const Counter = require('../models/Counter');

/**
 * Generate unique ID for patients
 * Format: PAT-YYYYMM-XXXXXXXXXX (10 digits counter)
 * Example: PAT-200304000001
 */
async function generatePatientId(birthDate) {
  try {
    const date = new Date(birthDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Get next sequence number for this year-month combination
    const sequenceKey = `patient_${year}${month}`;
    const sequence = await Counter.getNextSequence(sequenceKey);
    
    // Format: PAT-YYYYMM-XXXXXXXXXX (10 digits)
    const counter = String(sequence).padStart(10, '0');
    return `PAT-${year}${month}${counter}`;
  } catch (error) {
    console.error('Error generating patient ID:', error);
    throw new Error('Failed to generate patient ID');
  }
}

/**
 * Generate unique ID for doctors
 * Format: DOC-YYYYMM-XXXXXX (6 digits counter)
 * Example: DOC-200304000001
 */
async function generateDoctorId(birthDate) {
  try {
    const date = new Date(birthDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Get next sequence number for this year-month combination
    const sequenceKey = `doctor_${year}${month}`;
    const sequence = await Counter.getNextSequence(sequenceKey);
    
    // Format: DOC-YYYYMM-XXXXXX (6 digits)
    const counter = String(sequence).padStart(6, '0');
    return `DOC-${year}${month}${counter}`;
  } catch (error) {
    console.error('Error generating doctor ID:', error);
    throw new Error('Failed to generate doctor ID');
  }
}

/**
 * Generate unique ID for pharmacists
 * Format: PHC-YYYYMM-XXXXXX (6 digits counter)
 * Example: PHC-200304000001
 */
async function generatePharmacistId(birthDate) {
  try {
    const date = new Date(birthDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Get next sequence number for this year-month combination
    const sequenceKey = `pharmacist_${year}${month}`;
    const sequence = await Counter.getNextSequence(sequenceKey);
    
    // Format: PHC-YYYYMM-XXXXXX (6 digits)
    const counter = String(sequence).padStart(6, '0');
    return `PHC-${year}${month}${counter}`;
  } catch (error) {
    console.error('Error generating pharmacist ID:', error);
    throw new Error('Failed to generate pharmacist ID');
  }
}

/**
 * Validate ID format
 */
function validateIdFormat(id, type) {
  const patterns = {
    patient: /^PAT-\d{6}-\d{10}$/,
    doctor: /^DOC-\d{6}-\d{6}$/,
    pharmacist: /^PHC-\d{6}-\d{6}$/
  };
  
  return patterns[type] ? patterns[type].test(id) : false;
}

/**
 * Extract information from ID
 */
function parseId(id) {
  const match = id.match(/^(PAT|DOC|PHC)-(\d{6})-(\d+)$/);
  if (!match) return null;
  
  const [, prefix, datePart, counter] = match;
  const year = datePart.substring(0, 4);
  const month = datePart.substring(4, 6);
  
  return {
    type: prefix,
    year: parseInt(year),
    month: parseInt(month),
    counter: parseInt(counter),
    datePart,
    fullId: id
  };
}

module.exports = {
  generatePatientId,
  generateDoctorId,
  generatePharmacistId,
  validateIdFormat,
  parseId
}; 