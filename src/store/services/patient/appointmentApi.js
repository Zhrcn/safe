import { api } from '../api';

export const appointmentApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get all appointments for the current patient
        getAppointments: builder.query({
            query: () => ({
                url: '/appointments',
                method: 'GET',
            }),
        }),

        // Schedule a new appointment
        scheduleAppointment: builder.mutation({
            query: (appointmentData) => ({
                url: '/appointments',
                method: 'POST',
                body: appointmentData,
            }),
        }),

        // Update an existing appointment
        updateAppointment: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/appointments/${id}`,
                method: 'PUT',
                body: data,
            }),
        }),

        // Cancel an appointment
        cancelAppointment: builder.mutation({
            query: ({ appointmentId, reason }) => ({
                url: `/appointments/${appointmentId}/cancel`,
                method: 'POST',
                body: { reason },
            }),
        }),

        // Get available time slots for a doctor on a specific date
        getAvailableTimeSlots: builder.query({
            query: ({ doctorId, date }) => ({
                url: '/available-slots',
                method: 'GET',
                params: { doctorId, date },
            }),
        }),

        // Create a new appointment
        createAppointment: builder.mutation({
            query: (data) => ({
                url: '/appointments',
                method: 'POST',
                body: data,
            }),
        }),

        // Delete an appointment
        deleteAppointment: builder.mutation({
            query: (id) => ({
                url: `/appointments/${id}`,
                method: 'DELETE',
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
    useCreateAppointmentMutation,
    useDeleteAppointmentMutation,
} = appointmentApi; 