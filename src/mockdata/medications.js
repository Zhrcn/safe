export const medications = [
  {
    id: '1',
    patient: '1', // ID of the first patient from mockdata/patients.js
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    startDate: '2020-01-01T00:00:00.000Z',
    endDate: '2023-12-31T00:00:00.000Z',
    status: 'active',
    prescribedBy: '2', // ID of the doctor from mockdata/doctors.js
    instructions: 'Take with food',
    sideEffects: 'Dizziness, cough',
    notes: 'For hypertension',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]; 