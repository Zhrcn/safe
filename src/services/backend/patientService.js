import { connectToDatabase, withTimeout } from '@/lib/db';
import { logger } from '@/lib/logger';
import User from '@/models/User';
import Patient from '@/models/Patient';
import MedicalFile from '@/models/MedicalFile';
import Doctor from '@/models/Doctor';

const log = logger('PatientService');

/**
 * Get patient by user ID
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} Patient data or error
 */
export async function getPatientById(userId) {
  try {
    log.debug(`Getting patient with ID: ${userId}`);
    log.time('getPatientById');
    
    await connectToDatabase();
    
    const user = await withTimeout(
      User.findById(userId).select('-password'),
      5000,
      'User lookup timed out'
    );
    
    if (!user) {
      log.warn(`User not found with ID: ${userId}`);
      return { success: false, error: 'User not found', status: 404 };
    }
    
    const patient = await withTimeout(
      Patient.findOne({ user: userId }),
      5000,
      'Patient lookup timed out'
    );
    
    if (!patient) {
      log.warn(`Patient profile not found for user ID: ${userId}`);
      return { success: false, error: 'Patient profile not found', status: 404 };
    }
    
    log.timeEnd('getPatientById');
    return { 
      success: true, 
      data: { user, patient },
      status: 200
    };
  } catch (error) {
    log.error(`Error retrieving patient: ${error.message}`, error);
    return { 
      success: false, 
      error: 'Internal server error', 
      message: error.message,
      status: 500
    };
  }
}

/**
 * Get patient medical file
 * @param {string} patientId - The patient user ID
 * @returns {Promise<Object>} Medical file data or error
 */
export async function getPatientMedicalFile(patientId) {
  try {
    log.debug(`Getting medical file for patient: ${patientId}`);
    log.time('getPatientMedicalFile');
    
    await connectToDatabase();
    
    // Find medical file for the patient
    let medicalFile = await withTimeout(
      MedicalFile.findOne({ patientId }),
      5000,
      'Medical file lookup timed out'
    );
    
    // If no medical file exists, create one with default data
    if (!medicalFile) {
      log.info(`No medical file found for patient ${patientId}, creating new one`);
      
      medicalFile = await withTimeout(
        MedicalFile.create({
          patientId,
          medicalHistory: [{
            condition: 'Initial medical record created',
            diagnosisDate: new Date(),
            notes: 'System generated initial record'
          }],
          labResults: [],
          imaging: [],
          medications: []
        }),
        5000,
        'Medical file creation timed out'
      );
    }
    
    log.timeEnd('getPatientMedicalFile');
    return {
      success: true,
      data: medicalFile,
      status: 200
    };
  } catch (error) {
    log.error(`Error retrieving medical file: ${error.message}`, error);
    return {
      success: false,
      error: 'Internal server error',
      message: error.message,
      status: 500
    };
  }
}

/**
 * Transform medical file data to frontend format
 * @param {Object} medicalFile - The medical file document
 * @returns {Promise<Array>} Transformed records array
 */
