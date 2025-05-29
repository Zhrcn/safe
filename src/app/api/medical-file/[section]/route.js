import { NextResponse } from 'next/server';

// Mock medical file data
const MOCK_MEDICAL_FILES = {
  'patient1': {
    overview: {
      patientId: 'patient1',
      name: 'Sarah Johnson',
      dob: '1990-05-15',
      bloodType: 'A+',
      allergies: ['Penicillin', 'Peanuts'],
      chronicConditions: ['Hypertension']
    },
    history: [
      { date: '2023-12-10', description: 'Annual checkup', notes: 'Blood pressure slightly elevated' },
      { date: '2024-01-15', description: 'Follow-up appointment', notes: 'Started on medication' },
      { date: '2024-03-20', description: 'Blood work', notes: 'Results normal' },
    ],
    medications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'once daily', purpose: 'For Hypertension' },
      { name: 'Aspirin', dosage: '81mg', frequency: 'once daily', purpose: 'Preventative' }
    ],
    labResults: [
      { 
        date: '2024-03-20', 
        type: 'Blood Work', 
        results: [
          { test: 'CBC', value: 'Normal', referenceRange: 'N/A' },
          { test: 'Cholesterol', value: '185 mg/dL', referenceRange: '<200 mg/dL' },
          { test: 'Blood Pressure', value: '130/85', referenceRange: '<120/80' }
        ]
      }
    ]
  },
  'patient2': {
    overview: {
      patientId: 'patient2',
      name: 'John Smith',
      dob: '1975-08-22',
      bloodType: 'O-',
      allergies: ['Sulfa drugs'],
      chronicConditions: ['Diabetes Type 2']
    },
    history: [
      { date: '2023-11-05', description: 'Initial diagnosis', notes: 'Diabetes Type 2 confirmed' },
      { date: '2024-02-10', description: 'Follow-up appointment', notes: 'Glucose levels improving with diet' },
    ],
    medications: [
      { name: 'Metformin', dosage: '500mg', frequency: 'twice daily with meals', purpose: 'For Type 2 Diabetes' }
    ],
    labResults: [
      { 
        date: '2024-02-10', 
        type: 'Diabetes Panel', 
        results: [
          { test: 'Fasting Blood Glucose', value: '126 mg/dL', referenceRange: '70-99 mg/dL' },
          { test: 'HbA1c', value: '6.8%', referenceRange: '<5.7%' }
        ]
      }
    ]
  }
};

/**
 * GET handler for retrieving medical file data
 * @param {Request} request - The request object
 * @param {Object} context - The context object with params
 * @returns {NextResponse} - The response object
 */
export async function GET(request, { params }) {
  const { section } = params;
  const { searchParams } = new URL(request.url);
  
  // Get patientId from query params
  const patientId = searchParams.get('patientId');
  
  // Return 400 if no patientId provided
  if (!patientId) {
    return NextResponse.json(
      { error: 'Patient ID is required' },
      { status: 400 }
    );
  }
  
  // Get medical file for patient
  const medicalFile = MOCK_MEDICAL_FILES[patientId];
  
  // Return 404 if no medical file found
  if (!medicalFile) {
    return NextResponse.json(
      { error: 'Medical file not found' },
      { status: 404 }
    );
  }
  
  // Return requested section or 404 if section not found
  if (section && section !== 'all') {
    if (!medicalFile[section]) {
      return NextResponse.json(
        { error: `Section '${section}' not found in medical file` },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: medicalFile[section] 
    });
  }
  
  // Return entire medical file if section is 'all' or not specified
  return NextResponse.json({ 
    success: true, 
    data: medicalFile 
  });
}

/**
 * POST handler for creating/updating medical file data
 * @param {Request} request - The request object
 * @param {Object} context - The context object with params
 * @returns {NextResponse} - The response object
 */
export async function POST(request, { params }) {
  const { section } = params;
  const { searchParams } = new URL(request.url);
  
  // Get patientId from query params
  const patientId = searchParams.get('patientId');
  
  // Return 400 if no patientId provided
  if (!patientId) {
    return NextResponse.json(
      { error: 'Patient ID is required' },
      { status: 400 }
    );
  }
  
  try {
    // Parse request body
    const body = await request.json();
    
    // In a real app, this would update a database
    // For now, we'll just return success
    return NextResponse.json({ 
      success: true, 
      message: `Medical file ${section} updated for patient ${patientId}`,
      data: body
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

/**
 * PATCH handler for updating medical file data
 * @param {Request} request - The request object
 * @param {Object} context - The context object with params
 * @returns {NextResponse} - The response object
 */
export async function PATCH(request, { params }) {
  const { section } = params;
  const { searchParams } = new URL(request.url);
  
  // Get patientId from query params
  const patientId = searchParams.get('patientId');
  
  // Return 400 if no patientId provided
  if (!patientId) {
    return NextResponse.json(
      { error: 'Patient ID is required' },
      { status: 400 }
    );
  }
  
  // Get medical file for patient
  const medicalFile = MOCK_MEDICAL_FILES[patientId];
  
  // Return 404 if no medical file found
  if (!medicalFile) {
    return NextResponse.json(
      { error: 'Medical file not found' },
      { status: 404 }
    );
  }
  
  try {
    // Parse request body
    const body = await request.json();
    
    // In a real app, this would update a database
    // For now, we'll just return success
    return NextResponse.json({ 
      success: true, 
      message: `Medical file ${section} updated for patient ${patientId}`,
      data: body
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
} 