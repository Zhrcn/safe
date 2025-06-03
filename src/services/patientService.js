// Patient service functions for the Safe WebApp
// This file contains functions for retrieving patient data from the API

/**
 * Get authentication token from localStorage
 * @returns {string|null} The authentication token or null if not found
 */
export function getAuthToken() {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            return localStorage.getItem('safe_auth_token');
        }
        return null;
    } catch (error) {
        console.error('Error retrieving auth token:', error);
        return null;
    }
}

/**
 * Get the current user ID from the JWT token
 * @returns {string|null} The user ID or null if not found
 */
export function getCurrentUserId() {
    try {
        const token = getAuthToken();
        if (!token) {
            console.warn('No auth token found');
            return null;
        }
        
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        
        return payload?.id || payload?.userId || payload?.sub;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}

/**
 * Get health metrics for the current patient
 * @returns {Promise<Object>} Health metrics data or mock data on error
 */
export async function getHealthMetrics() {
    try {
        const token = getAuthToken();
        if (!token) {
            console.warn('Authentication token not found, using mock health metrics data');
            return getMockHealthMetrics();
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log('Fetching patient health metrics...');
        }

        const response = await fetch('/api/health-metrics', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (process.env.NODE_ENV !== 'production') {
            console.log('Health metrics response status:', response.status);
        }

        if (!response.ok) {
            if (response.status === 404) {
                console.warn('Health metrics endpoint not found (404), using mock data');
                return getMockHealthMetrics();
            }
            
            try {
                const errorData = await response.json();
                console.error(`API error: ${errorData.error || response.statusText}`);
                return getMockHealthMetrics();
            } catch (jsonError) {
                console.error(`Failed to parse error response: ${jsonError.message}`);
                return getMockHealthMetrics();
            }
        }

        try {
            const data = await response.json();
            return data;
        } catch (jsonError) {
            console.error('Error parsing health metrics response:', jsonError);
            return getMockHealthMetrics();
        }
    } catch (error) {
        console.error('Error fetching health metrics:', error);
        return getMockHealthMetrics();
    }
}

/**
 * Get mock health metrics data for fallback
 * @returns {Object} Mock health metrics data
 */
export function getMockHealthMetrics() {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const heartRateData = [];
    const bloodPressureData = [];
    const bloodSugarData = [];
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(lastWeek);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        heartRateData.push({
            date: dateStr,
            value: Math.floor(Math.random() * 40) + 60
        });
        
        bloodPressureData.push({
            date: dateStr,
            systolic: Math.floor(Math.random() * 40) + 110,
            diastolic: Math.floor(Math.random() * 30) + 70
        });
        
        bloodSugarData.push({
            date: dateStr,
            value: Math.floor(Math.random() * 50) + 80
        });
    }
    
    return {
        heartRate: {
            current: heartRateData[heartRateData.length - 1].value,
            data: heartRateData,
            unit: 'bpm',
            normalRange: '60-100',
            status: 'normal'
        },
        bloodPressure: {
            current: {
                systolic: bloodPressureData[bloodPressureData.length - 1].systolic,
                diastolic: bloodPressureData[bloodPressureData.length - 1].diastolic
            },
            data: bloodPressureData,
            unit: 'mmHg',
            normalRange: '90-120/60-80',
            status: 'normal'
        },
        bloodSugar: {
            current: bloodSugarData[bloodSugarData.length - 1].value,
            data: bloodSugarData,
            unit: 'mg/dL',
            normalRange: '70-140',
            status: 'normal'
        },
        weight: {
            current: 70.5,
            unit: 'kg',
            history: [
                { date: addDays(today, -30).toISOString().split('T')[0], value: 71.2 },
                { date: addDays(today, -15).toISOString().split('T')[0], value: 70.8 },
                { date: today.toISOString().split('T')[0], value: 70.5 }
            ]
        },
        bmi: {
            current: 22.3,
            status: 'normal',
            normalRange: '18.5-24.9'
        },
        lastUpdated: today.toISOString()
    };
}

/**
 * Get prescriptions for the current patient
 * @returns {Promise<Array>} Prescriptions data or mock data on error
 */
export async function getPrescriptions() {
    try {
        const token = getAuthToken();
        if (!token) {
            console.warn('Authentication token not found, using mock prescription data');
            return getMockPrescriptions();
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log('Fetching patient prescriptions...');
        }

        const response = await fetch('/api/prescriptions', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (process.env.NODE_ENV !== 'production') {
            console.log('Prescriptions response status:', response.status);
        }

        if (!response.ok) {
            if (response.status === 404) {
                console.warn('Prescriptions endpoint not found (404), using mock data');
                return getMockPrescriptions();
            }
            
            try {
                const errorData = await response.json();
                console.error(`API error: ${errorData.error || response.statusText}`);
                return getMockPrescriptions();
            } catch (jsonError) {
                console.error(`Failed to parse error response: ${jsonError.message}`);
                return getMockPrescriptions();
            }
        }

        try {
            const data = await response.json();
            return data.prescriptions || [];
        } catch (jsonError) {
            console.error('Error parsing prescriptions response:', jsonError);
            return getMockPrescriptions();
        }
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        return getMockPrescriptions();
    }
}

/**
 * Get mock prescription data for fallback
 * @returns {Array} Mock prescription data
 */
export function getMockPrescriptions() {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setDate(lastMonth.getDate() - 30);
    
    return [
        {
            id: 1,
            medication: 'Amoxicillin',
            dosage: '500mg',
            frequency: 'Three times daily',
            startDate: lastWeek.toISOString().split('T')[0],
            endDate: addDays(lastWeek, 10).toISOString().split('T')[0],
            doctorName: 'Dr. Michael Chen',
            doctorSpecialty: 'General Practitioner',
            instructions: 'Take with food. Complete the full course even if symptoms improve.',
            status: 'Active',
            refills: 0,
            issueDate: lastWeek.toISOString().split('T')[0]
        },
        {
            id: 2,
            medication: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            startDate: lastMonth.toISOString().split('T')[0],
            endDate: addDays(today, 60).toISOString().split('T')[0],
            doctorName: 'Dr. Sarah Johnson',
            doctorSpecialty: 'Cardiologist',
            instructions: 'Take in the morning with or without food.',
            status: 'Active',
            refills: 2,
            issueDate: lastMonth.toISOString().split('T')[0]
        },
        {
            id: 3,
            medication: 'Ibuprofen',
            dosage: '400mg',
            frequency: 'As needed for pain, not exceeding 3 times daily',
            startDate: lastMonth.toISOString().split('T')[0],
            endDate: lastWeek.toISOString().split('T')[0],
            doctorName: 'Dr. James Wilson',
            doctorSpecialty: 'Orthopedic Surgeon',
            instructions: 'Take with food to reduce stomach irritation. Do not take for more than 10 days.',
            status: 'Expired',
            refills: 0,
            issueDate: lastMonth.toISOString().split('T')[0]
        }
    ];
}

/**
 * Helper function to add days to a date
 * @param {Date} date - The date to add days to
 * @param {number} days - The number of days to add
 * @returns {Date} The new date
 */
export function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

/**
 * Get consultations for the current patient
 * @returns {Promise<Array>} Consultations data or mock data on error
 */
export async function getConsultations() {
    try {
        const token = getAuthToken();
        if (!token) {
            console.warn('Authentication token not found, using mock consultation data');
            return getMockConsultations();
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log('Fetching patient consultations...');
        }

        const response = await fetch('/api/consultations', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (process.env.NODE_ENV !== 'production') {
            console.log('Consultations response status:', response.status);
        }

        if (!response.ok) {
            if (response.status === 404) {
                console.warn('Consultations endpoint not found (404), using mock data');
                return getMockConsultations();
            }
            
            try {
                const errorData = await response.json();
                console.error(`API error: ${errorData.error || response.statusText}`);
                return getMockConsultations();
            } catch (jsonError) {
                // If JSON parsing fails, log the error and fall back to mock data
                console.error(`Failed to parse error response: ${jsonError.message}`);
                return getMockConsultations();
            }
        }

        try {
            const data = await response.json();
            return data.consultations || [];
        } catch (jsonError) {
            console.error('Error parsing consultations response:', jsonError);
            return getMockConsultations();
        }
    } catch (error) {
        console.error('Error fetching consultations:', error);
        // Fall back to mock data instead of throwing the error
        return getMockConsultations();
    }
}

/**
 * Get mock consultation data for fallback
 * @returns {Array} Mock consultation data
 */
export function getMockConsultations() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    return [
        {
            id: 1,
            doctorId: 101,
            doctorName: 'Dr. Sarah Johnson',
            doctorSpecialty: 'Cardiologist',
            date: yesterday.toISOString().split('T')[0],
            time: '10:30 AM',
            status: 'Completed',
            reason: 'Heart palpitations and chest discomfort',
            notes: 'EKG performed, results normal. Recommended stress test.',
            recommendations: 'Reduce caffeine intake, monitor blood pressure daily, schedule stress test.',
            attachments: [
                { name: 'EKG_Results.pdf', url: '/mock-files/ekg.pdf' }
            ],
            createdAt: lastWeek.toISOString()
        },
        {
            id: 2,
            doctorId: 102,
            doctorName: 'Dr. Michael Chen',
            doctorSpecialty: 'General Practitioner',
            date: lastWeek.toISOString().split('T')[0],
            time: '09:15 AM',
            status: 'Completed',
            reason: 'Annual physical examination',
            notes: 'All vitals normal. Blood work ordered.',
            recommendations: 'Continue current medications, follow up in 3 months.',
            attachments: [
                { name: 'Physical_Exam_Summary.pdf', url: '/mock-files/physical.pdf' },
                { name: 'Blood_Work_Order.pdf', url: '/mock-files/blood-work.pdf' }
            ],
            createdAt: lastWeek.toISOString()
        },
        {
            id: 3,
            doctorId: 103,
            doctorName: 'Dr. Emily Rodriguez',
            doctorSpecialty: 'Dermatologist',
            date: twoWeeksAgo.toISOString().split('T')[0],
            time: '02:00 PM',
            status: 'Completed',
            reason: 'Skin rash and itching',
            notes: 'Diagnosed with contact dermatitis. Prescribed topical steroid cream.',
            recommendations: 'Apply cream twice daily, avoid known allergens, follow up in 2 weeks if not improved.',
            attachments: [],
            createdAt: twoWeeksAgo.toISOString()
        }
    ];
}

/**
 * Schedule a new appointment for the patient
 * @param {Object} appointment - The appointment data
 * @returns {Promise<Object>} The created appointment or error response
 */
export async function scheduleAppointment(appointment) {
    try {
        // Only log detailed data in development
        if (process.env.NODE_ENV !== 'production') {
            console.log('Full appointment data received:', appointment);
        }
        
        // Handle both snake_case and camelCase field names
        const doctorId = appointment.doctorId || appointment.doctor_id;
        const reason = appointment.reason || appointment.reasonForVisit;
        const timeSlot = appointment.timeSlot || appointment.time_slot;
        const date = appointment.date || appointment.appointment_date;
        
        // Validate required fields
        if (!doctorId) {
            return {
                success: false,
                error: 'Please select a doctor',
                errorCode: 'VALIDATION_ERROR'
            };
        }
        if (!reason) {
            return {
                success: false,
                error: 'Please provide a reason for the appointment',
                errorCode: 'VALIDATION_ERROR'
            };
        }

        const token = getAuthToken();
        if (!token) {
            console.warn('Authentication token not found, returning mock appointment response');
            return getMockScheduleAppointmentResponse(appointment);
        }

        const patientId = getCurrentUserId();
        if (!patientId) {
            console.warn('Could not determine patient ID from token, returning mock appointment response');
            return getMockScheduleAppointmentResponse(appointment);
        }

        // Map time slot to actual time ranges
        let startTime, endTime;
        switch (timeSlot) {
            case 'morning':
                startTime = '09:00';
                endTime = '12:00';
                break;
            case 'afternoon':
                startTime = '13:00';
                endTime = '17:00';
                break;
            case 'evening':
                startTime = '18:00';
                endTime = '21:00';
                break;
            default:
                startTime = '09:00';
                endTime = '12:00';
        }

        // Ensure doctorId is sent as a string and include patientId
        const appointmentData = {
            doctorId: String(doctorId), // Ensure it's a string
            patientId: String(patientId), // Ensure patient ID is a string
            reason: reason,
            status: 'pending',  // Initial status is pending until doctor accepts
            time_slot: timeSlot || 'any',  // Patient's preferred time (morning/afternoon/evening)
            notes: appointment.notes || '',
            follow_up: appointment.followUp || false,
            date: date
        };

        // Log processed data in development only
        if (process.env.NODE_ENV !== 'production') {
            console.log('Processed appointment data:', appointmentData);
        }

        try {
            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(appointmentData)
            });

            let responseData;
            try {
                // Try to get response as text first to help with debugging
                const responseText = await response.text();
                
                // Only log in development
                if (process.env.NODE_ENV !== 'production') {
                    console.log('Response from server:', responseText);
                }
                
                // Parse the text response as JSON
                responseData = responseText ? JSON.parse(responseText) : {};
            } catch (parseError) {
                console.error('Error parsing server response:', parseError);
                return {
                    success: false,
                    error: 'Invalid server response format',
                    errorCode: 'PARSE_ERROR'
                };
            }

            if (!response.ok) {
                console.error('Backend error details:', responseData);
                return {
                    success: false,
                    error: responseData.error || responseData.message || `Server error: ${response.status}`,
                    errorCode: responseData.errorCode || 'API_ERROR',
                    status: response.status
                };
            }

            return {
                success: true,
                data: responseData,
                message: 'Appointment scheduled successfully'
            };
        } catch (fetchError) {
            console.error('Network error in scheduleAppointment:', fetchError);
            // Fall back to mock data for network errors
            return getMockScheduleAppointmentResponse(appointment);
        }
    } catch (error) {
        console.error('Error in scheduleAppointment:', error);
        return {
            success: false,
            error: error.message || 'An unexpected error occurred',
            errorCode: 'UNKNOWN_ERROR'
        };
    }
}

