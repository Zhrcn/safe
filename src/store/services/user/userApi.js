import axiosInstance from '../axiosInstance';

export const getNonPatientUsers = async () => {
  const res = await axiosInstance.get('/users');
  return res.data.data;
};

export const getNonDoctorUsers = async () => {
  const res = await axiosInstance.get('/users');
  return res.data.data;
};

// User Profile Management
export const getUserProfile = async () => {
  const res = await axiosInstance.get('/auth/me');
  return res.data.data;
};

export const updateUserProfile = async (profileData) => {
  const res = await axiosInstance.put('/auth/profile', profileData);
  return res.data.data;
};

// Profile Image Upload
export const uploadUserProfileImage = async (formData) => {
  const res = await axiosInstance.post('/upload/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data.data;
}; 