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
    if (!["CASH", "KHALTI"].includes(method)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method. Must be CASH or KHALTI",
      });
    }

    // Check slot availability
    const slot = await prisma.pickupSlot.findUnique({
      where: { id: pickupSlotId },
      include: { orders: true },
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

    if (slot.orders.length >= slot.maxOrders)
      return res.status(400).json({
        success: false,
        message: "Slot full",
      });

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
        priceAtPurchase: dish.price,
      });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        pickupSlotId,
        totalAmount: total,
        status: "PENDING",
        items: { create: orderItems },
      },
      include: { items: true },
    });

    /*  // Create payment
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        method,
        amount: total,
        status: method === "CASH" ? "COMPLETED" : "PENDING",
      },
    });
 */

    let payment = null;
    if (method === "CASH") {
      payment = await prisma.payment.create({
        data: {
          orderId: order.id,
          method: "CASH",
          amount: total,
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
    console.error(err);
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
      },
    });

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
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
