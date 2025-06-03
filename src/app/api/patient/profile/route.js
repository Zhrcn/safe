import { NextResponse } from 'next/server';
import { getPatientProfile, updatePatientProfile, createApiResponse } from '@/controllers/patient/profileController';

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return createApiResponse(
      { error: 'Unauthorized - Missing or invalid token' },
      401,
      { 'x-error-type': 'auth_error' }
    );
  }

  const token = authHeader.split(' ')[1];
  
    
  const result = await getPatientProfile(token);
  
    
  return createApiResponse(
    result.success ? { success: true, profile: result.profile } : { error: result.error, message: result.message },
    result.status,
    result.headers
  );
}

export async function PATCH(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return createApiResponse(
      { error: 'Unauthorized - Missing or invalid token' },
      401,
      { 'x-error-type': 'auth_error' }
    );
  }

  const token = authHeader.split(' ')[1];
  
  const requestData = await request.json();
  
  const result = await updatePatientProfile(token, requestData);
  
  return createApiResponse(
    result.success 
      ? { success: true, message: result.message, profile: result.profile } 
      : { error: result.error, message: result.message },
    result.status,
    result.headers
  );
}
