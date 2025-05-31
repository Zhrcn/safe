export const APP_NAME = 'S.A.F.E';
export const APP_DESCRIPTION = 'Secure, Accessible, Fast, Efficient Medical Service Platform';

// Use relative URL for API endpoints to work in any environment
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

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

export const THEME = {
    light: {
        primary: {
            main: '#2563eb',
            dark: '#1d4ed8',
            light: '#60a5fa',
        },
        secondary: {
            main: '#7c3aed',
            dark: '#6d28d9',
            light: '#a78bfa',
        },
        error: {
            main: '#dc2626',
            dark: '#b91c1c',
            light: '#f87171',
        },
        warning: {
            main: '#d97706',
            dark: '#b45309',
            light: '#fbbf24',
        },
        success: {
            main: '#059669',
            dark: '#047857',
            light: '#34d399',
        },
        background: {
            default: '#f9fafb',
            paper: '#ffffff',
        },
    },
    dark: {
        primary: {
            main: '#3b82f6',
            dark: '#2563eb',
            light: '#60a5fa',
        },
        secondary: {
            main: '#8b5cf6',
            dark: '#7c3aed',
            light: '#a78bfa',
        },
        error: {
            main: '#ef4444',
            dark: '#dc2626',
            light: '#f87171',
        },
        warning: {
            main: '#f59e0b',
            dark: '#d97706',
            light: '#fbbf24',
        },
        success: {
            main: '#10b981',
            dark: '#059669',
            light: '#34d399',
        },
        background: {
            default: '#111827',
            paper: '#1f2937',
        },
    },
}; 