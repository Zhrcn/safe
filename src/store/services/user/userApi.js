import axiosInstance from '../axiosInstance';

export const getNonPatientUsers = async () => {
  const res = await axiosInstance.get('/users');
  return res.data.data;
}; 