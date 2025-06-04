const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const rateLimit = require("express-rate-limit");
const logger = require("../config/logger");
const mongoose = require("mongoose");
const performanceMiddleware = require("../middleware/performance");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// CORS configuration for subdomain support
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow localhost, subdomains and Vercel domains
    const allowedOrigins = [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      /^http:\/\/.*\.localhost:5173$/,
      /^http:\/\/.*\.127\.0\.0\.1:5173$/,
      /^https:\/\/.*\.vercel\.app$/,
      "https://shopauth.vercel.app",
      "https://shopauth-client.vercel.app",
    ];

    const isAllowed = allowedOrigins.some((pattern) => {
      if (typeof pattern === "string") {
        return pattern === origin;
      }
      return pattern.test(origin);
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      logger.warn("CORS blocked origin:", { origin });
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Set-Cookie"],
};

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(limiter);
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(performanceMiddleware);

// Set secure cookie settings
app.set("trust proxy", 1);
app.use((req, res, next) => {
  // Enhance security headers
  res.header("X-Content-Type-Options", "nosniff");
  res.header("X-Frame-Options", "DENY");
  res.header("X-XSS-Protection", "1; mode=block");
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  logger.info("Incoming request", {
    method: req.method,
    path: req.path,
    origin: req.get("Origin") || "No Origin",
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });
  next();
});

// Route imports
const authRoutes = require("../routes/auth");
const userRoutes = require("../routes/user");
const monitorRoutes = require("../routes/monitor");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/monitor", monitorRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  const health = {
    success: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    environment: process.env.NODE_ENV,
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  };

  logger.info("Health check", health);
  res.json(health);
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((error, req, res, next) => {
  logger.error("Error occurred", {
    error: {
      message: error.message,
      stack: error.stack,
      status: error.status,
    },
    request: {
      method: req.method,
      path: req.path,
      ip: req.ip,
      userId: req.user?.id,
    },
  });

  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : error.message || "Internal server error";

  res.status(error.status || 500).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

module.exports = app;
