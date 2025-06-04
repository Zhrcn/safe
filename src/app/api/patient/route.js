import { getPatientData, updatePatientData } from '@/controllers/patientController';
import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    
    const session = await getSession(request);
    const result = await getPatientData(session);
    
    clearTimeout(timeout);
    
    if (result.status === 'error') {
      return NextResponse.json(
        { error: result.message },
        { status: result.message === 'Unauthorized' ? 401 : 408 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Patient Route Error:', error);
    const status = error.name === 'AbortError' ? 408 : 500;
    return NextResponse.json(
      { error: status === 408 ? 'Request timeout' : 'Internal server error' },
      { status }
    );
  }
}

export async function PUT(request) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    
    const session = await getSession(request);
    const updateData = await request.json();
    const result = await updatePatientData(session, updateData);
    
    clearTimeout(timeout);
    
    if (result.status === 'error') {
      return NextResponse.json(
        { error: result.message },
        { status: result.message === 'Unauthorized' ? 401 : 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Patient Update Route Error:', error);
    const status = error.name === 'AbortError' ? 408 : 500;
    return NextResponse.json(
      { error: status === 408 ? 'Request timeout' : 'Internal server error' },
      { status }
    );
  }
}
