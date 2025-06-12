import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@/config/app-config';

const TOKEN_STORAGE_KEY = 'safe_auth_token'; // Or import from tokenUtils if centralized

export const remindersApi = createApi({
    reducerPath: 'remindersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            let token = getState().user?.token;
            if (!token) {
                try {
                    const tokenFromStorage = localStorage.getItem(TOKEN_STORAGE_KEY);
                    if (tokenFromStorage) {
                        token = tokenFromStorage;
                    }
                } catch (e) {
                    console.warn('remindersApi/prepareHeaders: localStorage not accessible or token not found.');
                }
            }
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Reminder'],
    endpoints: (builder) => ({
        getReminders: builder.query({
            query: () => 'reminders',
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({ type: 'Reminder', id })),
                          { type: 'Reminder', id: 'LIST' },
                      ]
                    : [{ type: 'Reminder', id: 'LIST' }],
        }),
        createReminder: builder.mutation({
            query: (newReminder) => ({
                url: 'reminders',
                method: 'POST',
                body: newReminder,
            }),
            invalidatesTags: [{ type: 'Reminder', id: 'LIST' }],
        }),
        updateReminder: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `reminders/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Reminder', id }],
        }),
        deleteReminder: builder.mutation({
            query: (id) => ({
                url: `reminders/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Reminder', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetRemindersQuery,
    useCreateReminderMutation,
    useUpdateReminderMutation,
    useDeleteReminderMutation,
} = remindersApi; 