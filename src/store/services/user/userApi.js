import { createApi } from '@reduxjs/toolkit/query/react';
import axiosInstance from '../axiosInstance';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: async ({ url, method, data, formData }) => {
    try {
      let response;
      if (formData) {
        response = await axiosInstance({ url, method, data: formData, headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        response = await axiosInstance({ url, method, data });
      }
      return { data: response.data.data };
    } catch (error) {
      return { error: { status: error.response?.status, data: error.response?.data } };
    }
  },
  endpoints: (builder) => ({
    uploadUserProfileImage: builder.mutation({
      query: (formData) => ({
        url: '/upload/profile',
        method: 'POST',
        formData,
      }),
    }),
    updateUserProfile: builder.mutation({
      query: (profileData) => ({
        url: '/auth/profile',
        method: 'PUT',
        data: profileData,
      }),
    }),
  }),
});

export const { useUploadUserProfileImageMutation, useUpdateUserProfileMutation } = userApi;

export const getUserProfile = async () => {
  const res = await axiosInstance.get('/auth/me');
  return res.data.data;
};

export const updateUserProfile = async (profileData) => {
  const res = await axiosInstance.put('/auth/profile', profileData);
  return res.data.data;
};

export const uploadUserProfileImage = async (formData) => {
  const res = await axiosInstance.post('/upload/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data.data;
};

export const getNonPatientUsers = async () => {
  const res = await axiosInstance.get('/users');
  return res.data.data.filter(user => user.role !== 'patient');
}; 