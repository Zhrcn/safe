/**
 * Mock Database Implementation
 * 
 * This file provides mock database functionality to replace MongoDB during development.
 * It doesn't delete or modify any MongoDB connection code, just provides an alternative
 * data source when the MongoDB connection is not available.
 */

import mockUsers from './mockUsers';
import mockAppointments from './mockAppointments';
import mockMedicalFiles from './mockMedicalFiles';
import mockPrescriptions from './mockPrescriptions';
import mockConsultations from './mockConsultations';

let isMockMode = true;

// Exported data collections
export const collections = {
    users: [...mockUsers],
    appointments: [...mockAppointments],
    medicalFiles: { ...mockMedicalFiles },
    prescriptions: [...mockPrescriptions],
    consultations: [...mockConsultations]
};

/**
 * Enable or disable mock mode
 * @param {boolean} enable 
 */
export function setMockMode(enable) {
    isMockMode = enable;
    console.log(`Mock database ${enable ? 'enabled' : 'disabled'}`);
}

/**
 * Check if mock mode is enabled
 * @returns {boolean}
 */
export function isMockModeEnabled() {
    return isMockMode;
}

/**
 * Mock connection function that can be used in place of connectToDatabase
 * to provide a consistent API
 */
export async function mockConnectToDatabase() {
    console.log('Using mock database connection');
    return {
        connection: {
            db: {
                collection: (name) => getMockCollection(name)
            }
        },
        model: (modelName) => getMockModel(modelName)
    };
}

/**
 * Get a mock collection by name
 * @param {string} name 
 * @returns {Object} Mock collection with MongoDB-like methods
 */
function getMockCollection(name) {
    let collectionData;

    switch (name.toLowerCase()) {
        case 'users':
            collectionData = collections.users;
            break;
        case 'appointments':
            collectionData = collections.appointments;
            break;
        case 'medicalfiles':
            collectionData = collections.medicalFiles;
            break;
        case 'prescriptions':
            collectionData = collections.prescriptions;
            break;
        case 'consultations':
            collectionData = collections.consultations;
            break;
        default:
            collectionData = [];
    }

    return {
        find: (query = {}) => mockFind(collectionData, query),
        findOne: (query = {}) => mockFindOne(collectionData, query),
        insertOne: (doc) => mockInsertOne(collectionData, doc),
        updateOne: (query, update) => mockUpdateOne(collectionData, query, update),
        deleteOne: (query) => mockDeleteOne(collectionData, query)
    };
}

/**
 * Get a mock model by name
 * @param {string} name 
 * @returns {Object} Mock model with Mongoose-like methods
 */
function getMockModel(name) {
    const collection = getMockCollection(name);

    // Return a mock model with methods similar to Mongoose
    return {
        find: (query = {}) => ({
            exec: () => Promise.resolve(collection.find(query)),
            select: () => ({
                exec: () => Promise.resolve(collection.find(query))
            })
        }),
        findOne: (query = {}) => ({
            exec: () => Promise.resolve(collection.findOne(query)),
            select: (fields) => ({
                exec: () => {
                    const result = collection.findOne(query);
                    // Handle select('+password') syntax
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
                    // Handle select('+password') syntax
                    if (fields && fields.includes('+password') && result) {
                        return Promise.resolve({ ...result, password: result.password || 'hashedpassword' });
                    }
                    return Promise.resolve(result);
                }
            })
        }),
        create: (doc) => Promise.resolve(collection.insertOne(doc)),
        updateOne: (query, update) => Promise.resolve(collection.updateOne(query, update)),
        deleteOne: (query) => Promise.resolve(collection.deleteOne(query))
    };
}

// Mock MongoDB query operations
function mockFind(data, query) {
    return data.filter(item => matchQuery(item, query));
}

function mockFindOne(data, query) {
    return data.find(item => matchQuery(item, query)) || null;
}

function mockInsertOne(data, doc) {
    const newDoc = {
        _id: doc._id || `mock_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
        ...doc,
        createdAt: doc.createdAt || new Date().toISOString(),
        updatedAt: doc.updatedAt || new Date().toISOString()
    };
    data.push(newDoc);
    return { insertedId: newDoc._id, insertedCount: 1, acknowledged: true, ops: [newDoc] };
}

function mockUpdateOne(data, query, update) {
    const index = data.findIndex(item => matchQuery(item, query));
    if (index !== -1) {
        if (update.$set) {
            data[index] = { ...data[index], ...update.$set, updatedAt: new Date().toISOString() };
        } else {
            data[index] = { ...data[index], ...update, updatedAt: new Date().toISOString() };
        }
        return { matchedCount: 1, modifiedCount: 1, acknowledged: true };
    }
    return { matchedCount: 0, modifiedCount: 0, acknowledged: true };
}

function mockDeleteOne(data, query) {
    const index = data.findIndex(item => matchQuery(item, query));
    if (index !== -1) {
        data.splice(index, 1);
        return { deletedCount: 1, acknowledged: true };
    }
    return { deletedCount: 0, acknowledged: true };
}

// Helper function to match a document against a query
function matchQuery(doc, query) {
    for (const [key, value] of Object.entries(query)) {
        // Handle special query operators
        if (key === '$or' && Array.isArray(value)) {
            const matches = value.some(subQuery => matchQuery(doc, subQuery));
            if (!matches) return false;
        }
        // Handle equality conditions
        else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            if (value.$in && Array.isArray(value.$in)) {
                if (!value.$in.includes(doc[key])) return false;
            } else if (value.$ne !== undefined) {
                if (doc[key] === value.$ne) return false;
            } else if (value.$gt !== undefined) {
                if (!(doc[key] > value.$gt)) return false;
            } else if (value.$gte !== undefined) {
                if (!(doc[key] >= value.$gte)) return false;
            } else if (value.$lt !== undefined) {
                if (!(doc[key] < value.$lt)) return false;
            } else if (value.$lte !== undefined) {
                if (!(doc[key] <= value.$lte)) return false;
            }
        } else {
            // Simple equality check
            if (doc[key] !== value) return false;
        }
    }
    return true;
} 