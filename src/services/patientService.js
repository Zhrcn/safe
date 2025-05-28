/**
 * Patient Service
 * Handles all API calls related to the patient role
 */

// Mock data for development - replace with actual API calls in production
const MOCK_PATIENT_PROFILE = {
    id: 1,
    name: 'Sarah Johnson',
    age: 34,
    gender: 'Female',
    bloodType: 'A+',
    height: '165 cm',
    weight: '62 kg',
    contact: {
        email: 'sarah.johnson@example.com',
        phone: '+963 11 123 4567',
        address: '123 Main St, Damascus, Syria'
    },
    emergencyContact: {
        name: 'Michael Johnson',
        relationship: 'Husband',
        phone: '+963 11 234 5678'
    },
    insurance: {
        provider: 'National Health Insurance',
        policyNumber: 'NHI123456789',
        expiryDate: '2025-12-31'
    }
};

const MOCK_APPOINTMENTS = [
    {
        id: 1,
        doctorName: 'Dr. Ahmed Hassan',
        doctorSpecialty: 'Cardiology',
        date: '2024-07-05',
        time: '10:00 AM',
        status: 'Scheduled',
        location: 'Main Hospital, Room 305',
        notes: 'Regular checkup for hypertension'
    },
    {
        id: 2,
        doctorName: 'Dr. Fatima Al-Abbas',
        doctorSpecialty: 'General Medicine',
        date: '2024-06-15',
        time: '2:30 PM',
        status: 'Completed',
        location: 'Downtown Clinic',
        notes: 'Follow-up after medication change'
    },
    {
        id: 3,
        doctorName: 'Dr. Ahmed Hassan',
        doctorSpecialty: 'Cardiology',
        date: '2024-08-10',
        time: '11:15 AM',
        status: 'Scheduled',
        location: 'Main Hospital, Room 305',
        notes: 'Blood pressure monitoring'
    }
];

const MOCK_PRESCRIPTIONS = [
    {
        id: 1,
        medication: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        startDate: '2024-01-15',
        endDate: '2024-07-15',
        prescribedBy: 'Dr. Ahmed Hassan',
        status: 'Active',
        refillsRemaining: 2,
        instructions: 'Take in the morning with water',
        pharmacy: 'Downtown Pharmacy'
    },
    {
        id: 2,
        medication: 'Aspirin',
        dosage: '81mg',
        frequency: 'Once daily',
        startDate: '2024-01-15',
        endDate: '2024-07-15',
        prescribedBy: 'Dr. Ahmed Hassan',
        status: 'Active',
        refillsRemaining: 2,
        instructions: 'Take with food',
        pharmacy: 'Downtown Pharmacy'
    },
    {
        id: 3,
        medication: 'Amoxicillin',
        dosage: '500mg',
        frequency: 'Three times daily',
        startDate: '2024-05-10',
        endDate: '2024-05-20',
        prescribedBy: 'Dr. Fatima Al-Abbas',
        status: 'Completed',
        refillsRemaining: 0,
        instructions: 'Take until completed, even if feeling better',
        pharmacy: 'Central Pharmacy'
    }
];

const MOCK_MEDICAL_RECORDS = [
    {
        id: 1,
        date: '2024-01-15',
        type: 'Diagnosis',
        provider: 'Dr. Ahmed Hassan',
        description: 'Hypertension (High Blood Pressure)',
        notes: 'Blood pressure consistently above 140/90 mmHg. Started on Lisinopril 10mg daily.'
    },
    {
        id: 2,
        date: '2024-02-20',
        type: 'Lab Test',
        provider: 'Central Laboratory',
        description: 'Complete Blood Count',
        notes: 'All values within normal range.',
        results: [
            { name: 'WBC', value: '7.5', unit: '10^9/L', normalRange: '4.5-11.0' },
            { name: 'RBC', value: '4.8', unit: '10^12/L', normalRange: '4.5-5.5' },
            { name: 'Hemoglobin', value: '14.2', unit: 'g/dL', normalRange: '12.0-15.5' },
            { name: 'Hematocrit', value: '42', unit: '%', normalRange: '36-46' },
            { name: 'Platelets', value: '250', unit: '10^9/L', normalRange: '150-450' }
        ]
    },
    {
        id: 3,
        date: '2024-03-10',
        type: 'Imaging',
        provider: 'Imaging Center',
        description: 'Chest X-ray',
        notes: 'Normal chest radiograph. No evidence of cardiomegaly or pulmonary disease.'
    },
    {
        id: 4,
        date: '2024-04-15',
        type: 'Follow-up',
        provider: 'Dr. Ahmed Hassan',
        description: 'Hypertension Follow-up',
        notes: 'Blood pressure improved (130/85 mmHg). Continue current medication.'
    },
    {
        id: 5,
        date: '2024-05-10',
        type: 'Acute Care',
        provider: 'Dr. Fatima Al-Abbas',
        description: 'Upper Respiratory Infection',
        notes: 'Symptoms include sore throat, cough, and mild fever. Prescribed Amoxicillin for 10 days.'
    }
];

