export const consultations = [
  {
    id: '1',
    patient: '1', 
    doctor: '2', 
    reason: 'Regular checkup',
    preferredTime: '10:00 AM',
    status: 'Completed',
    response: 'Patient is healthy',
    attachments: [
      {
        name: 'Medical Report',
        url: 'https://example.com/medical-report.pdf',
        type: 'PDF',
        size: 1024,
      },
    ],
    requestedAt: new Date('2023-01-01'),
    startedAt: new Date('2023-01-01T10:00:00'),
    completedAt: new Date('2023-01-01T10:30:00'),
    cancelledAt: null,
    cancelledBy: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]; 