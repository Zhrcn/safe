import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const scheduleApi = createApi({
    reducerPath: 'scheduleApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Schedule', 'Availability'],
    endpoints: (builder) => ({
        getSchedule: builder.query({
            query: (date) => `?date=${date}`,
            providesTags: ['Schedule'],
        }),
        updateAvailability: builder.mutation({
            query: (availabilityData) => ({
                url: '/availability',
                method: 'PUT',
                body: availabilityData,
            }),
            invalidatesTags: ['Availability'],
        }),
        addAppointment: builder.mutation({
            query: (appointmentData) => ({
                url: '/appointments',
                method: 'POST',
                body: appointmentData,
            }),
            invalidatesTags: ['Schedule'],
        }),
        updateAppointment: builder.mutation({
            query: ({ appointmentId, appointmentData }) => ({
                url: `/appointments/${appointmentId}`,
                method: 'PUT',
                body: appointmentData,
            }),
            invalidatesTags: ['Schedule'],
        }),
        deleteAppointment: builder.mutation({
            query: (appointmentId) => ({
                url: `/appointments/${appointmentId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Schedule'],
        }),
        getAvailability: builder.query({
            query: (date) => `/availability?date=${date}`,
            providesTags: ['Availability'],
        }),
        setRecurringAvailability: builder.mutation({
            query: (recurringData) => ({
                url: '/availability/recurring',
                method: 'POST',
                body: recurringData,
            }),
            invalidatesTags: ['Availability'],
        }),
        getAppointmentsByDate: builder.query({
            query: (date) => `/appointments?date=${date}`,
            providesTags: ['Schedule'],
        }),
        getAppointmentsByPatient: builder.query({
            query: (patientId) => `/appointments/patient/${patientId}`,
            providesTags: ['Schedule'],
        }),
    }),
});
export const {
    useGetScheduleQuery,
    useUpdateAvailabilityMutation,
    useAddAppointmentMutation,
    useUpdateAppointmentMutation,
    useDeleteAppointmentMutation,
    useGetAvailabilityQuery,
    useSetRecurringAvailabilityMutation,
    useGetAppointmentsByDateQuery,
    useGetAppointmentsByPatientQuery,
} = scheduleApi; 