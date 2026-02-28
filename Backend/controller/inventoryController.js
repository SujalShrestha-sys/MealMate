import prisma from "../db/dbConfig.js";

// CREATE ITEM
export const createInventoryItem = async (req, res) => {
  try {
    const { name, unit, quantity, lowStockThreshold } = req.body;

    if (!name || !unit) {
      return res.status(400).json({
        success: false,
        message: "Name and unit are required",
      });
    }

    const existingItem = await prisma.inventoryItem.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        isDeleted: false,
      },
    });

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: "An inventory item with this name already exists",
      });
    }

    const item = await prisma.inventoryItem.create({
      data: {
        name,
        unit,
        quantity: quantity ? parseFloat(quantity) : 0,
        lowStockThreshold: lowStockThreshold
          ? parseFloat(lowStockThreshold)
          : 5,
      },
    });

    res.status(201).json({
      success: true,
      message: "Inventory item created",
      data: item,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getInventoryItems = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    const items = await prisma.inventoryItem.findMany({
      where: {
        isDeleted: false,
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    const total = await prisma.inventoryItem.count({
      where: {
        isDeleted: false,
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    });

    res.json({
      success: true,
      data: items,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getLowStockItems = async (req, res) => {
  try {
    const items = await prisma.inventoryItem.findMany({
      where: {
        isDeleted: false,
      },
    });

    const lowStockItems = items.filter(
      (item) => item.quantity <= item.lowStockThreshold,
    );

    res.json({
      success: true,
      data: lowStockItems,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const adjustInventoryStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount } = req.body;

    if (!type || !amount) {
      return res.status(400).json({
        success: false,
        message: "Type and amount are required",
      });
    }

    const item = await prisma.inventoryItem.findUnique({
      where: { id },
    });

    if (!item || item.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    let newQuantity = item.quantity;

    if (type === "add") {
      newQuantity += Number(amount);
    }

    if (type === "reduce") {
      newQuantity -= Number(amount);

      if (newQuantity < 0) {
        return res.status(400).json({
          success: false,
          message: "Stock cannot be negative",
        });
      }
    }

    const updated = await prisma.inventoryItem.update({
      where: { id },
      data: { quantity: newQuantity },
    });

    res.json({
      success: true,
      message: "Stock updated",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, unit, lowStockThreshold } = req.body;

    const item = await prisma.inventoryItem.findUnique({
      where: { id },
    });

    if (!item || item.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    const updated = await prisma.inventoryItem.update({
      where: { id },
      data: {
        name: name || item.name,
        unit: unit || item.unit,
        lowStockThreshold: lowStockThreshold || item.lowStockThreshold,
      },
    });

    res.json({
      success: true,
      message: "Inventory item updated",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }

    const item = await prisma.inventoryItem.findUnique({
      where: { id },
    });

    if (!item || item.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    await prisma.inventoryItem.update({
      where: { id },
      data: { isDeleted: true },
    });

    res.json({
      success: true,
      message: "Inventory item deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
