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
router.post("/create", AuthenticateToken, AuthorizeRoles("ADMIN"), createPlan);
router.put("/:planId", AuthenticateToken, AuthorizeRoles("ADMIN"), updatePlan);

// Generic routes 
router.get("/:planId", getPlanById);
router.delete("/:planId", AuthenticateToken, AuthorizeRoles("ADMIN"), deletePlan);

export default router;
