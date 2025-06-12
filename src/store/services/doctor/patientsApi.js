import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const patientsApi = createApi({
    reducerPath: 'patientsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5001/api/doctors/patients',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Patients', 'PatientDetails'],
    endpoints: (builder) => ({
        getPatients: builder.query({
            query: () => '/',
            providesTags: ['Patients'],
        }),
        getPatientDetails: builder.query({
            query: (patientId) => `/${patientId}`,
            providesTags: (result, error, patientId) => [{ type: 'PatientDetails', id: patientId }],
        }),
        updatePatientNotes: builder.mutation({
            query: ({ patientId, notes }) => ({
                url: `/${patientId}/notes`,
                method: 'PUT',
                body: { notes },
            }),
            invalidatesTags: (result, error, { patientId }) => [
                { type: 'PatientDetails', id: patientId },
                'Patients'
            ],
        }),
        addToFavorites: builder.mutation({
            query: (patientId) => ({
                url: `/${patientId}/favorite`,
                method: 'POST',
            }),
            invalidatesTags: ['Patients'],
        }),
        removeFromFavorites: builder.mutation({
            query: (patientId) => ({
                url: `/${patientId}/favorite`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Patients'],
        }),
        getPatientMedicalHistory: builder.query({
            query: (patientId) => `/${patientId}/medical-history`,
            providesTags: (result, error, patientId) => [{ type: 'PatientDetails', id: patientId }],
        }),
        getPatientAppointments: builder.query({
            query: (patientId) => `/${patientId}/appointments`,
            providesTags: (result, error, patientId) => [{ type: 'PatientDetails', id: patientId }],
        }),
        getPatientPrescriptions: builder.query({
            query: (patientId) => `/${patientId}/prescriptions`,
            providesTags: (result, error, patientId) => [{ type: 'PatientDetails', id: patientId }],
        }),
        getPatientConsultations: builder.query({
            query: (patientId) => `/${patientId}/consultations`,
            providesTags: (result, error, patientId) => [{ type: 'PatientDetails', id: patientId }],
        }),
        searchPatients: builder.query({
            query: (searchTerm) => `/search?q=${searchTerm}`,
            providesTags: ['Patients'],
        }),
    }),
});

export const {
    useGetPatientsQuery,
    useGetPatientDetailsQuery,
    useUpdatePatientNotesMutation,
    useAddToFavoritesMutation,
    useRemoveFromFavoritesMutation,
    useGetPatientMedicalHistoryQuery,
    useGetPatientAppointmentsQuery,
    useGetPatientPrescriptionsQuery,
    useGetPatientConsultationsQuery,
    useSearchPatientsQuery,
} = patientsApi; 