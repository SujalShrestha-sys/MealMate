import express from "express";
import {
  getPlan,
  purchasePlan,
  createPlan,
  getPlanById,
  updatePlan,
  deletePlan,
  getUserSubscription,
  cancelSubscription,
  getSubscriptionHistory,
  getAllSubscriptions,
  cancelSubscriptionAdmin,
} from "../controller/subscriptionPlanController.js";

import {
  AuthenticateToken,
  AuthorizeRoles,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getPlan);

// Protected routes (authenticated users only) - specific routes
router.get("/my-subscription", AuthenticateToken, getUserSubscription);
router.get("/history", AuthenticateToken, getSubscriptionHistory);
router.post("/purchase", AuthenticateToken, purchasePlan);
router.delete("/:subscriptionId/cancel", AuthenticateToken, cancelSubscription);

// Admin only routes
router.get(
  "/all",
  AuthenticateToken,
  AuthorizeRoles("ADMIN"),
  getAllSubscriptions,
);
router.post("/create", AuthenticateToken, AuthorizeRoles("ADMIN"), createPlan);
router.put("/:planId", AuthenticateToken, AuthorizeRoles("ADMIN"), updatePlan);
router.delete(
  "/:planId",
  AuthenticateToken,
  AuthorizeRoles("ADMIN"),
  deletePlan,
); // Moved from below
router.delete(
  "/admin/:subscriptionId/cancel",
  AuthenticateToken,
  AuthorizeRoles("ADMIN"),
  cancelSubscriptionAdmin,
);

// Public/Shared routes (Parameterized routes MUST be at the end)
router.get("/:planId", getPlanById);

export default router;
