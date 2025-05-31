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
        doctorId: 101,
        doctorName: 'Dr. Ahmed Hassan',
        doctorSpecialty: 'Cardiology',
        date: '2024-07-05',
        time: '10:00 AM',
        status: 'Scheduled',
        location: 'Main Hospital, Room 305',
        notes: 'Regular checkup for hypertension',
        createdAt: '2024-06-01T08:30:00'
    },
    {
        id: 2,
        doctorId: 102,
        doctorName: 'Dr. Fatima Al-Abbas',
        doctorSpecialty: 'General Medicine',
        date: '2024-06-15',
        time: '2:30 PM',
        status: 'Completed',
        location: 'Downtown Clinic',
        notes: 'Follow-up after medication change',
        createdAt: '2024-05-20T14:15:00'
    },
    {
        id: 3,
        doctorId: 101,
        doctorName: 'Dr. Ahmed Hassan',
        doctorSpecialty: 'Cardiology',
        date: '2024-08-10',
        time: '11:15 AM',
        status: 'Scheduled',
        location: 'Main Hospital, Room 305',
        notes: 'Blood pressure monitoring',
        createdAt: '2024-06-10T09:45:00'
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
        pharmacy: 'Downtown Pharmacy',
        reminders: [
            { time: '08:00', enabled: true, days: [1, 2, 3, 4, 5, 6, 7] }
        ]
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
        pharmacy: 'Downtown Pharmacy',
        reminders: [
            { time: '08:00', enabled: true, days: [1, 2, 3, 4, 5, 6, 7] }
        ]
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
        pharmacy: 'Central Pharmacy',
        reminders: [
            { time: '08:00', enabled: false, days: [1, 2, 3, 4, 5, 6, 7] },
            { time: '14:00', enabled: false, days: [1, 2, 3, 4, 5, 6, 7] },
            { time: '20:00', enabled: false, days: [1, 2, 3, 4, 5, 6, 7] }
        ]
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
        notes: 'Normal chest radiograph. No evidence of cardiomegaly or pulmonary disease.',
        imageUrl: '/mock/images/chest-xray.pdf'
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
    },
    {
        id: 6,
        date: '2024-04-25',
        type: 'Imaging',
        provider: 'Imaging Center',
        description: 'Mammography',
        notes: 'Routine screening mammogram. No suspicious findings.',
        imageUrl: '/mock/images/mammogram.pdf'
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

const MOCK_PROVIDERS = {
    doctors: [
        {
            id: 101,
            name: 'Dr. Ahmed Hassan',
            specialty: 'Cardiology',
            hospital: 'Main Hospital',
            photo: '/mock/images/doctor1.jpg',
            hasAccess: true,
            isPrimary: true,
            rating: 4.8,
            yearsExperience: 15
        },
        {
            id: 102,
            name: 'Dr. Fatima Al-Abbas',
            specialty: 'General Medicine',
            hospital: 'Downtown Clinic',
            photo: '/mock/images/doctor2.jpg',
            hasAccess: true,
            isPrimary: false,
            rating: 4.7,
            yearsExperience: 8
        },
        {
            id: 103,
            name: 'Dr. Omar Najjar',
            specialty: 'Neurology',
            hospital: 'Main Hospital',
            photo: '/mock/images/doctor3.jpg',
            hasAccess: false,
            isPrimary: false,
            rating: 4.9,
            yearsExperience: 12
        }
    ],
    pharmacists: [
        {
            id: 201,
            name: 'Leila Karam',
            pharmacy: 'Downtown Pharmacy',
            photo: '/mock/images/pharmacist1.jpg',
            rating: 4.6,
            yearsExperience: 10
        },
        {
            id: 202,
            name: 'Sami Al-Din',
            pharmacy: 'Central Pharmacy',
            photo: '/mock/images/pharmacist2.jpg',
            rating: 4.5,
            yearsExperience: 7
        }
    ]
};

const MOCK_CONVERSATIONS = [
    {
        id: 1,
        participantId: 101,
        participantName: 'Dr. Ahmed Hassan',
        participantRole: 'doctor',
        participantPhoto: '/mock/images/doctor1.jpg',
        lastMessage: 'Your blood pressure readings look good. Keep taking your medication as prescribed.',
        lastMessageDate: '2024-06-10T15:45:00',
        unread: 1,
        messages: [
            {
                id: 1,
                sender: 'patient',
                content: 'Hello Dr. Hassan, I wanted to ask about my blood pressure readings from last week.',
                timestamp: '2024-06-10T15:30:00'
            },
            {
                id: 2,
                sender: 'doctor',
                content: 'Your blood pressure readings look good. Keep taking your medication as prescribed.',
                timestamp: '2024-06-10T15:45:00'
            }
        ]
    },
    {
        id: 2,
        participantId: 201,
        participantName: 'Leila Karam',
        participantRole: 'pharmacist',
        participantPhoto: '/mock/images/pharmacist1.jpg',
        lastMessage: 'Yes, we have Lisinopril in stock. You can come pick up your refill anytime.',
        lastMessageDate: '2024-06-09T11:20:00',
        unread: 0,
        messages: [
            {
                id: 1,
                sender: 'patient',
                content: 'Hello, do you have Lisinopril 10mg in stock? I need a refill.',
                timestamp: '2024-06-09T11:15:00'
            },
            {
                id: 2,
                sender: 'pharmacist',
                content: 'Yes, we have Lisinopril in stock. You can come pick up your refill anytime.',
                timestamp: '2024-06-09T11:20:00'
            }
        ]
    }
];

/**
 * @returns {Promise<Object>} 
 */
export async function getPatientProfile() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_PATIENT_PROFILE);
        }, 500);
    });
}

