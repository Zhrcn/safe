/**
 * Mock Appointments Data
 */

const mockAppointments = [
    {
        _id: 'appointment_1',
        patientId: 'user_3',
        doctorId: 'user_2',
        date: '2024-06-25',
        time: '09:00 AM',
        reason: 'Annual checkup',
        status: 'scheduled',
        notes: 'Routine annual physical examination',
        preferredTimeSlot: 'morning',
        createdAt: '2024-06-10T10:30:00.000Z',
        updatedAt: '2024-06-10T10:30:00.000Z'
    },
    {
        _id: 'appointment_2',
        patientId: 'user_5',
        doctorId: 'user_2',
        date: '2024-06-26',
        time: '11:30 AM',
        reason: 'Diabetes follow-up',
        status: 'scheduled',
        notes: 'Follow-up on medication adjustment',
        preferredTimeSlot: 'morning',
        createdAt: '2024-06-12T09:15:00.000Z',
        updatedAt: '2024-06-12T09:15:00.000Z'
    },
    {
        _id: 'appointment_3',
        patientId: 'user_3',
        doctorId: 'user_6',
        date: '2024-06-28',
        time: '02:00 PM',
        reason: 'Heart palpitations',
        status: 'scheduled',
        notes: 'Patient reported occasional heart palpitations',
        preferredTimeSlot: 'afternoon',
        createdAt: '2024-06-15T14:45:00.000Z',
        updatedAt: '2024-06-15T14:45:00.000Z'
    },
    {
        _id: 'appointment_4',
        patientId: 'user_5',
        doctorId: 'user_6',
        status: 'pending',
        reason: 'Chest pain',
        preferredTimeSlot: 'afternoon',
        notes: 'Patient reported chest pain after exercise',
        createdAt: '2024-06-18T08:00:00.000Z',
        updatedAt: '2024-06-18T08:00:00.000Z'
    },
    {
        _id: 'appointment_5',
        patientId: 'user_3',
        doctorId: 'user_2',
        status: 'pending',
        reason: 'Headaches',
        preferredTimeSlot: 'evening',
        notes: 'Recurring headaches for the past two weeks',
        createdAt: '2024-06-19T16:30:00.000Z',
        updatedAt: '2024-06-19T16:30:00.000Z'
    },
    {
        _id: 'appointment_6',
        patientId: 'user_5',
        doctorId: 'user_2',
        date: '2024-06-15',
        time: '10:00 AM',
        reason: 'Blood pressure check',
        status: 'completed',
        notes: 'BP was 130/85, advised continued medication',
        preferredTimeSlot: 'morning',
        createdAt: '2024-06-01T11:00:00.000Z',
        updatedAt: '2024-06-15T11:30:00.000Z'
    },
    {
        _id: 'appointment_7',
        patientId: 'user_3',
        doctorId: 'user_6',
        date: '2024-06-10',
        time: '03:30 PM',
        reason: 'EKG test',
        status: 'completed',
        notes: 'EKG normal, no abnormalities detected',
        preferredTimeSlot: 'afternoon',
        createdAt: '2024-05-28T09:00:00.000Z',
        updatedAt: '2024-06-10T16:45:00.000Z'
    },
    {
        _id: 'appointment_8',
        patientId: 'user_5',
        doctorId: 'user_6',
        date: '2024-06-20',
        time: '11:00 AM',
        reason: 'Consultation',
        status: 'cancelled',
        notes: 'Patient had to travel for work',
        preferredTimeSlot: 'morning',
        createdAt: '2024-06-05T10:15:00.000Z',
        updatedAt: '2024-06-18T14:00:00.000Z'
    }
];

export default mockAppointments; 