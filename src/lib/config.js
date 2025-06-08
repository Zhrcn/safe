// API Configuration
export const API_BASE_URL = 'http://localhost:5001/api';

// Feature Flags
export const FEATURES = {
  ENABLE_APPOINTMENTS: true,
  ENABLE_MESSAGING: true,
  ENABLE_NOTIFICATIONS: true,
};

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'SAFE Health',
  APP_DESCRIPTION: 'Secure and Accessible Healthcare Platform',
  APP_VERSION: '1.0.0',
};

// Time Slots Configuration
export const TIME_SLOTS = {
  MORNING: {
    start: '09:00',
    end: '12:00',
    label: 'Morning (9:00 AM - 12:00 PM)',
  },
  AFTERNOON: {
    start: '13:00',
    end: '16:00',
    label: 'Afternoon (1:00 PM - 4:00 PM)',
  },
  EVENING: {
    start: '16:00',
    end: '19:00',
    label: 'Evening (4:00 PM - 7:00 PM)',
  },
};

// Appointment Configuration
export const APPOINTMENT_CONFIG = {
  MIN_ADVANCE_DAYS: 3,
  MAX_ADVANCE_DAYS: 30,
  DEFAULT_DURATION_MINUTES: 30,
  MAX_APPOINTMENTS_PER_DAY: 8,
};

// Notification Configuration
export const NOTIFICATION_CONFIG = {
  ENABLE_EMAIL: true,
  ENABLE_SMS: false,
  ENABLE_PUSH: true,
  REMINDER_HOURS_BEFORE: 24,
};

// Theme Configuration
export const THEME_CONFIG = {
  PRIMARY_COLOR: '#1976d2',
  SECONDARY_COLOR: '#dc004e',
  BACKGROUND_COLOR: '#f5f5f5',
  TEXT_COLOR: '#333333',
}; 