import axiosInstance from '../axiosInstance';

export const getMedicalRecords = async () => {
  const res = await axiosInstance.get(`/patients/medical-records`);
  return res.data.data;
}; 