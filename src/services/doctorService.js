/**
 * Doctor Service
 * Handles all API calls related to the doctor role
 */

// Mock data for development - replace with actual API calls in production
const MOCK_PATIENTS = [
    {
        id: 1,
        name: 'Sarah Johnson',
        age: 34,
        gender: 'Female',
        condition: 'Hypertension',
        status: 'Active',
        lastAppointment: '2024-06-15',
        contact: {
            email: 'sarah.johnson@example.com',
            phone: '+963 11 123 4567'
        },
        medicalHistory: [
            { date: '2023-12-10', description: 'Annual checkup', notes: 'Blood pressure slightly elevated' },
            { date: '2024-01-15', description: 'Follow-up appointment', notes: 'Started on medication' },
            { date: '2024-03-20', description: 'Blood work', notes: 'Results normal' },
        ],
        medications: [
            { name: 'Lisinopril', dosage: '10mg', frequency: 'once daily', purpose: 'For Hypertension' },
            { name: 'Aspirin', dosage: '81mg', frequency: 'once daily', purpose: 'Preventative' }
        ],
        vitalSigns: {
            bloodPressure: '130/85',
            heartRate: '72',
            temperature: '98.6',
            respiratoryRate: '16'
        }
    },
    {
        id: 2,
        name: 'John Smith',
        age: 45,
        gender: 'Male',
        condition: 'Diabetes Type 2',
        status: 'Active',
        lastAppointment: '2024-06-12',
        contact: {
            email: 'john.smith@example.com',
            phone: '+963 11 234 5678'
        },
        medicalHistory: [
            { date: '2023-11-05', description: 'Initial diagnosis', notes: 'Diabetes Type 2 confirmed' },
            { date: '2024-02-10', description: 'Follow-up appointment', notes: 'Glucose levels improving with diet' },
        ],
        medications: [
            { name: 'Metformin', dosage: '500mg', frequency: 'twice daily with meals', purpose: 'For Type 2 Diabetes' }
        ],
        vitalSigns: {
            bloodPressure: '120/80',
            heartRate: '68',
            temperature: '98.4',
            respiratoryRate: '14'
        }
    },
    {
        id: 3,
        name: 'Emma Davis',
        age: 29,
        gender: 'Female',
        condition: 'Pregnancy',
        status: 'Urgent',
        lastAppointment: '2024-06-18',
        contact: {
            email: 'emma.davis@example.com',
            phone: '+963 11 345 6789'
        },
        medicalHistory: [
            { date: '2023-12-15', description: 'Pregnancy confirmation', notes: 'Estimated 8 weeks' },
            { date: '2024-02-20', description: 'First trimester screening', notes: 'All tests normal' },
            { date: '2024-04-10', description: 'Anatomy scan', notes: 'Healthy development, gender: female' },
        ],
        medications: [
            { name: 'Prenatal vitamins', dosage: '1 tablet', frequency: 'once daily', purpose: 'Pregnancy support' },
            { name: 'Folic acid', dosage: '400mcg', frequency: 'once daily', purpose: 'Neural tube development' }
        ],
        vitalSigns: {
            bloodPressure: '118/75',
            heartRate: '85',
            temperature: '98.2',
            respiratoryRate: '18'
        }
    },
    {
        id: 4,
        name: 'Robert Wilson',
        age: 65,
        gender: 'Male',
        condition: 'Arthritis',
        status: 'Active',
        lastAppointment: '2024-06-10',
        contact: {
            email: 'robert.wilson@example.com',
            phone: '+963 11 456 7890'
        },
        medicalHistory: [
            { date: '2023-09-15', description: 'Joint pain evaluation', notes: 'Diagnosed with osteoarthritis' },
            { date: '2024-04-22', description: 'Pain management follow-up', notes: 'Increased pain, new medication prescribed' },
        ],
        medications: [
            { name: 'Ibuprofen', dosage: '400mg', frequency: 'three times daily with food', purpose: 'For pain and inflammation' },
            { name: 'Glucosamine', dosage: '1500mg', frequency: 'once daily', purpose: 'Joint support' }
        ],
        vitalSigns: {
            bloodPressure: '140/90',
            heartRate: '76',
            temperature: '98.8',
            respiratoryRate: '18'
        }
    },
    {
        id: 5,
        name: 'Maria Garcia',
        age: 42,
        gender: 'Female',
        condition: 'Asthma',
        status: 'Inactive',
        lastAppointment: '2024-05-15',
        contact: {
            email: 'maria.garcia@example.com',
            phone: '+963 11 567 8901'
        },
        medicalHistory: [
            { date: '2023-08-20', description: 'Respiratory assessment', notes: 'Mild asthma diagnosed' },
            { date: '2024-05-15', description: 'Asthma review', notes: 'Well controlled with current medication' },
        ],
        medications: [
            { name: 'Albuterol', dosage: '90mcg', frequency: 'As needed for symptoms', purpose: 'Rescue inhaler' },
            { name: 'Fluticasone', dosage: '110mcg', frequency: 'twice daily', purpose: 'Maintenance inhaler' }
        ],
        vitalSigns: {
            bloodPressure: '118/75',
            heartRate: '80',
            temperature: '98.2',
            respiratoryRate: '16'
        }
    },
    {
        id: 6,
        name: 'David Lee',
        age: 38,
        gender: 'Male',
        condition: 'Migraines',
        status: 'Active',
        lastAppointment: '2024-06-05',
        contact: {
            email: 'david.lee@example.com',
            phone: '+963 11 678 9012'
        },
        medicalHistory: [
            { date: '2023-10-05', description: 'Headache evaluation', notes: 'Diagnosed with chronic migraines' },
            { date: '2024-01-15', description: 'Medication review', notes: 'Adjusted dosage for better control' },
        ],
        medications: [
            { name: 'Sumatriptan', dosage: '50mg', frequency: 'As needed for migraine', purpose: 'Acute migraine treatment' },
            { name: 'Propranolol', dosage: '40mg', frequency: 'twice daily', purpose: 'Migraine prevention' }
        ],
        vitalSigns: {
            bloodPressure: '122/78',
            heartRate: '68',
            temperature: '98.6',
            respiratoryRate: '14'
        }
    },
    {
        id: 7,
        name: 'Jennifer Taylor',
        age: 52,
        gender: 'Female',
        condition: 'Heart Disease',
        status: 'Urgent',
        lastAppointment: '2024-06-17',
        contact: {
            email: 'jennifer.taylor@example.com',
            phone: '+963 11 789 0123'
        },
        medicalHistory: [
            { date: '2023-07-10', description: 'Cardiac evaluation', notes: 'Diagnosed with coronary artery disease' },
            { date: '2023-12-15', description: 'Stress test', notes: 'Moderate ischemia detected' },
            { date: '2024-03-20', description: 'Cardiology follow-up', notes: 'Medication adjusted, symptoms improved' },
        ],
        medications: [
            { name: 'Atorvastatin', dosage: '40mg', frequency: 'once daily at bedtime', purpose: 'Cholesterol management' },
            { name: 'Metoprolol', dosage: '25mg', frequency: 'twice daily', purpose: 'Blood pressure control' },
            { name: 'Aspirin', dosage: '81mg', frequency: 'once daily', purpose: 'Blood thinner' }
        ],
        vitalSigns: {
            bloodPressure: '145/90',
            heartRate: '78',
            temperature: '98.4',
            respiratoryRate: '16'
        }
    },
];

