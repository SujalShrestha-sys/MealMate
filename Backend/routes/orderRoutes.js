import express from "express";

import {
  createOrder,
  getUserOrders,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from "../controller/orderController.js";

import {
  AuthenticateToken,
  AuthorizeRoles,
} from "../middlewares/authMiddleware.js";
const router = express.Router();

// Protected routes (authenticated users only)
router.post("/create", AuthenticateToken, createOrder);
router.get("/my-orders", AuthenticateToken, getUserOrders);
router.delete("/:orderId/cancel", AuthenticateToken, cancelOrder);

// Admin only routes
router.get("/", AuthenticateToken, AuthorizeRoles("ADMIN"), getAllOrders);
router.put(
  "/:id/status",
  AuthenticateToken,
  AuthorizeRoles("ADMIN"),
  updateOrderStatus,
);

export default router;
