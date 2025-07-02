import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const medicineApi = createApi({
  reducerPath: 'medicineApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5001/api/v1/doctor/medicine',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Medicines'],
  endpoints: (builder) => ({
    getMedicines: builder.query({
      query: () => '/',
      providesTags: (result = [], error, arg) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Medicines', id: _id })),
              { type: 'Medicines', id: 'LIST' },
            ]
          : [{ type: 'Medicines', id: 'LIST' }],
    }),
    addMedicine: builder.mutation({
      query: (newMedicine) => ({
        url: '/',
        method: 'POST',
        body: newMedicine,
      }),
      invalidatesTags: [{ type: 'Medicines', id: 'LIST' }],
    }),
  }),
});

export const { useGetMedicinesQuery, useAddMedicineMutation } = medicineApi; 