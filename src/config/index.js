export * from './app';
export * from './api';
export * from './appointments';
export * from './notifications';
export * from './constants';
export const CONFIG = {
  API: {
    BASE_URL: 'http://localhost:5001',
  },
  APP: {
    NAME: 'SAFE Health',
    VERSION: '1.0.0'
  },
  FEATURES: {
    ENABLE_APPOINTMENTS: true,
    ENABLE_MESSAGING: true,
    ENABLE_NOTIFICATIONS: true
  }
}; 