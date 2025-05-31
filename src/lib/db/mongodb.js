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
 * Connect to MongoDB Atlas
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
    };

    // Use environment variable for connection string or fallback to a placeholder
    // Replace this with your actual MongoDB Atlas connection string
    const MONGODB_URI = process.env.MONGODB_URI || 
      'mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority';

    // Check if connection string is properly configured
    if (MONGODB_URI === 'mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority') {
      console.warn(
        'Please define the MONGODB_URI environment variable inside .env.local with your MongoDB connection string.'
      );
    }

    // Create connection promise
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('Connected to MongoDB Atlas');
      return mongoose;
    }).catch(err => {
      console.error('Error connecting to MongoDB Atlas:', err);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
} 