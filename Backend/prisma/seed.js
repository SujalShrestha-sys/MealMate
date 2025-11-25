import dotenv from "dotenv";
dotenv.config();

import prisma from "../db/dbConfig.js";
import { hashedPassword } from "../src/utils/bcrypt.js";

export const createAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME;

    if (!adminEmail || !adminPassword || !adminName) {
      console.log("Admin credentials missing - skipping admin creation");
      return;
    }

    const existingAdmin = await prisma.user.findFirst({
      where: {
        email: adminEmail,
      },
    });

    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    const hashedPass = await hashedPassword(adminPassword);

    const admin = await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPass,
        role: "ADMIN",
      },
    });

     console.log("Admin created successfully:", admin.role);
  } catch (error) {
    console.error("Error creating admin user:", error.message);
  }
};

export default createAdmin;
