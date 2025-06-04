const mongoose = require("mongoose");
const logger = require('./logger');

const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 50,
      retryWrites: true,
      retryReads: true,
      w: 'majority',
      ssl: process.env.NODE_ENV === 'production'
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    // Monitor database events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

  } catch (error) {
    logger.error("Database connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
