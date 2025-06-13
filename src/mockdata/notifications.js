export const notifications = [
  {
    id: '1',
    user: '3', // ID of the first patient from mockdata/patients.js
    type: 'appointment',
    title: 'Appointment Reminder',
    message: 'You have an appointment tomorrow at 10:00 AM.',
    isRead: false,
    relatedTo: '1', // ID of the appointment from mockdata/appointments.js
    relatedModel: 'Appointment',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]; 