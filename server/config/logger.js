const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

// Log directory
const logDir = path.join(__dirname, '../logs');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// Create rotating file transport
const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logDir, 'application-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
});

// Create logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [
    fileRotateTransport,
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Error event handler
fileRotateTransport.on('rotate', function(oldFilename, newFilename) {
  logger.info('Log file rotated', { oldFilename, newFilename });
});

module.exports = logger;
