import express from "express";
import {
  addToCart,
  getUserCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controller/addToCartController.js";
import { AuthenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(AuthenticateToken);

// Add item to cart
router.post("/", addToCart);

// Get user's cart
router.get("/", getUserCart);

// Update cart item quantity
router.put("/:cartItemId", updateCartItem);

// Remove item from cart
router.delete("/:cartItemId", removeCartItem);

// Clear entire cart
router.delete("/clear/all", clearCart);

export default router;
