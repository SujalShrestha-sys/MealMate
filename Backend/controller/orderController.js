import prisma from "../db/dbConfig.js";

export const createOrder = async (req, res) => {
  try {
    const { userId, pickupSlotId, items } = req.body;

    if (!userId || !pickupSlotId || !items || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItemsData = [];

    for (let item of items) {
      const dish = await prisma.dish.findUnique({ where: { id: item.dishId } });
      if (!dish || !dish.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `Dish not available: ${item.dishId}`,
        });
      }
      totalAmount += dish.price * item.quantity;

      orderItemsData.push({
        dishId: item.dishId,
        quantity: item.quantity,
        priceAtPurchase: dish.price, // Store price at time of purchase for historical accuracy
      });
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId,
        pickupSlotId,
        totalAmount,
        status: "PENDING",
        items: {
          create: orderItemsData,
        },
      },
    });

    if (order) {
      // Emit real-time notification to admin dashboard
      req.io.emit("new_order", {
        orderId: order.id,
        userId: order.userId,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
      });
    }

    res
      .status(201)
      .json({ success: true, message: "Order placed", data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found for this user" });
    }

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found" });
    }

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status)
      return res
        .status(400)
        .json({ success: false, message: "Status required" });

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

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    res.json({ success: true, message: "Status updated", data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.update({
      where: { id },
      data: { status: "cancelled" },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({ success: true, message: "Order cancelled", data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
