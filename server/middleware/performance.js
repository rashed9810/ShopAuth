const logger = require("../config/logger");

const performanceMiddleware = (req, res, next) => {
  const start = process.hrtime();

  // Add response hook to log performance metrics
  res.on("finish", () => {
    const diff = process.hrtime(start);
    const time = diff[0] * 1e3 + diff[1] * 1e-6; // Convert to milliseconds

    logger.info("Performance", {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: time.toFixed(2),
      userAgent: req.get("user-agent"),
      ip: req.ip,
    });
  });

  next();
};

module.exports = performanceMiddleware;
