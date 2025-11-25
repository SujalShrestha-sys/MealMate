import dotenv from "dotenv";
dotenv.config();

import express from "express";
import authRouter from "../routes/authRoutes.js";
import chatRouter from "../routes/chatRoutes.js";
import cors from "cors";
import prisma from "../db/dbConfig.js";
import errorHandling from "../errorHandling.js";
import { createAdmin } from "../prisma/seed.js";
import { createServer } from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Attach io to request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_conversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} joined conversation: ${conversationId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);

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

    httpServer.listen(PORT, () => {
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
