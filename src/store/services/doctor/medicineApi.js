import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import axiosInstance from '../axiosInstance';

// Base API using RTK Query
export const medicineApi = createApi({
  reducerPath: 'medicineApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Medicine', 'Request'],
  endpoints: (builder) => ({
    getMedicines: builder.query({
      query: () => '/doctor/medicine',
      providesTags: ['Medicine'],
    }),
    addMedicine: builder.mutation({
      query: (newMedicine) => ({
        url: '/doctor/medicine',
        method: 'POST',
        body: newMedicine,
      }),
      invalidatesTags: ['Medicine'],
    }),
    getRequests: builder.query({
      query: () => '/doctor/medicine/requests',
      providesTags: ['Request'],
    }),
    createRequest: builder.mutation({
      query: (requestData) => ({
        url: '/doctor/medicine/requests',
        method: 'POST',
        body: requestData,
      }),
      invalidatesTags: ['Request'],
    }),
  }),
});

// Export hooks
export const {
  useGetMedicinesQuery,
  useAddMedicineMutation,
  useGetRequestsQuery,
  useCreateRequestMutation,
} = medicineApi;

// Legacy exports for backward compatibility
export const getMedicines = async () => {
  const res = await axiosInstance.get('/doctor/medicine');
  return res.data.data;
};

export const addMedicine = async (newMedicine) => {
  const res = await axiosInstance.post('/doctor/medicine', newMedicine);
  return res.data.data;
}; 