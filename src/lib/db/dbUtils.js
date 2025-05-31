import { connectToDatabase } from './mongodb';
import mongoose from 'mongoose';

/**
 * Validates if a string is a valid MongoDB ObjectId
 * @param {string} id - The ID to validate
 * @returns {boolean} - Whether the ID is valid
 */
export function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/**
 * Converts a string to MongoDB ObjectId
 * @param {string} id - The ID to convert
 * @returns {ObjectId} - MongoDB ObjectId
 */
export function toObjectId(id) {
  if (!isValidObjectId(id)) {
    throw new Error(`Invalid ObjectId: ${id}`);
  }
  return new mongoose.Types.ObjectId(id);
}

/**
 * Generic function to find documents with pagination
 * @param {Model} model - Mongoose model
 * @param {Object} query - Query object
 * @param {Object} options - Options including pagination, sorting, etc.
 * @returns {Promise<Object>} - Results with pagination info
 */
export async function findWithPagination(model, query = {}, options = {}) {
  await connectToDatabase();
  
  const { 
    page = 1, 
    limit = 10, 
    sort = { createdAt: -1 },
    populate = [],
    select = ''
  } = options;
  
  const skip = (page - 1) * limit;
  
  // Count total documents matching the query
  const total = await model.countDocuments(query);
  
  // Build the find query
  let findQuery = model.find(query);
  
  // Apply pagination
  findQuery = findQuery.skip(skip).limit(limit);
  
  // Apply sorting
  findQuery = findQuery.sort(sort);
  
  // Apply field selection if provided
  if (select) {
    findQuery = findQuery.select(select);
  }
  
  // Apply population if provided
  if (populate.length > 0) {
    populate.forEach(field => {
      findQuery = findQuery.populate(field);
    });
  }
  
  // Execute query
  const results = await findQuery;
  
  return {
    results,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    }
  };
}

/**
 * Generic function to find a document by ID
 * @param {Model} model - Mongoose model
 * @param {string} id - Document ID
 * @param {Object} options - Options including population
 * @returns {Promise<Document>} - Found document
 */
export async function findById(model, id, options = {}) {
  await connectToDatabase();
  
  if (!isValidObjectId(id)) {
    throw new Error(`Invalid ObjectId: ${id}`);
  }
  
  const { populate = [], select = '' } = options;
  
  let query = model.findById(id);
  
  // Apply field selection if provided
  if (select) {
    query = query.select(select);
  }
  
  // Apply population if provided
  if (populate.length > 0) {
    populate.forEach(field => {
      query = query.populate(field);
    });
  }
  
  return await query;
}

/**
 * Generic function to create a document
 * @param {Model} model - Mongoose model
 * @param {Object} data - Document data
 * @returns {Promise<Document>} - Created document
 */
export async function createDocument(model, data) {
  await connectToDatabase();
  
  const document = new model(data);
  await document.save();
  return document;
}

/**
 * Generic function to update a document by ID
 * @param {Model} model - Mongoose model
 * @param {string} id - Document ID
 * @param {Object} data - Update data
 * @param {Object} options - Update options
 * @returns {Promise<Document>} - Updated document
 */
export async function updateDocument(model, id, data, options = {}) {
  await connectToDatabase();
  
  if (!isValidObjectId(id)) {
    throw new Error(`Invalid ObjectId: ${id}`);
  }
  
  const { new: returnNew = true, runValidators = true } = options;
  
  return await model.findByIdAndUpdate(
    id,
    data,
    { new: returnNew, runValidators }
  );
}

/**
 * Generic function to delete a document by ID
 * @param {Model} model - Mongoose model
 * @param {string} id - Document ID
 * @returns {Promise<Document>} - Deleted document
 */
export async function deleteDocument(model, id) {
  await connectToDatabase();
  
  if (!isValidObjectId(id)) {
    throw new Error(`Invalid ObjectId: ${id}`);
  }
  
  return await model.findByIdAndDelete(id);
} 