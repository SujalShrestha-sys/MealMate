import express from "express";
import { RegisterUser } from "../controller/authController.js";

const router = express.Router();

router.post('/register', RegisterUser);

export default router;
 