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
  const res = await axiosInstance.put(`/consultations/${id}/answer`, { answer });
  return res.data.data;
};

export const addFollowUpQuestion = async (consultationId, question) => {
  const res = await axiosInstance.post(`/consultations/${consultationId}/follow-up`, { question });
  return res.data.data;
};

export const getConsultationMessages = async (consultationId) => {
  const res = await axiosInstance.get(`/consultations/${consultationId}/messages`);
  return res.data.data;
};

export const getConsultationsByDoctorAndPatient = async (patientId) => {
  const res = await axiosInstance.get(`/patients/${patientId}/consultations`);
  return res.data.data?.consultations || [];
}; 