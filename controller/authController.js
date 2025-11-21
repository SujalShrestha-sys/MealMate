import bcrypt from "bcrypt";
import prisma from "../db/dbConfig.js";
import errorHandling from "../errorHandling.js";

export const RegisterUser = async (req, res) => {
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
    errorHandling(err)
  }
};