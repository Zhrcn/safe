import { connectToDatabase, withTimeout } from '@/lib/db/mongodb';
import { logger } from '@/lib/logger';
import mongoose from 'mongoose';
import Consultation from '@/models/Consultation';

const log = logger('ConsultationService');

/**
 * Get consultations with pagination, filtering, and role-based access control
 * @param {Object} params - Query parameters
 * @param {string} userId - User ID
 * @param {string} role - User role (patient, doctor, admin)
 * @returns {Object} - Result object with consultations, pagination, and status
 */
export async function getConsultations(params = {}, userId, role) {
  log.debug('Getting consultations', { userId, role, params });
  log.time('db-consultations-lookup');
  
  try {
    await connectToDatabase();
    
    const query = buildQueryByRole(userId, role, params);
    log.debug('Built query', { query });
    
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 10;
    const skip = (page - 1) * limit;
    
    const total = await withTimeout(
      Consultation.countDocuments(query),
      5000,
      'Database query timeout while counting consultations'
    );
    
    const consultations = await withTimeout(
      Consultation.find(query)
        .populate('patientId', 'name')
        .populate('doctorId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      5000,
      'Database query timeout while fetching consultations'
    );
    
    log.timeEnd('db-consultations-lookup');
    log.info(`Found ${consultations.length} consultations, total: ${total}`);
    
    return {
      success: true,
      consultations,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      status: 200,
      headers: {
        'x-data-source': 'mongodb',
        'x-response-time': new Date().toISOString()
      }
    };
  } catch (error) {
    log.error(`Error retrieving consultations: ${error.message}`, error);
    log.timeEnd('db-consultations-lookup');
    
    return {
      success: false,
      error: 'Failed to retrieve consultations',
      message: error.message,
      status: 500,
      headers: {
        'x-error-type': error.name || 'UNKNOWN_ERROR',
        'x-error-time': new Date().toISOString()
      }
    };
  }
}

export async function createConsultation(data, userId, role) {
  log.debug('Creating consultation', { userId, role });
  log.time('db-consultation-create');
  
  try {
    await connectToDatabase();
    
    if (!data.reason || !data.preferredResponseTime) {
      return {
        success: false,
        error: 'Missing required fields',
        message: 'Reason and preferred response time are required',
        status: 400
      };
    }
    
    let patientId, doctorId;
    
    if (role === 'patient') {
      patientId = userId;
      doctorId = data.doctorId;
      
      if (!doctorId) {
        return {
          success: false,
          error: 'Missing doctor ID',
          message: 'Doctor ID is required',
          status: 400
        };
      }
    } else if (role === 'doctor') {
      doctorId = userId;
      patientId = data.patientId;
      
      if (!patientId) {
        return {
          success: false,
          error: 'Missing patient ID',
          message: 'Patient ID is required',
          status: 400
        };
      }
    } else {
      return {
        success: false,
        error: 'Unauthorized role',
        message: 'Only patients and doctors can create consultations',
        status: 403
      };
    }
    
    const attachments = data.attachments || [];
    
    const messages = [];
    if (data.initialMessage) {
      messages.push({
        sender: role === 'patient' ? patientId : doctorId,
        content: data.initialMessage,
        timestamp: new Date(),
        attachments: []
      });
    }
    
    const consultation = new Consultation({
      patientId,
      doctorId,
      reason: data.reason,
      preferredResponseTime: data.preferredResponseTime,
      status: 'pending',
      attachments,
      messages
    });
    
    await consultation.save();
    
    log.timeEnd('db-consultation-create');
    log.info('Consultation created successfully', { id: consultation._id });
    
    return {
      success: true,
      consultation,
      status: 201,
      headers: {
        'x-data-source': 'mongodb',
        'x-response-time': new Date().toISOString()
      }
    };
  } catch (error) {
    log.error(`Error creating consultation: ${error.message}`, error);
    log.timeEnd('db-consultation-create');
    
    return {
      success: false,
      error: 'Failed to create consultation',
      message: error.message,
      status: 500,
      headers: {
        'x-error-type': error.name || 'UNKNOWN_ERROR',
        'x-error-time': new Date().toISOString()
      }
    };
  }
}

export async function updateConsultation(consultationId, data, userId, role) {
  log.debug('Updating consultation', { consultationId, userId, role });
  log.time('db-consultation-update');
  
  try {
    await connectToDatabase();
    
    if (!consultationId) {
      return {
        success: false,
        error: 'Missing consultation ID',
        message: 'Consultation ID is required',
        status: 400
      };
    }
    
    const consultation = await Consultation.findById(consultationId);
    if (!consultation) {
      return {
        success: false,
        error: 'Consultation not found',
        message: `No consultation found with ID: ${consultationId}`,
        status: 404
      };
    }
    
    if (!isAuthorizedToModifyConsultation(consultation, userId, role)) {
      return {
        success: false,
        error: 'Unauthorized',
        message: 'You are not authorized to modify this consultation',
        status: 403
      };
    }
    
    if (data.status) {
      consultation.status = data.status;
    }
    
    if (data.newMessage) {
      consultation.messages.push({
        sender: userId,
        content: data.newMessage,
        timestamp: new Date(),
        attachments: data.messageAttachments || []
      });
    }
    
    if (data.attachments && data.attachments.length > 0) {
      consultation.attachments = [
        ...consultation.attachments,
        ...data.attachments
      ];
    }
    
    await consultation.save();
    
    log.timeEnd('db-consultation-update');
    log.info('Consultation updated successfully', { id: consultation._id });
    
    return {
      success: true,
      consultation,
      status: 200,
      headers: {
        'x-data-source': 'mongodb',
        'x-response-time': new Date().toISOString()
      }
    };
  } catch (error) {
    log.error(`Error updating consultation: ${error.message}`, error);
    log.timeEnd('db-consultation-update');
    
    return {
      success: false,
      error: 'Failed to update consultation',
      message: error.message,
      status: 500,
      headers: {
        'x-error-type': error.name || 'UNKNOWN_ERROR',
        'x-error-time': new Date().toISOString()
      }
    };
  }
}

export function getMockConsultations(params = {}, userId, role) {
  log.info('Generating mock consultations data', { userId, role });
  
  const page = parseInt(params.page) || 1;
  const limit = parseInt(params.limit) || 10;
  
  const mockConsultations = generateMockConsultationsByRole(userId, role, limit);
  
  return {
    success: true,
    consultations: mockConsultations,
    pagination: {
      total: 25, // Mock total count
      page,
      limit,
      pages: Math.ceil(25 / limit)
    },
    status: 200,
    headers: {
      'x-data-source': 'mock',
      'x-response-time': new Date().toISOString()
    }
  };
}

function buildQueryByRole(userId, role, params) {
  let query = {};
  
  if (role === 'patient') {
    query.patientId = userId;
  } else if (role === 'doctor') {
    query.doctorId = userId;
    
    if (params.patientId) {
      query = { patientId: params.patientId, doctorId: userId };
    }
  } else if (role === 'admin') {
    if (params.patientId) query.patientId = params.patientId;
    if (params.doctorId) query.doctorId = params.doctorId;
    if (params.status) query.status = params.status;
  }
  
  return query;
}

function isAuthorizedToModifyConsultation(consultation, userId, role) {
  if (role === 'admin') {
    return true; 
  } else if (role === 'patient') {
    return consultation.patientId.toString() === userId;
  } else if (role === 'doctor') {
    return consultation.doctorId.toString() === userId;
  }
  return false;
}

function generateMockConsultationsByRole(userId, role, count) {
  const statuses = ['pending', 'active', 'completed', 'cancelled'];
  const mockConsultations = [];
  
  for (let i = 0; i < count; i++) {
    const mockId = `mock_${Math.random().toString(36).substring(2, 15)}`;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
    
    let consultation = {
      _id: mockId,
      reason: `Mock consultation reason ${i + 1}`,
      preferredResponseTime: ['morning', 'afternoon', 'evening'][i % 3],
      status,
      createdAt,
      updatedAt: new Date(createdAt.getTime() + Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000),
      messages: [
        {
          sender: role === 'patient' ? userId : `mock_doctor_${i}`,
          content: `Initial message for consultation ${i + 1}`,
          timestamp: createdAt,
          attachments: []
        }
      ],
      attachments: []
    };
    
    if (role === 'patient') {
      consultation.patientId = { _id: userId, name: 'Current Patient' };
      consultation.doctorId = { _id: `mock_doctor_${i}`, name: `Dr. Mock ${i + 1}` };
    } else if (role === 'doctor') {
      consultation.doctorId = { _id: userId, name: 'Current Doctor' };
      consultation.patientId = { _id: `mock_patient_${i}`, name: `Patient ${i + 1}` };
    } else {
      consultation.patientId = { _id: `mock_patient_${i}`, name: `Patient ${i + 1}` };
      consultation.doctorId = { _id: `mock_doctor_${i}`, name: `Dr. Mock ${i + 1}` };
    }
    
    if (status !== 'pending') {
      const messageCount = Math.floor(Math.random() * 5) + 1;
      for (let j = 0; j < messageCount; j++) {
        const sender = j % 2 === 0 
          ? (role === 'patient' ? userId : consultation.patientId._id)
          : (role === 'doctor' ? userId : consultation.doctorId._id);
        
        consultation.messages.push({
          sender,
          content: `Follow-up message ${j + 1} for consultation ${i + 1}`,
          timestamp: new Date(createdAt.getTime() + (j + 1) * 24 * 60 * 60 * 1000),
          attachments: []
        });
      }
    }
    
    mockConsultations.push(consultation);
  }
  
  return mockConsultations;
}
