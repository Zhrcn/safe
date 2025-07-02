import { api } from '../api';
import axiosInstance from '../axiosInstance';

export const patientApi = api.injectEndpoints({
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
} = patientApi;

export const getProfile = async () => {
  const res = await axiosInstance.get('/patients/profile');
  return res.data.data;
};

export const updateProfile = async (profileData) => {
  const res = await axiosInstance.put('/patients/profile', profileData);
  return res.data.data;
};
