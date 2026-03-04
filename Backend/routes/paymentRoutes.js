import express from "express";
import {
  initiatePayment,
  verifyPayment,
  updatePaymentStatus,
  getAllPayments,
} from "../controller/paymentController.js";
import {
  AuthenticateToken,
  AuthorizeRoles,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Step 1: Initiate payment (start Khalti or Cash payment)
router.post("/initiate", AuthenticateToken, initiatePayment);

// Step 2: Verify payment (confirm Khalti payment after callback)
router.post("/verify", AuthenticateToken, verifyPayment);

// Update payment status (admin only)
router.put(
  "/:paymentId/status",
  AuthenticateToken,
  AuthorizeRoles("ADMIN"),
  updatePaymentStatus
);

// Get all payments (admin only)
router.get("/", AuthenticateToken, AuthorizeRoles("ADMIN"), getAllPayments);

export default router;
