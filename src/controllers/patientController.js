import { getSession } from '@/lib/auth';
import Patient from '@/models/Patient';
import mongoose from 'mongoose';

const CACHE_TTL = 60000; // 1 minute cache
let lastFetchTime = 0;
let cachedPatientData = null;

export async function getPatientData(session) {
  // Return cached result if within TTL
  const now = Date.now();
  if (cachedPatientData && now - lastFetchTime < CACHE_TTL) {
    return cachedPatientData;
  }

  if (!session?.user?.id) {
    return {
      status: 'error',
      message: 'Unauthorized',
      data: null
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const patient = await Patient.findOne(
      { user: new mongoose.Types.ObjectId(session.user.id) },
      { 
        __v: 0,
        createdAt: 0,
        updatedAt: 0
      }
    )
    .populate('user', '-password -__v -createdAt -updatedAt')
    .populate('doctorsList', '-__v -createdAt -updatedAt')
    .lean();

    clearTimeout(timeout);
    
    if (!patient) {
      return {
        status: 'error',
        message: 'Patient not found',
        data: null
      };
    }

    cachedPatientData = {
      status: 'success',
      data: patient
    };
    lastFetchTime = Date.now();
    
    return cachedPatientData;
  } catch (error) {
    console.error('PatientController Error:', error);
    return {
      status: 'error',
      message: error.name === 'AbortError' ? 'Request timeout' : 'Failed to load patient data',
      data: null
    };
  }
}

export async function updatePatientData(session, updateData) {
  try {
    if (!session?.user?.id) {
      return {
        status: 'error',
        message: 'Unauthorized',
        data: null
      };
    }

    const updatedPatient = await Patient.findOneAndUpdate(
      { user: new mongoose.Types.ObjectId(session.user.id) },
      { $set: updateData },
      { new: true, lean: true }
    );

    // Clear cache after update
    cachedPatientData = null;
    
    return {
      status: 'success',
      data: updatedPatient
    };
  } catch (error) {
    console.error('PatientController Update Error:', error);
    return {
      status: 'error',
      message: 'Failed to update patient data',
      data: null
    };
  }
}
