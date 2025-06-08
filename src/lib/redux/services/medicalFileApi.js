// src/lib/redux/services/medicalFileApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@/app-config';

const TOKEN_STORAGE_KEY = 'safe_auth_token';

export const medicalFileApi = createApi({
    reducerPath: 'medicalFileApi',
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
                    console.warn('medicalFileApi/prepareHeaders: localStorage not accessible or token not found.');
                }
            }
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['MedicalFile'],
    endpoints: (builder) => ({
        getMedicalFileById: builder.query({
            query: (medicalFileId) => `medical-files/${medicalFileId}`, // e.g., GET /api/v1/medical-files/someId
            providesTags: (result, error, id) => [{ type: 'MedicalFile', id }],
            // transformResponse: (response) => response.data, // Uncomment if backend wraps in { data: ... }
        }),
        // Add mutations for updating medical file if needed later
    }),
});

export const {
    useGetMedicalFileByIdQuery,
    // Export other hooks as needed
} = medicalFileApi;
