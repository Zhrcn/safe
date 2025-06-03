import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Wraps a promise with a timeout
 * @param {Promise} promise - The promise to wrap
 * @param {number} timeoutMs - Timeout in milliseconds
 * @param {string} errorMessage - Error message to throw on timeout
 * @returns {Promise} - Promise with timeout
 */
export function withTimeout(promise, timeoutMs, errorMessage = 'Operation timed out') {
  let timeoutHandle;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error(errorMessage));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutHandle);
  });
}

/**
 * Connect to MongoDB Atlas with timeout protection
 * 
 * @returns {Promise<Mongoose>} Mongoose connection
 */
export async function connectToDatabase() {
  // If connection exists, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection is being established, wait for it
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 7000, // Increased to 7 seconds
      connectTimeoutMS: 7000,         // Increased to 7 seconds
    };

    // Use environment variable for connection string or fallback to local MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/safe';

    // Create connection promise with timeout
    console.log('Connecting to MongoDB...');
    cached.promise = withTimeout(
      mongoose.connect(MONGODB_URI, opts), 
      10000, 
      'MongoDB connection timed out after 10 seconds'
    ).then((mongoose) => {
      console.log('Connected to MongoDB successfully');
      return mongoose;
    }).catch(err => {
      console.error('Error connecting to MongoDB:', err);
      // Clear the promise so we can try again next time
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    console.error('MongoDB connection failed:', e.message);
    cached.promise = null;
    // For login purposes, provide a more specific error
    e.code = e.code || 'MONGODB_CONNECTION_ERROR';
    e.diagnostic = 'Check MongoDB connection string and network connectivity';
    throw e;
  }
}