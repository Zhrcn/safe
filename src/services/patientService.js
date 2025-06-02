/**
 * @returns {Promise<Object>} 
 */
export async function getHealthMetrics() {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Authentication token not found');
        }

        const response = await fetch('/api/health-metrics', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch health metrics');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching health metrics:', error);
        throw error;
    }
}

/**
 * Get the patient's prescriptions
 * @returns {Promise<Array>} List of prescriptions
 */
export async function getPrescriptions() {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Authentication token not found');
        }

        const response = await fetch('/api/prescriptions', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            // Handle 404 or other non-JSON responses gracefully
            if (response.status === 404) {
                throw new Error('Prescriptions endpoint not found (404)');
            }
            
            // For other errors, try to parse JSON if possible
            try {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to fetch prescriptions: ${response.status}`);
            } catch (jsonError) {
                // If JSON parsing fails, throw a generic error with status code
                throw new Error(`Failed to fetch prescriptions: ${response.status}`);
            }
        }

        const data = await response.json();
        return data.prescriptions || [];
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        throw error;
    }
}

/**
 * Get all consultations for the current patient
 * @returns {Promise<Array>} Array of consultation objects
 */
export async function getConsultations() {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Authentication token not found');
        }

        const response = await fetch('/api/consultations', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            // Handle 404 or other non-JSON responses gracefully
            if (response.status === 404) {
                throw new Error('Consultations endpoint not found (404)');
            }
            
            // For other errors, try to parse JSON if possible
            try {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to fetch consultations: ${response.status}`);
            } catch (jsonError) {
                // If JSON parsing fails, throw a generic error with status code
                throw new Error(`Failed to fetch consultations: ${response.status}`);
            }
        }

        const data = await response.json();
        return data.consultations || [];
    } catch (error) {
        console.error('Error fetching consultations:', error);
        throw error;
    }
}

/**
 * @param {Object} appointment 
 * @returns {Promise<Object>} 
 */
export async function scheduleAppointment(appointment) {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Authentication token not found');
        }

        // Map time slot to actual time
        let appointmentTime;
        switch (appointment.timeSlot) {
            case 'morning':
                appointmentTime = '09:00 AM';
                break;
            case 'afternoon':
                appointmentTime = '01:00 PM';
                break;
            case 'evening':
                appointmentTime = '06:00 PM';
                break;
            default:
                appointmentTime = '09:00 AM';
        }

        // Prepare the appointment data for the API
        const appointmentData = {
            doctorId: appointment.doctorId,
            date: appointment.date,
            time: appointmentTime,
            reasonForVisit: appointment.reason,
            status: 'scheduled',
            type: 'regular'
        };

        const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(appointmentData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to schedule appointment');
        }

        return await response.json();
    } catch (error) {
        console.error('Error scheduling appointment:', error);
        throw error;
    }
}

/**
 * @param {number} id 
 * @param {string} reason - Optional reason for cancellation
 * @returns {Promise<Object>} 
 */
export async function cancelAppointment(id, reason = '') {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Authentication token not found');
        }

        const response = await fetch(`/api/appointments/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                status: 'Cancelled',
                notes: {
                    patient: reason || 'Cancelled by patient'
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to cancel appointment');
        }

        return await response.json();
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        throw error;
    }
}

/**
 * @param {number} id 
 * @param {Object} data 
 * @returns {Promise<Object>} 
 */
export async function updateAppointment(id, data) {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Authentication token not found');
        }

        // Map time slot to actual time if provided
        if (data.timeSlot) {
            let appointmentTime;
            switch (data.timeSlot) {
                case 'morning':
                    appointmentTime = '09:00 AM';
                    break;
                case 'afternoon':
                    appointmentTime = '01:00 PM';
                    break;
                case 'evening':
                    appointmentTime = '06:00 PM';
                    break;
                default:
                    appointmentTime = '09:00 AM';
            }
            data.time = appointmentTime;
            delete data.timeSlot;
        }

        // Prepare the update data
        const updateData = {
            ...data,
            reasonForVisit: data.reason || data.reasonForVisit
        };
        if (updateData.reason) delete updateData.reason;

        const response = await fetch(`/api/appointments/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updateData)
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
 * @param {string} type 
 * @returns {Promise<Object>} 
 */