/**
 * Generate a mock response for scheduling an appointment
 * @param {Object} appointment - The appointment data that was submitted
 * @returns {Object} A mock success response
 */
export function getMockScheduleAppointmentResponse(appointment) {
    const now = new Date();
    const doctorId = appointment.doctorId || appointment.doctor_id || 101;
    const appointmentId = Math.floor(Math.random() * 10000) + 1;
    
    // Try to get doctor info from localStorage if available
    let doctorName = 'Dr. Sarah Johnson';
    let doctorSpecialty = 'Cardiologist';
    
    try {
        // Check if we have doctors data in localStorage
        const doctorsDataStr = localStorage.getItem('safe_doctors_data');
        if (doctorsDataStr) {
            const doctorsData = JSON.parse(doctorsDataStr);
            const doctor = doctorsData.find(d => d.id === doctorId || d.id === parseInt(doctorId));
            if (doctor) {
                doctorName = doctor.name || `Dr. ${doctor.firstName} ${doctor.lastName}`;
                doctorSpecialty = doctor.specialty;
            }
        }
    } catch (e) {
        console.warn('Could not retrieve doctor data from localStorage:', e);
    }
    
    return {
        success: true,
        message: 'Appointment scheduled successfully (mock data)',
        data: {
            id: appointmentId,
            doctor_id: doctorId,
            doctorName: doctorName,
            doctorSpecialty: doctorSpecialty,
            reason: appointment.reason || appointment.reasonForVisit || 'General checkup',
            status: 'pending',
            time_slot: appointment.timeSlot || appointment.time_slot || 'morning',
            date: appointment.date || appointment.appointment_date || new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            notes: appointment.notes || '',
            follow_up: appointment.followUp || false,
            created_at: now.toISOString(),
            updated_at: now.toISOString()
        }
    };
}

