import { NextResponse } from 'next/server';
import { createApiResponse } from '@/lib/apiResponse';
import { logger } from '@/lib/logger';
import { authenticateUser } from '@/middleware/auth';
import { getPatientProfile, updatePatientProfile } from '@/controllers/patient/profileController';

const log = logger('PatientProfileAPI');

export async function OPTIONS() {
  return createApiResponse({
    success: true,
    status: 200
  });
}

export async function GET(request) {
  log.debug('Patient profile GET request received');
  log.time('request-total');
  
  try {
    const authResult = await authenticateUser(request);
    if (!authResult.success) {
      log.warn(`Authentication failed: ${authResult.error}`);
      log.timeEnd('request-total');
      return createApiResponse(authResult);
    }
    
    const { userId, role } = authResult.user;
    log.debug(`Authenticated ${role} with ID: ${userId}`);
    if (role !== 'patient') {
      log.warn(`Unauthorized role: ${role}`);
      log.timeEnd('request-total');
      return createApiResponse({
        success: false,
        error: 'Forbidden',
        message: 'Only patients can access their profile',
        status: 403
      });
    }
    
    try {
      const result = await getPatientProfile(userId);
      log.timeEnd('request-total');
      return createApiResponse(result);
    } catch (error) {
      log.error(`Error in profile service: ${error.message}`, error);
      log.timeEnd('request-total');
      
      return createApiResponse({
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve profile',
        status: 500,
        headers: { 'x-error-type': 'service_error' }
      });
    }
  } catch (error) {
    log.error(`Unexpected error in patient profile API: ${error.message}`, error);
    log.timeEnd('request-total');
    
    return createApiResponse({
      success: false,
      error: 'Internal Server Error',
      message: error.message,
      status: 500,
      headers: { 'x-error-type': 'unexpected_error' }
    });
  }
}

export async function PATCH(request) {
  log.debug('Patient profile PATCH request received');
  log.time('request-total');
  
  try {
    const authResult = await authenticateUser(request);
    if (!authResult.success) {
      log.warn(`Authentication failed: ${authResult.error}`);
      log.timeEnd('request-total');
      return createApiResponse(authResult);
    }
    
    const { userId, role } = authResult.user;
    log.debug(`Authenticated ${role} with ID: ${userId}`);
    if (role !== 'patient') {
      log.warn(`Unauthorized role: ${role}`);
      log.timeEnd('request-total');
      return createApiResponse({
        success: false,
        error: 'Forbidden',
        message: 'Only patients can update their profile',
        status: 403
      });
    }
    
    try {
      const requestData = await request.json();
      log.debug('Profile update data received', { fields: Object.keys(requestData) });
      
      const result = await updatePatientProfile(userId, requestData);
      log.timeEnd('request-total');
      return createApiResponse(result);
    } catch (error) {
      log.error(`Error in profile update service: ${error.message}`, error);
      log.timeEnd('request-total');
      
      return createApiResponse({
        success: false,
        error: 'Internal server error',
        message: 'Failed to update profile',
        status: 500,
        headers: { 'x-error-type': 'service_error' }
      });
    }
  } catch (error) {
    log.error(`Unexpected error in patient profile API: ${error.message}`, error);
    log.timeEnd('request-total');
    
    return createApiResponse({
      success: false,
      error: 'Internal Server Error',
      message: error.message,
      status: 500,
      headers: { 'x-error-type': 'unexpected_error' }
    });
  }
}
