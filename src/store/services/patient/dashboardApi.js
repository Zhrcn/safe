import { api } from '../api';

export const dashboardApi = {
  getDashboardSummary: () => api.get('/dashboard'),
  getUpcomingAppointments: () => api.get('/dashboard/appointments'),
  getRecentMedications: () => api.get('/dashboard/medications'),
  getHealthMetrics: () => api.get('/dashboard/health-metrics'),
}; 