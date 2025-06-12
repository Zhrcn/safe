import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const prescriptionsApi = createApi({
    reducerPath: 'prescriptionsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5001/api/doctors/prescriptions',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Prescriptions', 'PrescriptionDetails'],
    endpoints: (builder) => ({
        getPrescriptions: builder.query({
            query: () => '/',
            providesTags: ['Prescriptions'],
        }),
        getPrescriptionDetails: builder.query({
            query: (prescriptionId) => `/${prescriptionId}`,
            providesTags: (result, error, prescriptionId) => [{ type: 'PrescriptionDetails', id: prescriptionId }],
        }),
        createPrescription: builder.mutation({
            query: (prescriptionData) => ({
                url: '/',
                method: 'POST',
                body: prescriptionData,
            }),
            invalidatesTags: ['Prescriptions'],
        }),
        updatePrescription: builder.mutation({
            query: ({ prescriptionId, prescriptionData }) => ({
                url: `/${prescriptionId}`,
                method: 'PUT',
                body: prescriptionData,
            }),
            invalidatesTags: (result, error, { prescriptionId }) => [
                { type: 'PrescriptionDetails', id: prescriptionId },
                'Prescriptions'
            ],
        }),
        addMedication: builder.mutation({
            query: ({ prescriptionId, medication }) => ({
                url: `/${prescriptionId}/medications`,
                method: 'POST',
                body: medication,
            }),
            invalidatesTags: (result, error, { prescriptionId }) => [
                { type: 'PrescriptionDetails', id: prescriptionId }
            ],
        }),
        removeMedication: builder.mutation({
            query: ({ prescriptionId, medicationId }) => ({
                url: `/${prescriptionId}/medications/${medicationId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { prescriptionId }) => [
                { type: 'PrescriptionDetails', id: prescriptionId }
            ],
        }),
        renewPrescription: builder.mutation({
            query: ({ prescriptionId, renewalData }) => ({
                url: `/${prescriptionId}/renew`,
                method: 'POST',
                body: renewalData,
            }),
            invalidatesTags: (result, error, { prescriptionId }) => [
                { type: 'PrescriptionDetails', id: prescriptionId },
                'Prescriptions'
            ],
        }),
        getPrescriptionsByPatient: builder.query({
            query: (patientId) => `/patient/${patientId}`,
            providesTags: ['Prescriptions'],
        }),
        getPrescriptionsByDate: builder.query({
            query: (date) => `/date/${date}`,
            providesTags: ['Prescriptions'],
        }),
        getPrescriptionMedications: builder.query({
            query: (prescriptionId) => `/${prescriptionId}/medications`,
            providesTags: (result, error, prescriptionId) => [{ type: 'PrescriptionDetails', id: prescriptionId }],
        }),
        getPrescriptionHistory: builder.query({
            query: (prescriptionId) => `/${prescriptionId}/history`,
            providesTags: (result, error, prescriptionId) => [{ type: 'PrescriptionDetails', id: prescriptionId }],
        }),
    }),
});

export const {
    useGetPrescriptionsQuery,
    useGetPrescriptionDetailsQuery,
    useCreatePrescriptionMutation,
    useUpdatePrescriptionMutation,
    useAddMedicationMutation,
    useRemoveMedicationMutation,
    useRenewPrescriptionMutation,
    useGetPrescriptionsByPatientQuery,
    useGetPrescriptionsByDateQuery,
    useGetPrescriptionMedicationsQuery,
    useGetPrescriptionHistoryQuery,
} = prescriptionsApi; 