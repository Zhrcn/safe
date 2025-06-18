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
            query: () => '/',
            providesTags: ['Consultations'],
        }),
        getConsultationDetails: builder.query({
            query: (consultationId) => `/${consultationId}`,
            providesTags: (result, error, consultationId) => [{ type: 'ConsultationDetails', id: consultationId }],
        }),
        createConsultation: builder.mutation({
            query: (consultationData) => ({
                url: '/',
                method: 'POST',
                body: consultationData,
            }),
            invalidatesTags: ['Consultations'],
        }),
        updateConsultation: builder.mutation({
            query: ({ consultationId, consultationData }) => ({
                url: `/${consultationId}`,
                method: 'PUT',
                body: consultationData,
            }),
            invalidatesTags: (result, error, { consultationId }) => [
                { type: 'ConsultationDetails', id: consultationId },
                'Consultations'
            ],
        }),
        addNote: builder.mutation({
            query: ({ consultationId, note }) => ({
                url: `/${consultationId}/notes`,
                method: 'POST',
                body: { note },
            }),
            invalidatesTags: (result, error, { consultationId }) => [
                { type: 'ConsultationDetails', id: consultationId }
            ],
        }),
        addAttachment: builder.mutation({
            query: ({ consultationId, attachment }) => {
                const formData = new FormData();
                formData.append('attachment', attachment);
                return {
                    url: `/${consultationId}/attachments`,
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: (result, error, { consultationId }) => [
                { type: 'ConsultationDetails', id: consultationId }
            ],
        }),
        getConsultationsByPatient: builder.query({
            query: (patientId) => `/patient/${patientId}`,
            providesTags: ['Consultations'],
        }),
        getConsultationsByDate: builder.query({
            query: (date) => `/date/${date}`,
            providesTags: ['Consultations'],
        }),
        getConsultationNotes: builder.query({
            query: (consultationId) => `/${consultationId}/notes`,
            providesTags: (result, error, consultationId) => [{ type: 'ConsultationDetails', id: consultationId }],
        }),
        getConsultationAttachments: builder.query({
            query: (consultationId) => `/${consultationId}/attachments`,
            providesTags: (result, error, consultationId) => [{ type: 'ConsultationDetails', id: consultationId }],
        }),
    }),
});
export const {
    useGetConsultationsQuery,
    useGetConsultationDetailsQuery,
    useCreateConsultationMutation,
    useUpdateConsultationMutation,
    useAddNoteMutation,
    useAddAttachmentMutation,
    useGetConsultationsByPatientQuery,
    useGetConsultationsByDateQuery,
    useGetConsultationNotesQuery,
    useGetConsultationAttachmentsQuery,
} = consultationsApi; 