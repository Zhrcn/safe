export const conversations = [
  {
    id: '1',
    participants: ['3', '2'], // IDs of the first patient and doctor from mockdata/patients.js and mockdata/doctors.js
    messages: [
      {
        sender: '3', // ID of the first patient from mockdata/patients.js
        recever: '2', // ID of the doctor from mockdata/doctors.js
        content: 'Hello, I have a question about my medication.',
        timestamp: '2023-01-01T10:00:00.000Z',
        read: true,
        attachments: [],
      },
      {
        sender: '2', // ID of the doctor from mockdata/doctors.js
        recever: '3', // ID of the first patient from mockdata/patients.js
        content: 'Sure, what would you like to know?',
        timestamp: '2023-01-01T10:05:00.000Z',
        read: true,
        attachments: [],
      },
    ],
    subject: 'Medication Inquiry',
    lastMessageTimestamp: '2023-01-01T10:05:00.000Z',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]; 