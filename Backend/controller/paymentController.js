import prisma from "../db/dbConfig.js";
import {
  initiateKhaltiPayment,
  lookupKhaltiPayment,
  isPaymentSuccessful,
  rupeesToPaisa,
} from "../utils/khalti.js";

// Step 1: Initiate Khalti Payment
// Frontend calls this to start Khalti payment process
// Returns payment_url to redirect user to Khalti checkout
export const initiatePayment = async (req, res) => {
  try {
    const { orderId, subscriptionId, method, return_url } = req.body;
    const userId = req.user.id; // From JWT token via AuthenticateToken middleware

    // Validate input
    if ((!orderId && !subscriptionId) || !method) {
      console.warn(
        `Payment Missing orderId/subscriptionId or method from user ${userId}`,
      );
      return res.status(400).json({
        success: false,
        message: "Order/Subscription ID and payment method required",
      });
    }

    // Handle KHALTI payment method
    if (method === "KHALTI") {
      let amount = 0;
      let purchaseOrderId = "";
      let purchaseOrderName = "";
      let customerName = "";
      let customerEmail = "";
      let customerPhone = "";

      if (orderId) {
        // Handle Order Payment
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: { user: true },
        });

        if (!order)
          return res
            .status(404)
            .json({ success: false, message: "Order not found" });

        if (order.userId !== userId)
          return res
            .status(403)
            .json({ success: false, message: "Unauthorized access" });

        if (!order.totalAmount || order.totalAmount <= 0)
          return res
            .status(400)
            .json({ success: false, message: "Invalid order amount" });

        const existingPayment = await prisma.payment.findUnique({
          where: { orderId },
        });

        if (existingPayment)
          return res.status(400).json({
            success: false,
            message: "Payment already initiated for this order",
          });

        amount = order.totalAmount;
        purchaseOrderId = order.id;
        purchaseOrderName = `MealMate Order ${order.id}`;
        customerName = order.user.name;
        customerEmail = order.user.email;
        customerPhone = order.user.phone || "9800000000";
      } else if (subscriptionId) {
        // Handle Subscription Payment
        const subscription = await prisma.userSubscription.findUnique({
          where: { id: subscriptionId },
          include: { user: true, plan: true },
        });

        if (!subscription)
          return res
            .status(404)
            .json({ success: false, message: "Subscription not found" });

        if (subscription.userId !== userId)
          return res
            .status(403)
            .json({ success: false, message: "Unauthorized access" });

        if (!subscription.plan.price || subscription.plan.price <= 0)
          return res
            .status(400)
            .json({ success: false, message: "Invalid plan price" });

        const existingPayment = await prisma.payment.findUnique({
          where: { subscriptionId },
        });
        if (existingPayment)
          return res.status(400).json({
            success: false,
            message: "Payment already initiated for this subscription",
          });

        amount = subscription.plan.price;
        purchaseOrderId = subscription.id;
        purchaseOrderName = `MealMate Subscription: ${subscription.plan.name}`;
        customerName = subscription.user.name;
        customerEmail = subscription.user.email;
        customerPhone = subscription.user.phone || "9800000000";
      }

      try {
        const amountInPaisa = rupeesToPaisa(amount);
        const khaltiResponse = await initiateKhaltiPayment({
          orderId: purchaseOrderId,
          amountInPaisa,
          customerName,
          customerEmail,
          customerPhone,
          returnUrl: return_url,
        });

        const paymentData = {
          method: "KHALTI",
          amount: amount,
          status: "PENDING",
          transactionReference: khaltiResponse.pidx,
        };

        if (orderId) paymentData.orderId = orderId;
        if (subscriptionId) paymentData.subscriptionId = subscriptionId;

        await prisma.payment.create({ data: paymentData });

        return res.json({
          success: true,
          message: "Payment initialized",
          data: {
            payment_url: khaltiResponse.payment_url,
            pidx: khaltiResponse.pidx,
            expires_in: khaltiResponse.expires_in,
          },
        });
      } catch (error) {
        console.error(`[Payment] Khalti initiation failed:`, error.message);
        return res.status(400).json({
          success: false,
          message: "Failed to initiate Khalti payment",
          error: error.message,
        });
      }
    } else if (method === "CASH") {
      // ... keep existing cash logic if still needed, or update similarly
      // For brevity, I'll update the main logic

      // Cash payment - no Khalti needed
      const order = await prisma.order.findUnique({ where: { id: orderId } });

      if (!order) {
        console.warn(
          `[Payment] Order not found: ${orderId} for user ${userId}`,
        );
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // SECURITY: Verify user owns this order
      if (order.userId !== userId) {
        console.error(
          `[Payment] Unauthorized order access! User ${userId} tried to pay for order belonging to ${order.userId}`,
        );
        return res.status(403).json({
          success: false,
          message: "You cannot pay for this order",
        });
      }

      // Check if payment already exists
      const existingPayment = await prisma.payment.findUnique({
        where: { orderId },
      });

      if (existingPayment) {
        console.warn(`[Payment] Payment already exists for order ${orderId}`);
        return res.status(400).json({
          success: false,
          message: "Payment already exists for this order",
        });
      }

      // Create cash payment (instantly completed)
      const payment = await prisma.payment.create({
        data: {
          orderId: order.id,
          method: "CASH",
          amount: order.totalAmount,
          status: "COMPLETED",
          paidAt: new Date(),
        },
      });

      console.log(
        `[Payment] Cash payment recorded for order ${orderId}: ${order.totalAmount} rupees`,
      );

      return res.json({
        success: true,
        message: "Cash payment recorded. Pay at pickup.",
        data: payment,
      });
    } else {
      console.warn(
        `[Payment] Invalid payment method: ${method} from user ${userId}`,
      );
      return res.status(400).json({
        success: false,
        message: "Invalid payment method. Use CASH or KHALTI",
      });
    }
  } catch (error) {
    console.error(`[Payment] Unexpected error in initiatePayment:`, error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Step 2: Verify Payment (Called after user returns from Khalti)
// Frontend redirects here after payment with pidx and status
// This confirms payment was successful
export const verifyPayment = async (req, res) => {
  try {
    const { pidx } = req.body;
    const userId = req.user.id; // From JWT token via AuthenticateToken middleware

    if (!pidx) {
      console.warn(`[Payment] Missing pidx from user ${userId}`);
      return res.status(400).json({
        success: false,
        message: "Payment ID (pidx) required",
      });
    }

    // Find payment by pidx (transactionReference)
    const payment = await prisma.payment.findFirst({
      where: { transactionReference: pidx },
      include: {
        order: true,
        subscription: {
          include: { plan: true },
        },
      },
    });

    if (!payment) {
      console.warn(`[Payment] Payment not found for pidx: ${pidx}`);
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // SECURITY: Verify user owns this payment
    const ownerId = payment.orderId
      ? payment.order.userId
      : payment.subscription.userId;

    if (ownerId !== userId) {
      console.error(
        `[Payment] Unauthorized payment verification! User ${userId} tried to verify payment for ${payment.orderId ? "order" : "subscription"} belonging to ${ownerId}`,
      );
      return res.status(403).json({
        success: false,
        message: "You cannot verify this payment",
      });
    }

    try {
      console.log(`[Payment] Verifying payment with Khalti: pidx=${pidx}`);

      // Lookup payment status from Khalti
      const khaltiResponse = await lookupKhaltiPayment(pidx);

      console.log(`[Payment] Khalti response for ${pidx}:`, khaltiResponse);

      // Check payment status
      if (isPaymentSuccessful(khaltiResponse.status)) {
        // Payment successful - update payment record
        const updatedPayment = await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "COMPLETED",
            paidAt: new Date(),
            transactionReference: khaltiResponse.transaction_id || pidx,
          },
        });

        // Update Order if it's an order payment
        if (payment.orderId) {
          const updatedOrder = await prisma.order.update({
            where: { id: payment.orderId },
            data: { status: "CONFIRMED" },
          });

          console.log(`[Payment] Order confirmed: ${updatedOrder.id}`);

          const orderNotification = await prisma.notification.create({
            data: {
              userId: payment.order.userId,
              title: "Payment Verified",
              message: `Your payment for order ${payment.orderId.slice(-6).toUpperCase()} has been verified. Your order is now confirmed!`,
            },
          });

          req.io
            .to(payment.order.userId)
            .emit("new_notification", orderNotification);
        }

        // Update Subscription if it's a subscription payment
        if (payment.subscriptionId) {
          const sub = await prisma.userSubscription.update({
            where: { id: payment.subscriptionId },
            data: {
              status: "ACTIVE",
              remainingMeals: payment.subscription.plan.meals,
            },
          });

          console.log(`[Payment] Subscription activated: ${sub.id}`);

          const subNotification = await prisma.notification.create({
            data: {
              userId: userId, // Current user is the one who paid
              title: "Plan Activated",
              message: `Your subscription has been activated successfully!`,
            },
          });

          req.io.to(userId).emit("new_notification", subNotification);
        }

        return res.json({
          success: true,
          message: "Payment successful!",
          data: updatedPayment,
        });
      } else if (khaltiResponse.status === "User canceled") {
        // User canceled payment
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: "FAILED" },
        });

        console.warn(`[Payment] User canceled payment: ${payment.id}`);

        return res.status(400).json({
          success: false,
          message: "Payment was canceled by user",
        });
      } else if (khaltiResponse.status === "Expired") {
        // Payment link expired
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: "FAILED" },
        });

        console.warn(`[Payment] Payment link expired: ${payment.id}`);

        return res.status(400).json({
          success: false,
          message: "Payment link has expired",
        });
      } else {
        // Pending or other status
        console.log(
          `[Payment] Payment still pending: ${payment.id}, status=${khaltiResponse.status}`,
        );

        return res.status(400).json({
          success: false,
          message: `Payment status: ${khaltiResponse.status}`,
          status: khaltiResponse.status,
        });
      }
    } catch (error) {
      console.error(
        `[Payment] Khalti verification failed for pidx ${pidx}:`,
        error.message,
      );

      return res.status(400).json({
        success: false,
        message: "Failed to verify payment",
        error: error.message,
      });
    }
  } catch (error) {
    console.error(`[Payment] Unexpected error in verifyPayment:`, error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all payments (admin only)
export const getAllPayments = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`[Payment] Admin ${userId} fetching all payments`);

    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      include: { order: true },
    });

    console.log(`[Payment] Returned ${payments.length} payment records`);

    res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error(`[Payment] Error fetching all payments:`, error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update payment status (admin only)
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!status || !["COMPLETED", "FAILED"].includes(status)) {
      console.warn(
        `[Payment] Invalid status update attempt: ${status} by admin ${userId}`,
      );
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      console.warn(
        `[Payment] Admin ${userId} tried to update non-existent payment: ${paymentId}`,
      );
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        paidAt: status === "COMPLETED" ? new Date() : null,
      },
    });

    console.log(
      `[Payment] Admin ${userId} updated payment ${paymentId} status to ${status}`,
    );

    res.json({
      success: true,
      message: `Payment status updated to ${status}`,
      data: updatedPayment,
    });
  } catch (error) {
    console.error(`[Payment] Error updating payment status:`, error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
