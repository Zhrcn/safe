import axiosInstance from '../axiosInstance';

export const getDoctors = async () => {
  const res = await axiosInstance.get('/patients/doctors');
  return res.data.data;
};

export const getDoctorById = async (id) => {
  const res = await axiosInstance.get(`/doctors/${id}`);
  return res.data.data;
};

export const getPatientDetails = async (id) => {
  const res = await axiosInstance.get(`/patients/${id}`);
  return res.data.data;
};

export const createDoctor = async (doctorData) => {
  const res = await axiosInstance.post('/doctors', doctorData);
  return res.data.data;
};

export const updateDoctor = async (id, doctorData) => {
  const res = await axiosInstance.put(`/doctors/${id}`, doctorData);
  return res.data.data;
};

export const deleteDoctor = async (id) => {
  const res = await axiosInstance.delete(`/doctors/${id}`);
  return res.data.data;
};
