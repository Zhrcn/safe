import mongoose from 'mongoose';
import { USE_MOCK_DB, debugLog } from '../config';
import { isMockMode, setMockMode } from '../mockdb/mockData';

// Set initial mock mode based on configuration
if (USE_MOCK_DB) {
  setMockMode(true);
  debugLog('MongoDB', 'Mock database mode enabled via configuration');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * @param {Promise} promise
 * @param {number} timeoutMs 
 * @param {string} errorMessage
 * @returns {Promise} 
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
  // If mock mode is enabled, return a mock connection
  if (isMockMode()) {
    debugLog('MongoDB', 'Using mock database connection');
    return createMockConnection();
  }

  // If connection exists, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection is being established, wait for it
  if (!cached.promise) {
    // MongoDB Atlas optimized connection options
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 60000,
      family: 4,
      maxPoolSize: 10,
      retryWrites: true,
      retryReads: true,
    };

    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      debugLog('MongoDB', 'MONGODB_URI environment variable is not defined. Falling back to mock database.');
      setMockMode(true);
      return createMockConnection();
    }

    const redactedURI = MONGODB_URI.replace(
      /(mongodb(?:\+srv)?:\/\/)([^:]+):([^@]+)@/,
      '$1$2:****@'
    );
    debugLog('MongoDB', `Using connection string: ${redactedURI}`);

    // Create connection promise with timeout
    console.log('Connecting to MongoDB...');
    cached.promise = withTimeout(
      mongoose.connect(MONGODB_URI, opts),
      20000,
      'MongoDB Atlas connection timed out after 20 seconds'
    ).then((mongoose) => {
      debugLog('MongoDB', 'Connected to MongoDB Atlas successfully');

      mongoose.connection.on('error', (err) => {
        console.error('MongoDB Atlas connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB Atlas disconnected. Will try to reconnect on next request.');
        cached.conn = null;
        cached.promise = null;
      });

      mongoose.connection.on('reconnected', () => {
        debugLog('MongoDB', 'MongoDB Atlas reconnected successfully');
      });

      return mongoose;
    }).catch(err => {
      console.error('Error connecting to MongoDB Atlas:', err);
      debugLog('MongoDB', 'Falling back to mock database due to connection error');
      cached.promise = null;
      setMockMode(true);
      return createMockConnection();
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    console.error('MongoDB Atlas connection failed:', e.message);
    cached.promise = null;

    e.code = e.code || 'MONGODB_CONNECTION_ERROR';

    if (e.message.includes('ECONNREFUSED')) {
      e.diagnostic = 'MongoDB Atlas server is not accessible - check network connectivity';
    } else if (e.message.includes('Authentication failed')) {
      e.diagnostic = 'MongoDB Atlas authentication failed - check username and password in connection string';
    } else if (e.message.includes('timed out')) {
      e.diagnostic = 'MongoDB Atlas connection timed out - check network or firewall settings';
    } else if (e.message.includes('ENOTFOUND')) {
      e.diagnostic = 'MongoDB Atlas hostname not found - check connection string format';
    } else if (e.message.includes('bad auth')) {
      e.diagnostic = 'MongoDB Atlas authentication failed - check database name and credentials';
    } else if (e.message.includes('IP address is not whitelisted') || e.message.includes('Could not connect to any servers')) {
      e.diagnostic = 'Your IP address is not whitelisted in MongoDB Atlas. Go to MongoDB Atlas dashboard > Network Access and add your current IP address.';
      console.error('\n🚨 IP WHITELIST ERROR: Your current IP address needs to be added to MongoDB Atlas whitelist.');
      console.error('Please visit: https://www.mongodb.com/docs/atlas/security-whitelist/');
      console.error('Or go to MongoDB Atlas dashboard > Network Access and click "Add IP Address" button.\n');
    } else {
      e.diagnostic = 'Check MongoDB Atlas connection string format, network connectivity, and credentials';
    }

    debugLog('MongoDB', `Falling back to mock database due to error: ${e.message}`);
    setMockMode(true);
    return createMockConnection();
  }
}

/**
 * Create a mock database connection object
 * @returns {Object} A mock connection object
 */
function createMockConnection() {
  return {
    connection: {
      db: {
        collection: (name) => {
          debugLog('MongoDB', `Getting mock collection: ${name}`);
          return createMockCollection(name);
        }
      }
    },
    model: (name) => {
      debugLog('MongoDB', `Getting mock model: ${name}`);
      return createMockModel(name);
    }
  };
}

/**
 * Create a mock collection with MongoDB-like methods
 * @param {string} name - The collection name
 * @returns {Object} A mock collection
 */
function createMockCollection(name) {
  const { mockData, findInCollection, findOneInCollection, insertIntoCollection, updateInCollection, deleteFromCollection } = require('../mockdb/mockData');

  // Determine which mock collection to use based on name
  let collection;
  switch (name.toLowerCase()) {
    case 'users':
      collection = mockData.users;
      break;
    case 'appointments':
      collection = mockData.appointments;
      break;
    case 'prescriptions':
      collection = mockData.prescriptions;
      break;
    case 'consultations':
      collection = mockData.consultations;
      break;
    default:
      collection = [];
      console.warn(`No mock collection found for ${name}, using empty array`);
  }

  return {
    find: (query = {}) => findInCollection(collection, query),
    findOne: (query = {}) => findOneInCollection(collection, query),
    insertOne: (doc) => ({ insertedId: insertIntoCollection(collection, doc)._id, acknowledged: true }),
    updateOne: (query, update) => {
      const updated = updateInCollection(collection, query, update);
      return { matchedCount: updated ? 1 : 0, modifiedCount: updated ? 1 : 0, acknowledged: true };
    },
    deleteOne: (query) => {
      const deleted = deleteFromCollection(collection, query);
      return { deletedCount: deleted ? 1 : 0, acknowledged: true };
    },
    countDocuments: (query = {}) => findInCollection(collection, query).length
  };
}

/**
 * Create a mock model with Mongoose-like methods
 * @param {string} name - The model name
 * @returns {Object} A mock model
 */
function createMockModel(name) {
  const collection = createMockCollection(name);

  return {
    find: (query = {}) => ({
      populate: () => ({
        sort: () => ({
          skip: () => ({
            limit: () => collection.find(query)
          })
        })
      }),
      select: () => ({
        exec: () => Promise.resolve(collection.find(query))
      }),
      exec: () => Promise.resolve(collection.find(query))
    }),
    findOne: (query = {}) => ({
      exec: () => Promise.resolve(collection.findOne(query)),
      select: (fields) => ({
        exec: () => {
          const result = collection.findOne(query);
          if (fields && fields.includes('+password') && result) {
            return Promise.resolve({ ...result, password: result.password || 'hashedpassword' });
          }
          return Promise.resolve(result);
        }
      })
    }),
    findById: (id) => ({
      exec: () => Promise.resolve(collection.findOne({ _id: id })),
      select: (fields) => ({
        exec: () => {
          const result = collection.findOne({ _id: id });
          if (fields && fields.includes('+password') && result) {
            return Promise.resolve({ ...result, password: result.password || 'hashedpassword' });
          }
          return Promise.resolve(result);
        }
      })
    }),
    create: (doc) => Promise.resolve(collection.insertOne(doc).insertedId),
    updateOne: (query, update) => Promise.resolve(collection.updateOne(query, update)),
    deleteOne: (query) => Promise.resolve(collection.deleteOne(query)),
    countDocuments: (query = {}) => Promise.resolve(collection.countDocuments(query))
  };
}