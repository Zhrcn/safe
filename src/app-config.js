// Content from original config.js
export const APP_NAME = 'S.A.F.E';
export const APP_DESCRIPTION = 'Secure, Accessible, Fast, Efficient Medical Service Platform';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api/v1';

export const JWT_TOKEN_KEY = 'safe_jwt_token';

export const ROLES = {
    DOCTOR: 'doctor',
    PATIENT: 'patient',
    PHARMACIST: 'pharmacist',
    ADMIN: 'admin',
};

export const ROLE_ROUTES = {
    [ROLES.DOCTOR]: {
        dashboard: '/doctor/dashboard',
        patients: '/doctor/patients',
        appointments: '/doctor/appointments',
        prescriptions: '/doctor/prescriptions',
    },
    [ROLES.PATIENT]: {
        dashboard: '/patient/dashboard',
        appointments: '/patient/appointments',
        prescriptions: '/patient/prescriptions',
        records: '/patient/records',
    },
    [ROLES.PHARMACIST]: {
        dashboard: '/pharmacist/dashboard',
        prescriptions: '/pharmacist/prescriptions',
        inventory: '/pharmacist/inventory',
    },
    [ROLES.ADMIN]: {
        dashboard: '/admin/dashboard',
        users: '/admin/users',
        settings: '/admin/settings',
    },
};
