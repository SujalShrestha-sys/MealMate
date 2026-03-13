import express from "express";
import {
  createNotification,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../controller/notificationController.js";
import {
  AuthenticateToken,
  AuthorizeRoles,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create notification (admin only)
router.post(
  "/",
  AuthenticateToken,
  AuthorizeRoles(["admin"]),
  createNotification,
);

// Get user notifications
router.get("/", AuthenticateToken, getUserNotifications);

// Get unread count
router.get("/unread/count", AuthenticateToken, getUnreadCount);

// Mark notification as read
router.put("/:notificationId/read", AuthenticateToken, markAsRead);

// Mark all notifications as read
router.put("/read/all", AuthenticateToken, markAllAsRead);

// Delete notification
router.delete("/:notificationId", AuthenticateToken, deleteNotification);

// Delete all notifications
router.delete("/delete/all", AuthenticateToken, deleteAllNotifications);

export default router;