/**
 * @param {Object} data 
 * @returns {Promise<Object>} 
 */
export async function updatePatientProfile(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const updatedProfile = { ...MOCK_PATIENT_PROFILE, ...data };
            resolve(updatedProfile);
        }, 500);
    });
}

/**
 * @param {string} status 
 * @returns {Promise<Array>} 
 */
export async function getAppointments(status = '') {
    return new Promise((resolve) => {
        setTimeout(() => {
            let filteredAppointments = MOCK_APPOINTMENTS;
            if (status) {
                filteredAppointments = MOCK_APPOINTMENTS.filter(
                    appointment => appointment.status.toLowerCase() === status.toLowerCase()
                );
            }
            resolve(filteredAppointments);
        }, 500);
    });
}

/**
 * @param {string} status 
 * @returns {Promise<Array>} 
 */
export async function getPrescriptions(status = '') {
    return new Promise((resolve) => {
        setTimeout(() => {
            let filteredPrescriptions = MOCK_PRESCRIPTIONS;
            if (status) {
                filteredPrescriptions = MOCK_PRESCRIPTIONS.filter(
                    prescription => prescription.status.toLowerCase() === status.toLowerCase()
                );
            }
            resolve(filteredPrescriptions);
        }, 500);
    });
}

/**
 * @param {string} type 
 * @returns {Promise<Array>}
 */
export async function getMedicalRecords(type = '') {
    return new Promise((resolve) => {
        setTimeout(() => {
            let filteredRecords = MOCK_MEDICAL_RECORDS;
            if (type) {
                filteredRecords = MOCK_MEDICAL_RECORDS.filter(
                    record => record.type.toLowerCase() === type.toLowerCase()
                );
            }
            resolve(filteredRecords);
        }, 500);
    });
}

/**
 * @returns {Promise<Object>} 
 */
export async function getHealthMetrics() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_HEALTH_METRICS);
        }, 500);
    });
}

/**
 * @param {Object} appointment 
 * @returns {Promise<Object>} 
 */
export async function scheduleAppointment(appointment) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newAppointment = {
                id: MOCK_APPOINTMENTS.length + 1,
                ...appointment,
                status: 'Scheduled',
                createdAt: new Date().toISOString()
            };
            resolve(newAppointment);
        }, 500);
    });
}

/**
 * @param {number} id 
 * @returns {Promise<Object>} 
 */
export async function cancelAppointment(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const appointment = MOCK_APPOINTMENTS.find(apt => apt.id === id);
            if (!appointment) {
                reject(new Error('Appointment not found'));
                return;
            }
            
            const appointmentDate = new Date(appointment.date + 'T' + appointment.time);
            const today = new Date();
            const diffTime = appointmentDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays < 3) {
                reject(new Error('Appointments can only be cancelled at least 3 days in advance'));
                return;
            }
            
            const cancelledAppointment = { ...appointment, status: 'Cancelled' };
            resolve(cancelledAppointment);
        }, 500);
    });
}

/**
 * @param {number} id 
 * @param {Object} data 
 * @returns {Promise<Object>} 
 */
export async function updateAppointment(id, data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const appointmentIndex = MOCK_APPOINTMENTS.findIndex(apt => apt.id === id);
            if (appointmentIndex === -1) {
                reject(new Error('Appointment not found'));
                return;
            }
            
            const appointmentDate = new Date(MOCK_APPOINTMENTS[appointmentIndex].date + 'T' + MOCK_APPOINTMENTS[appointmentIndex].time);
            const today = new Date();
            const diffTime = appointmentDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays < 3) {
                reject(new Error('Appointments can only be updated at least 3 days in advance'));
                return;
            }
            
            const updatedAppointment = { ...MOCK_APPOINTMENTS[appointmentIndex], ...data };
            resolve(updatedAppointment);
        }, 500);
    });
}

/**
 * @param {string} type 
 * @returns {Promise<Object>} 
 */
