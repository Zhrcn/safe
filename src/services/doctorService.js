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
        medicalId: 'MID10001',
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
        },
        prescriptions: [
            { id: 'P1001', date: '2024-01-15', medications: ['Lisinopril 10mg'], instructions: 'Take once daily', status: 'Active' },
            { id: 'P1002', date: '2024-03-20', medications: ['Aspirin 81mg'], instructions: 'Take once daily with food', status: 'Active' }
        ],
        conditionUpdates: [
            { date: '2024-01-15', status: 'Improving', notes: 'Responding well to medication' },
            { date: '2024-03-20', status: 'Stable', notes: 'Blood pressure maintained within target range' }
        ],
        referrals: []
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
        medicalId: 'MID10002',
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
        },
        prescriptions: [
            { id: 'P2001', date: '2023-11-05', medications: ['Metformin 500mg'], instructions: 'Take twice daily with meals', status: 'Active' }
        ],
        conditionUpdates: [
            { date: '2023-11-05', status: 'Initial', notes: 'Starting treatment plan' },
            { date: '2024-02-10', status: 'Improving', notes: 'Glucose levels decreasing with medication and diet' }
        ],
        referrals: []
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
        },
        referrals: []
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
        },
        referrals: []
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
        },
        referrals: []
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
        },
        referrals: []
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
        },
        referrals: []
    },
];

const MOCK_APPOINTMENTS = [
    { 
        id: 1, 
        patientId: 1, 
        patientName: 'Sarah Johnson', 
        time: '9:00 AM', 
        type: 'Annual Physical', 
        date: '2023-04-25', 
        status: 'Confirmed',
        notes: 'Annual check-up appointment'
    },
    { 
        id: 2, 
        patientId: 4, 
        patientName: 'Robert Wilson', 
        time: '11:30 AM', 
        type: 'Follow-up', 
        date: '2023-04-25',
        status: 'Confirmed',
        notes: 'Follow-up on arthritis treatment'
    },
    { 
        id: 3, 
        patientId: 3, 
        patientName: 'Emma Davis', 
        time: '2:00 PM', 
        type: 'Prenatal Checkup', 
        date: '2023-04-25',
        status: 'Pending',
        notes: 'Regular prenatal check-up'
    },
    { 
        id: 4, 
        patientId: 2, 
        patientName: 'John Smith', 
        time: '4:30 PM', 
        type: 'Diabetes Review', 
        date: '2023-04-25',
        status: 'Confirmed',
        notes: 'Review of diabetes management plan'
    },
];

const MOCK_MEDICINES = [
    { id: 1, name: 'Lisinopril', availability: true, alternatives: ['Enalapril', 'Ramipril'] },
    { id: 2, name: 'Metformin', availability: true, alternatives: ['Glucophage', 'Fortamet'] },
    { id: 3, name: 'Atorvastatin', availability: false, alternatives: ['Simvastatin', 'Rosuvastatin'] },
    { id: 4, name: 'Levothyroxine', availability: true, alternatives: ['Synthroid', 'Levoxyl'] },
    { id: 5, name: 'Amlodipine', availability: true, alternatives: ['Norvasc'] },
    { id: 6, name: 'Omeprazole', availability: false, alternatives: ['Prilosec', 'Nexium'] },
];

const MOCK_DOCTORS = [
    { id: 'D1001', name: 'Dr. Emily Rodriguez', specialty: 'Cardiology' },
    { id: 'D1002', name: 'Dr. Michael Chen', specialty: 'Endocrinology' },
    { id: 'D1003', name: 'Dr. Sarah Johnson', specialty: 'Neurology' },
    { id: 'D1004', name: 'Dr. David Kim', specialty: 'Orthopedics' },
    { id: 'D1005', name: 'Dr. Lisa Patel', specialty: 'Dermatology' },
];

