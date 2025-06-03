/**
 * Mock Data Implementation
 * 
 * This file serves as the main entry point for mock data in the application.
 * It consolidates all mock data sources and provides a consistent interface.
 */

import { USE_MOCK_DB } from '../config';

// Mock data collections
import mockUsers from './mockUsers';
import mockAppointments from './mockAppointments';
import mockMedicalFiles from './mockMedicalFiles';
import mockPrescriptions from './mockPrescriptions';
import mockConsultations from './mockConsultations';

// Flag to determine if we're using mock data
let useMockData = USE_MOCK_DB;

// Mock data collections that will be used by the application
export const mockData = {
    users: [...mockUsers],
    appointments: [...mockAppointments],
    medicalFiles: { ...mockMedicalFiles },
    prescriptions: [...mockPrescriptions],
    consultations: [...mockConsultations]
};

/**
 * Check if we're using mock data
 * @returns {boolean} True if using mock data
 */
export function isMockMode() {
    return useMockData;
}

/**
 * Set the mock data mode
 * @param {boolean} enable - True to enable mock data mode
 */
export function setMockMode(enable) {
    useMockData = enable;
    console.log(`Mock data mode ${enable ? 'enabled' : 'disabled'}`);
}

/**
 * Find items in a collection based on a query
 * @param {Array} collection - The collection to search
 * @param {Object} query - The query object
 * @returns {Array} - Matching items
 */
export function findInCollection(collection, query = {}) {
    return collection.filter(item => matchQuery(item, query));
}

/**
 * Find a single item in a collection based on a query
 * @param {Array} collection - The collection to search
 * @param {Object} query - The query object
 * @returns {Object|null} - The matching item or null
 */
export function findOneInCollection(collection, query = {}) {
    return collection.find(item => matchQuery(item, query)) || null;
}

/**
 * Check if an item matches a query
 * @param {Object} item - The item to check
 * @param {Object} query - The query object
 * @returns {boolean} - True if the item matches the query
 */
function matchQuery(item, query) {
    for (const [key, value] of Object.entries(query)) {
        // Special case for $or operator
        if (key === '$or' && Array.isArray(value)) {
            if (!value.some(orClause => matchQuery(item, orClause))) {
                return false;
            }
            continue;
        }

        // Handle dot notation for nested properties
        if (key.includes('.')) {
            const parts = key.split('.');
            let currentObj = item;

            // Navigate to the nested property
            for (let i = 0; i < parts.length - 1; i++) {
                if (!currentObj || typeof currentObj !== 'object') {
                    return false;
                }
                currentObj = currentObj[parts[i]];
            }

            // Check the final property against the value
            const finalProp = parts[parts.length - 1];
            if (!currentObj || currentObj[finalProp] !== value) {
                return false;
            }

            continue;
        }

        // Handle special operators
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            // $in operator
            if (value.$in && Array.isArray(value.$in)) {
                if (!value.$in.includes(item[key])) {
                    return false;
                }
            }
            // $ne operator (not equal)
            else if (value.$ne !== undefined) {
                if (item[key] === value.$ne) {
                    return false;
                }
            }
            // $gt operator (greater than)
            else if (value.$gt !== undefined) {
                if (!(item[key] > value.$gt)) {
                    return false;
                }
            }
            // $gte operator (greater than or equal)
            else if (value.$gte !== undefined) {
                if (!(item[key] >= value.$gte)) {
                    return false;
                }
            }
            // $lt operator (less than)
            else if (value.$lt !== undefined) {
                if (!(item[key] < value.$lt)) {
                    return false;
                }
            }
            // $lte operator (less than or equal)
            else if (value.$lte !== undefined) {
                if (!(item[key] <= value.$lte)) {
                    return false;
                }
            }
            // $exists operator
            else if (value.$exists !== undefined) {
                const exists = item[key] !== undefined;
                if (exists !== value.$exists) {
                    return false;
                }
            }
            // Regular object comparison
            else if (JSON.stringify(item[key]) !== JSON.stringify(value)) {
                return false;
            }
        }
        // Regular value comparison
        else if (item[key] !== value) {
            return false;
        }
    }

    return true;
}

/**
 * Insert a document into a collection
 * @param {Array} collection - The collection to insert into
 * @param {Object} document - The document to insert
 * @returns {Object} - The inserted document with an _id
 */
export function insertIntoCollection(collection, document) {
    const newDocument = {
        _id: document._id || `mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        ...document,
        createdAt: document.createdAt || new Date().toISOString(),
        updatedAt: document.updatedAt || new Date().toISOString()
    };

    collection.push(newDocument);
    return newDocument;
}

/**
 * Update a document in a collection
 * @param {Array} collection - The collection to update
 * @param {Object} query - The query to find the document
 * @param {Object} update - The update to apply
 * @returns {Object} - The updated document
 */
export function updateInCollection(collection, query, update) {
    const index = collection.findIndex(item => matchQuery(item, query));

    if (index === -1) {
        return null;
    }

    if (update.$set) {
        collection[index] = {
            ...collection[index],
            ...update.$set,
            updatedAt: new Date().toISOString()
        };
    } else {
        collection[index] = {
            ...collection[index],
            ...update,
            updatedAt: new Date().toISOString()
        };
    }

    return collection[index];
}

/**
 * Delete a document from a collection
 * @param {Array} collection - The collection to delete from
 * @param {Object} query - The query to find the document
 * @returns {boolean} - True if a document was deleted
 */
export function deleteFromCollection(collection, query) {
    const index = collection.findIndex(item => matchQuery(item, query));

    if (index === -1) {
        return false;
    }

    collection.splice(index, 1);
    return true;
} 