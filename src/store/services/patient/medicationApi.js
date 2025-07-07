import axiosInstance from '../axiosInstance';

export const getMedications = async () => {
  const res = await axiosInstance.get('/medications');
  return res.data.data;
};

export const getMedication = async (id) => {
  const res = await axiosInstance.get(`/medications/${id}`);
  return res.data.data;
};

export const createMedication = async (medicationData) => {
  const res = await axiosInstance.post('/medications', medicationData);
  return res.data.data;
};

export const addMedication = createMedication;

export const updateMedication = async (id, medicationData) => {
  const res = await axiosInstance.put(`/medications/${id}`, medicationData);
  return res.data.data;
};

export const deleteMedication = async (id) => {
  const res = await axiosInstance.delete(`/medications/${id}`);
  return res.data;
};

export const updateMedicationReminders = async (id, reminderData) => {
  const res = await axiosInstance.patch(`/medications/${id}/reminders`, reminderData);
  return res.data.data;
};

export const requestMedicationRefill = async (id) => {
  const res = await axiosInstance.post(`/medications/${id}/refill`);
  return res.data.data;
};

export const getActiveMedications = async () => {
  const res = await axiosInstance.get('/patients/medications/active');
  return res.data.data;
}; 