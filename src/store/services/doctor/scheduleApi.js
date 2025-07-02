import axiosInstance from '../axiosInstance';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const getSchedules = async () => {
  const res = await axiosInstance.get('/schedules');
  return res.data.data;
};

export const getScheduleById = async (id) => {
  const res = await axiosInstance.get(`/schedules/${id}`);
  return res.data.data;
};

export const createSchedule = async (scheduleData) => {
  const res = await axiosInstance.post('/schedules', scheduleData);
  return res.data.data;
};

export const updateSchedule = async (id, scheduleData) => {
  const res = await axiosInstance.put(`/schedules/${id}`, scheduleData);
  return res.data.data;
};

export const deleteSchedule = async (id) => {
  const res = await axiosInstance.delete(`/schedules/${id}`);
  return res.data.data;
};

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