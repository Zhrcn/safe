export const APP_NAME = 'S.A.F.E';
export const APP_DESCRIPTION = 'Secure, Accessible, Fast, Efficient Medical Service Platform';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
export const JWT_TOKEN_KEY = 'safe_jwt_token';

export const ROLES = {
    DOCTOR: 'doctor',
    PATIENT: 'patient',
    PHARMACIST: 'pharmacist',
    ADMIN: 'admin',
    DISTRIBUTOR: 'distributor',
};

export const GLOBAL_ROUTES = {
    settings: '/settings',
};

export const ROLE_ROUTES = {
    doctor: {
        dashboard: '/doctor/dashboard',
        patients: '/doctor/patients',
        appointments: '/doctor/appointments',
        prescriptions: '/doctor/prescriptions',
        settings: '/settings',
    },
    patient: {
        dashboard: '/patient/dashboard',
        appointments: '/patient/appointments',
        prescriptions: '/patient/prescriptions',
        records: '/patient/records',
        settings: '/settings',
    },
    pharmacist: {
        dashboard: '/pharmacist/dashboard',
        prescriptions: '/pharmacist/prescriptions',
        inventory: '/pharmacist/inventory',
        settings: '/settings',
    },
    admin: {
        dashboard: '/admin/dashboard',
        users: '/admin/users',
        settings: '/settings',
    },
    distributor: {
        dashboard: '/distributor/dashboard',
        settings: '/settings',
    },
};
