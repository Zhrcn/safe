import axios from 'axios';
import { API_BASE_URL } from '@/app-config';
import { jwtDecode } from 'jwt-decode';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('safe_auth_token');

            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    const currentTime = Date.now() / 1000;

                    if (decoded.exp && decoded.exp < currentTime) {
                        localStorage.removeItem('safe_auth_token');
                        localStorage.removeItem('safe_user_data');

                        if (window.location.pathname !== '/' &&
                            !window.location.pathname.includes('/login') &&
                            !window.location.pathname.includes('/register')) {
                            window.location.href = '/login';
                        }
                    } else {
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

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('safe_auth_token');
                localStorage.removeItem('safe_user_data');

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

export const authApi = {
    login: (email, password, role) =>
        api.post('/auth/login', { email, password, role }),

    register: (userData) => {
        console.log('Sending registration data to API:', JSON.stringify(userData, null, 2));
        return api.post('/auth/register', userData);
    },
};

export const medicalFilesApi = {
    getPatientFile: (patientId) =>
        api.get(`/medicalfiles/${patientId}`),

    createMedicalFile: (data) =>
        api.post('/medical-file', data),

    updateMedicalFile: (data, patientId) =>
        api.patch(patientId ? `/medical-file?patientId=${patientId}` : '/medical-file', data),
};

export const appointmentsApi = {
    getAppointments: (params) =>
        api.get('/appointments', { params }),

    getAppointmentById: (id) =>
        api.get(`/appointments/${id}`),

    createAppointment: (data) =>
        api.post('/appointments', data),

    updateAppointmentDetails: (id, data) => 
        api.patch(`/appointments/${id}`, data),

    updateAppointmentStatus: (id, status) => 
        api.patch(`/appointments/${id}/status`, { status }),
};

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

export const notificationsApi = {
    // Get notifications for the logged-in user
    // params can include: page, limit, readStatus ('all', 'read', 'unread')
    getUserNotifications: (params) => 
        api.get('/notifications', { params }),

    // Mark a specific notification as read
    markNotificationAsRead: (notificationId) => 
        api.patch(`/notifications/${notificationId}/read`),

    // Mark all unread notifications as read for the logged-in user
    markAllNotificationsAsRead: () => 
        api.patch('/notifications/read-all'),
};

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