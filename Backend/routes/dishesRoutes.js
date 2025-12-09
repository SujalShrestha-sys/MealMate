import express from 'express';
import { getAllDishes, getByCategory, getSingleDish, searchDishes } from '../controller/dishesController.js';

const router = express.Router();

router.get("/", getAllDishes);
router.get("/:id", getSingleDish);
router.get("/category/:category", getByCategory)
router.get("/search", searchDishes)

export default router;
