import { connectToDatabase, withTimeout } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { logger } from '@/lib/logger';

const log = logger('AppointmentService');

/**
 * Get appointments based on query parameters
 * @param {Object} params - Query parameters
 * @param {string} userId - User ID from authentication
 * @param {string} role - User role from authentication
 * @returns {Promise<Object>} - Appointments data with pagination
 */
async function getAppointments(params, userId, role) {
  log.debug(`Getting appointments for ${role} with ID: ${userId}`);
  log.time('db-appointments-lookup');
  
  try {
    await connectToDatabase();
    
    // Build query based on role and parameters
    let query = buildAppointmentsQuery(params, userId, role);
    
    // Parse pagination parameters
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Connect to database
    const { db } = await connectToDatabase();
    const appointmentsCollection = db.collection('appointments');
    
    // Get total count of matching appointments
    const total = await withTimeout(
      appointmentsCollection.countDocuments(query),
      5000,
      'Appointments count timed out'
    );
    
    log.debug(`Found ${total} appointments matching query`);
    
    // Get appointments with pagination
    const appointmentsCursor = appointmentsCollection.find(query)
      .sort({ date: 1, startTime: 1 })
      .skip(skip)
      .limit(limit);
      
    const appointments = await withTimeout(
      appointmentsCursor.toArray(),
      5000,
      'Appointments fetch timed out'
    );
    
    // Populate patient and doctor names
    const usersCollection = db.collection('users');
    const populatedAppointments = await Promise.all(appointments.map(async (appointment) => {
      let patientName = 'Unknown Patient';
      let doctorName = 'Unknown Doctor';
      
      if (appointment.patientId) {
        const patient = await withTimeout(
          usersCollection.findOne({ _id: new ObjectId(appointment.patientId) }),
          3000,
          'Patient lookup timed out'
        );
        if (patient) {
          patientName = `${patient.firstName || ''} ${patient.lastName || ''}`.trim();
        }
      }
      
      if (appointment.doctorId) {
        const doctor = await withTimeout(
          usersCollection.findOne({ _id: new ObjectId(appointment.doctorId) }),
          3000,
          'Doctor lookup timed out'
        );
        if (doctor) {
          doctorName = `${doctor.firstName || ''} ${doctor.lastName || ''}`.trim();
        }
      }
      
      return {
        ...appointment,
        patientName,
        doctorName
      };
    }));
    
    const hasMore = total > page * limit;
    
    log.timeEnd('db-appointments-lookup');
    
    return {
      success: true,
      appointments: populatedAppointments,
      pagination: {
        total,
        page,
        limit,
        hasMore
      },
      status: 200,
      headers: { 
        'x-records-count': total,
        'x-data-source': 'database',
        'x-data-completeness': 'full'
      }
    };
  } catch (error) {
    log.error(`Error fetching appointments: ${error.message}`, error);
    log.timeEnd('db-appointments-lookup');
    
    return {
      success: false,
      error: 'Database error',
      message: error.message,
      status: 500,
      headers: { 'x-error-type': 'database_error' }
    };
  }
}

/**
 * Build query object for appointments based on role and parameters
 * @param {Object} params - Query parameters
 * @param {string} userId - User ID from authentication
 * @param {string} role - User role from authentication
 * @returns {Object} - MongoDB query object
 */
function buildAppointmentsQuery(params, userId, role) {
  let query = {};
  
  // Role-based filtering
  if (role === 'patient') {
    query.patientId = new ObjectId(userId);
  } else if (role === 'doctor') {
    query.doctorId = new ObjectId(userId);
    
    // If doctor is viewing a specific patient's appointments
    if (params.patientId) {
      query = { 
        patientId: new ObjectId(params.patientId), 
        doctorId: new ObjectId(userId) 
      };
    }
  } else if (role === 'admin') {
    // Admin can filter by any field
    if (params.patientId) query.patientId = new ObjectId(params.patientId);
    if (params.doctorId) query.doctorId = new ObjectId(params.doctorId);
    if (params.status) query.status = params.status;
  }
  
  // Date range filtering
  if (params.startDate || params.endDate) {
    query.date = {};
    if (params.startDate) query.date.$gte = new Date(params.startDate);
    if (params.endDate) query.date.$lte = new Date(params.endDate);
  }
  
  return query;
}

/**
 * Get mock appointments data for fallback
 * @param {Object} params - Query parameters
 * @param {string} userId - User ID from authentication
 * @param {string} role - User role from authentication
 * @returns {Object} - Mock appointments data
 */
function getMockAppointments(params, userId, role) {
  const page = parseInt(params.page) || 1;
  const limit = parseInt(params.limit) || 10;
  
  // Generate mock appointments
  const mockAppointments = [];
  const total = 5;
  
  for (let i = 0; i < Math.min(total, limit); i++) {
    const appointmentDate = new Date();
    appointmentDate.setDate(appointmentDate.getDate() + i);
    
    mockAppointments.push({
      _id: `mock-appointment-${i}`,
      patientId: role === 'patient' ? userId : `mock-patient-${i}`,
      doctorId: role === 'doctor' ? userId : `mock-doctor-${i}`,
      patientName: 'John Doe',
      doctorName: 'Dr. Jane Smith',
      date: appointmentDate,
      startTime: '10:00',
      endTime: '10:30',
      status: ['scheduled', 'completed', 'cancelled'][i % 3],
      type: ['consultation', 'follow-up', 'check-up'][i % 3],
      notes: 'Mock appointment notes',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  
  return {
    success: true,
    appointments: mockAppointments,
    pagination: {
      total,
      page,
      limit,
      hasMore: page * limit < total
    },
    status: 200,
    headers: { 
      'x-records-count': total,
      'x-data-source': 'mock',
      'x-data-completeness': 'partial'
    }
  };
}

export {
  getAppointments,
  getMockAppointments
};
