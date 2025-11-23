import dotenv from "dotenv";
dotenv.config();

import express from "express";
import authRouter from "../routes/authRoutes.js";
import cors from "cors";
import prisma from "../db/dbConfig.js";
import errorHandling from "../errorHandling.js";
import { createAdmin } from "../prisma/seed.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);

// Global Error Handler
app.use(errorHandling);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Start server
async function startServer() {
  try {
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL is missing!");
      process.exit(1);
    }

    await prisma.$connect();
    console.log("Database connected successfully");

    /* await createAdmin()
      .catch((error) => {
        console.error("Error in seed:", error);
        process.exit(1);
      })
      .finally(async () => {
        await prisma.$disconnect();
      }); */

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Database disconnected");
  process.exit(0);
});

startServer();
