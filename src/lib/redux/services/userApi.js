import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@/lib/config';

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getProfile: builder.query({
            query: () => '/users/profile',
            providesTags: ['User'],
        }),
        updateProfile: builder.mutation({
            query: (data) => ({
                url: '/users/profile',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        getUsers: builder.query({
            query: (params) => ({
                url: '/users',
                params,
            }),
            providesTags: ['User'],
        }),
        getUserById: builder.query({
            query: (id) => `/users/${id}`,
            providesTags: ['User'],
        }),
        updateUser: builder.mutation({
            query: ({ id, data }) => ({
                url: `/users/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useGetProfileQuery,
    useUpdateProfileMutation,
    useGetUsersQuery,
    useGetUserByIdQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = userApi; 