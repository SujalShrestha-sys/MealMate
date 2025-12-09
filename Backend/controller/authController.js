import prisma from "../db/dbConfig.js";
import { comparePassword, hashedPassword } from "../utils/bcrypt.js";
import {
  generateAccessAndRefreshTokens,
  verifyRefreshToken,
  verifyToken,
} from "../utils/jwt.js";
import { generateResetToken } from "../utils/token.js";
import crypto from "crypto"

export const RegisterUser = async (req, res, next) => {
  try {
    const { name, password, confirmPassword, email } = req.body;

    // Validate required fields
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    // Verify password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match!",
      });
    }

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists!",
      });
    }

    // Hash password and create user
    const hashedPass = await hashedPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPass,
        role: "STUDENT",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Registered Successfully",
      data: newUser,
    });
  } catch (err) {
    next(err);
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

    // Check if user exists, role matches, AND name matches
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
      user.id
    );

    console.log(accessToken);
    console.log(refreshToken);

    //save refresh token to DB
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: refreshToken
      }
    })


    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    return res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .status(200)
      .json({
        success: true,
        message: "User logged in successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        accessToken,
        refreshToken,
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
  const incommingToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incommingToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token missing",
    });
  }

  try {
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
      user.id
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    return res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .status(200)
      .json({
        success: true,
        message: "Access token refreshed",
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

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: null,
      }
    });
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    return res
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .clearCookie("refreshToken", options)
      .status(200)
      .json({
        success: true,
        message: "User logged out successfully",
      });
  } catch (error) {
    console.log(error.message)
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
        message: "Email is required"
      })
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email"
      })
    }

    //Generate the token
    const { resetToken, hashedToken } = generateResetToken();

    await prisma.user.update({
      where: {
        email
      },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000) //15 min expiry
      }
    });

    const resetURL = `http://localhost:5173/reset-password/${resetToken}`;

    return res.status(200).json({
      success: true,
      message: "Password reset link generated successfully",
      resetURL
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}

export const ResetPassword = async (req, res) => {
  try {
    const resetToken = req.params.token;

    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password are required"
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    //Hash token to compare with DB
    const hasedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        resetToken: hasedToken,
        resetTokenExpiry: { gt: new Date() }
      }
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
        id: user.id
      },
      data: {
        password: newHashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
