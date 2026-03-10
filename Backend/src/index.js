import "dotenv/config";
import prisma from "../db/dbConfig.js";
import { createServer } from "http";
import cors from "cors";
import errorHandling from "../errorHandling.js";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

import express from "express";
import authRouter from "../routes/authRoutes.js";
import chatRouter from "../routes/chatRoutes.js";
import subscriptionPlanRouter from "../routes/subscriptionPlanRoutes.js";
import dishesRouter from "../routes/dishesRoutes.js";
import inventoryRoutes from "../routes/inventoryRoutes.js";
import orderRoutes from "../routes/orderRoutes.js";
import paymentRoutes from "../routes/paymentRoutes.js";
import pickupSlotRoutes from "../routes/pickupslotRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import cartRoutes from "../routes/addToCartRoutes.js";
import notificationRoutes from "../routes/notificationRoutes.js";

const app = express();
const httpServer = createServer(app);

// Dynamic CORS configuration
const getAllowedOrigins = () => {
  if (process.env.NODE_ENV === "production") {
    return (
      process.env.FRONTEND_URL?.split(",") || [
        "https://mealmate-frontend.onrender.com",
      ]
    );
  }
  return [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5000",
    process.env.FRONTEND_URL,
  ].filter(Boolean);
};

const corsOptions = {
  origin: getAllowedOrigins(),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const io = new Server(httpServer, {
  cors: corsOptions,
  transports: ["websocket", "polling"],
});

const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// Attach io to request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // User joins their personal room for notifications
  socket.on("user_online", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined personal room`);
    // Broadcast user is online
    io.emit("user_status_changed", {
      userId,
      status: "online",
    });
  });

  // Join conversation room for real-time chat
  socket.on("join_conversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} joined conversation: ${conversationId}`);
    // Notify others in conversation
    io.to(conversationId).emit("user_typing_start", {
      conversationId,
      userId: socket.id,
    });
  });

  // Handle typing indicator
  socket.on("typing", (conversationId) => {
    io.to(conversationId).emit("user_typing", {
      conversationId,
      userId: socket.id,
    });
  });

  // Handle stop typing
  socket.on("stop_typing", (conversationId) => {
    io.to(conversationId).emit("user_stop_typing", {
      conversationId,
      userId: socket.id,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Broadcast user is offline
    io.emit("user_status_changed", {
      userId: socket.id,
      status: "offline",
    });
  });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);
app.use("/api/dishes", dishesRouter);
app.use("/api/plans", subscriptionPlanRouter);
app.use("/api/cart", cartRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin/inventory", inventoryRoutes);
app.use("/api/admin/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/pickup-slots", pickupSlotRoutes);
app.use("/api/users", userRoutes);

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

    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(
        `Server running on port ${PORT} in ${process.env.NODE_ENV} mode`,
      );
      console.log(`Allowed origins:`, getAllowedOrigins());
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
