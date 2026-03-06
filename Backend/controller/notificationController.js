import prisma from "../db/dbConfig.js";

// CREATE NOTIFICATION
export const createNotification = async (req, res) => {
  try {
    const { userId, title, message } = req.body;

    // Validation
    if (!userId || !title || !message) {
      return res.status(400).json({
        success: false,
        message: "userId, title, and message are required",
      });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
      },
    });

    // Emit real-time notification via Socket.io
    req.io.to(userId).emit("new_notification", notification);

    res.status(201).json({
      success: true,
      message: "Notification created",
      data: notification,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create notification",
    });
  }
};

// GET USER NOTIFICATIONS
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    res.json({
      success: true,
      data: notifications,
      unreadCount,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

// GET UNREAD NOTIFICATIONS COUNT
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const unreadCount = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    res.json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch unread count",
    });
  }
};

// MARK NOTIFICATION AS READ
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Verify notification exists and belongs to user
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    if (notification.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this notification",
      });
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    res.json({
      success: true,
      message: "Notification marked as read",
      data: updatedNotification,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update notification",
    });
  }
};

// MARK ALL NOTIFICATIONS AS READ
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update notifications",
    });
  }
};

// DELETE NOTIFICATION
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Verify notification exists and belongs to user
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    if (notification.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this notification",
      });
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });

    res.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete notification",
    });
  }
};

// DELETE ALL NOTIFICATIONS
export const deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    await prisma.notification.deleteMany({
      where: { userId },
    });

    res.json({
      success: true,
      message: "All notifications deleted successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete notifications",
    });
  }
};
