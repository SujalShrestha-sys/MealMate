import prisma from "../db/dbConfig.js";

export const createPickupSlot = async (req, res) => {
  try {
    const { startTime, endTime, maxOrders } = req.body;

    if (!startTime || !endTime || !maxOrders) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const startTimeObj = new Date(startTime);
    const endTimeObj = new Date(endTime);

     if (isNaN(startTimeObj) || isNaN(endTimeObj)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    if (startTimeObj >= endTimeObj) {
      return res.status(400).json({
        success: false,
        message: "Start time must be before end time",
      });
    }

     if (startTimeObj < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Cannot create a pickup slot in the past",
      });
    }

    const pickupSlot = await prisma.pickupSlot.create({
      data: {
        startTime: startTimeObj,
        endTime: endTimeObj,
        maxOrders,
      },
    });

    if (pickupSlot) {
      // Emit real-time notification to admin dashboard
      req.io.emit("new_pickup_slot", {
        pickupSlotId: pickupSlot.id,
        startTime: pickupSlot.startTime,
        endTime: pickupSlot.endTime,
        maxOrders: pickupSlot.maxOrders,
        createdAt: pickupSlot.createdAt,
      });
    }

    res.status(201).json({
      success: true,
      message: "Pickup slot created",
      data: pickupSlot,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getPickupSlots = async (req, res) => {
  try {
    const pickupSlots = await prisma.pickupSlot.findMany({
      orderBy: { startTime: "asc" },
    });

    res.json({ success: true, data: pickupSlots });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getPickupSlotById = async (req, res) => {
  try {
    const { id } = req.params;

    const slot = await prisma.pickupSlot.findUnique({
      where: { id },
    });

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Pickup slot not found",
      });
    }

    res.json({
      success: true,
      data: slot,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deletePickupSlot = async (req, res) => {
  try {
    const { id } = req.params;

    const slot = await prisma.pickupSlot.findUnique({
      where: { id },
    });
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Pickup slot not found",
      });
    }

    const deletedSlot = await prisma.pickupSlot.delete({
      where: { id },
    });

    res.json({ success: true, message: "Pickup slot deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updatePickupSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { startTime, endTime, maxOrders } = req.body;

    const slot = await prisma.pickupSlot.findUnique({
      where: { id },
    });
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Pickup slot not found",
      });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: "Start time must be before end time",
      });
    }

    const updatedSlot = await prisma.pickupSlot.update({
      where: { id },
      data: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        maxOrders,
      },
    });
    res.json({
      success: true,
      message: "Pickup slot updated successfully",
      data: updatedSlot,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
