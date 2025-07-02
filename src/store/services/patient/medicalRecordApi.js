import axiosInstance from '../axiosInstance';

export const getMedicalRecords = async () => {
  const res = await axiosInstance.get('/medical-records');
  return res.data.data;
};

export const addMedicalRecord = async (recordData) => {
  const res = await axiosInstance.post('/medical-records', recordData);
  return res.data.data;
};

export const updateMedicalRecord = async (id, recordData) => {
  const res = await axiosInstance.put(`/medical-records/${id}`, recordData);
  return res.data.data;
};

export const deleteMedicalRecord = async (id) => {
  const res = await axiosInstance.delete(`/medical-records/${id}`);
  return res.data.data;
}; 