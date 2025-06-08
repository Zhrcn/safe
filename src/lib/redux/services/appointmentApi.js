// src/lib/redux/services/appointmentApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@/lib/config';

const TOKEN_STORAGE_KEY = 'auth_token';

export const appointmentApi = createApi({
    reducerPath: 'appointmentApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_BASE_URL}/appointments`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem(TOKEN_STORAGE_KEY);
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Appointment'],
    endpoints: (builder) => ({
        // Get all appointments for the current patient
        getAppointments: builder.query({
            query: () => ({
                url: '/',
                method: 'GET',
            }),
            providesTags: ['Appointment'],
        }),

        // Schedule a new appointment
        scheduleAppointment: builder.mutation({
            query: (appointmentData) => ({
                url: '/schedule',
                method: 'POST',
                body: appointmentData,
            }),
            invalidatesTags: ['Appointment'],
        }),

        // Update an existing appointment
        updateAppointment: builder.mutation({
            query: ({ appointmentId, updateData }) => ({
                url: `/${appointmentId}`,
                method: 'PATCH',
                body: updateData,
            }),
            invalidatesTags: ['Appointment'],
        }),

        // Cancel an appointment
        cancelAppointment: builder.mutation({
            query: ({ appointmentId, reason }) => ({
                url: `/${appointmentId}/cancel`,
                method: 'POST',
                body: { reason },
            }),
            invalidatesTags: ['Appointment'],
        }),

        // Get available time slots for a doctor on a specific date
        getAvailableTimeSlots: builder.query({
            query: ({ doctorId, date }) => ({
                url: '/available-slots',
                method: 'GET',
                params: { doctorId, date },
            }),
        }),
    }),
});

export const {
    useGetAppointmentsQuery,
    useScheduleAppointmentMutation,
    useUpdateAppointmentMutation,
    useCancelAppointmentMutation,
    useGetAvailableTimeSlotsQuery,
} = appointmentApi; 