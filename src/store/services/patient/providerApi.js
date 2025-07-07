import axiosInstance from '../axiosInstance';

export const getDoctors = async () => {
  const res = await axiosInstance.get('/patients/doctors');
  return res.data.data;
};

export const getPharmacists = async () => {
  const res = await axiosInstance.get('/pharmacists');
  return res.data.data;
};

export const getProviderById = async (id, type) => {
  const res = await axiosInstance.get(`/${type}/${id}`);
  return res.data.data;
};

export const getProviderSchedule = async (id, type) => {
  const res = await axiosInstance.get(`/${type}/${id}/schedule`);
  return res.data.data;
};

export const getProviderReviews = async (id, type) => {
  const res = await axiosInstance.get(`/${type}/${id}/reviews`);
  return res.data.data;
};

export const getProviders = async () => {
  const res = await axiosInstance.get('/patients/providers');
  return res.data.data;
};

export const addProvider = async (providerData) => {
  const res = await axiosInstance.post('/providers', providerData);
  return res.data.data;
};

export const updateProvider = async (id, providerData) => {
  const res = await axiosInstance.put(`/providers/${id}`, providerData);
  return res.data.data;
};

export const deleteProvider = async (id) => {
  const res = await axiosInstance.delete(`/providers/${id}`);
  return res.data.data;
}; 