import dotenv from "dotenv";
dotenv.config();

import prisma from "../db/dbConfig.js";
import { hashedPassword } from "../utils/bcrypt.js";

const createDefaultRoles = async () => {
  try {
    const roles = ["ADMIN", "STUDENT"];

    for (const roleName of roles) {
      const existingRole = await prisma.role.findUnique({
        where: { name: roleName },
      });

      if (!existingRole) {
        await prisma.role.create({
          data: { name: roleName },
        });
        console.log(`✓ Role '${roleName}' created successfully`);
      } else {
        console.log(`✓ Role '${roleName}' already exists`);
      }
    }
  } catch (error) {
    console.error("Error creating default roles:", error.message);
  }
};

export const createAdmin = async () => {
  try {
    // Create roles first
    await createDefaultRoles();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME;

    if (!adminEmail || !adminPassword || !adminName) {
      console.log(" Admin credentials missing - skipping admin creation");
      return;
    }

    const existingAdmin = await prisma.user.findFirst({
      where: {
        email: adminEmail,
      },
    });

    if (existingAdmin) {
      console.log("✓ Admin user already exists");
      return;
    }

    const hashedPass = await hashedPassword(adminPassword);

    const admin = await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPass,
        role: {
          connect: { name: "ADMIN" },
        },
      },
    });

    console.log("Admin created successfully:", admin.name, "with role ADMIN");
  } catch (error) {
    console.error("Error in seed:", error.message);
  } finally {
    await prisma.$disconnect();
  }
};

// Run seed
createAdmin();
