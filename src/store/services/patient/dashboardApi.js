import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5001/api/v1/patients',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery,
  tagTypes: ['Dashboard', 'Appointments', 'Medications', 'MedicalFile', 'Messages', 'Consultations'],
  endpoints: (builder) => ({
    getDashboardSummary: builder.query({
      query: () => ({
        url: '/dashboard/summary',
        method: 'GET',
      }),
      transformResponse: (response) => {
        if (response.success) {
          return {
            success: true,
            data: response.data
          };
        }
        return {
          success: false,
          message: response.message || 'Failed to fetch dashboard data'
        };
      },
      providesTags: ['Dashboard']
    }),

    getUpcomingAppointments: builder.query({
      query: () => ({
        url: '/appointments/upcoming',
        method: 'GET',
      }),
      transformResponse: (response) => {
        if (response.success) {
          return {
            success: true,
            data: response.data
          };
        }
        return {
          success: false,
          message: response.message || 'Failed to fetch appointments'
        };
      },
      providesTags: ['Appointments']
    }),

    getActiveMedications: builder.query({
      query: () => ({
        url: '/medications/active',
        method: 'GET',
      }),
      transformResponse: (response) => {
        if (response.success) {
          return {
            success: true,
            data: response.data
          };
        }
        return {
          success: false,
          message: response.message || 'Failed to fetch medications'
        };
      },
      providesTags: ['Medications']
    }),

    getMedicalFile: builder.query({
      query: () => ({
        url: '/medical-file',
        method: 'GET',
      }),
      transformResponse: (response) => {
        if (response.success) {
          return {
            success: true,
            data: response.data
          };
        }
        return {
          success: false,
          message: response.message || 'Failed to fetch medical file'
        };
      },
      providesTags: ['MedicalFile']
    }),

    getRecentLabResults: builder.query({
      query: () => ({
        url: '/lab-results/recent',
        method: 'GET',
      }),
      transformResponse: (response) => {
        if (response.success) {
          return {
            success: true,
            data: response.data
          };
        }
        return {
          success: false,
          message: response.message || 'Failed to fetch lab results'
        };
      },
      providesTags: ['MedicalFile']
    }),

    getVitalSigns: builder.query({
      query: () => ({
        url: '/vital-signs',
        method: 'GET',
      }),
      transformResponse: (response) => {
        if (response.success) {
          return {
            success: true,
            data: response.data
          };
        }
        return {
          success: false,
          message: response.message || 'Failed to fetch vital signs'
        };
      },
      providesTags: ['MedicalFile']
    }),

    getChronicConditions: builder.query({
      query: () => ({
        url: '/chronic-conditions',
        method: 'GET',
      }),
      transformResponse: (response) => {
        if (response.success) {
          return {
            success: true,
            data: response.data
          };
        }
        return {
          success: false,
          message: response.message || 'Failed to fetch chronic conditions'
        };
      },
      providesTags: ['MedicalFile']
    }),

    getAllergies: builder.query({
      query: () => ({
        url: '/allergies',
        method: 'GET',
      }),
      transformResponse: (response) => {
        if (response.success) {
          return {
            success: true,
            data: response.data
          };
        }
        return {
          success: false,
          message: response.message || 'Failed to fetch allergies'
        };
      },
      providesTags: ['MedicalFile']
    }),

    getRecentMessages: builder.query({
      query: () => ({
        url: '/messages/recent',
        method: 'GET',
      }),
      transformResponse: (response) => {
        if (response.success) {
          return {
            success: true,
            data: response.data
          };
        }
        return {
          success: false,
          message: response.message || 'Failed to fetch messages'
        };
      },
      providesTags: ['Messages']
    }),

    getRecentConsultations: builder.query({
      query: () => ({
        url: '/consultations/recent',
        method: 'GET',
      }),
      transformResponse: (response) => {
        if (response.success) {
          return {
            success: true,
            data: response.data
          };
        }
        return {
          success: false,
          message: response.message || 'Failed to fetch consultations'
        };
      },
      providesTags: ['Consultations']
    }),
  }),
});

export const {
  useGetDashboardSummaryQuery,
  useGetUpcomingAppointmentsQuery,
  useGetActiveMedicationsQuery,
  useGetMedicalFileQuery,
  useGetRecentLabResultsQuery,
  useGetVitalSignsQuery,
  useGetChronicConditionsQuery,
  useGetAllergiesQuery,
  useGetRecentMessagesQuery,
  useGetRecentConsultationsQuery,
} = dashboardApi; 