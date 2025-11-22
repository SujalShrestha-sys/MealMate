
import prisma from "../db/dbConfig.js";
import bcrypt from "bcrypt"

export const RegisterUser = async (req, res, next) => {
  try {
    const { name, password, email, role } = req.body;

    // Check if user exists
    const userExists = await prisma.user.findFirst({
      where: { email },
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists!",
      });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "STUDENT",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Registered Successfully",
      data: newUser,
    });
  } catch (err) {
    next(err)
  }
};