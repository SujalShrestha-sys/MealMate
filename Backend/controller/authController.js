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
    const user = await prisma.user.findUnique({ where: { email } });

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

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user.id);

    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);

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
        refreshToken,
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
    const incommingToken = req.cookies?.refreshToken || req.body?.refreshToken;

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

    console.log("USER", user);

    if (!user || user.refreshToken != incommingToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user.id,
    );

    return res.status(200).json({
      success: true,
      message: "Access token refreshed",
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find how many refresh tokens the user currently has
    const tokenCount = await prisma.refreshToken.count({
      where: { userId },
    });

    if (tokenCount === 0) {
      // No tokens found — user is already logged out
      return res.status(400).json({
        success: false,
        message: "User already logged out",
      });
    }

    await prisma.refreshToken.deleteMany({
      where: { userId },
    });

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong" || error.message,
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
        message: "User not found with this email",
      });
    }

    //Generate the token
    const { resetToken, hashedToken } = generateResetToken();

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000), //15 min expiry
      },
    });

    const resetURL = `http://localhost:5173/reset-password/${resetToken}`;

    return res.status(200).json({
      success: true,
      message: "Password reset link generated successfully",
      resetURL,
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

    //Hash token to compare with DB
    const hasedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        resetToken: hasedToken,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const newHashedPassword = await hashedPassword(password);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: newHashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
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
