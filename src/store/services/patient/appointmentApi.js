import axiosInstance from '../axiosInstance';

export const getAppointments = async () => {
  const res = await axiosInstance.get('/patients/appointments');
  if (Array.isArray(res.data)) return res.data;
  if (res.data && Array.isArray(res.data.data)) return res.data.data;
  return [];
};

export const createAppointment = async (appointmentData) => {
  const res = await axiosInstance.post('/patients/appointments', appointmentData);
  return res.data.data;
};

export const updateAppointment = async (id, appointmentData) => {
  const res = await axiosInstance.put(`/patients/appointments/${id}`, appointmentData);
  return res.data.data;
};

export const deleteAppointment = async (id) => {
  const res = await axiosInstance.delete(`/patients/appointments/${id}`);
  return res.data.data;
};

export const scheduleAppointment = async (appointmentData) => {
  const res = await axiosInstance.post('/patients/appointments', appointmentData);
  return res.data.data;
};

export const requestReschedule = async (appointmentId, rescheduleData) => {
  console.log('Sending reschedule request:', { appointmentId, rescheduleData });
  const res = await axiosInstance.post(`/appointments/${appointmentId}/reschedule-request`, rescheduleData);
  return res.data.data;
};

export const cancelAppointment = async (appointmentId, reason) => {
  const res = await axiosInstance.post(`/patients/appointments/${appointmentId}/cancel`, { reason });
  return res.data.data;
};

export const getAvailableTimeSlots = async (doctorId, date) => {
  const res = await axiosInstance.get('/available-slots', { params: { doctorId, date } });
  return res.data.data;
};

export const appointmentApi = {
    getAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    scheduleAppointment,
    cancelAppointment,
    getAvailableTimeSlots,
}; 