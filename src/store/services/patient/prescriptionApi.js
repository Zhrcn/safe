import axiosInstance from '../axiosInstance';

export const getPrescriptions = async () => {
  const res = await axiosInstance.get('/prescriptions');
  return res.data.data;
};

export const getActivePrescriptions = async () => {
  const res = await axiosInstance.get('/prescriptions/active');
  return res.data.data;
};

export const getPrescriptionById = async (id) => {
  const res = await axiosInstance.get(`/prescriptions/${id}`);
  return res.data.data;
};

export const addPrescription = async (prescription) => {
  const res = await axiosInstance.post('/prescriptions', prescription);
  return res.data.data;
};

export const updatePrescription = async (id, prescription) => {
  const res = await axiosInstance.put(`/prescriptions/${id}`, prescription);
  return res.data.data;
};

export const deletePrescription = async (id) => {
  const res = await axiosInstance.delete(`/prescriptions/${id}`);
  return res.data.data;
}; 