const MOCK_MESSAGES = [
    {
        id: 1,
        conversationId: 'c1',
        sender: { id: 'D1000', name: 'Dr. Ahmed Hassan', role: 'doctor' },
        recipient: { id: 1, name: 'Sarah Johnson', role: 'patient' },
        content: 'Hello Sarah, how are you feeling after starting the new medication?',
        timestamp: '2024-06-15T10:30:00',
        read: true
    },
    {
        id: 2,
        conversationId: 'c1',
        sender: { id: 1, name: 'Sarah Johnson', role: 'patient' },
        recipient: { id: 'D1000', name: 'Dr. Ahmed Hassan', role: 'doctor' },
        content: 'Hi Dr. Hassan, I\'m feeling much better. My blood pressure seems to be more stable now.',
        timestamp: '2024-06-15T10:45:00',
        read: true
    },
    {
        id: 3,
        conversationId: 'c2',
        sender: { id: 'D1000', name: 'Dr. Ahmed Hassan', role: 'doctor' },
        recipient: { id: 'P1001', name: 'Pharmacy Central', role: 'pharmacist' },
        content: 'Do you have Lisinopril 10mg in stock? I have a patient who needs it urgently.',
        timestamp: '2024-06-16T09:15:00',
        read: false
    }
];

const MOCK_CONVERSATIONS = [
    {
        id: 'c1',
        participants: [
            { id: 'D1000', name: 'Dr. Ahmed Hassan', role: 'doctor' },
            { id: 1, name: 'Sarah Johnson', role: 'patient' }
        ],
        lastMessage: {
            content: 'Hi Dr. Hassan, I\'m feeling much better. My blood pressure seems to be more stable now.',
            timestamp: '2024-06-15T10:45:00',
            sender: { id: 1, name: 'Sarah Johnson', role: 'patient' }
        },
        unreadCount: 0
    },
    {
        id: 'c2',
        participants: [
            { id: 'D1000', name: 'Dr. Ahmed Hassan', role: 'doctor' },
            { id: 'P1001', name: 'Pharmacy Central', role: 'pharmacist' }
        ],
        lastMessage: {
            content: 'Do you have Lisinopril 10mg in stock? I have a patient who needs it urgently.',
            timestamp: '2024-06-16T09:15:00',
            sender: { id: 'D1000', name: 'Dr. Ahmed Hassan', role: 'doctor' }
        },
        unreadCount: 1
    }
];

const MOCK_DOCTOR_PROFILE = {
    id: 'D1000',
    name: 'Dr. Ahmed Hassan',
    specialty: 'Cardiology',
    licenseNumber: 'MD12345',
    experience: '15 years',
    contact: {
        email: 'ahmed.hassan@example.com',
        phone: '+963 98 765 4321',
    },
    education: [
        { degree: 'MD', institution: 'Damascus University School of Medicine', year: '2005' },
        { degree: 'Cardiology Fellowship', institution: 'Aleppo Medical Center', year: '2010' }
    ],
    achievements: [
        { title: 'Excellence in Cardiac Care Award', year: '2018', issuer: 'Syrian Medical Association' },
        { title: 'Research Publication on Hypertension Management', year: '2020', issuer: 'International Journal of Cardiology' }
    ]
};

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
    ],
    prescriptionsByPatient: [
        { patient: 'Sarah Johnson', count: 5 },
        { patient: 'John Smith', count: 3 },
        { patient: 'Emma Davis', count: 2 },
        { patient: 'Robert Wilson', count: 6 },
        { patient: 'Maria Garcia', count: 1 },
    ],
    appointmentsByPatient: [
        { patient: 'Sarah Johnson', count: 8 },
        { patient: 'John Smith', count: 5 },
        { patient: 'Emma Davis', count: 12 },
        { patient: 'Robert Wilson', count: 4 },
        { patient: 'Maria Garcia', count: 3 },
    ]
};

/**
 * Fetches dashboard data for the doctor dashboard
 * @returns {Promise<Object>} Dashboard data for the doctor dashboard
 */
export async function getDoctorDashboardData() {
    try {
        const response = await fetch('/api/dashboard/doctor', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('safe_auth_token')}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch dashboard data');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching doctor dashboard data:', error);
        throw error;
    }
}

/**
 * Fetches patients for the doctor
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Number of items per page
 * @param {string} options.search - Search term
 * @returns {Promise<Object>} Patients data
 */
export async function getPatients(options = {}) {
    try {
        const { page = 1, limit = 10, search = '' } = options;
        
        let url = `/api/doctor/patients?page=${page}&limit=${limit}`;
        if (search) {
            url += `&search=${encodeURIComponent(search)}`;
        }
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('safe_auth_token')}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch patients');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching patients:', error);
        throw error;
    }
}

