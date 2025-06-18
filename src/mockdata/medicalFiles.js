export const medicalFiles = [
  {
    id: '1',
    patientId: '3', 
    bloodType: 'A+',
    status: 'active',
    allergies: [
      {
        name: 'Penicillin',
        severity: 'severe',
        reaction: 'Anaphylaxis',
      },
    ],
    chronicConditions: [
      {
        name: 'Hypertension',
        diagnosisDate: new Date('2020-01-01'),
        status: 'active',
        notes: 'Regular monitoring required',
      },
    ],
    labResults: [
      {
        testName: 'Blood Pressure',
        date: new Date('2023-01-01'),
        results: '120/80',
        normalRange: '120/80',
        unit: 'mmHg',
        labName: 'City Lab',
        doctorId: '2', 
        documents: [],
      },
    ],
    imagingReports: [
      {
        type: 'X-Ray',
        date: new Date('2023-01-01'),
        findings: 'Normal',
        location: 'Chest',
        doctorId: '2', 
        images: [],
      },
    ],
    vitalSigns: [
      {
        date: new Date('2023-01-01'),
        bloodPressure: '120/80',
        heartRate: 72,
        temperature: 37,
        respiratoryRate: 16,
        weight: 70,
        height: 175,
        bmi: 22.9,
        oxygenSaturation: 98,
        notes: 'Normal',
      },
    ],
    prescriptionsList: [],
    medicationHistory: [
      {
        medicine: '1', 
        name: 'Lisinopril',
        dose: '10mg',
        frequency: 'Once daily',
        route: 'Oral',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2023-12-31'),
        active: true,
        instructions: 'Take with food',
        prescribedBy: '2', 
        reminders: [
          {
            time: '08:00',
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            message: 'Take Lisinopril',
            status: 'active',
          },
        ],
      },
    ],
    immunizations: [
      {
        name: 'Flu Shot',
        dateAdministered: new Date('2023-01-01'),
        nextDoseDate: new Date('2024-01-01'),
        manufacturer: 'Pfizer',
        batchNumber: '123456',
        administeredBy: 'Dr. Smith',
      },
    ],
    attachedDocuments: [
      {
        title: 'Medical Report',
        type: 'PDF',
        url: 'https:labName',
        uploadDate: new Date('2023-01-01'),
        tags: ['report', 'medical'],
      },
    ],
    diagnoses: [
      {
        conditionName: 'Hypertension',
        diagnosedBy: '2', 
        date: new Date('2020-01-01'),
        notes: 'Regular monitoring required',
        treatmentPlan: 'Medication and lifestyle changes',
        status: 'active',
      },
    ],
    surgicalHistory: [
      {
        name: 'Appendectomy',
        date: new Date('2010-01-01'),
        hospital: 'General Hospital',
        surgeon: 'Dr. Johnson',
        notes: 'Successful',
        complications: 'None',
        outcome: 'Good',
      },
    ],
    familyMedicalHistory: [
      {
        relation: 'Father',
        condition: 'Heart Disease',
        notes: 'Deceased at age 65',
      },
    ],
    socialHistory: {
      smokingStatus: 'never',
      alcoholUse: 'Occasional',
      occupation: 'Engineer',
      livingSituation: 'With family',
    },
    generalMedicalHistory: [
      {
        date: new Date('2023-01-01'),
        doctorId: '2', 
        visitReason: 'Regular checkup',
        diagnosisSummary: 'Healthy',
        treatmentSummary: 'None',
        notes: 'Patient is doing well',
      },
    ],
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '0987654321',
      email: 'jane.doe@example.com',
    },
    insuranceDetails: {
      provider: 'Blue Cross',
      policyNumber: '123456789',
      groupNumber: '987654321',
      expiryDate: new Date('2023-12-31'),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    patientId: '4',
    bloodType: 'O-',
    status: 'inactive',
    allergies: [
      {
        name: 'None',
        severity: '',
        reaction: '',
      },
    ],
    chronicConditions: [
      {
        name: 'Diabetes',
        diagnosisDate: new Date('2018-05-10'),
        status: 'controlled',
        notes: 'On medication',
      },
    ],
    labResults: [
      {
        testName: 'Glucose',
        date: new Date('2023-02-15'),
        results: '90',
        normalRange: '70-99',
        unit: 'mg/dL',
        labName: 'Central Lab',
        doctorId: '3',
        documents: [],
      },
    ],
    imagingReports: [
      {
        type: 'MRI',
        date: new Date('2023-03-20'),
        findings: 'No abnormalities',
        location: 'Brain',
        doctorId: '3',
        images: [],
      },
    ],
    vitalSigns: [
      {
        date: new Date('2023-03-20'),
        bloodPressure: '130/85',
        heartRate: 80,
        temperature: 36.8,
        respiratoryRate: 18,
        weight: 80,
        height: 180,
        bmi: 24.7,
        oxygenSaturation: 97,
        notes: 'Slightly elevated BP',
      },
    ]
  }
]; 