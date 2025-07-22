import axiosInstance from '../axiosInstance';

export const doctorAppointmentsApi = {
  getDoctorAppointments: async () => {
    try {
      const res = await axiosInstance.get('/doctors/appointments');
      return res;
    } catch (error) {
      throw error;
    }
  },

  getAppointmentDetails: async (appointmentId) => {
    try {
      const res = await axiosInstance.get(`/doctors/appointments/${appointmentId}`);
      return res;
    } catch (error) {
      throw error;
    }
  },

  acceptAppointment: async (appointmentId, appointmentData) => {
    try {
      const res = await axiosInstance.patch(`/doctors/appointments/${appointmentId}/accept`, appointmentData);
      return res;
    } catch (error) {
      console.error('API: Accept error', error);
      throw error;
    }
  },

  rejectAppointment: async (appointmentId, doctorNotes) => {
    try {
      const res = await axiosInstance.patch(`/doctors/appointments/${appointmentId}/reject`, { doctorNotes });
      return res;
    } catch (error) {
      console.error('API: Reject error', error);
      throw error;
    }
  },

  updateAppointment: async (appointmentId, appointmentData) => {
    try {
      const res = await axiosInstance.patch(`/doctors/appointments/${appointmentId}`, appointmentData);
      return res;
    } catch (error) {
      throw error;
    }
  },

  handleRescheduleRequest: async (appointmentId, action, data = {}) => {
    try {
      const res = await axiosInstance.post(`/doctors/appointments/${appointmentId}/reschedule-request`, {
        action,
        ...data
      });
      return res;
    } catch (error) {
      console.error('API: Handle reschedule request error', error);
      throw error;
    }
  },

  createAppointment: async (appointmentData) => {
    console.log('[API] doctorAppointmentsApi.createAppointment called', appointmentData);
    const res = await axiosInstance.post('/doctors/appointments', appointmentData);
    return res.data.data;
  }
};

export const getDoctorAppointments = async () => {
  console.log('getDoctorAppointments called - making API request to /appointments');
  try {
    const res = await axiosInstance.get('/appointments');
    console.log('getDoctorAppointments response:', res);
    return res.data.data || res.data;
  } catch (error) {
    console.error('getDoctorAppointments error:', error);
    throw error;
  }
};

export const getAppointmentById = async (id) => {
  const res = await axiosInstance.get(`/appointments/${id}`);
  return res.data.data;
};

export const createAppointment = async (appointmentData) => {
  const res = await axiosInstance.post('/doctors/appointments', appointmentData);
  return res.data.data;
};

export const updateAppointment = async (id, appointmentData) => {
  const res = await axiosInstance.put(`/appointments/${id}`, appointmentData);
  return res.data.data;
};

export const deleteAppointment = async (id) => {
  const res = await axiosInstance.delete(`/appointments/${id}`);
  return res.data.data;
};

export const cancelAppointment = async (appointmentId, reason) => {
  const res = await axiosInstance.post(`/appointments/${appointmentId}/cancel`, { reason });
  return res.data.data;
};

export const completeAppointment = async (appointmentId, notes) => {
  const res = await axiosInstance.post(`/appointments/${appointmentId}/complete`, { notes });
  return res.data.data;
};

export const rescheduleAppointment = async (appointmentId, newDate, newTime) => {
  const res = await axiosInstance.post(`/appointments/${appointmentId}/reschedule`, { 
    date: newDate, 
    time: newTime 
  });
  return res.data.data;
};

export const handleRescheduleRequest = async (appointmentId, action, data = {}) => {
  const res = await axiosInstance.post(`/doctors/appointments/${appointmentId}/reschedule-request`, {
    action,
    ...data
  });
  return res.data.data;
};

export const getAvailableTimeSlots = async (doctorId, date) => {
  const res = await axiosInstance.get('/available-slots', { params: { doctorId, date } });
  return res.data.data;
}; 