/**
 * Fetches appointments for the doctor
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Number of items per page
 * @param {string} options.status - Filter by status
 * @param {string} options.patientId - Filter by patient ID
 * @param {string} options.startDate - Filter by start date
 * @param {string} options.endDate - Filter by end date
 * @returns {Promise<Object>} Appointments data
 */
export async function getAppointments(options = {}) {
    try {
        const { page = 1, limit = 10, status, patientId, startDate, endDate } = options;
        
        let url = `/api/appointments?page=${page}&limit=${limit}`;
        if (status) url += `&status=${encodeURIComponent(status)}`;
        if (patientId) url += `&patientId=${encodeURIComponent(patientId)}`;
        if (startDate) url += `&startDate=${encodeURIComponent(startDate)}`;
        if (endDate) url += `&endDate=${encodeURIComponent(endDate)}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('safe_auth_token')}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch appointments');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching appointments:', error);
        throw error;
    }
}

/**
 * Creates a new appointment
 * @param {Object} appointmentData - Appointment data
 * @returns {Promise<Object>} Created appointment
 */
export async function createAppointment(appointmentData) {
    try {
        const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('safe_auth_token')}`
            },
            body: JSON.stringify(appointmentData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create appointment');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating appointment:', error);
        throw error;
    }
}

/**
 * Updates an appointment
 * @param {string} appointmentId - Appointment ID
 * @param {Object} appointmentData - Updated appointment data
 * @returns {Promise<Object>} Updated appointment
 */
export async function updateAppointment(appointmentId, appointmentData) {
    try {
        const response = await fetch(`/api/appointments/${appointmentId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('safe_auth_token')}`
            },
            body: JSON.stringify(appointmentData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update appointment');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating appointment:', error);
        throw error;
    }
}

/**
 * Creates a new prescription
 * @param {Object} prescriptionData - Prescription data
 * @returns {Promise<Object>} Created prescription
 */
export async function createPrescription(prescriptionData) {
    try {
        const response = await fetch('/api/prescriptions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('safe_auth_token')}`
            },
            body: JSON.stringify(prescriptionData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create prescription');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating prescription:', error);
        throw error;
    }
}

/**
 * Updates a patient's medical file
 * @param {string} patientId - Patient ID
 * @param {Object} medicalData - Medical data to update
 * @returns {Promise<Object>} Updated medical file
 */
export async function updateMedicalFile(patientId, medicalData) {
    try {
        const response = await fetch(`/api/medical-file?patientId=${patientId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('safe_auth_token')}`
            },
            body: JSON.stringify(medicalData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update medical file');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating medical file:', error);
        throw error;
    }
}

export async function getDoctorProfile() {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return MOCK_DOCTOR_PROFILE;
}


export async function getAnalyticsData() {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return MOCK_ANALYTICS;
}


export async function updatePatientStatus(id, status) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { success: true, message: `Patient status updated to ${status}` };
}

/**
 * @param {Object} patientData
 */
export async function addPatient(patientData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newId = Math.max(...MOCK_PATIENTS.map(p => p.id)) + 1;
    const newMedicalId = `MID${10000 + newId}`;
    
    const newPatient = {
        id: newId,
        medicalId: newMedicalId,
        status: 'Active',
        medicalHistory: [],
        medications: [],
        vitalSigns: {
            bloodPressure: '',
            heartRate: '',
            temperature: '',
            respiratoryRate: ''
        },
        prescriptions: [],
        conditionUpdates: [],
        referrals: [],
        ...patientData
    };
    
    MOCK_PATIENTS.push(newPatient);
    
    return { 
        success: true, 
        message: 'Patient added successfully', 
        patient: newPatient 
    };
}

/**
 * @param {number} patientId 
 * @param {Object} prescriptionData 
 */
export async function createPatientPrescription(patientId, prescriptionData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const patient = MOCK_PATIENTS.find(p => p.id === patientId);
    
    if (!patient) {
        return { success: false, message: 'Patient not found' };
    }
    
    const prescriptionId = `P${patientId}${String(patient.prescriptions.length + 1).padStart(3, '0')}`;
    
    const newPrescription = {
        id: prescriptionId,
        date: new Date().toISOString().split('T')[0],
        status: 'Active',
        ...prescriptionData
    };
    
    patient.prescriptions.push(newPrescription);
    
    return {
        success: true,
        message: 'Prescription created successfully',
        prescription: newPrescription
    };
}