const MOCK_HEALTH_METRICS = {
    bloodPressure: [
        { date: '2024-01-15', systolic: 145, diastolic: 95 },
        { date: '2024-02-15', systolic: 140, diastolic: 90 },
        { date: '2024-03-15', systolic: 135, diastolic: 88 },
        { date: '2024-04-15', systolic: 130, diastolic: 85 },
        { date: '2024-05-15', systolic: 128, diastolic: 84 },
        { date: '2024-06-15', systolic: 125, diastolic: 82 }
    ],
    weight: [
        { date: '2024-01-15', value: 65 },
        { date: '2024-02-15', value: 64 },
        { date: '2024-03-15', value: 63.5 },
        { date: '2024-04-15', value: 63 },
        { date: '2024-05-15', value: 62.5 },
        { date: '2024-06-15', value: 62 }
    ],
    heartRate: [
        { date: '2024-01-15', value: 78 },
        { date: '2024-02-15', value: 76 },
        { date: '2024-03-15', value: 75 },
        { date: '2024-04-15', value: 74 },
        { date: '2024-05-15', value: 73 },
        { date: '2024-06-15', value: 72 }
    ],
    bloodGlucose: [
        { date: '2024-01-15', value: 98 },
        { date: '2024-02-15', value: 96 },
        { date: '2024-03-15', value: 95 },
        { date: '2024-04-15', value: 94 },
        { date: '2024-05-15', value: 93 },
        { date: '2024-06-15', value: 92 }
    ]
};

/**
 * Get patient profile
 * @returns {Promise<Object>} - Patient profile
 */
export async function getPatientProfile() {
    // Mock implementation
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_PATIENT_PROFILE);
        }, 300);
    });
}

/**
 * Get patient appointments
 * @param {string} status - Optional status filter
 * @returns {Promise<Array>} - List of appointments
 */
export async function getAppointments(status = '') {
    // Mock implementation
    return new Promise((resolve) => {
        setTimeout(() => {
            const filteredAppointments = status
                ? MOCK_APPOINTMENTS.filter(appointment => appointment.status === status)
                : MOCK_APPOINTMENTS;
            resolve(filteredAppointments);
        }, 300);
    });
}

/**
 * Get patient prescriptions
 * @param {string} status - Optional status filter
 * @returns {Promise<Array>} - List of prescriptions
 */
export async function getPrescriptions(status = '') {
    // Mock implementation
    return new Promise((resolve) => {
        setTimeout(() => {
            const filteredPrescriptions = status
                ? MOCK_PRESCRIPTIONS.filter(prescription => prescription.status === status)
                : MOCK_PRESCRIPTIONS;
            resolve(filteredPrescriptions);
        }, 300);
    });
}

/**
 * Get patient medical records
 * @param {string} type - Optional type filter
 * @returns {Promise<Array>} - List of medical records
 */
export async function getMedicalRecords(type = '') {
    // Mock implementation
    return new Promise((resolve) => {
        setTimeout(() => {
            const filteredRecords = type
                ? MOCK_MEDICAL_RECORDS.filter(record => record.type === type)
                : MOCK_MEDICAL_RECORDS;
            resolve(filteredRecords);
        }, 300);
    });
}

/**
 * Get patient health metrics
 * @returns {Promise<Object>} - Health metrics data
 */
export async function getHealthMetrics() {
    // Mock implementation
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_HEALTH_METRICS);
        }, 300);
    });
}

/**
 * Schedule new appointment
 * @param {Object} appointment - Appointment data
 * @returns {Promise<Object>} - Created appointment
 */
export async function scheduleAppointment(appointment) {
    // Mock implementation
    return new Promise((resolve) => {
        setTimeout(() => {
            const newAppointment = {
                id: Math.max(...MOCK_APPOINTMENTS.map(a => a.id)) + 1,
                ...appointment,
                status: 'Scheduled'
            };
            MOCK_APPOINTMENTS.push(newAppointment);
            resolve(newAppointment);
        }, 300);
    });
}

/**
 * Cancel appointment
 * @param {number} id - Appointment ID
 * @returns {Promise<Object>} - Updated appointment
 */
export async function cancelAppointment(id) {
    // Mock implementation
    return new Promise((resolve) => {
        setTimeout(() => {
            const appointment = MOCK_APPOINTMENTS.find(a => a.id === id);
            if (appointment) {
                appointment.status = 'Cancelled';
            }
            resolve(appointment);
        }, 300);
    });
} 