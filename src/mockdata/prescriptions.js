export const prescriptions = [
  {
    id: '1',
    patientId: '3', // ID of the first patient from mockdata/patients.js
    doctorId: '2', // ID of the doctor from mockdata/doctors.js
    issueDate: new Date('2023-01-01'),
    expiryDate: new Date('2023-12-31'),
    medications: [
      {
        name: 'Lisinopril',
        medicineId: '1', // ID of the medicine from mockdata/medicines.js
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '1 year',
        route: 'Oral',
        instructions: 'Take with food',
      },
    ],
    diagnosis: 'Hypertension',
    notes: 'Regular monitoring required',
    status: 'active',
    dispenseHistory: [
      {
        pharmacistId: '5', // ID of the pharmacist from mockdata/pharmacists.js
        dispenseDate: new Date('2023-01-01'),
        quantityDispensed: '30 tablets',
        pharmacyNotes: 'Patient picked up medication',
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]; 