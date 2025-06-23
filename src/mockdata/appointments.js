export const appointments = [
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
    date: '2024-04-15',
    time: '10:00 AM',
    type: 'video',
    status: 'scheduled',
    reason: 'Follow-up Consultation',
    location: 'Virtual Meeting',
    notes: 'Please prepare your recent test results',
    duration: 30,
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z',
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
    date: '2024-04-20',
    time: '2:30 PM',
    type: 'in-person',
    status: 'scheduled',
    reason: 'Annual Physical Examination',
    location: 'Main Clinic, Room 302',
    notes: 'Please arrive 15 minutes early',
    duration: 45,
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z',
  },
  {
    id: '3',
    patientId: '1',
    doctorId: '3',
    patient: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe'
    },
    doctor: {
      id: '3',
      firstName: 'Emily',
      lastName: 'Brown',
      name: 'Dr. Emily Brown',
      specialty: 'Pediatrics'
    },
    date: '2024-04-25',
    time: '11:00 AM',
    type: 'phone',
    status: 'scheduled',
    reason: 'Medication Review',
    location: 'Phone Consultation',
    notes: 'Have your current medications list ready',
    duration: 20,
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z',
  }
]; 