export async function getMedicalProviders(type = 'all') {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Authentication token not found');
        }

        const response = await fetch('/api/medical-providers', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch medical providers');
        }

        const data = await response.json();
        return data.providers || {};
    } catch (error) {
        console.error('Error fetching medical providers:', error);
        throw error;
    }
}

/**
 * @param {number} doctorId 
 * @param {boolean} hasAccess 
 * @returns {Promise<Object>} 
 */
export async function updateDoctorAccess(doctorId, hasAccess) {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Authentication token not found');
        }

        const response = await fetch(`/api/doctors/${doctorId}/access`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ hasAccess })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update doctor access');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating doctor access:', error);
        throw error;
    }
}

/**
 * @param {number} doctorId 
 * @returns {Promise<Array>} 
 */
export async function setPrimaryDoctor(doctorId) {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Authentication token not found');
        }

        const response = await fetch(`/api/doctors/${doctorId}/primary`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to set primary doctor');
        }

        return await response.json();
    } catch (error) {
        console.error('Error setting primary doctor:', error);
        throw error;
    }
}

/**
 * @returns {Promise<Array>}
 */
export async function getConversations() {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Authentication token not found');
        }

        const response = await fetch('/api/conversations', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            // Handle 404 or other non-JSON responses gracefully
            if (response.status === 404) {
                throw new Error('Conversations endpoint not found (404)');
            }
            
            // For other errors, try to parse JSON if possible
            try {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to fetch conversations: ${response.status}`);
            } catch (jsonError) {
                // If JSON parsing fails, throw a generic error with status code
                throw new Error(`Failed to fetch conversations: ${response.status}`);
            }
        }

        const data = await response.json();
        return data.conversations || [];
    } catch (error) {
        console.error('Error fetching conversations:', error);
        throw error;
    }
}

/**
 * Get a specific conversation by ID
 * @param {number} id - The conversation ID
 * @returns {Promise<Object>} The conversation object
 */
export async function getConversation(id) {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Authentication token not found');
        }

        const response = await fetch(`/api/conversations/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            // Handle 404 or other non-JSON responses gracefully
            if (response.status === 404) {
                throw new Error(`Conversation endpoint not found (404) or conversation ${id} not found`);
            }
            
            // For other errors, try to parse JSON if possible
            try {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to fetch conversation: ${response.status}`);
            } catch (jsonError) {
                // If JSON parsing fails, throw a generic error with status code
                throw new Error(`Failed to fetch conversation: ${response.status}`);
            }
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching conversation ${id}:`, error);
        throw error;
    }
}

/**
 * @param {number} conversationId 
 * @param {string} content 
 * @returns {Promise<Object>} 
 */
export async function sendMessage(conversationId, content) {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Authentication token not found');
        }

        const response = await fetch(`/api/conversations/${conversationId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to send message');
        }

        return await response.json();
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}

/**
 * @param {string} medication 
 * @param {number} pharmacyId 
 * @returns {Promise<Object>} 
 */
export async function checkMedicineAvailability(medication, pharmacyId) {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Authentication token not found');
        }

        const response = await fetch(`/api/pharmacies/${pharmacyId}/medicines/${medication}/availability`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to check medicine availability');
        }

        return await response.json();
    } catch (error) {
        console.error('Error checking medicine availability:', error);
        throw error;
    }
}

/**
 * @param {number} doctorId 
 * @param {string} reason 
 * @param {string} preferredTime 
 * @param {Array} attachments - Optional array of attachment objects
 * @returns {Promise<Object>} 
 */
export async function requestConsultation(doctorId, reason, preferredTime, attachments = []) {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Authentication token not found');
        }

        // Map preferred time to API format
        let preferredResponseTime;
        switch (preferredTime) {
            case 'Within 24 hours':
                preferredResponseTime = 'urgent';
                break;
            case 'This week':
                preferredResponseTime = 'standard';
                break;
            case 'As soon as possible':
                preferredResponseTime = 'immediate';
                break;
            default:
                preferredResponseTime = 'standard';
        }

        const consultationData = {
            doctorId,
            reason,
            preferredResponseTime,
            attachments: attachments.map(file => ({
                name: file.name,
                type: file.type,
                size: file.size
            }))
        };

        const response = await fetch('/api/consultations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(consultationData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to request consultation');
        }

        return await response.json();
    } catch (error) {
        console.error('Error requesting consultation:', error);
        throw error;
    }
}

/**
 * @returns {Promise<Array>}
 */
export async function getMedicineReminders() {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Authentication token not found');
        }

        const response = await fetch('/api/medicine-reminders', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch medicine reminders');
        }

        const data = await response.json();
        return data.reminders || [];
    } catch (error) {
        console.error('Error fetching medicine reminders:', error);
        throw error;
    }
}

/**
 * @param {string} id 
 * @param {Object} data 
 * @returns {Promise<Object>} 
 */
export async function updateMedicineReminder(id, data) {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Authentication token not found');
        }

        const response = await fetch(`/api/medicine-reminders/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update medicine reminder');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating medicine reminder:', error);
        throw error;
    }
}

