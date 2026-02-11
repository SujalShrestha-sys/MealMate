import express from "express";
import { ForgetPassword, LoginUser, logoutUser, RefreshAccessToken, RegisterUser, ResetPassword } from "../controller/authController.js";
import { AuthenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", RegisterUser);

router.post("/login", LoginUser);

router.post("/refresh-token", RefreshAccessToken)

router.post("/logout", logoutUser)

router.post("/forget-password", ForgetPassword)

router.post("/reset-password/:token", ResetPassword)


export default router;
