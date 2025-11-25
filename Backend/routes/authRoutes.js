import express from "express";
import { LoginUser, logoutUser, RefreshAccessToken, RegisterUser } from "../controller/authController.js";
import { AuthenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", RegisterUser);

router.post("/login", LoginUser);

router.post("/refresh-token", RefreshAccessToken)

router.post("/logout", AuthenticateToken, logoutUser)


export default router;
