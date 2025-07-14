import axiosInstance from '../axiosInstance';

// Patient can only read their medical records, not modify them
export const getMedicalRecords = async () => {
  const res = await axiosInstance.get(`/patients/medical-records`);
  return res.data.data;
}; 