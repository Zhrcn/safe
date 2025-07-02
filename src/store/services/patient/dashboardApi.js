import axiosInstance from '../axiosInstance';

export const getDashboardSummary = async () => {
  const res = await axiosInstance.get('/dashboard/summary');
  return res.data.data;
};

export const getUpcomingAppointments = async () => {
  const res = await axiosInstance.get('/appointments/upcoming');
  return res.data.data;
};

export const getActiveMedications = async () => {
  const res = await axiosInstance.get('/patients/medications/active');
  return res.data.data;
};

export const getMedicalFile = async () => {
  const res = await axiosInstance.get('/medical-file');
  return res.data.data;
};

export const getRecentLabResults = async () => {
  const res = await axiosInstance.get('/lab-results/recent');
  return res.data.data;
};

export const getVitalSigns = async () => {
  const res = await axiosInstance.get('/vital-signs');
  return res.data.data;
};

export const getChronicConditions = async () => {
  const res = await axiosInstance.get('/chronic-conditions');
  return res.data.data;
};

export const getAllergies = async () => {
  const res = await axiosInstance.get('/allergies');
  return res.data.data;
};

export const getRecentMessages = async () => {
  const res = await axiosInstance.get('/messages/recent');
  return res.data.data;
};

export const getRecentConsultations = async () => {
  const res = await axiosInstance.get('/consultations/recent');
  return res.data.data;
}; 