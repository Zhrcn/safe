// src/lib/redux/services/patientApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@/app-config';

const TOKEN_STORAGE_KEY = 'safe_auth_token'; // Consistent with authApi.js

export const patientApi = createApi({
    reducerPath: 'patientApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            // Attempt to get token from Redux state (userSlice or authSlice)
            // This assumes the token is stored in state.user.token after login
            let token = getState().user?.token; 

            if (!token) {
                // Fallback to localStorage if not in Redux state
                try {
                    const tokenFromStorage = localStorage.getItem(TOKEN_STORAGE_KEY);
                    if (tokenFromStorage) {
                        token = tokenFromStorage;
                        // console.log('patientApi/prepareHeaders: Using token from localStorage fallback.');
                    }
                } catch (e) {
                    // console.warn('patientApi/prepareHeaders: localStorage not accessible or token not found for fallback.');
                }
            }

            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            } else {
                // console.warn('patientApi/prepareHeaders: No token found to set Authorization header.');
            }
            return headers;
        },
    }),
    tagTypes: ['PatientProfile', 'Appointments', 'Medications', 'VitalSigns'],
    endpoints: (builder) => ({
        getPatientProfile: builder.query({
            query: () => 'patients/profile', // GET /api/v1/patients/profile
            providesTags: ['PatientProfile'],
            // transformResponse: (response) => response.data, // If backend wraps in { data: ... }
        }),
        updatePatientProfile: builder.mutation({
            query: (profileData) => ({
                url: 'patients/profile', // PATCH /api/v1/patients/profile
                method: 'PATCH',
                body: profileData,
            }),
            invalidatesTags: ['PatientProfile'], // Invalidate cache on update
            // transformResponse: (response) => response.data, // If backend wraps in { data: ... }
        }),
        // Dashboard specific endpoints
        getDashboardData: builder.query({
            query: () => 'patients/dashboard',
            providesTags: ['PatientProfile', 'Appointments', 'Medications', 'VitalSigns'],
        }),
        getUpcomingAppointments: builder.query({
            query: () => 'patients/appointments/upcoming',
            providesTags: ['Appointments'],
        }),
        getActiveMedications: builder.query({
            query: () => 'patients/medications/active',
            providesTags: ['Medications'],
        }),
        getVitalSigns: builder.query({
            query: () => 'patients/vital-signs',
            providesTags: ['VitalSigns'],
        }),
        getHealthMetrics: builder.query({
            query: () => 'patients/health-metrics',
            providesTags: ['PatientProfile'],
        }),
    }),
});

export const {
    useGetPatientProfileQuery,
    useUpdatePatientProfileMutation,
    useGetDashboardDataQuery,
    useGetUpcomingAppointmentsQuery,
    useGetActiveMedicationsQuery,
    useGetVitalSignsQuery,
    useGetHealthMetricsQuery,
} = patientApi;
