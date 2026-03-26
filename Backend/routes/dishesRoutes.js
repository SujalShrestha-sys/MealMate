import express from "express";
import {
  createDish,
  getAllDishes,
  getByCategory,
  getSingleDish,
  searchDishes,
  updateDish,
  deleteDish,
  getAllCategories,
} from "../controller/dishesController.js";
import { AuthenticateToken, AuthorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create
router.post("/create", AuthenticateToken, AuthorizeRoles("ADMIN"), createDish);

// Update & Delete
router.put("/:id", AuthenticateToken, AuthorizeRoles("ADMIN"), updateDish);
router.delete("/:id", AuthenticateToken, AuthorizeRoles("ADMIN"), deleteDish);

// Get - specific routes first (before generic :id)
router.get("/search", searchDishes);
router.get("/categories", getAllCategories);
router.get("/category/:category", getByCategory);

// Get - generic route last
router.get("/", getAllDishes);
router.get("/:id", getSingleDish);

export default router;
