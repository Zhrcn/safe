import { api } from '../api';
import axiosInstance from '../axiosInstance';

export const getPatients = async () => {
  const res = await axiosInstance.get('/patients');
  return res.data.data;
};

export const getPatientById = async (id) => {
  const res = await axiosInstance.get(`/patients/${id}`);
  return res.data.data;
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

export const patientsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPatients: builder.query({
      query: () => ({
        url: '/patients',
        method: 'GET',
      }),
      providesTags: ['Patients'],
    }),
    getPatientById: builder.query({
      query: (id) => ({
        url: `/patients/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Patients', id }],
    }),
  }),
});

export const {
  useGetPatientsQuery,
  useGetPatientByIdQuery,
} = patientsApi; 