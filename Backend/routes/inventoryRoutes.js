import express from "express";

import {
  createInventoryItem,
  getInventoryItems,
  adjustInventoryStock,
  getLowStockItems,
  updateInventoryItem,
  deleteInventoryItem,
} from "../controller/inventoryController.js";

const router = express.Router();

router.get("/", getInventoryItems);
router.get("/low-stock", getLowStockItems);

router.post("/", createInventoryItem);
router.patch("/:id/adjust", adjustInventoryStock);
router.put("/:id", updateInventoryItem);
router.delete("/:id", deleteInventoryItem);

export default router;
