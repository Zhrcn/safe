import axiosInstance from '../axiosInstance';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const medicineApi = createApi({
  reducerPath: 'medicineApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token || localStorage.getItem('safe_auth_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['MedicineRequest'],
  endpoints: (builder) => ({
    getRequests: builder.query({
      query: () => '/doctor/medicine/requests',
      providesTags: ['MedicineRequest'],
    }),
    createRequest: builder.mutation({
      query: (request) => ({
        url: '/doctor/medicine/requests',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['MedicineRequest'],
    }),
  }),
});

export const { useGetRequestsQuery, useCreateRequestMutation } = medicineApi;

export const getMedicines = async () => {
  const res = await axiosInstance.get('/doctor/medicine');
  return res.data.data;
};

export const addMedicine = async (newMedicine) => {
  const res = await axiosInstance.post('/doctor/medicine', newMedicine);
  return res.data.data;
}; 