const MOCK_APPOINTMENTS = [
    { id: 1, patientId: 1, patientName: 'Sarah Johnson', time: '9:00 AM', type: 'Annual Physical', date: '2023-04-25' },
    { id: 2, patientId: 4, patientName: 'Robert Wilson', time: '11:30 AM', type: 'Follow-up', date: '2023-04-25' },
    { id: 3, patientId: 3, patientName: 'Emma Davis', time: '2:00 PM', type: 'Prenatal Checkup', date: '2023-04-25' },
    { id: 4, patientId: 2, patientName: 'John Smith', time: '4:30 PM', type: 'Diabetes Review', date: '2023-04-25' },
];

const MOCK_DOCTOR_PROFILE = {
    name: 'Dr. Ahmed Hassan',
    specialty: 'Cardiology',
    licenseNumber: 'MD12345',
    experience: '15 years',
    contact: {
        email: 'ahmed.hassan@example.com',
        phone: '+963 98 765 4321',
    },
};

// Analytics data
const MOCK_ANALYTICS = {
    appointmentsByMonth: [
        { month: 'Jan', count: 45 },
        { month: 'Feb', count: 52 },
        { month: 'Mar', count: 48 },
        { month: 'Apr', count: 61 },
        { month: 'May', count: 55 },
        { month: 'Jun', count: 67 },
        { month: 'Jul', count: 60 },
        { month: 'Aug', count: 63 },
        { month: 'Sep', count: 58 },
        { month: 'Oct', count: 65 },
        { month: 'Nov', count: 71 },
        { month: 'Dec', count: 68 },
    ],
    patientDemographics: {
        ageGroups: [
            { group: '0-18', count: 25 },
            { group: '19-35', count: 42 },
            { group: '36-50', count: 58 },
            { group: '51-65', count: 37 },
            { group: '65+', count: 28 },
        ],
        gender: [
            { name: 'Male', value: 45 },
            { name: 'Female', value: 55 },
        ],
    },
    treatmentOutcomes: [
        { condition: 'Hypertension', improved: 75, unchanged: 20, worsened: 5 },
        { condition: 'Diabetes', improved: 65, unchanged: 25, worsened: 10 },
        { condition: 'Asthma', improved: 80, unchanged: 15, worsened: 5 },
        { condition: 'Arthritis', improved: 60, unchanged: 30, worsened: 10 },
    ],
    prescriptionData: [
        { name: 'Antibiotics', count: 120 },
        { name: 'Antihypertensives', count: 95 },
        { name: 'Analgesics', count: 150 },
        { name: 'Antidiabetics', count: 85 },
        { name: 'Antihistamines', count: 60 },
    ],
};

