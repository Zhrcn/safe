import axiosInstance from '../axiosInstance';

export const dashboardApi = {
  getComprehensiveAnalytics: async () => {
    try {
      const res = await axiosInstance.get('/doctors/analytics/comprehensive');
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  getDashboardAnalytics: async () => {
    try {
      const res = await axiosInstance.get('/doctors/dashboard/analytics');
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  getAppointmentsAnalytics: async (period = 'week') => {
    try {
      const res = await axiosInstance.get(`/doctors/appointments/analytics?period=${period}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  getPatientDistribution: async () => {
    try {
      const res = await axiosInstance.get('/doctors/patients/distribution');
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  getRecentAppointments: async (limit = 10) => {
    try {
      const res = await axiosInstance.get(`/doctors/appointments/recent?limit=${limit}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  getAppointmentsByDate: async (date) => {
    try {
      const res = await axiosInstance.get(`/doctors/appointments/date/${date}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
}; 