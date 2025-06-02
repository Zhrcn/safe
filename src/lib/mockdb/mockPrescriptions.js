/**
 * Mock Prescriptions Data
 */

const mockPrescriptions = [
    {
        _id: 'prescription_1',
        patientId: 'user_3',
        doctorId: 'user_2',
        medications: [
            {
                name: 'Lisinopril',
                dosage: '10mg',
                frequency: 'Once daily',
                duration: '90 days',
                instructions: 'Take in the morning with water',
                quantity: 90
            },
            {
                name: 'Aspirin',
                dosage: '81mg',
                frequency: 'Once daily',
                duration: '90 days',
                instructions: 'Take with food',
                quantity: 90
            }
        ],
        notes: 'Continue current hypertension management',
        status: 'active',
        dateIssued: '2024-05-15T10:30:00.000Z',
        expiryDate: '2024-08-15T10:30:00.000Z',
        refills: 2,
        refillsUsed: 0,
        createdAt: '2024-05-15T10:30:00.000Z',
        updatedAt: '2024-05-15T10:30:00.000Z'
    },
    {
        _id: 'prescription_2',
        patientId: 'user_5',
        doctorId: 'user_2',
        medications: [
            {
                name: 'Metformin',
                dosage: '500mg',
                frequency: 'Twice daily with meals',
                duration: '30 days',
                instructions: 'Take with breakfast and dinner',
                quantity: 60
            }
        ],
        notes: 'Monitor blood glucose levels and report any side effects',
        status: 'active',
        dateIssued: '2024-06-15T11:15:00.000Z',
        expiryDate: '2024-07-15T11:15:00.000Z',
        refills: 3,
        refillsUsed: 0,
        createdAt: '2024-06-15T11:15:00.000Z',
        updatedAt: '2024-06-15T11:15:00.000Z'
    },
    {
        _id: 'prescription_3',
        patientId: 'user_3',
        doctorId: 'user_6',
        medications: [
            {
                name: 'Atorvastatin',
                dosage: '20mg',
                frequency: 'Once daily',
                duration: '30 days',
                instructions: 'Take at bedtime',
                quantity: 30
            }
        ],
        notes: 'For cholesterol management',
        status: 'active',
        dateIssued: '2024-06-10T15:45:00.000Z',
        expiryDate: '2024-07-10T15:45:00.000Z',
        refills: 2,
        refillsUsed: 0,
        createdAt: '2024-06-10T15:45:00.000Z',
        updatedAt: '2024-06-10T15:45:00.000Z'
    },
    {
        _id: 'prescription_4',
        patientId: 'user_5',
        doctorId: 'user_6',
        medications: [
            {
                name: 'Lisinopril',
                dosage: '5mg',
                frequency: 'Once daily',
                duration: '30 days',
                instructions: 'Take in the morning',
                quantity: 30
            }
        ],
        notes: 'For blood pressure management alongside diabetes care',
        status: 'completed',
        dateIssued: '2024-05-05T09:30:00.000Z',
        expiryDate: '2024-06-05T09:30:00.000Z',
        refills: 0,
        refillsUsed: 0,
        createdAt: '2024-05-05T09:30:00.000Z',
        updatedAt: '2024-06-05T09:30:00.000Z'
    },
    {
        _id: 'prescription_5',
        patientId: 'user_3',
        doctorId: 'user_2',
        medications: [
            {
                name: 'Amoxicillin',
                dosage: '500mg',
                frequency: 'Three times daily',
                duration: '10 days',
                instructions: 'Take until completed, even if symptoms improve',
                quantity: 30
            }
        ],
        notes: 'For upper respiratory infection',
        status: 'completed',
        dateIssued: '2024-04-10T14:00:00.000Z',
        expiryDate: '2024-04-24T14:00:00.000Z',
        refills: 0,
        refillsUsed: 0,
        createdAt: '2024-04-10T14:00:00.000Z',
        updatedAt: '2024-04-20T14:00:00.000Z'
    }
];

export default mockPrescriptions; 