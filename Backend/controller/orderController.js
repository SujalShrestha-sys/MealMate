import prisma from "../db/dbConfig.js";

export const createOrder = async (req, res) => {
  try {
    const { userId, pickupSlotId, items, method } = req.body;

    // Validate input
    if (!userId || !pickupSlotId || !items?.length || !method) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate payment method
    if (!["CASH", "KHALTI", "SUBSCRIPTION"].includes(method)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid payment method. Must be CASH, KHALTI, or SUBSCRIPTION",
      });
    }

    // Check slot availability
    const slot = await prisma.pickupSlot.findUnique({
      where: { id: pickupSlotId },
    });

    if (!slot)
      return res.status(404).json({
        success: false,
        message: "Pickup slot not found",
      });

    if (new Date() > slot.startTime)
      return res.status(400).json({
        success: false,
        message: "Slot expired",
      });

    if (slot.maxOrders <= 0)
      return res.status(400).json({
        success: false,
        message: "Slot full",
      });

    // Check for subscription if method is SUBSCRIPTION
    let activeSub = null;
    if (method === "SUBSCRIPTION") {
      activeSub = await prisma.userSubscription.findFirst({
        where: {
          userId,
          status: "ACTIVE",
          endDate: { gte: new Date() },
          remainingMeals: { gt: 0 },
        },
      });

      const totalMealsNeeded = items.reduce(
        (acc, item) => acc + item.quantity,
        0,
      );

      if (!activeSub || activeSub.remainingMeals < totalMealsNeeded) {
        return res.status(400).json({
          success: false,
          message: `Not enough meals in your subscription. Remaining: ${activeSub?.remainingMeals || 0}`,
        });
      }
    }

    // Calculate total and prepare order items
    let total = 0;
    const orderItems = [];
    for (let item of items) {
      const dish = await prisma.dish.findUnique({ where: { id: item.dishId } });

      if (!dish || !dish.isAvailable)
        return res.status(400).json({
          success: false,
          message: `Dish not available: ${item.dishId}`,
        });

      total += dish.price * item.quantity;

      orderItems.push({
        dishId: item.dishId,
        quantity: item.quantity,
        priceAtPurchase: method === "SUBSCRIPTION" ? 0 : dish.price,
      });
    }

    // Set total to 0 if using subscription
    const finalTotal = method === "SUBSCRIPTION" ? 0 : total;

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        pickupSlotId,
        totalAmount: finalTotal,
        status: method === "SUBSCRIPTION" ? "CONFIRMED" : "PENDING",
        items: { create: orderItems },
      },
      include: { items: true },
    });

    // Decrease slot capacity
    await prisma.pickupSlot.update({
      where: { id: pickupSlotId },
      data: {
        maxOrders: {
          decrement: 1,
        },
      },
    });

    // If subscription, decrement remaining meals
    if (method === "SUBSCRIPTION" && activeSub) {
      const totalMealsUsed = items.reduce(
        (acc, item) => acc + item.quantity,
        0,
      );
      await prisma.userSubscription.update({
        where: { id: activeSub.id },
        data: {
          remainingMeals: {
            decrement: totalMealsUsed,
          },
        },
      });
    }

    const notificationId = order.id.slice(-6).toUpperCase();

    let notificationTitle = `New Order #${notificationId}`;
    let notificationMessage = `You have a new order with total amount Rs.${total}.`;

    if (method === "CASH") {
      notificationMessage += " Order Confirmed. Pay at pickup.";
    } else if (method === "SUBSCRIPTION") {
      notificationMessage += " Order Confirmed using subscription.";
    } else {
      notificationMessage += " Please complete payment via Khalti.";
    }

    const notification = await prisma.notification.create({
      data: {
        userId: order.userId,
        title: notificationTitle,
        message: notificationMessage,
      },
    });

    req.io.to(order.userId).emit("new_notification", notification);

    let payment = null;
    if (method === "CASH" || method === "SUBSCRIPTION") {
      payment = await prisma.payment.create({
        data: {
          orderId: order.id,
          method: method,
          amount: finalTotal, // Value is 0 for subscription
          status: "COMPLETED",
        },
      });
    }

    res.status(201).json({
      success: true,
      message:
        method === "CASH"
          ? "Order placed. Pay at pickup."
          : "Order placed. Complete Khalti payment.",
      data: {
        order,
        /*  payment, */
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            dish: true,
          },
        },
        payment: true,
        pickupSlot: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (orders.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: "No orders found",
      });
    }

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            dish: true,
          },
        },
        payment: true,
        pickupSlot: true,
      },
    });

    if (orders.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: "No orders found for this user",
      });
    }

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status)
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });

    if (
      ![
        "PENDING",
        "CONFIRMED",
        "PREPARING",
        "READY_FOR_PICKUP",
        "COMPLETED",
        "CANCELLED",
      ].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            dish: true,
          },
        },
        payment: true,
        pickupSlot: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    res.json({
      success: true,
      message: "Status updated",
      data: order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if order is already completed or cancelled
    if (
      existingOrder.status === "COMPLETED" ||
      existingOrder.status === "CANCELLED"
    ) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${existingOrder.status}`,
      });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
      include: {
        items: {
          include: {
            dish: true,
          },
        },
        payment: true,
        pickupSlot: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: "Order cancelled",
      data: order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
