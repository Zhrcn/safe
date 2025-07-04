import {} from '@/store/services/api';

export const fetchPrescriptionsApi = () => {
  return axiosInstance.get('/api/prescriptions');
}; 