export async function transformMedicalRecords(medicalFile) {
  try {
    log.debug('Transforming medical records');
    log.time('transformMedicalRecords');
    
    const records = [];
    
    // Get all doctor IDs referenced in the medical file
    const doctorIds = new Set();
    
    // Add doctor IDs from medical history
    if (medicalFile.medicalHistory && medicalFile.medicalHistory.length > 0) {
      medicalFile.medicalHistory.forEach(item => {
        if (item.doctorId) doctorIds.add(item.doctorId.toString());
      });
    }
    
    // Add doctor IDs from lab results
    if (medicalFile.labResults && medicalFile.labResults.length > 0) {
      medicalFile.labResults.forEach(item => {
        if (item.doctorId) doctorIds.add(item.doctorId.toString());
      });
    }
    
    // Add doctor IDs from imaging
    if (medicalFile.imaging && medicalFile.imaging.length > 0) {
      medicalFile.imaging.forEach(item => {
        if (item.doctorId) doctorIds.add(item.doctorId.toString());
      });
    }
    
    // Add doctor IDs from medications
    if (medicalFile.medications && medicalFile.medications.length > 0) {
      medicalFile.medications.forEach(item => {
        if (item.prescribedBy) doctorIds.add(item.prescribedBy.toString());
      });
    }
    
    // Fetch all doctors in one query
    const doctorIdsArray = Array.from(doctorIds);
    const doctors = doctorIdsArray.length > 0 
      ? await Doctor.find({ _id: { $in: doctorIdsArray } })
      : [];
    
    // Create a map of doctor IDs to names for quick lookup
    const doctorMap = {};
    doctors.forEach(doctor => {
      doctorMap[doctor._id.toString()] = `Dr. ${doctor.firstName} ${doctor.lastName}`;
    });
    
    // Process medical history records
    if (medicalFile.medicalHistory && medicalFile.medicalHistory.length > 0) {
      medicalFile.medicalHistory.forEach(item => {
        const doctorId = item.doctorId ? item.doctorId.toString() : null;
        records.push({
          id: item._id.toString(),
          date: item.diagnosisDate,
          type: 'Diagnosis',
          description: item.condition,
          doctor: doctorId ? doctorMap[doctorId] || 'Unknown Doctor' : 'Unknown Doctor',
          notes: item.notes || '',
          details: item.details || {}
        });
      });
    }
    
    // Process lab results
    if (medicalFile.labResults && medicalFile.labResults.length > 0) {
      medicalFile.labResults.forEach(item => {
        const doctorId = item.doctorId ? item.doctorId.toString() : null;
        records.push({
          id: item._id.toString(),
          date: item.date,
          type: 'Lab Test',
          description: item.testName,
          doctor: doctorId ? doctorMap[doctorId] || 'Unknown Doctor' : 'Unknown Doctor',
          notes: item.notes || '',
          details: {
            result: item.result,
            normalRange: item.normalRange,
            units: item.units
          }
        });
      });
    }
    
    // Process imaging records
    if (medicalFile.imaging && medicalFile.imaging.length > 0) {
      medicalFile.imaging.forEach(item => {
        const doctorId = item.doctorId ? item.doctorId.toString() : null;
        records.push({
          id: item._id.toString(),
          date: item.date,
          type: 'Imaging',
          description: item.imagingType,
          doctor: doctorId ? doctorMap[doctorId] || 'Unknown Doctor' : 'Unknown Doctor',
          notes: item.notes || '',
          imageUrl: item.imageUrl || '',
          details: {
            findings: item.findings,
            recommendation: item.recommendation
          }
        });
      });
    }
    
    // Process follow-up appointments
    if (medicalFile.followUps && medicalFile.followUps.length > 0) {
      medicalFile.followUps.forEach(item => {
        const doctorId = item.doctorId ? item.doctorId.toString() : null;
        records.push({
          id: item._id.toString(),
          date: item.date,
          type: 'Follow-up',
          description: item.reason,
          doctor: doctorId ? doctorMap[doctorId] || 'Unknown Doctor' : 'Unknown Doctor',
          notes: item.notes || '',
          details: {
            outcome: item.outcome,
            nextSteps: item.nextSteps
          }
        });
      });
    }
    
    // Sort records by date (newest first)
    records.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    log.timeEnd('transformMedicalRecords');
    return records;
  } catch (error) {
    log.error(`Error transforming medical records: ${error.message}`, error);
    throw error;
  }
}

/**
 * Get mock medical records data for fallback
 * @returns {Array} Mock medical records
 */
export function getMockMedicalRecords() {
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
  
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  return [
    {
      id: 'mock-record-1',
      date: twoMonthsAgo.toISOString(),
      type: 'Diagnosis',
      description: 'Seasonal Allergies',
      doctor: 'Dr. Sarah Johnson',
      notes: 'Patient presented with nasal congestion, sneezing, and itchy eyes.',
      details: {
        severity: 'Mild',
        triggers: 'Pollen, dust',
        treatment: 'Antihistamines'
      }
    },
    {
      id: 'mock-record-2',
      date: oneMonthAgo.toISOString(),
      type: 'Lab Test',
      description: 'Complete Blood Count (CBC)',
      doctor: 'Dr. Michael Chen',
      notes: 'Routine blood work as part of annual physical.',
      details: {
        result: 'Normal',
        normalRange: 'Within reference ranges',
        units: 'Various'
      }
    },
    {
      id: 'mock-record-3',
      date: twoWeeksAgo.toISOString(),
      type: 'Imaging',
      description: 'Chest X-Ray',
      doctor: 'Dr. Emily Rodriguez',
      notes: 'Performed to rule out pneumonia.',
      imageUrl: 'https://example.com/mock-xray.pdf',
      details: {
        findings: 'No abnormalities detected',
        recommendation: 'No further imaging needed'
      }
    },
    {
      id: 'mock-record-4',
      date: oneWeekAgo.toISOString(),
      type: 'Follow-up',
      description: 'Allergy Management',
      doctor: 'Dr. Sarah Johnson',
      notes: 'Follow-up appointment to assess effectiveness of allergy medication.',
      details: {
        outcome: 'Symptoms improved',
        nextSteps: 'Continue current medication regimen'
      }
    }
  ];
}
