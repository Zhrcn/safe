import mongoose from 'mongoose';

// Use the environment variable or fallback to the provided string for development
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/safe';

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

// Global is used here to maintain a cached connection across hot reloads in development
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        console.log('Connecting to MongoDB...');
        cached.promise = mongoose.connect(MONGODB_URI, opts)
            .then((mongoose) => {
                console.log('MongoDB connected successfully');
                return mongoose;
            })
            .catch((error) => {
                console.error('MongoDB connection error:', error);
                throw error;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error('Failed to connect to MongoDB, retrying on next request:', e);
        throw e;
    }

    return cached.conn;
}

// Event listeners for connection status
mongoose.connection.on('connected', () => {
    console.log('MongoDB connection established');
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB connection disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

// Handle Node.js process termination and close the MongoDB connection
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed due to application termination');
    process.exit(0);
});

export default connectDB; 