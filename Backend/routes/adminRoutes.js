import express from "express";
import {
  getAdminStats,
  getDashboardStats,
  getSalesTrend,
  getBusiestHours,
  getRecentOrders,
} from "../controller/adminController.js";

import {
  AuthenticateToken,
  AuthorizeRoles,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/stats",AuthenticateToken,AuthorizeRoles("ADMIN"), getAdminStats); // all-time overview

router.get(
  "/dashboard-stats",
  AuthenticateToken,
  AuthorizeRoles("ADMIN"),
  getDashboardStats,
); // today's 4 stat cards

router.get(
  "/sales-trend",
  AuthenticateToken,
  AuthorizeRoles("ADMIN"),
  getSalesTrend,
); // sales chart

router.get(
  "/busiest-hours",
  AuthenticateToken,
  AuthorizeRoles("ADMIN"),
  getBusiestHours,
); // busiest hours chart
router.get(
    
  "/recent-orders",
  AuthenticateToken,
  AuthorizeRoles("ADMIN"),
  getRecentOrders,
); // live orders table

export default router;
