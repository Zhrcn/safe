import { api } from '../api';

export const prescriptionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPrescriptions: builder.query({
      query: () => ({
        url: '/prescriptions',
        method: 'GET',
      }),
    }),
    getActivePrescriptions: builder.query({
      query: () => ({
        url: '/prescriptions/active',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetPrescriptionsQuery,
  useGetActivePrescriptionsQuery,
} = prescriptionApi; 