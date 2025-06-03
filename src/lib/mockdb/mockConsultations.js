/**
 * Mock Consultations Data
 */

const mockConsultations = [
    {
        _id: 'consultation_1',
        patientId: 'user_3',
        doctorId: 'user_2',
        appointmentId: 'appointment_6',
        date: '2024-06-15',
        chiefComplaint: 'High blood pressure',
        history: 'Patient has been taking Lisinopril 10mg daily for the past 3 months.',
        examination: 'BP: 130/85, HR: 72, RR: 16, Temp: 98.6F',
        assessment: 'Hypertension, well-controlled with current medication',
        plan: 'Continue current medication. Follow up in 3 months.',
        recommendations: 'Maintain low sodium diet, regular exercise, stress management',
        referrals: [],
        followUp: '2024-09-15',
        createdAt: '2024-06-15T11:30:00.000Z',
        updatedAt: '2024-06-15T11:30:00.000Z'
    },
    {
        _id: 'consultation_2',
        patientId: 'user_5',
        doctorId: 'user_2',
        appointmentId: 'appointment_6',
        date: '2024-06-15',
        chiefComplaint: 'Routine diabetes follow-up',
        history: 'Patient reports consistent medication compliance and blood glucose monitoring.',
        examination: 'BP: 125/82, HR: 68, RR: 14, Temp: 98.4F. Feet examination normal, no ulcers.',
        assessment: 'Type 2 Diabetes Mellitus, well-controlled with current regimen',
        plan: 'Continue Metformin 500mg twice daily. Ordered HbA1c and fasting glucose tests.',
        recommendations: 'Continue diet and exercise plan. Monitor blood glucose daily.',
        referrals: [],
        followUp: '2024-07-15',
        createdAt: '2024-06-15T10:45:00.000Z',
        updatedAt: '2024-06-15T10:45:00.000Z'
    },
    {
        _id: 'consultation_3',
        patientId: 'user_3',
        doctorId: 'user_6',
        appointmentId: 'appointment_7',
        date: '2024-06-10',
        chiefComplaint: 'Occasional heart palpitations',
        history: 'Patient reports occasional heart racing, particularly after stressful events. No syncope or chest pain.',
        examination: 'Cardiac exam normal. EKG shows normal sinus rhythm.',
        assessment: 'Likely benign palpitations related to stress',
        plan: 'EKG normal. No medication indicated at this time.',
        recommendations: 'Stress reduction techniques, limit caffeine intake, adequate sleep',
        referrals: [],
        followUp: '2024-08-10',
        createdAt: '2024-06-10T16:45:00.000Z',
        updatedAt: '2024-06-10T16:45:00.000Z'
    }
];

export default mockConsultations; 