/**
 * Get doctors available for the patient
 * @returns {Promise<Array>} Doctors data or mock data on error
 */
export async function getDoctors() {
    try {
        const token = getAuthToken();
        if (!token) {
            console.warn('Authentication token not found, using mock doctors data');
            return getMockDoctors();
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log('Fetching available doctors...');
        }

        const response = await fetch('/api/doctors', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (process.env.NODE_ENV !== 'production') {
            console.log('Doctors response status:', response.status);
        }

        if (!response.ok) {
            if (response.status === 404) {
                console.warn('Doctors endpoint not found (404), using mock data');
                return getMockDoctors();
            }
            
            try {
                const errorData = await response.json();
                console.error(`API error: ${errorData.error || response.statusText}`);
                return getMockDoctors();
            } catch (jsonError) {
                console.error(`Failed to parse error response: ${jsonError.message}`);
                return getMockDoctors();
            }
        }

        try {
            const data = await response.json();
            return Array.isArray(data) ? data : (data.doctors || []);
        } catch (jsonError) {
            console.error('Error parsing doctors response:', jsonError);
            return getMockDoctors();
        }
    } catch (error) {
        console.error('Error fetching doctors:', error);
        return getMockDoctors();
    }
}

/**
 * Get mock doctors data for fallback
 * @returns {Array} Mock doctors data
 */
export function getMockDoctors() {
    return [
        {
            id: 101,
            name: 'Dr. Sarah Johnson',
            specialty: 'Cardiologist',
            hospital: 'Main Hospital',
            rating: 4.8,
            experience: 12,
            image: '/images/doctors/doctor1.jpg',
            availability: ['Monday', 'Wednesday', 'Friday'],
            contact: {
                email: 'sarah.johnson@example.com',
                phone: '+1 (555) 123-4567'
            }
        },
        {
            id: 102,
            name: 'Dr. Michael Chen',
            specialty: 'General Practitioner',
            hospital: 'Medical Center',
            rating: 4.6,
            experience: 8,
            image: '/images/doctors/doctor2.jpg',
            availability: ['Monday', 'Tuesday', 'Thursday'],
            contact: {
                email: 'michael.chen@example.com',
                phone: '+1 (555) 234-5678'
            }
        },
        {
            id: 103,
            name: 'Dr. Emily Rodriguez',
            specialty: 'Dermatologist',
            hospital: 'Dermatology Clinic',
            rating: 4.9,
            experience: 15,
            image: '/images/doctors/doctor3.jpg',
            availability: ['Tuesday', 'Wednesday', 'Friday'],
            contact: {
                email: 'emily.rodriguez@example.com',
                phone: '+1 (555) 345-6789'
            }
        },
        {
            id: 104,
            name: 'Dr. James Wilson',
            specialty: 'Orthopedic Surgeon',
            hospital: 'Orthopedic Center',
            rating: 4.7,
            experience: 20,
            image: '/images/doctors/doctor4.jpg',
            availability: ['Monday', 'Thursday', 'Friday'],
            contact: {
                email: 'james.wilson@example.com',
                phone: '+1 (555) 456-7890'
            }
        }
    ];
}

/**
 * Get patient profile data
 * @returns {Promise<Object>} Patient profile data or mock data on error
 */
export async function getPatientProfile() {
    try {
        const token = getAuthToken();
        if (!token) {
            console.warn('Authentication token not found, using mock patient profile data');
            return getMockPatientProfile();
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log('Fetching patient profile...');
        }

        const response = await fetch('/api/patient/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (process.env.NODE_ENV !== 'production') {
            console.log('Patient profile response status:', response.status);
        }

        if (!response.ok) {
            if (response.status === 404) {
                console.warn('Patient profile endpoint not found (404), using mock data');
                return getMockPatientProfile();
            }
            
            try {
                const errorData = await response.json();
                console.error(`API error: ${errorData.error || response.statusText}`);
                return getMockPatientProfile();
            } catch (jsonError) {
                console.error(`Failed to parse error response: ${jsonError.message}`);
                return getMockPatientProfile();
            }
        }

        try {
            const data = await response.json();
            
            // Ensure the data has the expected structure
            if (!data.contact) {
                console.warn('API response missing contact field, adding default structure');
                const mockData = getMockPatientProfile();
                
                // Create a properly structured profile by combining API data with mock data structure
                return {
                    ...data,
                    contact: {
                        email: data.email || mockData.contact.email,
                        phone: data.phone || mockData.contact.phone,
                        address: data.address || mockData.contact.address
                    },
                    // Ensure other required fields are present
                    emergencyContact: data.emergencyContact || mockData.emergencyContact,
                    insurance: data.insurance || mockData.insurance,
                    allergies: data.allergies || mockData.allergies,
                    chronicConditions: data.chronicConditions || mockData.chronicConditions
                };
            }
            
            return data;
        } catch (jsonError) {
            console.error('Error parsing patient profile response:', jsonError);
            return getMockPatientProfile();
        }
    } catch (error) {
        console.error('Error fetching patient profile:', error);
        return getMockPatientProfile();
    }
}

/**
 * Get mock patient profile data for fallback
 * @returns {Object} Mock patient profile data
 */
export function getMockPatientProfile() {
    const userId = getCurrentUserId() || 'user123';
    const userEmail = typeof window !== 'undefined' && localStorage.getItem('safe_user_data') ? 
        JSON.parse(localStorage.getItem('safe_user_data')).email : 'patient@example.com';
    const userName = typeof window !== 'undefined' && localStorage.getItem('safe_user_data') ? 
        JSON.parse(localStorage.getItem('safe_user_data')).name : 'Default Patient';

    return {
        id: userId,
        name: userName,
        dateOfBirth: '1990-05-15',
        gender: 'Male',
        bloodType: 'O+',
        contact: {
            email: userEmail,
            phone: '+1 (555) 123-4567',
            address: '123 Health Street, Medical City, MC 12345'
        },
        emergencyContact: {
            name: 'Emergency Contact',
            relationship: 'Family',
            phone: '+1 (555) 987-6543'
        },
        insurance: {
            provider: 'HealthGuard Insurance',
            policyNumber: 'HGI-123456789',
            expiryDate: new Date(new Date().getFullYear() + 1, 0, 1).toISOString()
        },
        allergies: ['Penicillin', 'Peanuts'],
        chronicConditions: ['Asthma'],
        lastUpdated: new Date().toISOString()
    };
}

/**
 * Get appointments for the current patient
 * @returns {Promise<Array>} Appointments data or mock data on error
 */
export async function getAppointments() {
    try {
        const token = getAuthToken();
        if (!token) {
            console.warn('Authentication token not found, using mock appointments data');
            return getMockAppointments();
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log('Fetching patient appointments...');
        }

        const response = await fetch('/api/appointments', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (process.env.NODE_ENV !== 'production') {
            console.log('Appointments response status:', response.status);
        }

        if (!response.ok) {
            if (response.status === 404) {
                console.warn('Appointments endpoint not found (404), using mock data');
                return getMockAppointments();
            }
            
            try {
                const errorData = await response.json();
                console.error(`API error: ${errorData.error || response.statusText}`);
                return getMockAppointments();
            } catch (jsonError) {
                console.error(`Failed to parse error response: ${jsonError.message}`);
                return getMockAppointments();
            }
        }

        try {
            const data = await response.json();
            return data;
        } catch (jsonError) {
            console.error('Error parsing appointments response:', jsonError);
            return getMockAppointments();
        }
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return getMockAppointments();
    }
}

/**
 * Get mock appointments data for fallback
 * @returns {Array} Mock appointments data
 */
export function getMockAppointments() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return [
        {
            id: 1001,
            doctorId: 101,
            doctorName: 'Dr. Sarah Johnson',
            specialty: 'Cardiologist',
            date: tomorrow.toISOString().split('T')[0],
            time: '10:00 AM',
            status: 'confirmed',
            notes: 'Regular checkup',
            location: 'Main Hospital, Room 305',
            type: 'in-person'
        },
        {
            id: 1002,
            doctorId: 102,
            doctorName: 'Dr. Michael Chen',
            specialty: 'General Practitioner',
            date: nextWeek.toISOString().split('T')[0],
            time: '2:30 PM',
            status: 'scheduled',
            notes: 'Follow-up appointment',
            location: 'Medical Center, Room 210',
            type: 'in-person'
        },
        {
            id: 1003,
            doctorId: 103,
            doctorName: 'Dr. Emily Rodriguez',
            specialty: 'Dermatologist',
            date: addDays(today, 14).toISOString().split('T')[0],
            time: '11:15 AM',
            status: 'scheduled',
            notes: 'Skin examination',
            location: 'Virtual',
            type: 'telehealth'
        }
    ];
}

/**
 * Update an existing appointment
 * @param {Object} appointment - The appointment data to update
 * @returns {Promise<Object>} The updated appointment or error response
 */
export async function updateAppointment(appointmentId, updates) {
    try {
        const token = getAuthToken();
        if (!token) {
            console.warn('Authentication token not found, using mock update response');
            return getMockUpdateAppointmentResponse(appointmentId, updates);
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log('Updating appointment:', appointmentId, updates);
        }

        const response = await fetch(`/api/appointments/${appointmentId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updates)
        });

        if (process.env.NODE_ENV !== 'production') {
            console.log('Update appointment response status:', response.status);
        }

        if (!response.ok) {
            if (response.status === 404) {
                console.warn('Update appointment endpoint not found (404), using mock response');
                return getMockUpdateAppointmentResponse(appointmentId, updates);
            }
            
            try {
                const errorData = await response.json();
                console.error(`API error: ${errorData.error || response.statusText}`);
                return getMockUpdateAppointmentResponse(appointmentId, updates);
            } catch (jsonError) {
                console.error(`Failed to parse error response: ${jsonError.message}`);
                return getMockUpdateAppointmentResponse(appointmentId, updates);
            }
        }

        try {
            const data = await response.json();
            return data;
        } catch (jsonError) {
            console.error('Error parsing update appointment response:', jsonError);
            return getMockUpdateAppointmentResponse(appointmentId, updates);
        }
    } catch (error) {
        console.error('Error updating appointment:', error);
        return getMockUpdateAppointmentResponse(appointmentId, updates);
    }
}

/**
 * Generate a mock response for updating an appointment
 * @param {number} appointmentId - The ID of the appointment to update
 * @param {Object} updates - The updates to apply to the appointment
 * @returns {Object} A mock success response
 */
export function getMockUpdateAppointmentResponse(appointmentId, updates) {
    return {
        id: appointmentId,
        ...updates,
        updated: true,
        updatedAt: new Date().toISOString()
    };
}

/**
 * Cancel an existing appointment
 * @param {number} appointmentId - The ID of the appointment to cancel
 * @returns {Promise<Object>} The cancellation result or error response
 */
export async function cancelAppointment(appointmentId) {
    try {
        const token = getAuthToken();
        if (!token) {
            console.warn('Authentication token not found, using mock cancel response');
            return getMockCancelAppointmentResponse(appointmentId);
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log('Cancelling appointment:', appointmentId);
        }

        const response = await fetch(`/api/appointments/${appointmentId}/cancel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (process.env.NODE_ENV !== 'production') {
            console.log('Cancel appointment response status:', response.status);
        }

        if (!response.ok) {
            if (response.status === 404) {
                console.warn('Cancel appointment endpoint not found (404), using mock response');
                return getMockCancelAppointmentResponse(appointmentId);
            }
            
            try {
                const errorData = await response.json();
                console.error(`API error: ${errorData.error || response.statusText}`);
                return getMockCancelAppointmentResponse(appointmentId);
            } catch (jsonError) {
                console.error(`Failed to parse error response: ${jsonError.message}`);
                return getMockCancelAppointmentResponse(appointmentId);
            }
        }

        try {
            const data = await response.json();
            return data;
        } catch (jsonError) {
            console.error('Error parsing cancel appointment response:', jsonError);
            return getMockCancelAppointmentResponse(appointmentId);
        }
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        return getMockCancelAppointmentResponse(appointmentId);
    }
}

/**
 * Generate a mock response for cancelling an appointment
 * @param {number} appointmentId - The ID of the appointment to cancel
 * @returns {Object} A mock success response
 */
export function getMockCancelAppointmentResponse(appointmentId) {
    return {
        id: appointmentId,
        status: 'cancelled',
        cancelledAt: new Date().toISOString(),
        success: true,
        message: 'Appointment cancelled successfully'
    };
}

/**
 * Get patient dashboard data
 * @returns {Promise<Object>} Dashboard data or mock data on error
 */
export async function getPatientDashboardData() {
    try {
        const token = getAuthToken();
        if (!token) {
            console.warn('Authentication token not found, using mock dashboard data');
            return getMockDashboardData();
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log('Fetching patient dashboard data...');
        }

        const response = await fetch('/api/patient/dashboard', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (process.env.NODE_ENV !== 'production') {
            console.log('Dashboard data response status:', response.status);
        }

        if (!response.ok) {
            if (response.status === 404) {
                console.warn('Dashboard endpoint not found (404), using mock data');
                return getMockDashboardData();
            }
            
            try {
                const errorData = await response.json();
                console.error(`API error: ${errorData.error || response.statusText}`);
                return getMockDashboardData();
            } catch (jsonError) {
                console.error(`Failed to parse error response: ${jsonError.message}`);
                return getMockDashboardData();
            }
        }

        try {
            const data = await response.json();
            return data;
        } catch (jsonError) {
            console.error('Error parsing dashboard data response:', jsonError);
            return getMockDashboardData();
        }
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return getMockDashboardData();
    }
}

/**
 * Get mock dashboard data for fallback
 * @returns {Object} Mock dashboard data
 */
export function getMockDashboardData() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return {
        upcomingAppointments: [
            {
                id: 1001,
                doctorName: 'Dr. Sarah Johnson',
                specialty: 'Cardiologist',
                date: tomorrow.toISOString().split('T')[0],
                time: '10:00 AM',
                location: 'Main Hospital, Room 305'
            }
        ],
        // Add medications array for the dashboard
        medications: [
            {
                id: 2001,
                name: 'Lisinopril',
                dosage: '10mg',
                frequency: 'Once daily',
                prescribedBy: 'Dr. Sarah Johnson',
                startDate: new Date(today.getFullYear(), today.getMonth() - 1, 15).toISOString().split('T')[0],
                endDate: new Date(today.getFullYear(), today.getMonth() + 2, 15).toISOString().split('T')[0],
                purpose: 'Blood pressure control'
            },
            {
                id: 2002,
                name: 'Atorvastatin',
                dosage: '20mg',
                frequency: 'Once daily at bedtime',
                prescribedBy: 'Dr. Sarah Johnson',
                startDate: new Date(today.getFullYear(), today.getMonth() - 2, 10).toISOString().split('T')[0],
                endDate: new Date(today.getFullYear(), today.getMonth() + 4, 10).toISOString().split('T')[0],
                purpose: 'Cholesterol management'
            }
        ],
        recentPrescriptions: [
            {
                id: 2001,
                medicationName: 'Lisinopril',
                dosage: '10mg',
                frequency: 'Once daily',
                prescribedBy: 'Dr. Sarah Johnson',
                startDate: new Date(today.getFullYear(), today.getMonth() - 1, 15).toISOString().split('T')[0],
                endDate: new Date(today.getFullYear(), today.getMonth() + 2, 15).toISOString().split('T')[0]
            }
        ],
        healthMetrics: {
            bloodPressure: {
                current: { systolic: 125, diastolic: 82, date: today.toISOString().split('T')[0] },
                previous: { systolic: 130, diastolic: 85, date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30).toISOString().split('T')[0] },
                trend: 'improving'
            },
            heartRate: {
                current: { value: 72, date: today.toISOString().split('T')[0] },
                previous: { value: 75, date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30).toISOString().split('T')[0] },
                trend: 'stable'
            },
            weight: {
                current: { value: 70, unit: 'kg', date: today.toISOString().split('T')[0] },
                previous: { value: 72, unit: 'kg', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30).toISOString().split('T')[0] },
                trend: 'improving'
            }
        },
        // Add healthStats array for the dashboard
        healthStats: [
            {
                name: 'Blood Pressure',
                value: '125/82',
                unit: 'mmHg',
                trend: 'improving'
            },
            {
                name: 'Heart Rate',
                value: '72',
                unit: 'bpm',
                trend: 'stable'
            },
            {
                name: 'Weight',
                value: '70',
                unit: 'kg',
                trend: 'improving'
            },
            {
                name: 'Blood Glucose',
                value: '95',
                unit: 'mg/dL',
                trend: 'stable'
            }
        ],
        stats: {
            appointmentsThisMonth: 3,
            medicationsActive: 2,
            testsCompleted: 5,
            healthScore: 85,
            lastCheckup: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 45).toISOString().split('T')[0],
            nextCheckupDue: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 45).toISOString().split('T')[0],
            goalCompletion: 75 // percentage
        },
        notifications: [
            {
                id: 3001,
                type: 'appointment',
                message: 'Upcoming appointment with Dr. Sarah Johnson tomorrow at 10:00 AM',
                date: today.toISOString(),
                read: false
            },
            {
                id: 3002,
                type: 'medication',
                message: 'Remember to take Lisinopril today',
                date: today.toISOString(),
                read: true
            }
        ]
    };
}

