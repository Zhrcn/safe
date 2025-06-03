import { MongoClient, ObjectId } from 'mongodb';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// MongoDB connection
export const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
export const dbName = process.env.MONGODB_DB || 'safe_db';
export const JWT_SECRET = process.env.JWT_SECRET || 'safe_default_secret';

// Timeout for database operations (15 seconds)
export const DB_TIMEOUT = 15000;

/**
 * Verify JWT token from cookies or Authorization header
 * @param {Request} request - The incoming request
 * @returns {Object|null} Decoded token or null if invalid
 */
export function verifyToken(request) {
  try {
    // Check for token in cookies
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get('token');
    
    // Check for token in Authorization header
    const authHeader = request.headers.get('Authorization');
    const headerToken = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;
    
    // Use token from cookie or header
    const token = tokenCookie?.value || headerToken;
    
    if (!token) {
      return null;
    }
    
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error.message);
    return null;
  }
}

/**
 * Connect to MongoDB with timeout protection
 * @returns {Promise<MongoClient>} MongoDB client
 */
export async function connectToDatabase() {
  try {
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Database connection timeout'));
      }, DB_TIMEOUT);
    });
    
    // Create connection promise
    const connectionPromise = MongoClient.connect(uri);
    
    // Race the connection against the timeout
    const client = await Promise.race([connectionPromise, timeoutPromise]);
    return client;
  } catch (error) {
    console.error('Database connection error:', error.message);
    throw error;
  }
}

/**
 * Get standard CORS headers for API responses
 * @param {string} methods - Allowed HTTP methods
 * @returns {Object} Headers object
 */
export function getCorsHeaders(methods = 'GET, POST, PUT, PATCH, DELETE, OPTIONS') {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': methods,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };
}

/**
 * Convert MongoDB ObjectId strings to actual ObjectIds
 * @param {Object} filter - Query filter object
 * @returns {Object} Filter with converted ObjectIds
 */
export function convertObjectIds(filter) {
  const result = { ...filter };
  
  // Convert known ObjectId fields
  const objectIdFields = ['_id', 'userId', 'patientId', 'doctorId', 'pharmacistId'];
  
  for (const field of objectIdFields) {
    if (result[field] && typeof result[field] === 'string') {
      try {
        result[field] = new ObjectId(result[field]);
      } catch (error) {
        console.warn(`Invalid ObjectId for field ${field}:`, error.message);
      }
    }
  }
  
  return result;
}
