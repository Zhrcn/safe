import axiosInstance from '../axiosInstance';

export const dashboardApi = {
  // Get comprehensive analytics data for analytics page
  getComprehensiveAnalytics: async () => {
    try {
      const res = await axiosInstance.get('/doctors/analytics/comprehensive');
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Get dashboard analytics data
  getDashboardAnalytics: async () => {
    try {
      const res = await axiosInstance.get('/doctors/dashboard/analytics');
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Get appointments for chart data
  getAppointmentsAnalytics: async (period = 'week') => {
    try {
      const res = await axiosInstance.get(`/doctors/appointments/analytics?period=${period}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Get patient distribution data
  getPatientDistribution: async () => {
    try {
      const res = await axiosInstance.get('/doctors/patients/distribution');
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Get recent appointments for calendar
  getRecentAppointments: async (limit = 10) => {
    try {
      const res = await axiosInstance.get(`/doctors/appointments/recent?limit=${limit}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Get appointments for specific date
  getAppointmentsByDate: async (date) => {
    try {
      const res = await axiosInstance.get(`/doctors/appointments/date/${date}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
}; 