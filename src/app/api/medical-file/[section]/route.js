import { NextResponse } from 'next/server';

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
 * @param {Request} request
 * @param {Object} context with params
 * @returns {NextResponse} 
 */
export async function GET(request, { params }) {
  const { section } = params;
  const { searchParams } = new URL(request.url);
  
  const patientId = searchParams.get('patientId');
  
  if (!patientId) {
    return NextResponse.json(
      { error: 'Patient ID is required' },
      { status: 400 }
    );
  }
  
  const medicalFile = MOCK_MEDICAL_FILES[patientId];
  
  if (!medicalFile) {
    return NextResponse.json(
      { error: 'Medical file not found' },
      { status: 404 }
    );
  }
  
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
  

  return NextResponse.json({ 
    success: true, 
    data: medicalFile 
  });
}

/**
 * @param {Request} request
 * @param {Object} context 
 * @returns {NextResponse} 
 */
export async function POST(request, { params }) {
  const { section } = params;
  const { searchParams } = new URL(request.url);
  
  const patientId = searchParams.get('patientId');
  
  if (!patientId) {
    return NextResponse.json(
      { error: 'Patient ID is required' },
      { status: 400 }
    );
  }
  
  try {
    const body = await request.json();
    
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
 * @param {Request} request
 * @param {Object} context 
 * @returns {NextResponse} 
 */
export async function PATCH(request, { params }) {
  const { section } = params;
  const { searchParams } = new URL(request.url);
  
  const patientId = searchParams.get('patientId');
  
  if (!patientId) {
    return NextResponse.json(
      { error: 'Patient ID is required' },
      { status: 400 }
    );
  }
  
  const medicalFile = MOCK_MEDICAL_FILES[patientId];
  
  if (!medicalFile) {
    return NextResponse.json(
      { error: 'Medical file not found' },
      { status: 404 }
    );
  }
  
  try {
    const body = await request.json();
    
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