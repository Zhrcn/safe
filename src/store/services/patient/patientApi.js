import axiosInstance from '../axiosInstance';

export const getProfile = async () => {
  const res = await axiosInstance.get('/patients/profile');
  return res.data.data;
};

export const updateProfile = async (profileData) => {
  const res = await axiosInstance.put('/patients/profile', profileData);
  return res.data.data;
};
