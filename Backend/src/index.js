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
import adminRoutes from "../routes/adminRoutes.js";

const app = express();
const httpServer = createServer(app);
let isDatabaseReady = false;
let isDatabaseConnecting = false;

// CORS configuration
const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:3000",
  "https://meal-mate-frontend-rho.vercel.app",
]);

if (process.env.FRONTEND_URL) {
  const envOrigins = process.env.FRONTEND_URL.split(",").map((u) =>
    u.trim().replace(/\/$/, ""),
  );
  envOrigins.forEach((origin) => {
    if (origin) allowedOrigins.add(origin);
  });
}

const isVercelPreviewOrigin = (origin) =>
  /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/$/, "");
    const isAllowed = Array.from(allowedOrigins).some(
      (allowed) => allowed.toLowerCase() === normalizedOrigin.toLowerCase(),
    );

    if (isAllowed || isVercelPreviewOrigin(normalizedOrigin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked request from origin: ${origin}`);
      callback(new Error("CORS origin not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
  optionsSuccessStatus: 200,
};

const io = new Server(httpServer, {
  cors: corsOptions,
});

const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.get("/api/health", (req, res) => {
  return res.status(isDatabaseReady ? 200 : 503).json({
    success: isDatabaseReady,
    status: isDatabaseReady ? "ok" : "starting",
    db: isDatabaseReady ? "connected" : "connecting",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", (req, res, next) => {
  if (req.path === "/health") return next();
  if (!isDatabaseReady) {
    return res.status(503).json({
      success: false,
      message: "Server is warming up. Please retry in a few seconds.",
    });
  }
  return next();
});

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
app.use("/api/admin", adminRoutes);
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

async function connectDatabaseWithRetry() {
  if (isDatabaseReady || isDatabaseConnecting) return;
  isDatabaseConnecting = true;

  try {
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL is missing!");
      process.exit(1);
    }

    await prisma.$connect();
    isDatabaseReady = true;
    isDatabaseConnecting = false;
    console.log("Database connected successfully");
  } catch (error) {
    isDatabaseReady = false;
    isDatabaseConnecting = false;
    console.error("Database connection failed:", error.message);
    setTimeout(connectDatabaseWithRetry, 5000);
  }
}

// Keep server alive on free-tier hosting (Render sleeps after 15 min)
// Pings itself every 14 minutes so the server never goes to sleep
function keepServerAlive() {
  if (process.env.NODE_ENV !== "production") return;

  const FOURTEEN_MINUTES = 14 * 60 * 1000;

  setInterval(async () => {
    try {
      const url = `http://localhost:${PORT}/api/health`;
      const res = await fetch(url);
      console.log(
        `[Keep-Alive] Pinged health endpoint — status: ${res.status}`,
      );
    } catch (err) {
      console.log("[Keep-Alive] Ping failed:", err.message);
    }
  }, FOURTEEN_MINUTES);

  console.log("[Keep-Alive] Active — pinging every 14 minutes");
}

// Start server
function startServer() {
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(
      `Server running on port ${PORT} in ${process.env.NODE_ENV} mode`,
    );
    console.log("Allowed origins:", Array.from(allowedOrigins));
    connectDatabaseWithRetry();
    keepServerAlive();
  });
}

// Graceful shutdown
process.on("SIGINT", async () => {
  if (isDatabaseReady) {
    await prisma.$disconnect();
  }
  console.log("Database disconnected");
  process.exit(0);
});

startServer();
