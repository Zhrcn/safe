const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const config = {
  API_BASE_URL,
};

export default config;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/v1/login',
    REGISTER: '/auth/v1/register',
    LOGOUT: '/auth/v1/logout',
    REFRESH: '/auth/v1/refresh',
    VERIFY: '/auth/v1/verify',
    ME: '/auth/v1/me',
  },
  USER: {
    PROFILE: '/users/profile',
    UPDATE: '/users/update',
  },
  DOCTOR: {
    PROFILE: '/doctors/profile',
    PATIENTS: '/doctors/patients',
    APPOINTMENTS: '/doctors/appointments',
    CONSULTATIONS: '/doctors/consultations',
  },
  PATIENT: {
    PROFILE: '/patients/profile',
    APPOINTMENTS: '/patients/appointments',
    PRESCRIPTIONS: '/patients/prescriptions',
    CONSULTATIONS: '/patients/consultations',
    MEDICAL_FILE: '/patients/medical-file',
  },
};
export const ROLES = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  PATIENT: 'PATIENT',
  PHARMACIST: 'PHARMACIST'
};
export const AUTH_CONSTANTS = {
  API_ENDPOINTS: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    LOGOUT: '/api/v1/auth/logout',
    VERIFY: '/api/v1/auth/verify',
    CURRENT_USER: '/api/v1/auth/me',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
    UPDATE_PASSWORD: '/api/v1/auth/update-password',
  },
  TOKEN_KEY: 'safe_auth_token',
  REFRESH_TOKEN_KEY: 'safe_refresh_token',
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000,
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  ERROR_MESSAGES: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    ACCOUNT_LOCKED: 'Account is locked. Please try again later',
    TOKEN_EXPIRED: 'Session expired. Please log in again',
    INVALID_TOKEN: 'Invalid token',
    NETWORK_ERROR: 'Network error. Please check your connection',
    SERVER_ERROR: 'Server error. Please try again later',
    VALIDATION_ERROR: 'Please check your input',
  },
  SUCCESS_MESSAGES: {
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    REGISTER_SUCCESS: 'Registration successful',
    PASSWORD_RESET_SUCCESS: 'Password reset successful',
    EMAIL_VERIFIED: 'Email verified successfully',
  },
};
export const DOCTOR_CONSTANTS = {
  STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending',
  },
  SPECIALIZATION: {
    GENERAL_PRACTITIONER: 'general_practitioner',
    CARDIOLOGIST: 'cardiologist',
    DERMATOLOGIST: 'dermatologist',
    NEUROLOGIST: 'neurologist',
    PEDIATRICIAN: 'pediatrician',
    PSYCHIATRIST: 'psychiatrist',
    OTHER: 'other',
  },
  APPOINTMENT_TYPES: {
    CONSULTATION: 'consultation',
    FOLLOW_UP: 'follow_up',
    EMERGENCY: 'emergency',
    ROUTINE: 'routine',
  },
  CONSULTATION_TYPES: {
    IN_PERSON: 'in_person',
    VIDEO: 'video',
    PHONE: 'phone',
  },
};
export const PATIENT_CONSTANTS = {
  STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
  },
  BLOOD_TYPES: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  GENDER: {
    MALE: 'male',
    FEMALE: 'female',
    OTHER: 'other',
  },
};
export const APPOINTMENT_CONSTANTS = {
  STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed',
    RESCHEDULED: 'rescheduled',
  },
  DURATION: {
    SHORT: 15, 
    MEDIUM: 30,
    LONG: 60,
  },
};
export const PRESCRIPTION_CONSTANTS = {
  STATUS: {
    ACTIVE: 'active',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  },
  FREQUENCY: {
    DAILY: 'daily',
    TWICE_DAILY: 'twice_daily',
    THREE_TIMES_DAILY: 'three_times_daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    AS_NEEDED: 'as_needed',
  },
};
export const CONSULTATION_CONSTANTS = {
  STATUS: {
    PENDING: 'pending',
    SCHEDULED: 'scheduled',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  },
  TYPE: {
    INITIAL: 'initial',
    FOLLOW_UP: 'follow_up',
    EMERGENCY: 'emergency',
  },
};
export const NOTIFICATION_CONSTANTS = {
  TYPES: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
  },
  DURATION: {
    SHORT: 3000,
    MEDIUM: 5000,
    LONG: 8000,
  },
}; 