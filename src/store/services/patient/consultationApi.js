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
      query: ({ doctorId, question }) => ({
        url: '/consultations',
        method: 'POST',
        body: { doctorId, question },
      }),
    }),
    answerConsultation: builder.mutation({
      query: ({ id, answer }) => ({
        url: `/consultations/${id}`,
        method: 'PUT',
        body: { answer },
      }),
    }),
  }),
});
export const {
  useGetConsultationsQuery,
  useCreateConsultationMutation,
  useAnswerConsultationMutation,
} = consultationApi; 