import express from 'express';
import { 
  createDish, 
  getAllDishes, 
  getByCategory, 
  getSingleDish, 
  searchDishes,
  updateDish,
  deleteDish
} from '../controller/dishesController.js';

const router = express.Router();

// Create
router.post("/create", createDish);

// Update & Delete
router.put("/:id", updateDish);
router.delete("/:id", deleteDish);

// Get - specific routes first (before generic :id)
router.get("/search", searchDishes);
router.get("/category/:category", getByCategory);

// Get - generic route last
router.get("/", getAllDishes);
router.get("/:id", getSingleDish);

export default router;
