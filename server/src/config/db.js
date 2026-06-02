const mongoose = require('mongoose');

/**
 * Connect to MongoDB with retry logic.
 * Uses exponential backoff for connection retries.
 */
const connectDB = async () => {
  const MAX_RETRIES = 5;
  const RETRY_DELAY_MS = 3000;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        // Mongoose 8 uses these by default, but explicit for clarity
        autoIndex: true,
      });

      console.log(`✅ MongoDB connected: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);
      return conn;
    } catch (error) {
      console.error(`❌ MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed:`, error.message);

      if (attempt === MAX_RETRIES) {
        console.error('💥 All MongoDB connection attempts exhausted. Exiting...');
        process.exit(1);
      }

      const delay = RETRY_DELAY_MS * attempt;
      console.log(`⏳ Retrying in ${delay / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

/**
 * Graceful shutdown handler for MongoDB connection.
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed gracefully');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error.message);
  }
};

// Handle process termination signals
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});

module.exports = { connectDB, disconnectDB };
