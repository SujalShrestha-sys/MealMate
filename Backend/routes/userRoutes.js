import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAdminUser,
  getAllRoles
} from "../controller/userController.js";
import {
  AuthenticateToken,
  AuthorizeRoles,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get all roles (admin only)
router.get("/roles", AuthenticateToken, AuthorizeRoles("ADMIN"), getAllRoles);

// Get all users (admin only)
router.get("/", AuthenticateToken, AuthorizeRoles("ADMIN"), getAllUsers);

// Get admin user details for chat (admin only)
router.get("/admin", AuthenticateToken, getAdminUser);

// Get user by ID (own profile or admin)
router.get("/:id", AuthenticateToken, getUserById);

// Update user (own profile or admin)
router.put("/:id", AuthenticateToken, updateUser);

// Delete user (admin only)
router.delete("/:id", AuthenticateToken, AuthorizeRoles("ADMIN"), deleteUser);

export default router;
