import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@/config/app-config';
import { getToken } from '@/utils/tokenUtils';

export const patientApi = createApi({
    reducerPath: 'patientApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_BASE_URL}/patients`,
        prepareHeaders: (headers) => {
            const token = getToken();
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
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
        'Notifications'
    ],
    endpoints: (builder) => ({
        // Profile endpoints
        getProfile: builder.query({
            query: () => '/profile',
            providesTags: ['Profile'],
        }),
        updateProfile: builder.mutation({
            query: (data) => ({
                url: '/profile',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Profile'],
        }),

        // Medical file endpoints
        getMedicalFile: builder.query({
            query: () => '/medical-file',
            providesTags: ['MedicalFile'],
        }),
        updateMedicalFile: builder.mutation({
            query: (data) => ({
                url: '/medical-file',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['MedicalFile'],
        }),

        // Appointment endpoints
        getAppointments: builder.query({
            query: () => '/appointments',
            providesTags: ['Appointments'],
        }),
        createAppointment: builder.mutation({
            query: (data) => ({
                url: '/appointments',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Appointments'],
        }),
        updateAppointment: builder.mutation({
            query: ({ id, data }) => ({
                url: `/appointments/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Appointments'],
        }),
        deleteAppointment: builder.mutation({
            query: (id) => ({
                url: `/appointments/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Appointments'],
        }),

        // Medication endpoints
        getMedications: builder.query({
            query: () => '/medications',
            providesTags: ['Medications'],
        }),
        addMedication: builder.mutation({
            query: (data) => ({
                url: '/medications',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Medications'],
        }),
        updateMedication: builder.mutation({
            query: ({ id, data }) => ({
                url: `/medications/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Medications'],
        }),
        deleteMedication: builder.mutation({
            query: (id) => ({
                url: `/medications/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Medications'],
        }),

        // Consultation endpoints
        getConsultations: builder.query({
            query: () => '/consultations',
            providesTags: ['Consultations'],
        }),
        createConsultation: builder.mutation({
            query: (data) => ({
                url: '/consultations',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Consultations'],
        }),
        updateConsultation: builder.mutation({
            query: ({ id, data }) => ({
                url: `/consultations/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Consultations'],
        }),

        // Prescription endpoints
        getPrescriptions: builder.query({
            query: () => '/prescriptions',
            providesTags: ['Prescriptions'],
        }),
        getActivePrescriptions: builder.query({
            query: () => '/prescriptions/active',
            providesTags: ['Prescriptions'],
        }),

        // Message endpoints
        getMessages: builder.query({
            query: () => '/messages',
            providesTags: ['Messages'],
        }),
        sendMessage: builder.mutation({
            query: (data) => ({
                url: '/messages',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Messages'],
        }),

        // Provider endpoints
        getDoctors: builder.query({
            query: () => '/doctors',
            providesTags: ['Doctors'],
        }),
        getDoctor: builder.query({
            query: (id) => `/doctors/${id}`,
            providesTags: ['Doctors'],
        }),
        getPharmacists: builder.query({
            query: () => '/pharmacists',
            providesTags: ['Pharmacists'],
        }),
        getPharmacist: builder.query({
            query: (id) => `/pharmacists/${id}`,
            providesTags: ['Pharmacists'],
        }),

        // Dashboard endpoint
        getDashboardSummary: builder.query({
            query: () => '/dashboard/summary',
            providesTags: ['Profile', 'MedicalFile', 'Appointments', 'Medications'],
        }),

        // Emergency Contacts endpoints
        getEmergencyContacts: builder.query({
            query: () => '/emergency-contacts',
            providesTags: ['EmergencyContacts'],
        }),
        addEmergencyContact: builder.mutation({
            query: (data) => ({
                url: '/emergency-contacts',
                method: 'POST',
                body: data,
            }),
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

        // Insurance endpoints
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

        // Health Status endpoints
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

        // Notification endpoints
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
    // Profile
    useGetProfileQuery,
    useUpdateProfileMutation,
    
    // Medical File
    useGetMedicalFileQuery,
    useUpdateMedicalFileMutation,
    
    // Appointments
    useGetAppointmentsQuery,
    useCreateAppointmentMutation,
    useUpdateAppointmentMutation,
    useDeleteAppointmentMutation,
    
    // Medications
    useGetMedicationsQuery,
    useAddMedicationMutation,
    useUpdateMedicationMutation,
    useDeleteMedicationMutation,
    
    // Consultations
    useGetConsultationsQuery,
    useCreateConsultationMutation,
    useUpdateConsultationMutation,
    
    // Prescriptions
    useGetPrescriptionsQuery,
    useGetActivePrescriptionsQuery,
    
    // Messages
    useGetMessagesQuery,
    useSendMessageMutation,
    
    // Providers
    useGetDoctorsQuery,
    useGetDoctorQuery,
    useGetPharmacistsQuery,
    useGetPharmacistQuery,
    
    // Dashboard
    useGetDashboardSummaryQuery,
    
    // Emergency Contacts
    useGetEmergencyContactsQuery,
    useAddEmergencyContactMutation,
    useUpdateEmergencyContactMutation,
    useDeleteEmergencyContactMutation,
    
    // Insurance
    useGetInsuranceQuery,
    useUpdateInsuranceMutation,
    
    // Health Status
    useGetHealthStatusQuery,
    useUpdateHealthStatusMutation,
    
    // Notifications
    useGetNotificationsQuery,
    useMarkNotificationAsReadMutation,
    useDeleteNotificationMutation,
} = patientApi;
