export const consultations = [
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
    reason: 'Review of recent test results',
    type: 'video',
    status: 'scheduled',
    preferredTime: '10:00 AM',
    response: 'Patient is healthy',
    notes: 'Please have your blood test results ready',
    duration: 30,
    location: 'Virtual Meeting',
    attachments: [
      {
        id: 1,
        name: 'Blood Test Results.pdf',
        type: 'pdf',
        size: '2.5MB',
        uploadedAt: '2024-03-19'
      },
    ],
    messages: [
      {
        sender: 'You',
        message: 'I have my blood test results ready for the consultation.',
        timestamp: '2024-03-20T14:30:00Z',
        read: true
      },
      {
        sender: 'Dr. Sarah Johnson',
        message: 'Thank you for preparing the results. I\'ll review them during our consultation.',
        timestamp: '2024-03-20T14:35:00Z',
        read: true
      }
    ],
    requestedAt: '2024-03-18T00:00:00Z',
    startedAt: '2024-03-20T15:00:00Z',
    completedAt: null,
    cancelledAt: null,
    cancelledBy: null,
    createdAt: '2024-03-18T00:00:00Z',
    updatedAt: '2024-03-20T14:30:00Z',
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
    reason: 'Skin condition follow-up',
    type: 'in-person',
    status: 'completed',
    preferredTime: '11:00 AM',
    response: 'Patient reported improvement in symptoms',
    notes: 'Patient reported improvement in symptoms',
    duration: 45,
    location: 'Medical Center - Dermatology Clinic',
    attachments: [
      {
        id: 2,
        name: 'Skin Photos.jpg',
        type: 'image',
        size: '1.8MB',
        uploadedAt: '2024-03-17'
      },
    ],
    messages: [
      {
        sender: 'You',
        message: 'The prescribed cream has helped reduce the redness significantly.',
        timestamp: '2024-03-18T10:45:00Z',
        read: true
      },
      {
        sender: 'Dr. Michael Chen',
        message: 'That\'s great to hear. Let\'s discuss the progress during our appointment.',
        timestamp: '2024-03-18T10:50:00Z',
        read: true
      },
      {
        sender: 'Dr. Michael Chen',
        message: 'Based on today\'s examination, we can reduce the frequency of application.',
        timestamp: '2024-03-18T11:45:00Z',
        read: true
      }
    ],
    requestedAt: '2024-03-15T00:00:00Z',
    startedAt: '2024-03-18T11:00:00Z',
    completedAt: '2024-03-18T11:45:00Z',
    cancelledAt: null,
    cancelledBy: null,
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-03-18T11:45:00Z',
  }
]; 