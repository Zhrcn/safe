import axiosInstance from '../axiosInstance';

// Get all medications for the authenticated patient
export const getMedications = async () => {
  const res = await axiosInstance.get('/medications');
  return res.data.data;
};

// Get a single medication by ID
export const getMedication = async (id) => {
  const res = await axiosInstance.get(`/medications/${id}`);
  return res.data.data;
};

// Create a new medication
export const createMedication = async (medicationData) => {
  const res = await axiosInstance.post('/medications', medicationData);
  return res.data.data;
};

// Alias for compatibility
export const addMedication = createMedication;

// Update a medication
export const updateMedication = async (id, medicationData) => {
  const res = await axiosInstance.put(`/medications/${id}`, medicationData);
  return res.data.data;
};

// Delete a medication
export const deleteMedication = async (id) => {
  const res = await axiosInstance.delete(`/medications/${id}`);
  return res.data;
};

// Update medication reminders
export const updateMedicationReminders = async (id, reminderData) => {
  const res = await axiosInstance.patch(`/medications/${id}/reminders`, reminderData);
  return res.data.data;
};

// Request medication refill
export const requestMedicationRefill = async (id) => {
  const res = await axiosInstance.post(`/medications/${id}/refill`);
  return res.data.data;
};

export const getActiveMedications = async () => {
  const res = await axiosInstance.get('/patients/medications/active');
  return res.data.data;
}; 