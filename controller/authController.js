import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../db/dbConfig.js";
import errorHandling from "../errorHandling.js";

export const RegisterUser = async (req, res, next) => {
  try {
    const { name, password, email, confirmPassword, role } = req.body;

    const UserExists = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (UserExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        confirmPassword : hashedPassword,
        role: role,
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

const loginUser =  async(req, res) => {
  
}