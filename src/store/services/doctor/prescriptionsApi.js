import axiosInstance from '../axiosInstance';

export const getPrescriptions = async () => {
  const res = await axiosInstance.get('/prescriptions');
  return res.data.data;
};

export const getPrescriptionById = async (id) => {
  const res = await axiosInstance.get(`/prescriptions/${id}`);
  return res.data.data;
};

export const createPrescription = async (prescriptionData) => {
  const res = await axiosInstance.post('/prescriptions', prescriptionData);
  return res.data.data;
};

export const updatePrescription = async (id, prescriptionData) => {
  const res = await axiosInstance.put(`/prescriptions/${id}`, prescriptionData);
  return res.data.data;
};

export const deletePrescription = async (id) => {
  const res = await axiosInstance.delete(`/prescriptions/${id}`);
  return res.data.data;
};

export const addMedication = async (prescriptionId, medication) => {
  const res = await axiosInstance.post(`/prescriptions/${prescriptionId}/medications`, medication);
  return res.data.data;
};

export const removeMedication = async (prescriptionId, medicationId) => {
  const res = await axiosInstance.delete(`/prescriptions/${prescriptionId}/medications/${medicationId}`);
  return res.data.data;
};

export const renewPrescription = async (prescriptionId, renewalData) => {
  const res = await axiosInstance.post(`/prescriptions/${prescriptionId}/renew`, renewalData);
  return res.data.data;
};

export const getPrescriptionsByPatient = async (patientId) => {
  const res = await axiosInstance.get(`/patient/${patientId}`);
  return res.data.data;
};

export const getPrescriptionsByDate = async (date) => {
  const res = await axiosInstance.get(`/date/${date}`);
  return res.data.data;
};

export const getPrescriptionMedications = async (prescriptionId) => {
  const res = await axiosInstance.get(`/prescriptions/${prescriptionId}/medications`);
  return res.data.data;
};

export const getPrescriptionHistory = async (prescriptionId) => {
  const res = await axiosInstance.get(`/prescriptions/${prescriptionId}/history`);
  return res.data.data;
}; 