export async function getMedicalProviders(type = 'all') {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (type === 'doctors') {
                resolve({ doctors: MOCK_PROVIDERS.doctors });
            } else if (type === 'pharmacists') {
                resolve({ pharmacists: MOCK_PROVIDERS.pharmacists });
            } else {
                resolve(MOCK_PROVIDERS);
            }
        }, 500);
    });
}

/**
 * @param {number} doctorId 
 * @param {boolean} hasAccess 
 * @returns {Promise<Object>} 
 */
export async function updateDoctorAccess(doctorId, hasAccess) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const doctorIndex = MOCK_PROVIDERS.doctors.findIndex(doc => doc.id === doctorId);
            if (doctorIndex === -1) {
                reject(new Error('Doctor not found'));
                return;
            }
            
            const updatedDoctor = { ...MOCK_PROVIDERS.doctors[doctorIndex], hasAccess };
            resolve(updatedDoctor);
        }, 500);
    });
}

/**
 * @param {number} doctorId 
 * @returns {Promise<Array>} 
 */
export async function setPrimaryDoctor(doctorId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const doctorIndex = MOCK_PROVIDERS.doctors.findIndex(doc => doc.id === doctorId);
            if (doctorIndex === -1) {
                reject(new Error('Doctor not found'));
                return;
            }
            
            const updatedDoctors = MOCK_PROVIDERS.doctors.map(doc => ({
                ...doc,
                isPrimary: doc.id === doctorId
            }));
            
            resolve(updatedDoctors);
        }, 500);
    });
}

/**
 * @returns {Promise<Array>}
 */
export async function getConversations() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_CONVERSATIONS);
        }, 500);
    });
}

/**
 * @param {number} id 
 * @returns {Promise<Object>} 
 */
export async function getConversation(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const conversation = MOCK_CONVERSATIONS.find(conv => conv.id === id);
            if (!conversation) {
                reject(new Error('Conversation not found'));
                return;
            }
            resolve(conversation);
        }, 500);
    });
}

/**
 * @param {number} conversationId 
 * @param {string} content 
 * @returns {Promise<Object>} 
 */
export async function sendMessage(conversationId, content) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const conversationIndex = MOCK_CONVERSATIONS.findIndex(conv => conv.id === conversationId);
            if (conversationIndex === -1) {
                reject(new Error('Conversation not found'));
                return;
            }
            
            const newMessage = {
                id: MOCK_CONVERSATIONS[conversationIndex].messages.length + 1,
                sender: 'patient',
                content,
                timestamp: new Date().toISOString()
            };
            
            resolve(newMessage);
        }, 500);
    });
}

/**
 * @param {string} medication 
 * @param {number} pharmacyId 
 * @returns {Promise<Object>} 
 */
export async function checkMedicineAvailability(medication, pharmacyId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const isAvailable = Math.random() > 0.3;
            resolve({
                medication,
                isAvailable,
                pharmacy: MOCK_PROVIDERS.pharmacists.find(p => p.id === pharmacyId)?.pharmacy || 'Unknown Pharmacy',
                quantity: isAvailable ? Math.floor(Math.random() * 30) + 1 : 0
            });
        }, 500);
    });
}

/**
 * @param {number} doctorId 
 * @param {string} reason 
 * @param {string} preferredTime 
 * @returns {Promise<Object>} 
 */
export async function requestConsultation(doctorId, reason, preferredTime) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: Math.floor(Math.random() * 1000) + 1,
                doctorId,
                doctorName: MOCK_PROVIDERS.doctors.find(d => d.id === doctorId)?.name || 'Unknown Doctor',
                reason,
                preferredTime,
                status: 'Pending',
                requestedAt: new Date().toISOString()
            });
        }, 500);
    });
}

/**
 * @returns {Promise<Array>} 
 */
export async function getMedicineReminders() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const reminders = MOCK_PRESCRIPTIONS
                .filter(p => p.status === 'Active')
                .flatMap(p => p.reminders.map(r => ({
                    id: `${p.id}-${r.time}`,
                    medicationId: p.id,
                    medication: p.medication,
                    dosage: p.dosage,
                    time: r.time,
                    enabled: r.enabled,
                    days: r.days
                })));
            resolve(reminders);
        }, 500);
    });
}

/**
 * @param {string} id 
 * @param {Object} data 
 * @returns {Promise<Object>} 
 */
export async function updateMedicineReminder(id, data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            
            const [medicationId, time] = id.split('-');
            
            resolve({
                id,
                medicationId: parseInt(medicationId),
                medication: MOCK_PRESCRIPTIONS.find(p => p.id === parseInt(medicationId))?.medication,
                ...data
            });
        }, 500);
    });
}

/**
 * @returns {Promise<Object>} Dashboard data for the patient dashboard
 */
export async function getPatientDashboardData() {
    try {
        const response = await fetch('/api/dashboard/patient', {
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
        console.error('Error fetching patient dashboard data:', error);
        throw error;
    }
} 