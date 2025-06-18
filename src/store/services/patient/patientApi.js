import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
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

export const patientApi = createApi({
    reducerPath: 'patientApi',
    baseQuery,
    tagTypes: [
        'Profile',
        'MedicalFile',
        'Appointments',
        'Medications',
        'Consultations',
        'Prescriptions',
        'Messages',
        'Doctors',
        'Pharmacists',
        'EmergencyContacts',
        'Insurance',
        'HealthStatus',
        'Notifications',
        'Allergies',
        'ChronicConditions'
    ],
    endpoints: (builder) => ({
        getProfile: builder.query({
            query: () => {
                const request = {
                    url: '/api/v1/patients/profile',
                    method: 'GET'
                };
                logRequest(request);
                return request;
            },
            providesTags: ['Profile'],
            transformResponse: (response) => response.data
        }),
        updateProfile: builder.mutation({
            query: (data) => {
                const request = {
                    url: '/api/v1/patients/profile',
                    method: 'PATCH',
                    body: data
                };
                logRequest(request);
                return request;
            },
            invalidatesTags: ['Profile'],
        }),
        addAllergy: builder.mutation({
            query: (allergyData) => {
                const request = {
                    url: '/api/v1/patients/allergies',
                    method: 'POST',
                    body: allergyData
                };
                logRequest(request);
                return request;
            },
            invalidatesTags: ['Profile'],
            transformResponse: (response) => response.data
        }),
        addChronicCondition: builder.mutation({
            query: (conditionData) => {
                const request = {
                    url: '/api/v1/patients/chronic-conditions',
                    method: 'POST',
                    body: conditionData
                };
                logRequest(request);
                return request;
            },
            invalidatesTags: ['Profile'],
            transformResponse: (response) => response.data
        }),
        getMedicalFile: builder.query({
            query: () => {
                const request = {
                    url: '/api/v1/patients/medical-file',
                    method: 'GET'
                };
                logRequest(request);
                return request;
            },
            providesTags: ['MedicalFile'],
        }),
        updateMedicalFile: builder.mutation({
            query: (data) => {
                const request = {
                    url: '/api/v1/patients/medical-file',
                    method: 'PUT',
                    body: data
                };
                logRequest(request);
                return request;
            },
            invalidatesTags: ['MedicalFile'],
        }),
        getAppointments: builder.query({
            query: () => {
                const request = {
                    url: '/api/v1/patients/appointments',
                    method: 'GET'
                };
                logRequest(request);
                return request;
            },
            providesTags: ['Appointments'],
            transformResponse: (response) => response.data
        }),
        createAppointment: builder.mutation({
            query: (data) => {
                const request = {
                    url: '/api/v1/patients/appointments',
                    method: 'POST',
                    body: data
                };
                logRequest(request);
                return request;
            },
            invalidatesTags: ['Appointments'],
        }),
        updateAppointment: builder.mutation({
            query: ({ id, data }) => {
                const request = {
                    url: `/api/v1/patients/appointments/${id}`,
                    method: 'PUT',
                    body: data
                };
                logRequest(request);
                return request;
            },
            invalidatesTags: ['Appointments'],
        }),
        deleteAppointment: builder.mutation({
            query: (id) => {
                const request = {
                    url: `/api/v1/patients/appointments/${id}`,
                    method: 'DELETE'
                };
                logRequest(request);
                return request;
            },
            invalidatesTags: ['Appointments'],
        }),
        getMedications: builder.query({
            query: () => {
                const request = {
                    url: '/api/v1/patients/medications',
                    method: 'GET'
                };
                logRequest(request);
                return request;
            },
            providesTags: ['Medications'],
            transformResponse: (response) => response.data
        }),
        addMedication: builder.mutation({
            query: (medicationData) => {
                const request = {
                    url: '/api/v1/patients/medications',
                    method: 'POST',
                    body: medicationData
                };
                logRequest(request);
                return request;
            },
            invalidatesTags: ['Profile', 'Medications'],
            transformResponse: (response) => response.data
        }),
        updateMedication: builder.mutation({
            query: ({ id, data }) => {
                const request = {
                    url: `/api/v1/patients/medications/${id}`,
                    method: 'PUT',
                    body: data
                };
                logRequest(request);
                return request;
            },
            invalidatesTags: ['Medications'],
        }),
        deleteMedication: builder.mutation({
            query: (id) => {
                const request = {
                    url: `/api/v1/patients/medications/${id}`,
                    method: 'DELETE'
                };
                logRequest(request);
                return request;
            },
            invalidatesTags: ['Medications'],
        }),
        getConsultations: builder.query({
            query: () => {
                const request = {
                    url: '/api/v1/patients/consultations',
                    method: 'GET'
                };
                logRequest(request);
                return request;
            },
            providesTags: ['Consultations'],
        }),
        createConsultation: builder.mutation({
            query: (data) => {
                const request = {
                    url: '/api/v1/patients/consultations',
                    method: 'POST',
                    body: data
                };
                logRequest(request);
                return request;
            },
            invalidatesTags: ['Consultations'],
        }),
        updateConsultation: builder.mutation({
            query: ({ id, data }) => {
                const request = {
                    url: `/api/v1/patients/consultations/${id}`,
                    method: 'PUT',
                    body: data
                };
                logRequest(request);
                return request;
            },
            invalidatesTags: ['Consultations'],
        }),
        getPrescriptions: builder.query({
            query: () => {
                const request = {
                    url: '/api/v1/patients/prescriptions',
                    method: 'GET'
                };
                logRequest(request);
                return request;
            },
            providesTags: ['Prescriptions'],
        }),
        getActivePrescriptions: builder.query({
            query: () => {
                const request = {
                    url: '/api/v1/patients/prescriptions/active',
                    method: 'GET'
                };
                logRequest(request);
                return request;
            },
            providesTags: ['Prescriptions'],
        }),
        getMessages: builder.query({
            query: () => {
                const request = {
                    url: '/api/v1/patients/messages',
                    method: 'GET'
                };
                logRequest(request);
                return request;
            },
            providesTags: ['Messages'],
        }),
        sendMessage: builder.mutation({
            query: (data) => {
                const request = {
                    url: '/api/v1/patients/messages',
                    method: 'POST',
                    body: data
                };
                logRequest(request);
                return request;
            },
            invalidatesTags: ['Messages'],
        }),
        getDoctors: builder.query({
            query: () => {
                const request = {
                    url: '/api/v1/patients/doctors',
                    method: 'GET'
                };
                logRequest(request);
                return request;
            },
            providesTags: ['Doctors'],
        }),
        getDoctor: builder.query({
            query: (id) => {
                const request = {
                    url: `/api/v1/patients/doctors/${id}`,
                    method: 'GET'
                };
                logRequest(request);
                return request;
            },
            providesTags: ['Doctors'],
        }),
        getPharmacists: builder.query({
            query: () => {
                const request = {
                    url: '/api/v1/patients/pharmacists',
                    method: 'GET'
                };
                logRequest(request);
                return request;
            },
            providesTags: ['Pharmacists'],
        }),
        getPharmacist: builder.query({
            query: (id) => {
                const request = {
                    url: `/api/v1/patients/pharmacists/${id}`,
                    method: 'GET'
                };
                logRequest(request);
                return request;
            },
            providesTags: ['Pharmacists'],
        }),
        getDashboardSummary: builder.query({
            query: () => {
                const request = {
                    url: '/api/v1/patients/dashboard',
                    method: 'GET'
                };
                logRequest(request);
                return request;
            },
            providesTags: ['Profile', 'Appointments', 'Medications'],
            transformResponse: (response) => response.data
        }),
        getEmergencyContacts: builder.query({
            query: () => {
                const request = {
                    url: '/api/v1/patients/emergency-contacts',
                    method: 'GET'
                };
                logRequest(request);
                return request;
            },
            providesTags: ['EmergencyContacts'],
        }),
        addEmergencyContact: builder.mutation({
            query: (data) => {
                const request = {
                    url: '/api/v1/patients/emergency-contacts',
                    method: 'POST',
                    body: data
                };
                logRequest(request);
                return request;
            },
            invalidatesTags: ['EmergencyContacts'],
        }),
        updateEmergencyContact: builder.mutation({
            query: ({ id, data }) => ({
                url: `/emergency-contacts/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['EmergencyContacts'],
        }),
        deleteEmergencyContact: builder.mutation({
            query: (id) => ({
                url: `/emergency-contacts/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['EmergencyContacts'],
        }),
        getInsurance: builder.query({
            query: () => '/insurance',
            providesTags: ['Insurance'],
        }),
        updateInsurance: builder.mutation({
            query: (data) => ({
                url: '/insurance',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Insurance'],
        }),
        getHealthStatus: builder.query({
            query: () => '/health-status',
            providesTags: ['HealthStatus'],
        }),
        updateHealthStatus: builder.mutation({
            query: (data) => ({
                url: '/health-status',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['HealthStatus'],
        }),
        getNotifications: builder.query({
            query: () => '/notifications',
            providesTags: ['Notifications'],
        }),
        markNotificationAsRead: builder.mutation({
            query: (id) => ({
                url: `/notifications/${id}/read`,
                method: 'PUT',
            }),
            invalidatesTags: ['Notifications'],
        }),
        deleteNotification: builder.mutation({
            query: (id) => ({
                url: `/notifications/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Notifications'],
        }),
    }),
});

export const {
    useGetProfileQuery,
    useUpdateProfileMutation,
    useAddAllergyMutation,
    useAddChronicConditionMutation,
    useAddMedicationMutation,
    useGetMedicalFileQuery,
    useUpdateMedicalFileMutation,
    useGetAppointmentsQuery,
    useCreateAppointmentMutation,
    useUpdateAppointmentMutation,
    useDeleteAppointmentMutation,
    useGetMedicationsQuery,
    useUpdateMedicationMutation,
    useDeleteMedicationMutation,
    useGetConsultationsQuery,
    useCreateConsultationMutation,
    useUpdateConsultationMutation,
    useGetPrescriptionsQuery,
    useGetActivePrescriptionsQuery,
    useGetMessagesQuery,
    useSendMessageMutation,
    useGetDoctorsQuery,
    useGetDoctorQuery,
    useGetPharmacistsQuery,
    useGetPharmacistQuery,
    useGetDashboardSummaryQuery,
    useGetEmergencyContactsQuery,
    useAddEmergencyContactMutation,
    useUpdateEmergencyContactMutation,
    useDeleteEmergencyContactMutation,
    useGetInsuranceQuery,
    useUpdateInsuranceMutation,
    useGetHealthStatusQuery,
    useUpdateHealthStatusMutation,
    useGetNotificationsQuery,
    useMarkNotificationAsReadMutation,
    useDeleteNotificationMutation,
} = patientApi;