/**
 * Get medicine reminders for the current patient
 * @returns {Promise<Array>} Medicine reminders data or mock data on error
 */
export async function getMedicineReminders() {
    try {
        const token = getAuthToken();
        if (!token) {
            console.warn('Authentication token not found, using mock medicine reminders data');
            return getMockMedicineReminders();
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log('Fetching medicine reminders...');
        }

        const response = await fetch('/api/medicine-reminders', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (process.env.NODE_ENV !== 'production') {
            console.log('Medicine reminders response status:', response.status);
        }

        if (!response.ok) {
            if (response.status === 404) {
                console.warn('Medicine reminders endpoint not found (404), using mock data');
                return getMockMedicineReminders();
            }
            
            try {
                const errorData = await response.json();
                console.error(`API error: ${errorData.error || response.statusText}`);
                return getMockMedicineReminders();
            } catch (jsonError) {
                console.error(`Failed to parse error response: ${jsonError.message}`);
                return getMockMedicineReminders();
            }
        }

        try {
            const data = await response.json();
            return data;
        } catch (jsonError) {
            console.error('Error parsing medicine reminders response:', jsonError);
            return getMockMedicineReminders();
        }
    } catch (error) {
        console.error('Error fetching medicine reminders:', error);
        return getMockMedicineReminders();
    }
}

/**
 * Get mock medicine reminders data for fallback
 * @returns {Array} Mock medicine reminders data
 */
export function getMockMedicineReminders() {
    return [
        {
            id: 4001,
            medicationId: 2001,
            medicationName: 'Lisinopril',
            dosage: '10mg',
            time: '08:00',
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            active: true,
            instructions: 'Take with water before breakfast'
        },
        {
            id: 4002,
            medicationId: 2002,
            medicationName: 'Aspirin',
            dosage: '81mg',
            time: '20:00',
            days: ['Monday', 'Wednesday', 'Friday'],
            active: true,
            instructions: 'Take with food in the evening'
        },
        {
            id: 4003,
            medicationId: 2003,
            medicationName: 'Vitamin D',
            dosage: '1000 IU',
            time: '12:00',
            days: ['Monday', 'Thursday'],
            active: false,
            instructions: 'Take with lunch'
        }
    ];
}

/**
 * Update a medicine reminder
 * @param {number} reminderId - The ID of the reminder to update
 * @param {Object} updates - The updates to apply to the reminder
 * @returns {Promise<Object>} The updated reminder or error response
 */
export async function updateMedicineReminder(reminderId, updates) {
    try {
        const token = getAuthToken();
        if (!token) {
            console.warn('Authentication token not found, using mock update reminder response');
            return getMockUpdateReminderResponse(reminderId, updates);
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log('Updating medicine reminder:', reminderId, updates);
        }

        const response = await fetch(`/api/medicine-reminders/${reminderId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updates)
        });

        if (process.env.NODE_ENV !== 'production') {
            console.log('Update reminder response status:', response.status);
        }

        if (!response.ok) {
            if (response.status === 404) {
                console.warn('Update reminder endpoint not found (404), using mock response');
                return getMockUpdateReminderResponse(reminderId, updates);
            }
            
            try {
                const errorData = await response.json();
                console.error(`API error: ${errorData.error || response.statusText}`);
                return getMockUpdateReminderResponse(reminderId, updates);
            } catch (jsonError) {
                console.error(`Failed to parse error response: ${jsonError.message}`);
                return getMockUpdateReminderResponse(reminderId, updates);
            }
        }

        try {
            const data = await response.json();
            return data;
        } catch (jsonError) {
            console.error('Error parsing update reminder response:', jsonError);
            return getMockUpdateReminderResponse(reminderId, updates);
        }
    } catch (error) {
        console.error('Error updating medicine reminder:', error);
        return getMockUpdateReminderResponse(reminderId, updates);
    }
}

/**
 * Generate a mock response for updating a medicine reminder
 * @param {number} reminderId - The ID of the reminder to update
 * @param {Object} updates - The updates to apply to the reminder
 * @returns {Object} A mock success response
 */
export function getMockUpdateReminderResponse(reminderId, updates) {
    return {
        id: reminderId,
        ...updates,
        updated: true,
        updatedAt: new Date().toISOString()
    };
}

/**
 * Get conversations for the current patient
 * @returns {Promise<Array>} Conversations data or mock data on error
 */
export async function getConversations() {
    try {
        const token = getAuthToken();
        if (!token) {
            console.warn('Authentication token not found, using mock conversations data');
            return getMockConversations();
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log('Fetching patient conversations...');
        }

        const response = await fetch('/api/conversations', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (process.env.NODE_ENV !== 'production') {
            console.log('Conversations response status:', response.status);
        }

        if (!response.ok) {
            if (response.status === 404) {
                console.warn('Conversations endpoint not found (404), using mock data');
                return getMockConversations();
            }
            
            try {
                const errorData = await response.json();
                console.error(`API error: ${errorData.error || response.statusText}`);
                return getMockConversations();
            } catch (jsonError) {
                console.error(`Failed to parse error response: ${jsonError.message}`);
                return getMockConversations();
            }
        }

        try {
            const data = await response.json();
            return data;
        } catch (jsonError) {
            console.error('Error parsing conversations response:', jsonError);
            return getMockConversations();
        }
    } catch (error) {
        console.error('Error fetching conversations:', error);
        return getMockConversations();
    }
}

/**
 * Get mock conversations data for fallback
 * @returns {Array} Mock conversations data
 */
export function getMockConversations() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    return [
        {
            id: 5001,
            participantId: 101,
            participantName: 'Dr. Sarah Johnson',
            participantRole: 'Cardiologist',
            lastMessage: 'How are you feeling today?',
            lastMessageTime: yesterday.toISOString(),
            unreadCount: 2,
            avatar: '/images/doctors/doctor1.jpg'
        },
        {
            id: 5002,
            participantId: 102,
            participantName: 'Dr. Michael Chen',
            participantRole: 'General Practitioner',
            lastMessage: 'Your test results look good.',
            lastMessageTime: lastWeek.toISOString(),
            unreadCount: 0,
            avatar: '/images/doctors/doctor2.jpg'
        },
        {
            id: 5003,
            participantId: 201,
            participantName: 'Pharmacy Support',
            participantRole: 'Support',
            lastMessage: 'Your prescription is ready for pickup.',
            lastMessageTime: addDays(today, -3).toISOString(),
            unreadCount: 1,
            avatar: '/images/support/pharmacy.jpg'
        }
    ];
}

/**
 * Get a specific conversation with messages
 * @param {number} conversationId - The ID of the conversation to fetch
 * @returns {Promise<Object>} Conversation data with messages or mock data on error
 */
export async function getConversation(conversationId) {
    try {
        const token = getAuthToken();
        if (!token) {
            console.warn('Authentication token not found, using mock conversation data');
            return getMockConversation(conversationId);
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log('Fetching conversation:', conversationId);
        }

        const response = await fetch(`/api/conversations/${conversationId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (process.env.NODE_ENV !== 'production') {
            console.log('Conversation response status:', response.status);
        }

        if (!response.ok) {
            if (response.status === 404) {
                console.warn('Conversation endpoint not found (404), using mock data');
                return getMockConversation(conversationId);
            }
            
            try {
                const errorData = await response.json();
                console.error(`API error: ${errorData.error || response.statusText}`);
                return getMockConversation(conversationId);
            } catch (jsonError) {
                console.error(`Failed to parse error response: ${jsonError.message}`);
                return getMockConversation(conversationId);
            }
        }

        try {
            const data = await response.json();
            return data;
        } catch (jsonError) {
            console.error('Error parsing conversation response:', jsonError);
            return getMockConversation(conversationId);
        }
    } catch (error) {
        console.error('Error fetching conversation:', error);
        return getMockConversation(conversationId);
    }
}

/**
 * Get mock conversation data for fallback
 * @param {number} conversationId - The ID of the conversation to mock
 * @returns {Object} Mock conversation data with messages
 */
export function getMockConversation(conversationId) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Find the conversation in mock conversations
    const conversations = getMockConversations();
    const conversation = conversations.find(c => c.id === conversationId) || conversations[0];
    
    // Generate mock messages based on the conversation
    const messages = [];
    const messageCount = 5 + Math.floor(Math.random() * 5); // 5-10 messages
    
    for (let i = 0; i < messageCount; i++) {
        const isFromDoctor = i % 2 === 0;
        const timestamp = new Date(today);
        timestamp.setHours(timestamp.getHours() - (messageCount - i));
        
        messages.push({
            id: `msg-${conversationId}-${i}`,
            senderId: isFromDoctor ? conversation.participantId : 'current-user',
            senderName: isFromDoctor ? conversation.participantName : 'You',
            senderRole: isFromDoctor ? conversation.participantRole : 'Patient',
            content: isFromDoctor 
                ? getMockDoctorMessage(conversation.participantRole, i)
                : getMockPatientMessage(i),
            timestamp: timestamp.toISOString(),
            read: i < messageCount - conversation.unreadCount
        });
    }
    
    return {
        id: conversation.id,
        participant: {
            id: conversation.participantId,
            name: conversation.participantName,
            role: conversation.participantRole,
            avatar: conversation.avatar
        },
        messages: messages,
        canCall: true,
        canVideoCall: conversation.participantRole !== 'Support'
    };
}

/**
 * Generate a mock doctor message
 * @param {string} doctorRole - The role of the doctor
 * @param {number} index - Message index for variety
 * @returns {string} A mock message
 */
function getMockDoctorMessage(doctorRole, index) {
    const cardioMessages = [
        "How have you been feeling since our last appointment?",
        "Have you been taking your medication regularly?",
        "Your latest blood pressure readings look good.",
        "I'd like to schedule a follow-up in two weeks.",
        "Remember to keep up with your daily walks."
    ];
    
    const gpMessages = [
        "How are your symptoms today?",
        "Make sure to complete the full course of antibiotics.",
        "Your test results came back normal.",
        "Let me know if you experience any side effects.",
        "I've sent a new prescription to your pharmacy."
    ];
    
    const supportMessages = [
        "Your prescription is ready for pickup.",
        "We've processed your insurance claim.",
        "Your medication will be delivered tomorrow.",
        "Do you need a refill on your prescription?",
        "We're here to help if you have any questions about your medication."
    ];
    
    if (doctorRole === 'Cardiologist') {
        return cardioMessages[index % cardioMessages.length];
    } else if (doctorRole === 'Support') {
        return supportMessages[index % supportMessages.length];
    } else {
        return gpMessages[index % gpMessages.length];
    }
}

/**
 * Generate a mock patient message
 * @param {number} index - Message index for variety
 * @returns {string} A mock message
 */
function getMockPatientMessage(index) {
    const messages = [
        "I've been feeling much better, thank you.",
        "Yes, I've been taking all my medications as prescribed.",
        "When should I schedule my next appointment?",
        "I've been experiencing some mild side effects.",
        "Thank you for the information."
    ];
    
    return messages[index % messages.length];
}

/**
 * Send a message in a conversation
 * @param {number} conversationId - The ID of the conversation
 * @param {string} message - The message content to send
 * @returns {Promise<Object>} The sent message data or error response
 */
export async function sendMessage(conversationId, message) {
    try {
        const token = getAuthToken();
        if (!token) {
            console.warn('Authentication token not found, using mock send message response');
            return getMockSendMessageResponse(conversationId, message);
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log('Sending message to conversation:', conversationId, message);
        }

        const response = await fetch(`/api/conversations/${conversationId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content: message })
        });

        if (process.env.NODE_ENV !== 'production') {
            console.log('Send message response status:', response.status);
        }

        if (!response.ok) {
            if (response.status === 404) {
                console.warn('Send message endpoint not found (404), using mock response');
                return getMockSendMessageResponse(conversationId, message);
            }
            
            try {
                const errorData = await response.json();
                console.error(`API error: ${errorData.error || response.statusText}`);
                return getMockSendMessageResponse(conversationId, message);
            } catch (jsonError) {
                console.error(`Failed to parse error response: ${jsonError.message}`);
                return getMockSendMessageResponse(conversationId, message);
            }
        }

        try {
            const data = await response.json();
            return data;
        } catch (jsonError) {
            console.error('Error parsing send message response:', jsonError);
            return getMockSendMessageResponse(conversationId, message);
        }
    } catch (error) {
        console.error('Error sending message:', error);
        return getMockSendMessageResponse(conversationId, message);
    }
}

/**
 * Generate a mock response for sending a message
 * @param {number} conversationId - The ID of the conversation
 * @param {string} message - The message content that was sent
 * @returns {Object} A mock success response with the sent message
 */
export function getMockSendMessageResponse(conversationId, message) {
    return {
        id: `msg-${conversationId}-${Date.now()}`,
        conversationId: conversationId,
        senderId: 'current-user',
        senderName: 'You',
        senderRole: 'Patient',
        content: message,
        timestamp: new Date().toISOString(),
        read: false,
        sent: true
    };
}

/**
 * Update patient profile information
 * @param {Object} profileData - The updated profile data
 * @returns {Promise<Object>} Updated profile data or error response
 */
export async function updatePatientProfile(profileData) {
    try {
        const token = getAuthToken();
        if (!token) {
            console.warn('Authentication token not found, using mock profile update response');
            return getMockUpdateProfileResponse(profileData);
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log('Updating patient profile:', profileData);
        }

        const response = await fetch('/api/patient/profile', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(profileData)
        });

        if (process.env.NODE_ENV !== 'production') {
            console.log('Profile update response status:', response.status);
        }

        if (!response.ok) {
            if (response.status === 404) {
                console.warn('Profile update endpoint not found (404), using mock response');
                return getMockUpdateProfileResponse(profileData);
            }
            
            try {
                const errorData = await response.json();
                console.error(`API error: ${errorData.error || response.statusText}`);
                return {
                    success: false,
                    message: errorData.message || 'Failed to update profile',
                    error: errorData.error || response.statusText
                };
            } catch (jsonError) {
                console.error(`Failed to parse error response: ${jsonError.message}`);
                return {
                    success: false,
                    message: 'Failed to update profile',
                    error: 'Unknown error'
                };
            }
        }

        try {
            const data = await response.json();
            return {
                success: true,
                message: 'Profile updated successfully',
                profile: data.profile || profileData
            };
        } catch (jsonError) {
            console.error('Error parsing profile update response:', jsonError);
            return getMockUpdateProfileResponse(profileData);
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        return getMockUpdateProfileResponse(profileData);
    }
}

/**
 * Generate a mock response for updating patient profile
 * @param {Object} profileData - The profile data that was submitted
 * @returns {Object} A mock success response with the updated profile
 */
export function getMockUpdateProfileResponse(profileData) {
    return {
        success: true,
        message: 'Profile updated successfully (mock)',
        profile: {
            ...profileData,
            updatedAt: new Date().toISOString()
        }
    };
}


export async function getMedicalProviders() {
    try {
        const token = getAuthToken();
        if (!token) {
            console.warn('Authentication token not found, using mock medical providers data');
            return getMockMedicalProviders();
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log('Fetching medical providers...');
        }

        const response = await fetch('/api/medical-providers', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (process.env.NODE_ENV !== 'production') {
            console.log('Medical providers response status:', response.status);
        }

        if (!response.ok) {
            if (response.status === 404) {
                console.warn('Medical providers endpoint not found (404), using mock data');
                return getMockMedicalProviders();
            }
            
            try {
                const errorData = await response.json();
                console.error(`API error: ${errorData.error || response.statusText}`);
                return getMockMedicalProviders();
            } catch (jsonError) {
                console.error(`Failed to parse error response: ${jsonError.message}`);
                return getMockMedicalProviders();
            }
        }

        try {
            const data = await response.json();
            
            // Ensure the data has the expected structure
            if (!data.doctors || !data.pharmacists) {
                console.warn('API response missing doctors or pharmacists field, adding default structure');
                const mockData = getMockMedicalProviders();
                
                // If the API returns an array of doctors but not in the expected structure
                if (Array.isArray(data)) {
                    return {
                        doctors: data, // Assume the array contains doctors
                        pharmacists: mockData.pharmacists
                    };
                }
                
                // Create a properly structured response
                return {
                    doctors: data.doctors || mockData.doctors,
                    pharmacists: data.pharmacists || mockData.pharmacists
                };
            }
            
            return data;
        } catch (jsonError) {
            console.error('Error parsing medical providers response:', jsonError);
            return getMockMedicalProviders();
        }
    } catch (error) {
        console.error('Error fetching medical providers:', error);
        return getMockMedicalProviders();
    }
}

/**
 * Get mock medical providers data for fallback
 * @returns {Object} Mock medical providers data with doctors and pharmacists arrays
 */
export function getMockMedicalProviders() {
    return {
        doctors: [
            {
                id: 101,
                name: 'Dr. Sarah Johnson',
                specialty: 'Cardiology',
                hospital: 'City General Hospital',
                address: '123 Medical Center Blvd, Cityville',
                phone: '(555) 123-4567',
                email: 'sarah.johnson@cityhospital.org',
                rating: 4.8,
                reviewCount: 127,
                isPrimary: true,
                hasAccess: true,
                availability: [
                    { day: 'Monday', slots: ['9:00 AM', '10:00 AM', '2:00 PM'] },
                    { day: 'Wednesday', slots: ['1:00 PM', '3:00 PM', '4:00 PM'] },
                    { day: 'Friday', slots: ['9:00 AM', '11:00 AM', '2:00 PM'] }
                ],
                avatar: '/images/doctors/doctor1.jpg',
                nextAvailable: addDays(new Date(), 2).toISOString()
            },
            {
                id: 102,
                name: 'Dr. Michael Chen',
                specialty: 'General Practice',
                hospital: 'Westside Medical Center',
                address: '456 Health Avenue, Westside',
                phone: '(555) 987-6543',
                email: 'michael.chen@westsidemedical.org',
                rating: 4.6,
                reviewCount: 89,
                isPrimary: false,
                hasAccess: true,
                availability: [
                    { day: 'Tuesday', slots: ['10:00 AM', '11:00 AM', '3:00 PM'] },
                    { day: 'Thursday', slots: ['9:00 AM', '2:00 PM', '4:00 PM'] },
                    { day: 'Saturday', slots: ['10:00 AM', '11:00 AM'] }
                ],
                avatar: '/images/doctors/doctor2.jpg',
                nextAvailable: addDays(new Date(), 1).toISOString()
            },
            {
                id: 103,
                name: 'Dr. Emily Rodriguez',
                specialty: 'Endocrinology',
                hospital: 'Diabetes & Hormone Center',
                address: '789 Specialist Road, Eastside',
                phone: '(555) 234-5678',
                email: 'emily.rodriguez@dhcenter.org',
                rating: 4.9,
                reviewCount: 64,
                isPrimary: false,
                hasAccess: false,
                availability: [
                    { day: 'Monday', slots: ['1:00 PM', '2:00 PM', '3:00 PM'] },
                    { day: 'Wednesday', slots: ['9:00 AM', '10:00 AM', '11:00 AM'] },
                    { day: 'Thursday', slots: ['1:00 PM', '3:00 PM'] }
                ],
                avatar: '/images/doctors/doctor3.jpg',
                nextAvailable: addDays(new Date(), 3).toISOString()
            }
        ],
        pharmacists: [
            {
                id: 201,
                name: 'Lisa Thompson',
                pharmacy: 'HealthPlus Pharmacy',
                address: '123 Wellness Street, Cityville',
                phone: '(555) 765-4321',
                email: 'lisa.thompson@healthplus.com',
                rating: 4.7,
                reviewCount: 56,
                availability: [
                    { day: 'Monday', hours: '9:00 AM - 6:00 PM' },
                    { day: 'Tuesday', hours: '9:00 AM - 6:00 PM' },
                    { day: 'Wednesday', hours: '9:00 AM - 6:00 PM' },
                    { day: 'Thursday', hours: '9:00 AM - 6:00 PM' },
                    { day: 'Friday', hours: '9:00 AM - 6:00 PM' }
                ],
                avatar: '/images/pharmacists/pharmacist1.jpg'
            },
            {
                id: 202,
                name: 'Robert Garcia',
                pharmacy: 'MediQuick Pharmacy',
                address: '456 Quick Avenue, Westside',
                phone: '(555) 234-5678',
                email: 'robert.garcia@mediquick.com',
                rating: 4.5,
                reviewCount: 42,
                availability: [
                    { day: 'Monday', hours: '8:00 AM - 8:00 PM' },
                    { day: 'Tuesday', hours: '8:00 AM - 8:00 PM' },
                    { day: 'Wednesday', hours: '8:00 AM - 8:00 PM' },
                    { day: 'Thursday', hours: '8:00 AM - 8:00 PM' },
                    { day: 'Friday', hours: '8:00 AM - 8:00 PM' },
                    { day: 'Saturday', hours: '10:00 AM - 4:00 PM' }
                ],
                avatar: '/images/pharmacists/pharmacist2.jpg'
            }
        ]
    };
}

/**
 * Update doctor access permissions
 * @param {number} doctorId - The ID of the doctor to update access for
 * @param {boolean} hasAccess - Whether the doctor should have access to patient records
 * @returns {Promise<Object>} Success/failure response
 */
export async function updateDoctorAccess(doctorId, hasAccess) {
    try {
        const token = getAuthToken();
        if (!token) {
            console.warn('Authentication token not found, using mock doctor access update response');
            return getMockUpdateDoctorAccessResponse(doctorId, hasAccess);
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log('Updating doctor access:', doctorId, hasAccess);
        }

        const response = await fetch(`/api/medical-providers/${doctorId}/access`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ hasAccess })
        });

        if (process.env.NODE_ENV !== 'production') {
            console.log('Doctor access update response status:', response.status);
        }

        if (!response.ok) {
            if (response.status === 404) {
                console.warn('Doctor access endpoint not found (404), using mock response');
                return getMockUpdateDoctorAccessResponse(doctorId, hasAccess);
            }
            
            try {
                const errorData = await response.json();
                console.error(`API error: ${errorData.error || response.statusText}`);
                return {
                    success: false,
                    message: errorData.message || 'Failed to update doctor access',
                    error: errorData.error || response.statusText
                };
            } catch (jsonError) {
                console.error(`Failed to parse error response: ${jsonError.message}`);
                return {
                    success: false,
                    message: 'Failed to update doctor access',
                    error: 'Unknown error'
                };
            }
        }

        try {
            const data = await response.json();
            return data;
        } catch (jsonError) {
            console.error('Error parsing doctor access update response:', jsonError);
            return getMockUpdateDoctorAccessResponse(doctorId, hasAccess);
        }
    } catch (error) {
        console.error('Error updating doctor access:', error);
        return getMockUpdateDoctorAccessResponse(doctorId, hasAccess);
    }
}

/**
 * Generate a mock response for updating doctor access
 * @param {number} doctorId - The ID of the doctor
 * @param {boolean} hasAccess - The new access status
 * @returns {Object} A mock success response
 */
export function getMockUpdateDoctorAccessResponse(doctorId, hasAccess) {
    return {
        success: true,
        message: `Doctor access ${hasAccess ? 'granted' : 'revoked'} successfully (mock)`,
        doctorId: doctorId,
        hasAccess: hasAccess,
        updatedAt: new Date().toISOString()
    };
}

/**
 * Set a doctor as the primary care physician
 * @param {number} doctorId - The ID of the doctor to set as primary
 * @returns {Promise<Object>} Success/failure response
 */
export async function setPrimaryDoctor(doctorId) {
    try {
        const token = getAuthToken();
        if (!token) {
            console.warn('Authentication token not found, using mock set primary doctor response');
            return getMockSetPrimaryDoctorResponse(doctorId);
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log('Setting primary doctor:', doctorId);
        }

        const response = await fetch(`/api/patient/primary-doctor`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ doctorId })
        });

        if (process.env.NODE_ENV !== 'production') {
            console.log('Set primary doctor response status:', response.status);
        }

        if (!response.ok) {
            if (response.status === 404) {
                console.warn('Primary doctor endpoint not found (404), using mock response');
                return getMockSetPrimaryDoctorResponse(doctorId);
            }
            
            try {
                const errorData = await response.json();
                console.error(`API error: ${errorData.error || response.statusText}`);
                return {
                    success: false,
                    message: errorData.message || 'Failed to set primary doctor',
                    error: errorData.error || response.statusText
                };
            } catch (jsonError) {
                console.error(`Failed to parse error response: ${jsonError.message}`);
                return {
                    success: false,
                    message: 'Failed to set primary doctor',
                    error: 'Unknown error'
                };
            }
        }

        try {
            const data = await response.json();
            return data;
        } catch (jsonError) {
            console.error('Error parsing set primary doctor response:', jsonError);
            return getMockSetPrimaryDoctorResponse(doctorId);
        }
    } catch (error) {
        console.error('Error setting primary doctor:', error);
        return getMockSetPrimaryDoctorResponse(doctorId);
    }
}

/**
 * Generate a mock response for setting a primary doctor
 * @param {number} doctorId - The ID of the doctor
 * @returns {Object} A mock success response
 */
export function getMockSetPrimaryDoctorResponse(doctorId) {
    return {
        success: true,
        message: 'Primary doctor updated successfully (mock)',
        doctorId: doctorId,
        updatedAt: new Date().toISOString()
    };
}

/**
 * Request a consultation with a doctor
 * @param {number} doctorId - The ID of the doctor to request consultation with
 * @param {Object} consultationDetails - Details about the consultation request
 * @returns {Promise<Object>} Success/failure response
 */
export async function requestConsultation(doctorId, consultationDetails) {
    try {
        const token = getAuthToken();
        if (!token) {
            console.warn('Authentication token not found, using mock consultation request response');
            return getMockConsultationRequestResponse(doctorId, consultationDetails);
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log('Requesting consultation:', doctorId, consultationDetails);
        }

        const response = await fetch(`/api/consultations/request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                doctorId,
                ...consultationDetails
            })
        });

        if (process.env.NODE_ENV !== 'production') {
            console.log('Consultation request response status:', response.status);
        }

        if (!response.ok) {
            if (response.status === 404) {
                console.warn('Consultation request endpoint not found (404), using mock response');
                return getMockConsultationRequestResponse(doctorId, consultationDetails);
            }
            
            try {
                const errorData = await response.json();
                console.error(`API error: ${errorData.error || response.statusText}`);
                return {
                    success: false,
                    message: errorData.message || 'Failed to request consultation',
                    error: errorData.error || response.statusText
                };
            } catch (jsonError) {
                console.error(`Failed to parse error response: ${jsonError.message}`);
                return {
                    success: false,
                    message: 'Failed to request consultation',
                    error: 'Unknown error'
                };
            }
        }

        try {
            const data = await response.json();
            return data;
        } catch (jsonError) {
            console.error('Error parsing consultation request response:', jsonError);
            return getMockConsultationRequestResponse(doctorId, consultationDetails);
        }
    } catch (error) {
        console.error('Error requesting consultation:', error);
        return getMockConsultationRequestResponse(doctorId, consultationDetails);
    }
}

