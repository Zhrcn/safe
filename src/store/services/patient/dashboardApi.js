import axiosInstance from '../axiosInstance';

export const getDashboardSummary = async () => {
  const res = await axiosInstance.get('/patients/dashboard/summary');
  return res.data.data;
};

export const getUpcomingAppointments = async () => {
  const res = await axiosInstance.get('/patients/appointments');
  return res.data.data;
};

export const getActiveMedications = async () => {
  const res = await axiosInstance.get('/patients/medications');
  return res.data.data;
};

export const getMedicalFile = async () => {
  const res = await axiosInstance.get('/patients/medical-file');
  return res.data.data;
};

export const getRecentLabResults = async () => {
  const res = await axiosInstance.get('/patients/lab-results/recent');
  return res.data.data;
};

export const getVitalSigns = async () => {
  const res = await axiosInstance.get('/patients/vitals/latest');
  return res.data.data;
};

export const getChronicConditions = async () => {
  const res = await axiosInstance.get('/patients/medical-file');
  return res.data.data?.chronicConditions || [];
};

export const getAllergies = async () => {
  const res = await axiosInstance.get('/patients/medical-file');
  return res.data.data?.allergies || [];
};

export const getRecentMessages = async () => {
  const res = await axiosInstance.get('/patients/messages');
  return res.data.data;
};

export const getRecentConsultations = async () => {
  const res = await axiosInstance.get('/patients/consultations');
  return res.data.data;
}; 