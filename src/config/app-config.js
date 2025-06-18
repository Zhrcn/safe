export const APP_NAME = 'S.A.F.E';
export const APP_DESCRIPTION = 'Secure, Accessible, Fast, Efficient Medical Service Platform';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
export const JWT_TOKEN_KEY = 'safe_jwt_token';

export const ROLES = {
    DOCTOR: 'doctor',
    PATIENT: 'patient',
    PHARMACIST: 'pharmacist',
    ADMIN: 'admin',
};

export const ROLE_ROUTES = {
    doctor: {
        dashboard: '/doctor/dashboard',
        patients: '/doctor/patients',
        appointments: '/doctor/appointments',
        prescriptions: '/doctor/prescriptions',
    },
    patient: {
        dashboard: '/patient/dashboard',
        appointments: '/patient/appointments',
        prescriptions: '/patient/prescriptions',
        records: '/patient/records',
    },
    pharmacist: {
        dashboard: '/pharmacist/dashboard',
        prescriptions: '/pharmacist/prescriptions',
        inventory: '/pharmacist/inventory',
    },
    admin: {
        dashboard: '/admin/dashboard',
        users: '/admin/users',
        settings: '/admin/settings',
    },
};