/**
 * Generate a mock response for requesting a consultation
 * @param {number} doctorId - The ID of the doctor
 * @param {Object} consultationDetails - Details about the consultation request
 * @returns {Object} A mock success response
 */
export function getMockConsultationRequestResponse(doctorId, consultationDetails) {
    const requestId = Date.now();
    return {
        success: true,
        message: 'Consultation request submitted successfully (mock)',
        requestId: requestId,
        doctorId: doctorId,
        details: consultationDetails,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
}

/**
 * Check medicine availability at nearby pharmacies
 * @param {string} medicineName - The name of the medicine to check
 * @returns {Promise<Array>} List of pharmacies with availability information
 */
export async function checkMedicineAvailability(medicineName) {
    try {
        const token = getAuthToken();
        if (!token) {
            console.warn('Authentication token not found, using mock medicine availability data');
            return getMockMedicineAvailability(medicineName);
        }

        if (process.env.NODE_ENV !== 'production') {
            console.log('Checking medicine availability:', medicineName);
        }

        const response = await fetch(`/api/pharmacies/medicine-availability?name=${encodeURIComponent(medicineName)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (process.env.NODE_ENV !== 'production') {
            console.log('Medicine availability response status:', response.status);
        }

        if (!response.ok) {
            if (response.status === 404) {
                console.warn('Medicine availability endpoint not found (404), using mock data');
                return getMockMedicineAvailability(medicineName);
            }
            
            try {
                const errorData = await response.json();
                console.error(`API error: ${errorData.error || response.statusText}`);
                return getMockMedicineAvailability(medicineName);
            } catch (jsonError) {
                console.error(`Failed to parse error response: ${jsonError.message}`);
                return getMockMedicineAvailability(medicineName);
            }
        }

        try {
            const data = await response.json();
            return data;
        } catch (jsonError) {
            console.error('Error parsing medicine availability response:', jsonError);
            return getMockMedicineAvailability(medicineName);
        }
    } catch (error) {
        console.error('Error checking medicine availability:', error);
        return getMockMedicineAvailability(medicineName);
    }
}

/**
 * Generate mock medicine availability data
 * @param {string} medicineName - The name of the medicine
 * @returns {Array} Mock pharmacy availability data
 */
export function getMockMedicineAvailability(medicineName) {
    return [
        {
            id: 501,
            name: 'City Pharmacy',
            address: '123 Main Street, Cityville',
            phone: '(555) 123-7890',
            distance: 0.8,
            available: true,
            price: 24.99,
            insuranceCovered: true,
            hours: '8:00 AM - 9:00 PM'
        },
        {
            id: 502,
            name: 'Westside Drugs',
            address: '456 West Avenue, Westside',
            phone: '(555) 456-7890',
            distance: 1.2,
            available: true,
            price: 22.50,
            insuranceCovered: true,
            hours: '9:00 AM - 8:00 PM'
        },
        {
            id: 503,
            name: 'Health Plus Pharmacy',
            address: '789 Health Boulevard, Eastside',
            phone: '(555) 789-0123',
            distance: 2.5,
            available: false,
            expectedRestock: addDays(new Date(), 2).toISOString(),
            hours: '8:00 AM - 10:00 PM'
        }
    ];
}
