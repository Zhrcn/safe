import axiosInstance from '../axiosInstance';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const medicineApi = createApi({
  reducerPath: 'medicineApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
      : 'http://localhost:5001/api/v1',
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
      query: () => 'medicine-requests',
      providesTags: ['MedicineRequest'],
    }),
    createRequest: builder.mutation({
      query: (request) => ({
        url: 'medicine-requests',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['MedicineRequest'],
    }),
    deleteRequest: builder.mutation({
      query: (id) => ({
        url: `medicine-requests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MedicineRequest'],
    }),
    respondToRequest: builder.mutation({
      query: ({ id, available, message }) => ({
        url: `medicine-requests/${id}/respond`,
        method: 'PATCH',
        body: { available, message },
      }),
      invalidatesTags: ['MedicineRequest'],
    }),
    getPharmacyRequests: builder.query({
      query: () => 'medicine-requests/pharmacy',
      providesTags: ['MedicineRequest'],
    }),
  }),
});

export const { useGetRequestsQuery, useCreateRequestMutation, useDeleteRequestMutation, useRespondToRequestMutation, useGetPharmacyRequestsQuery } = medicineApi;

export const getMedicines = async () => {
  const res = await axiosInstance.get('/medicines');
  return res.data;
};

export const addMedicine = async (newMedicine) => {
  const res = await axiosInstance.post('/medicines', newMedicine);
  return res.data;
}; 