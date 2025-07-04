import { api } from '../api';
import axiosInstance from '../axiosInstance';

export const consultationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getConsultations: builder.query({
      query: () => ({
        url: '/consultations',
        method: 'GET',
      }),
      providesTags: ['Consultations'],
    }),
    getConsultationById: builder.query({
      query: (id) => ({
        url: `/consultations/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Consultations', id }],
    }),
    createConsultation: builder.mutation({
      query: (consultationData) => ({
        url: '/consultations',
        method: 'POST',
        body: consultationData,
      }),
      invalidatesTags: ['Consultations'],
    }),
    answerConsultation: builder.mutation({
      query: ({ id, answerData }) => ({
        url: `/consultations/${id}/answer`,
        method: 'POST',
        body: answerData,
      }),
      invalidatesTags: ['Consultations'],
    }),
  }),
});

export const {
  useGetConsultationsQuery,
  useGetConsultationByIdQuery,
  useCreateConsultationMutation,
  useAnswerConsultationMutation,
} = consultationsApi;

export const createConsultation = async (consultationData) => {
  const res = await axiosInstance.post('/consultations', consultationData);
  return res.data.data;
};

export const updateConsultation = async (id, consultationData) => {
  const res = await axiosInstance.put(`/consultations/${id}`, consultationData);
  return res.data.data;
};

export const deleteConsultation = async (id) => {
  const res = await axiosInstance.delete(`/consultations/${id}`);
  return res.data.data;
};

export const getDoctorConsultations = async () => {
  const res = await axiosInstance.get('/consultations/doctor');
  return res.data.data;
};

export const answerConsultation = async (consultationId, answer) => {
  const res = await axiosInstance.put(`/consultations/${consultationId}`, { answer });
  return res.data.data;
};

export const getConsultationMessages = async (consultationId) => {
  const res = await axiosInstance.get(`/consultations/${consultationId}/messages`);
  return res.data.data;
};

export const getPatientConsultations = async (patientId) => {
  const res = await axiosInstance.get(`/consultations/patient/${patientId}`);
  return res.data.data;
}; 