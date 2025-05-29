import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Create an axios instance with baseURL
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include auth token in requests
api.interceptors.request.use(
    (config) => {
        // Get the token from localStorage (only in browser)
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('safe_auth_token');

            if (token) {
                // Check if token is expired
                try {
                    const decoded = jwtDecode(token);
                    const currentTime = Date.now() / 1000;

                    if (decoded.exp && decoded.exp < currentTime) {
                        // Token is expired, remove it
                        localStorage.removeItem('safe_auth_token');
                        localStorage.removeItem('safe_user_data');

                        // Redirect to login if needed
                        if (window.location.pathname !== '/' &&
                            !window.location.pathname.includes('/login') &&
                            !window.location.pathname.includes('/register')) {
                            window.location.href = '/login';
                        }
                    } else {
                        // Token is valid, add it to headers
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                } catch (error) {
                    console.error('Error decoding token:', error);
                    localStorage.removeItem('safe_auth_token');
                    localStorage.removeItem('safe_user_data');
                }
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle authentication errors
        if (error.response && error.response.status === 401) {
            // Clear auth data
            if (typeof window !== 'undefined') {
                localStorage.removeItem('safe_auth_token');
                localStorage.removeItem('safe_user_data');

                // Redirect to login
                if (window.location.pathname !== '/' &&
                    !window.location.pathname.includes('/login') &&
                    !window.location.pathname.includes('/register')) {
                    window.location.href = '/login';
                }
            }
        }

        return Promise.reject(error);
    }
);

// Auth API
export const authApi = {
    login: (email, password, role) =>
        api.post('/auth/login', { email, password, role }),

    register: (userData) => {
        console.log('Sending registration data to API:', JSON.stringify(userData, null, 2));
        return api.post('/auth/register', userData);
    },
};

// Medical Files API
export const medicalFilesApi = {
    getPatientFile: (patientId) =>
        api.get(patientId ? `/medical-file?patientId=${patientId}` : '/medical-file'),

    createMedicalFile: (data) =>
        api.post('/medical-file', data),

    updateMedicalFile: (data, patientId) =>
        api.patch(patientId ? `/medical-file?patientId=${patientId}` : '/medical-file', data),
};

// Appointments API
export const appointmentsApi = {
    getAppointments: (params) =>
        api.get('/appointments', { params }),

    getAppointmentById: (id) =>
        api.get(`/appointments/${id}`),

    createAppointment: (data) =>
        api.post('/appointments', data),

    updateAppointment: (id, data) =>
        api.patch(`/appointments/${id}`, data),

    cancelAppointment: (id, reason) =>
        api.patch(`/appointments/${id}`, { status: 'Cancelled', notes: { doctor: reason } }),
};

// Prescriptions API
export const prescriptionsApi = {
    getPrescriptions: (params) =>
        api.get('/prescriptions', { params }),

    getPrescriptionById: (id) =>
        api.get(`/prescriptions/${id}`),

    createPrescription: (data) =>
        api.post('/prescriptions', data),

    updatePrescription: (id, data) =>
        api.patch(`/prescriptions/${id}`, data),

    fillPrescription: (id, notes) =>
        api.patch(`/prescriptions/${id}`, { status: 'Filled', notes }),
};

// Users API
export const usersApi = {
    getDoctors: (params) =>
        api.get('/users/doctors', { params }),

    getPatients: (params) =>
        api.get('/users/patients', { params }),

    getUserById: (id) =>
        api.get(`/users/${id}`),

    updateUserProfile: (id, data) =>
        api.patch(`/users/${id}`, data),
};

export default api; 