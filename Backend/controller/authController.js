import prisma from "../db/dbConfig.js";
import { comparePassword, hashedPassword } from "../utils/bcrypt.js";
import {
  generateAccessAndRefreshTokens,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { generateResetToken } from "../utils/token.js";
import crypto from "crypto";

export const RegisterUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const emailExists = await prisma.user.findFirst({
      where: { email },
    });

    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPass = await hashedPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPass,
        role: {
          connect: { name: "STUDENT" },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Registered successfully",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const LoginUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (
      [name, email, password].some((field) => !field || field.trim() === "")
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
        data: {},
      });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Verify password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user.id,
    );

    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);

    // Set httpOnly cookie for refresh token
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role?.name || null,
      },
      tokens: {
        accessToken,
      },
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const RefreshAccessToken = async (req, res) => {
  try {
    const incommingToken = req.cookies?.refreshToken;

    if (!incommingToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    const decoded = verifyRefreshToken(incommingToken);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    console.log("STUDENT", user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    //check token exists in DB
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        token: incommingToken,
        userId: user.id,
      },
    });

    if (!storedToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    //check expiration manually
    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({
        where: {
          id: storedToken.id,
        },
      });

      return res.status(401).json({
        success: false,
        message: "Refresh token expired!",
      });
    }

    //Delete old token
    await prisma.refreshToken.delete({
      where: {
        id: storedToken.id,
      },
    });

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user.id,
    );

    // Set httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "Access token refreshed",
      tokens: {
        accessToken,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token required",
      });
    }

    //Delete the specific sesssion
    const deleted = await prisma.refreshToken.deleteMany({
      where: {
        token: refreshToken,
      },
    });

    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};

export const ForgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "If this email exists, a reset link has been sent",
      });
    }

    //Generate the token
    const { resetToken, hashedToken } = generateResetToken();

    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
      },
    });

    await prisma.passwordResetToken.create({
      data: {
        token: hashedToken,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), //15 min expiry
        userId: user.id,
      },
    });

    const resetURL = `http://localhost:5173/reset-password/${resetToken}`;

    // In production → send via email
    return res.status(200).json({
      success: true,
      message: "Password reset link generated successfully",
      resetURL, //remove in production
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const ResetPassword = async (req, res) => {
  try {
    const resetToken = req.params.token;

    const { password, confirmPassword } = req.body;

    if (!resetToken) {
      return res.status(400).json({
        success: false,
        message: "Reset token is required",
      });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    //Hash incomming token
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    //find reset token record
    const resetTokenRecord = await prisma.passwordResetToken.findFirst({
      where: {
        token: hashedToken,
        expiresAt: { gt: new Date() },
      },
    });

    if (!resetTokenRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    //Hash new password
    const newHashedPassword = await hashedPassword(password);

    //update user password
    await prisma.user.updateMany({
      where: {
        id: resetTokenRecord.userId,
      },
      data: {
        password: newHashedPassword,
      },
    });

    //Delete all reset tokens for the user
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: resetTokenRecord.userId,
      },
    });

    //logout from all the connected devices
    await prisma.refreshToken.deleteMany({
      where: {
        userId: resetTokenRecord.userId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
