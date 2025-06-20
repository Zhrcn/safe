import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const consultationsApi = createApi({
    reducerPath: 'consultationsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5001',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Consultations', 'ConsultationDetails'],
    endpoints: (builder) => ({
        getConsultations: builder.query({
            query: () => '/consultations',
            providesTags: ['Consultations'],
        }),
        getConsultationDetails: builder.query({
            query: (consultationId) => `/consultations/${consultationId}`,
            providesTags: (result, error, consultationId) => [{ type: 'ConsultationDetails', id: consultationId }],
        }),
        createConsultation: builder.mutation({
            query: ({ doctorId, question }) => ({
                url: '/consultations',
                method: 'POST',
                body: { doctorId, question },
            }),
            invalidatesTags: ['Consultations'],
        }),
        answerConsultation: builder.mutation({
            query: ({ consultationId, answer }) => ({
                url: `/consultations/${consultationId}`,
                method: 'PUT',
                body: { answer },
            }),
            invalidatesTags: (result, error, { consultationId }) => [
                { type: 'ConsultationDetails', id: consultationId },
                'Consultations'
            ],
        }),
    }),
});
export const {
    useGetConsultationsQuery,
    useGetConsultationDetailsQuery,
    useCreateConsultationMutation,
    useAnswerConsultationMutation,
} = consultationsApi; 