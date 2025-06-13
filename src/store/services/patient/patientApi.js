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
        'Notifications',
        'Allergies',
        'ChronicConditions'
    ],
    endpoints: (builder) => ({
        // Profile endpoints
        getProfile: builder.query({
            query: () => '/profile',
            providesTags: ['Profile'],
            transformResponse: (response) => response.data
        }),
        updateProfile: builder.mutation({
            query: (data) => ({
                url: '/profile',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Profile'],
        }),
        addAllergy: builder.mutation({
            query: (allergyData) => ({
                url: '/allergies',
                method: 'POST',
                body: allergyData,
            }),
            invalidatesTags: ['Profile'],
            transformResponse: (response) => response.data
        }),
        addChronicCondition: builder.mutation({
            query: (conditionData) => ({
                url: '/chronic-conditions',
                method: 'POST',
                body: conditionData,
            }),
            invalidatesTags: ['Profile'],
            transformResponse: (response) => response.data
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
            transformResponse: (response) => response.data
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
            transformResponse: (response) => response.data
        }),
        addMedication: builder.mutation({
            query: (medicationData) => ({
                url: '/medications',
                method: 'POST',
                body: medicationData,
            }),
            invalidatesTags: ['Profile', 'Medications'],
            transformResponse: (response) => response.data
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
            query: () => '/dashboard',
            providesTags: ['Profile', 'Appointments', 'Medications'],
            transformResponse: (response) => response.data
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
    useAddAllergyMutation,
    useAddChronicConditionMutation,
    useAddMedicationMutation,
    
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
