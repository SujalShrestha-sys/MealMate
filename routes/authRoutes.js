import express from "express";
import { LoginUser, RefreshAccessToken, RegisterUser } from "../controller/authController.js";

const router = express.Router();

router.post("/register", RegisterUser);

router.post("/login", LoginUser);

router.post("/refresh-token", RefreshAccessToken)


export default router;
