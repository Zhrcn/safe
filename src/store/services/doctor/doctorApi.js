import { api } from '../api';

export const doctorApi = api.injectEndpoints({
  tagTypes: ['Doctors', 'Patients'],
  endpoints: (builder) => ({
    getDoctors: builder.query({
      query: () => ({
        url: '/patients/doctors',
        method: 'GET',
      }),
      providesTags: ['Doctors'],
    }),
    getDoctorById: builder.query({
      query: (id) => ({
        url: `/doctors/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Doctors', id }],
    }),
    getPatientDetails: builder.query({
      query: (id) => ({
        url: `/patients/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Patients', id }],
    }),
  }),
});

export const {
  useGetDoctorsQuery,
  useGetDoctorByIdQuery,
  useGetPatientDetailsQuery,
} = doctorApi;

export const createDoctor = async (doctorData) => {
  const res = await axiosInstance.post('/doctors', doctorData);
  return res.data.data;
};

export const updateDoctor = async (id, doctorData) => {
  const res = await axiosInstance.put(`/doctors/${id}`, doctorData);
  return res.data.data;
};

export const deleteDoctor = async (id) => {
  const res = await axiosInstance.delete(`/doctors/${id}`);
  return res.data.data;
};
