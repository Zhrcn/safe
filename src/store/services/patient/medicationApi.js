import axiosInstance from '../axiosInstance';

export const getMedications = async () => {
  const res = await axiosInstance.get('/patients/medications');
  return res.data.data;
};

export const addMedication = async (medicationData) => {
  const res = await axiosInstance.post('/patients/medications', medicationData);
  return res.data.data;
};

export const updateMedication = async (id, medicationData) => {
  const res = await axiosInstance.put(`/patients/medications/${id}`, medicationData);
  return res.data.data;
};

export const deleteMedication = async (id) => {
  const res = await axiosInstance.delete(`/patients/medications/${id}`);
  return res.data.data;
};

export const getActiveMedications = async () => {
  const res = await axiosInstance.get('/patients/medications/active');
  return res.data.data;
}; 