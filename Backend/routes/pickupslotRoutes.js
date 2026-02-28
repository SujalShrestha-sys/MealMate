import express from "express";

import {
    createPickupSlot,
    getPickupSlots,
    getPickupSlotById,
    updatePickupSlot,
    deletePickupSlot,
} from "../controller/pickupSlotController.js";

import {
    AuthenticateToken,
    AuthorizeRoles,
} from "../middlewares/authMiddleware.js";

const router = express.Router();


// Protected routes (authenticated users only)
router.post("/create", AuthenticateToken, AuthorizeRoles("ADMIN"), createPickupSlot);
router.get("/", AuthenticateToken, getPickupSlots);
router.get("/:id", AuthenticateToken, getPickupSlotById);
router.put("/:id", AuthenticateToken, AuthorizeRoles("ADMIN"), updatePickupSlot);
router.delete("/:id", AuthenticateToken, AuthorizeRoles("ADMIN"), deletePickupSlot);



export default router;