/**
 * @param {number} patientId 
 * @param {Object} updateData 
 */
export async function addConditionUpdate(patientId, updateData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const patient = MOCK_PATIENTS.find(p => p.id === patientId);
    
    if (!patient) {
        return { success: false, message: 'Patient not found' };
    }
    
    const newUpdate = {
        date: new Date().toISOString().split('T')[0],
        ...updateData
    };
    
    patient.conditionUpdates.push(newUpdate);
    
    return {
        success: true,
        message: 'Condition update added successfully',
        update: newUpdate
    };
}

/**
 * @param {number} patientId 
 */
export async function getPatientHistory(patientId) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const patient = MOCK_PATIENTS.find(p => p.id === patientId);
    
    if (!patient) {
        return { success: false, message: 'Patient not found' };
    }
    
    const history = {
        medicalHistory: patient.medicalHistory,
        prescriptions: patient.prescriptions,
        conditionUpdates: patient.conditionUpdates,
        appointments: MOCK_APPOINTMENTS.filter(a => a.patientId === patientId),
        referrals: patient.referrals
    };
    
    return {
        success: true,
        history
    };
}

/**
 * @param {Object} appointmentData 
 */
export async function manageAppointment(appointmentData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (appointmentData.id) {
        const appointmentIndex = MOCK_APPOINTMENTS.findIndex(a => a.id === appointmentData.id);
        
        if (appointmentIndex === -1) {
            return { success: false, message: 'Appointment not found' };
        }
        
        const appointmentDate = new Date(`${MOCK_APPOINTMENTS[appointmentIndex].date}T${MOCK_APPOINTMENTS[appointmentIndex].time}`);
        const now = new Date();
        const hoursDifference = (appointmentDate - now) / (1000 * 60 * 60);
        
        if (hoursDifference < 24) {
            return { 
                success: false, 
                message: 'Appointments can only be edited at least 24 hours in advance' 
            };
        }
        
        MOCK_APPOINTMENTS[appointmentIndex] = {
            ...MOCK_APPOINTMENTS[appointmentIndex],
            ...appointmentData
        };
        
        return {
            success: true,
            message: 'Appointment updated successfully',
            appointment: MOCK_APPOINTMENTS[appointmentIndex]
        };
    } else {
        const newId = Math.max(...MOCK_APPOINTMENTS.map(a => a.id)) + 1;
        
        const newAppointment = {
            id: newId,
            status: 'Pending',
            ...appointmentData
        };
        
        MOCK_APPOINTMENTS.push(newAppointment);
        
        return {
            success: true,
            message: 'Appointment created successfully',
            appointment: newAppointment
        };
    }
}

/**

 * @param {number} appointmentId 
 * @param {string} status 
 */
export async function updateAppointmentStatus(appointmentId, status) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const appointmentIndex = MOCK_APPOINTMENTS.findIndex(a => a.id === appointmentId);
    
    if (appointmentIndex === -1) {
        return { success: false, message: 'Appointment not found' };
    }
    
    MOCK_APPOINTMENTS[appointmentIndex].status = status;
    
    
    return {
        success: true,
        message: `Appointment ${status.toLowerCase()} successfully`,
        appointment: MOCK_APPOINTMENTS[appointmentIndex]
    };
}

/**
 * @param {string} medicineName 
 */
export async function queryMedicineAvailability(medicineName) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const medicine = MOCK_MEDICINES.find(
        m => m.name.toLowerCase() === medicineName.toLowerCase()
    );
    
    if (!medicine) {
        return { 
            success: false, 
            message: 'Medicine not found in database',
            availability: false,
            alternatives: []
        };
    }
    
    return {
        success: true,
        medicine: medicine.name,
        availability: medicine.availability,
        alternatives: medicine.availability ? [] : medicine.alternatives,
        message: medicine.availability 
            ? `${medicine.name} is available` 
            : `${medicine.name} is currently out of stock`
    };
}

