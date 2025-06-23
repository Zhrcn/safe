export const prescriptions = [
  {
    id: '1',
    patientId: '1', 
    doctorId: '1', 
    patient: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe'
    },
    doctor: {
      id: '1',
      firstName: 'Sarah',
      lastName: 'Johnson',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology'
    },
    issueDate: '2024-03-15T00:00:00Z',
    expiryDate: '2024-12-31T00:00:00Z',
    medications: [
      {
        id: '1',
        name: 'Lisinopril',
        medicineId: '1', 
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '30 days',
        route: 'Oral',
        instructions: 'Take with food',
        refills: 2,
        status: 'active'
      },
      {
        id: '2',
        name: 'Metformin',
        medicineId: '2', 
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '30 days',
        route: 'Oral',
        instructions: 'Take with meals',
        refills: 1,
        status: 'active'
      }
    ],
    diagnosis: 'Hypertension',
    notes: 'Regular monitoring required',
    status: 'active',
    dispenseHistory: [
      {
        id: '1',
        pharmacistId: '1', 
        pharmacist: {
          id: '1',
          name: 'John Smith',
          pharmacy: 'City Pharmacy'
        },
        dispenseDate: '2024-03-15T00:00:00Z',
        quantityDispensed: '30 tablets',
        pharmacyNotes: 'Patient picked up medication',
      },
    ],
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
  {
    id: '2',
    patientId: '1', 
    doctorId: '2', 
    patient: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe'
    },
    doctor: {
      id: '2',
      firstName: 'Michael',
      lastName: 'Chen',
      name: 'Dr. Michael Chen',
      specialty: 'Dermatology'
    },
    issueDate: '2024-02-28T00:00:00Z',
    expiryDate: '2024-03-14T00:00:00Z',
    medications: [
      {
        id: '3',
        name: 'Hydrocortisone Cream',
        medicineId: '3', 
        dosage: '1%',
        frequency: 'Apply twice daily',
        duration: '14 days',
        route: 'Topical',
        instructions: 'Apply to affected area',
        refills: 0,
        status: 'completed'
      }
    ],
    diagnosis: 'Contact Dermatitis',
    notes: 'Apply cream to affected areas until symptoms improve',
    status: 'completed',
    dispenseHistory: [
      {
        id: '2',
        pharmacistId: '2', 
        pharmacist: {
          id: '2',
          name: 'Maria Garcia',
          pharmacy: 'Health Plus Pharmacy'
        },
        dispenseDate: '2024-02-28T00:00:00Z',
        quantityDispensed: '1 tube',
        pharmacyNotes: 'Patient picked up medication',
      },
    ],
    createdAt: '2024-02-28T00:00:00Z',
    updatedAt: '2024-02-28T00:00:00Z',
  }
]; 