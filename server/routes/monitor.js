const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const logger = require("../config/logger");
const os = require("os");
const mongoose = require("mongoose");

// Get system metrics
router.get("/metrics", verifyToken, async (req, res) => {
  try {
    const metrics = {
      system: {
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        cpuUsage: os.loadavg(),
        uptime: os.uptime(),
      },
      mongodb: {
        status:
          mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        collections: Object.keys(mongoose.connection.collections).length,
      },
      process: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        version: process.version,
      },
    };

    res.json({
      success: true,
      metrics,
    });
  } catch (error) {
    logger.error("Error fetching metrics:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch metrics",
    });
  }
});

// Get recent logs
router.get("/logs", verifyToken, async (req, res) => {
  try {
    const logs = await logger.query({
      limit: 100,
      order: "desc",
    });

    res.json({
      success: true,
      logs,
    });
  } catch (error) {
    logger.error("Error fetching logs:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch logs",
    });
  }
});

module.exports = router;
