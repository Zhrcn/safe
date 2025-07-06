import axiosInstance from '../axiosInstance';

export const getPatients = async () => {
  console.log('getPatients called - making API request to /doctors/patients');
  console.log('Axios instance baseURL:', axiosInstance.defaults.baseURL);
  try {
    const res = await axiosInstance.get('/doctors/patients');
    console.log('getPatients response:', res);
    return res.data.data;
  } catch (error) {
    console.error('getPatients error:', error);
    throw error;
  }
};

export const getPatientById = async (id) => {
  console.log('getPatientById called with ID:', id);
  try {
    const res = await axiosInstance.get(`/doctors/patients/${id}`);
    return res.data.data;
  } catch (error) {
    console.error('getPatientById error:', error);
    throw error;
  }
};

export const createPatient = async (patientData) => {
  const res = await axiosInstance.post('/patients', patientData);
  return res.data.data;
};

export const updatePatient = async (id, patientData) => {
  const res = await axiosInstance.put(`/patients/${id}`, patientData);
  return res.data.data;
};

export const deletePatient = async (id) => {
  const res = await axiosInstance.delete(`/patients/${id}`);
  return res.data.data;
};

export const updatePatientNotes = async (patientId, notes) => {
  const res = await axiosInstance.put(`/patients/${patientId}/notes`, { notes });
  return res.data.data;
};

export const addToFavorites = async (patientId) => {
  const res = await axiosInstance.post(`/patients/${patientId}/favorite`);
  return res.data.data;
};

export const removeFromFavorites = async (patientId) => {
  const res = await axiosInstance.delete(`/patients/${patientId}/favorite`);
  return res.data.data;
};

export const getPatientMedicalHistory = async (patientId) => {
  const res = await axiosInstance.get(`/patients/${patientId}/medical-history`);
  return res.data.data;
};

export const getPatientAppointments = async (patientId) => {
  const res = await axiosInstance.get(`/patients/${patientId}/appointments`);
  return res.data.data;
};

export const getPatientPrescriptions = async (patientId) => {
  const res = await axiosInstance.get(`/patients/${patientId}/prescriptions`);
  return res.data.data;
};

export const getPatientConsultations = async (patientId) => {
  const res = await axiosInstance.get(`/patients/${patientId}/consultations`);
  return res.data.data;
};

export const searchPatients = async (searchTerm) => {
  const res = await axiosInstance.get(`/search?q=${searchTerm}`);
  return res.data.data;
}; 