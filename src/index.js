import dotenv from "dotenv";
import express from "express";
import authRouter from "../routes/authRoutes.js";
import cors from "cors";
import prisma from "../db/dbConfig.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Connect to database and start server
async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
    
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

startServer();