/**
 * Get patients
 * @param {string} searchTerm - Optional search term
 * @returns {Promise<Array>} - List of patients
 */
export async function getPatients(searchTerm = '') {
    // Mock implementation
    return new Promise((resolve) => {
        setTimeout(() => {
            const filteredPatients = searchTerm
                ? MOCK_PATIENTS.filter(patient =>
                    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
                )
                : MOCK_PATIENTS;
            resolve(filteredPatients);
        }, 300); // Simulate network delay
    });
}

/**
 * Get appointments
 * @param {string} date - Optional date filter
 * @returns {Promise<Array>} - List of appointments
 */
export async function getAppointments(date = '') {
    // Mock implementation
    return new Promise((resolve) => {
        setTimeout(() => {
            const filteredAppointments = date
                ? MOCK_APPOINTMENTS.filter(appointment => appointment.date === date)
                : MOCK_APPOINTMENTS;
            resolve(filteredAppointments);
        }, 300);
    });
}

/**
 * Get doctor profile
 * @returns {Promise<Object>} - Doctor profile
 */
export async function getDoctorProfile() {
    // Mock implementation
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_DOCTOR_PROFILE);
        }, 300);
    });
}

/**
 * Get analytics data
 * @returns {Promise<Object>} - Analytics data
 */
export async function getAnalyticsData() {
    // Mock implementation
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_ANALYTICS);
        }, 300);
    });
}

/**
 * Update patient status
 * @param {number} id - Patient ID
 * @param {string} status - New status
 * @returns {Promise<Object>} - Updated patient
 */
export async function updatePatientStatus(id, status) {
    // Mock implementation
    return new Promise((resolve) => {
        setTimeout(() => {
            const patient = MOCK_PATIENTS.find(p => p.id === id);
            if (patient) {
                patient.status = status;
            }
            resolve(patient);
        }, 300);
    });
} 