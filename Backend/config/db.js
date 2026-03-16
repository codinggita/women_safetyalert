const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * Uses MONGODB_URI from environment variables
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Server will continue without database connection...');
    return null;
  }
};

module.exports = connectDB;
