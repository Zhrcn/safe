import axiosInstance from '../axiosInstance';

export const getConsultations = async () => {
  const res = await axiosInstance.get('/consultations');
  return res.data.data;
};

export const createConsultation = async (doctorId, question) => {
  const res = await axiosInstance.post('/consultations', { doctorId, question });
  return res.data.data;
};

export const answerConsultation = async (id, answer) => {
  const res = await axiosInstance.put(`/consultations/${id}`, { answer });
  return res.data.data;
}; 