/**
 * @param {Object} profileData
 */
export async function updateDoctorProfile(profileData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    Object.assign(MOCK_DOCTOR_PROFILE, profileData);
    
    return {
        success: true,
        message: 'Profile updated successfully',
        profile: MOCK_DOCTOR_PROFILE
    };
}

/**
 * @param {string} type 
 * @param {Object} data 
 */
export async function addProfileItem(type, data) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (type === 'education') {
        MOCK_DOCTOR_PROFILE.education.push(data);
    } else if (type === 'achievement') {
        MOCK_DOCTOR_PROFILE.achievements.push(data);
    } else {
        return { success: false, message: 'Invalid item type' };
    }
    
    return {
        success: true,
        message: `${type} added successfully`,
        profile: MOCK_DOCTOR_PROFILE
    };
}


export async function getAvailableDoctors() {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return MOCK_DOCTORS;
}

/**
 * @param {number} patientId 
 * @param {Object} referralData 
 */
export async function createReferral(patientId, referralData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const patient = MOCK_PATIENTS.find(p => p.id === patientId);
    
    if (!patient) {
        return { success: false, message: 'Patient not found' };
    }
    
    const newReferral = {
        id: `R${patientId}${String(patient.referrals.length + 1).padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        ...referralData
    };
    
    patient.referrals.push(newReferral);
    
    return {
        success: true,
        message: 'Referral created successfully',
        referral: newReferral
    };
}


export async function getConversations() {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return MOCK_CONVERSATIONS;
}

/**
 * @param {string} conversationId 
 */
export async function getMessages(conversationId) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return MOCK_MESSAGES.filter(m => m.conversationId === conversationId);
}

/**
 * @param {Object} messageData 
 */
export async function sendMessage(messageData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newMessage = {
        id: MOCK_MESSAGES.length + 1,
        timestamp: new Date().toISOString(),
        read: false,
        ...messageData
    };
    
    MOCK_MESSAGES.push(newMessage);
    
    const conversationIndex = MOCK_CONVERSATIONS.findIndex(c => c.id === messageData.conversationId);
    if (conversationIndex !== -1) {
        MOCK_CONVERSATIONS[conversationIndex].lastMessage = {
            content: messageData.content,
            timestamp: newMessage.timestamp,
            sender: messageData.sender
        };
    }
    
    return {
        success: true,
        message: 'Message sent successfully',
        data: newMessage
    };
}

/**
 * Get patient statistics for analytics
 */
export async function getPatientStatistics() {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
        totalPatients: MOCK_PATIENTS.length,
        activePatients: MOCK_PATIENTS.filter(p => p.status === 'Active').length,
        urgentCases: MOCK_PATIENTS.filter(p => p.status === 'Urgent').length,
        byCondition: [
            { condition: 'Hypertension', count: MOCK_PATIENTS.filter(p => p.condition.includes('Hypertension')).length },
            { condition: 'Diabetes', count: MOCK_PATIENTS.filter(p => p.condition.includes('Diabetes')).length },
            { condition: 'Arthritis', count: MOCK_PATIENTS.filter(p => p.condition.includes('Arthritis')).length },
            { condition: 'Asthma', count: MOCK_PATIENTS.filter(p => p.condition.includes('Asthma')).length },
            { condition: 'Other', count: MOCK_PATIENTS.filter(p => 
                !p.condition.includes('Hypertension') && 
                !p.condition.includes('Diabetes') && 
                !p.condition.includes('Arthritis') && 
                !p.condition.includes('Asthma')
            ).length }
        ]
    };
}

/**
 * @param {string|number} id 
 * @returns {Promise<Object>} 
 */
export async function getPatientById(id) {
    return new Promise((resolve) => {
        setTimeout(() => {
            try {
                const patientId = isNaN(id) ? id : Number(id);
                
                const patient = MOCK_PATIENTS.find(p => p.id === patientId || p.medicalId === id);
                
            if (patient) {
                    resolve({
                        success: true,
                        patient: { ...patient }
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Patient not found with the provided ID'
                    });
                }
            } catch (error) {
                console.error('Error in getPatientById:', error);
                resolve({
                    success: false,
                    message: 'An error occurred while searching for the patient'
                });
            }
        }, 800); 
    });
} 