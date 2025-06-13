import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { DOCTOR_CONSTANTS } from '@/config/constants';
import { getToken } from '@/utils/tokenUtils';
import { handleApiError } from '@/utils/errorHandling';

export const doctorApi = createApi({
    reducerPath: 'doctorApi',
    baseQuery: fetchBaseQuery({
        baseUrl: DOCTOR_CONSTANTS.API_BASE_URL,
        prepareHeaders: (headers) => {
            const token = getToken();
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Doctor', 'Patients', 'Appointments', 'Consultations', 'Prescriptions', 'Statistics'],
    endpoints: (builder) => ({
        // Profile
        getProfile: builder.query({
            query: () => ({
                url: DOCTOR_CONSTANTS.API_ENDPOINTS.PROFILE,
                method: 'GET',
            }),
            providesTags: ['Doctor'],
            transformErrorResponse: handleApiError,
        }),
        updateProfile: builder.mutation({
            query: (data) => ({
                url: DOCTOR_CONSTANTS.API_ENDPOINTS.PROFILE,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Doctor'],
            transformErrorResponse: handleApiError,
        }),

        // Patients
        getPatients: builder.query({
            query: () => '/patients',
            providesTags: ['Patients'],
            transformResponse: (response) => response.data
        }),
        getPatientDetails: builder.query({
            query: (patientId) => ({
                url: `${DOCTOR_CONSTANTS.API_ENDPOINTS.PATIENTS}/${patientId}`,
                method: 'GET',
            }),
            providesTags: ['Patients'],
            transformErrorResponse: handleApiError,
        }),

        // Appointments
        getAppointments: builder.query({
            query: () => '/appointments',
            providesTags: ['Appointments'],
            transformResponse: (response) => response.data
        }),
        getAppointmentsByPatient: builder.query({
            query: (patientId) => ({
                url: `${DOCTOR_CONSTANTS.API_ENDPOINTS.APPOINTMENTS}/patient/${patientId}`,
                method: 'GET',
            }),
            providesTags: ['Appointments'],
            transformErrorResponse: handleApiError,
        }),
        createAppointment: builder.mutation({
            query: (data) => ({
                url: DOCTOR_CONSTANTS.API_ENDPOINTS.APPOINTMENTS,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Appointments'],
            transformErrorResponse: handleApiError,
        }),
        updateAppointment: builder.mutation({
            query: ({ id, data }) => ({
                url: `${DOCTOR_CONSTANTS.API_ENDPOINTS.APPOINTMENTS}/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Appointments'],
            transformErrorResponse: handleApiError,
        }),
        cancelAppointment: builder.mutation({
            query: (id) => ({
                url: `${DOCTOR_CONSTANTS.API_ENDPOINTS.APPOINTMENTS}/${id}/cancel`,
                method: 'POST',
            }),
            invalidatesTags: ['Appointments'],
            transformErrorResponse: handleApiError,
        }),

        // Consultations
        getConsultations: builder.query({
            query: (params) => ({
                url: DOCTOR_CONSTANTS.API_ENDPOINTS.CONSULTATIONS,
                method: 'GET',
                params,
            }),
            providesTags: ['Consultations'],
            transformErrorResponse: handleApiError,
        }),
        getConsultationsByPatient: builder.query({
            query: (patientId) => ({
                url: `${DOCTOR_CONSTANTS.API_ENDPOINTS.CONSULTATIONS}/patient/${patientId}`,
                method: 'GET',
            }),
            providesTags: ['Consultations'],
            transformErrorResponse: handleApiError,
        }),
        createConsultation: builder.mutation({
            query: (data) => ({
                url: DOCTOR_CONSTANTS.API_ENDPOINTS.CONSULTATIONS,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Consultations'],
            transformErrorResponse: handleApiError,
        }),
        updateConsultation: builder.mutation({
            query: ({ id, data }) => ({
                url: `${DOCTOR_CONSTANTS.API_ENDPOINTS.CONSULTATIONS}/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Consultations'],
            transformErrorResponse: handleApiError,
        }),

        // Prescriptions
        getPrescriptions: builder.query({
            query: (params) => ({
                url: DOCTOR_CONSTANTS.API_ENDPOINTS.PRESCRIPTIONS,
                method: 'GET',
                params,
            }),
            providesTags: ['Prescriptions'],
            transformErrorResponse: handleApiError,
        }),
        createPrescription: builder.mutation({
            query: (data) => ({
                url: DOCTOR_CONSTANTS.API_ENDPOINTS.PRESCRIPTIONS,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Prescriptions'],
            transformErrorResponse: handleApiError,
        }),
        updatePrescription: builder.mutation({
            query: ({ id, data }) => ({
                url: `${DOCTOR_CONSTANTS.API_ENDPOINTS.PRESCRIPTIONS}/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Prescriptions'],
            transformErrorResponse: handleApiError,
        }),

        // Statistics
        getPatientStatistics: builder.query({
            query: () => '/statistics',
            providesTags: ['Statistics'],
            transformResponse: (response) => response.data
        }),
    }),
});

export const {
    useGetProfileQuery,
    useUpdateProfileMutation,
    useGetPatientsQuery,
    useGetPatientDetailsQuery,
    useGetAppointmentsQuery,
    useGetAppointmentsByPatientQuery,
    useCreateAppointmentMutation,
    useUpdateAppointmentMutation,
    useCancelAppointmentMutation,
    useGetConsultationsQuery,
    useGetConsultationsByPatientQuery,
    useCreateConsultationMutation,
    useUpdateConsultationMutation,
    useGetPrescriptionsQuery,
    useCreatePrescriptionMutation,
    useUpdatePrescriptionMutation,
    useGetPatientStatisticsQuery,
} = doctorApi;
