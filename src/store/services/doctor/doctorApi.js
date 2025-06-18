import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { handleApiError } from '@/utils/errorHandling';
import { getToken } from '@/utils/tokenUtils';

const logRequest = (request) => {
    console.log('API Request:', {
        url: request.url,
        method: request.method,
        headers: request.headers,
        body: request.body
    });
};

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001',
    credentials: 'include',
    prepareHeaders: (headers) => {
        const token = getToken();
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        headers.set('Content-Type', 'application/json');
        headers.set('Accept', 'application/json');
        headers.set('Origin', 'http://localhost:3000');
        return headers;
    },
});

export const doctorApi = createApi({
    reducerPath: 'doctorApi',
    baseQuery,
    tagTypes: ['Doctor', 'Patients', 'Appointments', 'Consultations', 'Prescriptions', 'Statistics'],
    endpoints: (builder) => ({
        getProfile: builder.query({
            query: () => {
                const request = {
                    url: '/api/v1/doctors/profile',
                    method: 'GET'
                };
                logRequest(request);
                return request;
            },
            providesTags: ['Doctor'],
            transformErrorResponse: handleApiError,
        }),
        updateProfile: builder.mutation({
            query: (data) => {
                const request = {
                    url: '/api/v1/doctors/profile',
                    method: 'PUT',
                    body: data
                };
                logRequest(request);
                return request;
            },
            invalidatesTags: ['Doctor'],
            transformErrorResponse: handleApiError,
        }),
        getPatients: builder.query({
            query: () => {
                const request = {
                    url: '/api/v1/doctors/patients',
                    method: 'GET'
                };
                logRequest(request);
                return request;
            },
            providesTags: ['Patients'],
            transformResponse: (response) => response.data
        }),
        getPatientDetails: builder.query({
            query: (patientId) => {
                const request = {
                    url: `/api/v1/doctors/patients/${patientId}`,
                    method: 'GET'
                };
                logRequest(request);
                return request;
            },
            providesTags: ['Patients'],
            transformErrorResponse: handleApiError,
        }),
        getAppointments: builder.query({
            query: () => {
                const request = {
                    url: '/api/v1/doctors/appointments',
                    method: 'GET'
                };
                logRequest(request);
                return request;
            },
            providesTags: ['Appointments'],
            transformResponse: (response) => response.data
        }),
        getAppointmentsByPatient: builder.query({
            query: (patientId) => {
                const request = {
                    url: `/api/v1/doctors/appointments/patient/${patientId}`,
                    method: 'GET'
                };
                logRequest(request);
                return request;
            },
            providesTags: ['Appointments'],
            transformErrorResponse: handleApiError,
        }),
        createAppointment: builder.mutation({
            query: (data) => {
                const request = {
                    url: '/api/v1/doctors/appointments',
                    method: 'POST',
                    body: data
                };
                logRequest(request);
                return request;
            },
            invalidatesTags: ['Appointments'],
            transformErrorResponse: handleApiError,
        }),
        updateAppointment: builder.mutation({
            query: ({ id, data }) => {
                const request = {
                    url: `/api/v1/doctors/appointments/${id}`,
                    method: 'PUT',
                    body: data
                };
                logRequest(request);
                return request;
            },
            invalidatesTags: ['Appointments'],
            transformErrorResponse: handleApiError,
        }),
        cancelAppointment: builder.mutation({
            query: (id) => {
                const request = {
                    url: `/api/v1/doctors/appointments/${id}/cancel`,
                    method: 'POST'
                };
                logRequest(request);
                return request;
            },
            invalidatesTags: ['Appointments'],
            transformErrorResponse: handleApiError,
        }),
        getConsultations: builder.query({
            query: (params) => {
                const request = {
                    url: '/api/v1/doctors/consultations',
                    method: 'GET',
                    params
                };
                logRequest(request);
                return request;
            },
            providesTags: ['Consultations'],
            transformErrorResponse: handleApiError,
        }),
        getConsultationsByPatient: builder.query({
            query: (patientId) => {
                const request = {
                    url: `/api/v1/doctors/consultations/patient/${patientId}`,
                    method: 'GET'
                };
                logRequest(request);
                return request;
            },
            providesTags: ['Consultations'],
            transformErrorResponse: handleApiError,
        }),
        createConsultation: builder.mutation({
            query: (data) => {
                const request = {
                    url: '/api/v1/doctors/consultations',
                    method: 'POST',
                    body: data
                };
                logRequest(request);
                return request;
            },
            invalidatesTags: ['Consultations'],
            transformErrorResponse: handleApiError,
        }),
        updateConsultation: builder.mutation({
            query: ({ id, data }) => {
                const request = {
                    url: `/api/v1/doctors/consultations/${id}`,
                    method: 'PUT',
                    body: data
                };
                logRequest(request);
                return request;
            },
            invalidatesTags: ['Consultations'],
            transformErrorResponse: handleApiError,
        }),
        getPrescriptions: builder.query({
            query: (params) => {
                const request = {
                    url: '/api/v1/doctors/prescriptions',
                    method: 'GET',
                    params
                };
                logRequest(request);
                return request;
            },
            providesTags: ['Prescriptions'],
            transformErrorResponse: handleApiError,
        }),
        createPrescription: builder.mutation({
            query: (data) => {
                const request = {
                    url: '/api/v1/doctors/prescriptions',
                    method: 'POST',
                    body: data
                };
                logRequest(request);
                return request;
            },
            invalidatesTags: ['Prescriptions'],
            transformErrorResponse: handleApiError,
        }),
        updatePrescription: builder.mutation({
            query: ({ id, data }) => {
                const request = {
                    url: `/api/v1/doctors/prescriptions/${id}`,
                    method: 'PUT',
                    body: data
                };
                logRequest(request);
                return request;
            },
            invalidatesTags: ['Prescriptions'],
            transformErrorResponse: handleApiError,
        }),
        getPatientStatistics: builder.query({
            query: () => {
                const request = {
                    url: '/api/v1/doctors/statistics',
                    method: 'GET'
                };
                logRequest(request);
                return request;
            },
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
