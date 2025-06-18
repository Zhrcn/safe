import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AUTH_CONSTANTS } from '@/config/constants';
import { getToken } from '@/utils/tokenUtils';

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

export const remindersApi = createApi({
    reducerPath: 'remindersApi',
    baseQuery,
    tagTypes: ['Reminders'],
    endpoints: (builder) => ({
        getReminders: builder.query({
            query: () => 'reminders',
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({ type: 'Reminders', id })),
                          { type: 'Reminders', id: 'LIST' },
                      ]
                    : [{ type: 'Reminders', id: 'LIST' }],
        }),
        createReminder: builder.mutation({
            query: (newReminder) => ({
                url: 'reminders',
                method: 'POST',
                body: newReminder,
            }),
            invalidatesTags: [{ type: 'Reminders', id: 'LIST' }],
        }),
        updateReminder: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `reminders/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Reminders', id }],
        }),
        deleteReminder: builder.mutation({
            query: (id) => ({
                url: `reminders/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Reminders', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetRemindersQuery,
    useCreateReminderMutation,
    useUpdateReminderMutation,
    useDeleteReminderMutation,
} = remindersApi; 