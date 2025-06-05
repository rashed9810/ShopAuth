const mongoose = require("mongoose");
const logger = require("./logger");

const connectDB = async () => {
  try {
    // Validate MongoDB URI
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    const options = {
      serverSelectionTimeoutMS: 10000, // Increased timeout for Vercel
      socketTimeoutMS: 45000,
      maxPoolSize: 10, // Reduced for serverless
      minPoolSize: 0,
      retryWrites: true,
      retryReads: true,
      w: "majority",
      ssl: true, // Always use SSL for production MongoDB Atlas
      tls: true,
      tlsAllowInvalidCertificates: false,
      bufferCommands: false, // Disable mongoose buffering for serverless
      bufferMaxEntries: 0,
    };

    // Add connection event listeners
    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    return conn;
  } catch (error) {
    logger.error("Database connection error:", {
      message: error.message,
      stack: error.stack,
      mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not set'
    });

    // In serverless environment, don't exit process
    if (process.env.VERCEL) {
      throw error;
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
