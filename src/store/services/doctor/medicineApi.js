import axiosInstance from '../axiosInstance';

export const getMedicines = async () => {
  const res = await axiosInstance.get('/doctor/medicine');
  return res.data.data;
};

export const addMedicine = async (newMedicine) => {
  const res = await axiosInstance.post('/doctor/medicine', newMedicine);
  return res.data.data;
}; 