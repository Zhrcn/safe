import { api } from '../api';

export const providerApi = {
  getDoctors: () => api.get('/doctors'),
  getPharmacists: () => api.get('/pharmacists'),
  getProviderById: (id, type) => api.get(`/${type}/${id}`),
  getProviderSchedule: (id, type) => api.get(`/${type}/${id}/schedule`),
  getProviderReviews: (id, type) => api.get(`/${type}/${id}/reviews`),
}; 