/**
 * @returns {Promise<Object>} Dashboard data for the patient dashboard
 */
export async function getPatientDashboardData() {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Authentication token not found');
        }

        const response = await fetch('/api/dashboard/patient', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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

/**
 * Get the patient's appointments
 * @returns {Promise<Array>} List of appointments
 */
export async function getAppointments() {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Authentication token not found');
        }

        const response = await fetch('/api/appointments', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            // Handle 404 or other non-JSON responses gracefully
            if (response.status === 404) {
                throw new Error('Appointments endpoint not found (404)');
            }
            
            // For other errors, try to parse JSON if possible
            try {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to fetch appointments: ${response.status}`);
            } catch (jsonError) {
                // If JSON parsing fails, throw a generic error with status code
                throw new Error(`Failed to fetch appointments: ${response.status}`);
            }
        }

        const data = await response.json();
        const appointmentsData = data.appointments;
        return Array.isArray(appointmentsData) ? appointmentsData : [];
    } catch (error) {
        console.error('Error fetching appointments:', error);
        throw error;
    }
}

/**
 * Get the patient's profile information
 * @returns {Promise<Object>} Patient profile data
 */
export async function getPatientProfile() {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Authentication token not found');
        }

        const response = await fetch('/api/patient/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            // Handle 404 or other non-JSON responses gracefully
            if (response.status === 404) {
                throw new Error('Patient profile endpoint not found (404)');
            }
            
            // For other errors, try to parse JSON if possible
            try {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to fetch patient profile: ${response.status}`);
            } catch (jsonError) {
                // If JSON parsing fails, throw a generic error with status code
                throw new Error(`Failed to fetch patient profile: ${response.status}`);
            }
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching patient profile:', error);
        throw error;
    }
}

/**
 * Update the patient's profile information
 * @param {Object} profileData - The updated profile data
 * @returns {Promise<Object>} Updated patient profile
 */
export async function updatePatientProfile(profileData) {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Authentication token not found');
        }

        const response = await fetch('/api/patient/profile', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(profileData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update patient profile');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating patient profile:', error);
        throw error;
    }
}

/**
 * Get the list of available doctors
 * @returns {Promise<Array>} List of doctors
 */
export async function getDoctors() {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Authentication token not found');
        }

        const response = await fetch('/api/doctors', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            // Handle 404 or other non-JSON responses gracefully
            if (response.status === 404) {
                throw new Error('Doctors endpoint not found (404)');
            }
            
            // For other errors, try to parse JSON if possible
            try {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to fetch doctors: ${response.status}`);
            } catch (jsonError) {
                // If JSON parsing fails, throw a generic error with status code
                throw new Error(`Failed to fetch doctors: ${response.status}`);
            }
        }

        const data = await response.json();
        return data.doctors || [];
    } catch (error) {
        console.error('Error fetching doctors:', error);
        throw error;
    }
}

/**
 * Utility function to get the authentication token with proper error handling for SSR context
 * @returns {string|null} The authentication token or null if not available
 */
function getAuthToken() {
    try {
        // Check if we're in a browser environment to avoid SSR issues
        if (typeof window !== 'undefined' && window.localStorage) {
            // Use the correct token storage key as defined in AuthContext.jsx
            return localStorage.getItem('safe_auth_token');
        }
        return null;
    } catch (error) {
        console.error('Error retrieving auth token:', error);
        return null;
    }
}