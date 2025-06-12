import { api } from '../api';

export const consultationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getConsultations: builder.query({
      query: () => ({
        url: '/consultations',
        method: 'GET',
      }),
    }),
    createConsultation: builder.mutation({
      query: (data) => ({
        url: '/consultations',
        method: 'POST',
        body: data,
      }),
    }),
    updateConsultation: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/consultations/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetConsultationsQuery,
  useCreateConsultationMutation,
  useUpdateConsultationMutation,
} = consultationApi; 