import axiosInstance from '../axiosInstance';

export const getNonPatientUsers = async () => {
  const res = await axiosInstance.get('/users');
  return res.data.data;
};

export const getNonDoctorUsers = async () => {
  const res = await axiosInstance.get('/users');
  return res.data.data;
}; 