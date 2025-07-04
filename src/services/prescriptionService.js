import axiosInstance from '@/store/services/axiosInstance';

export const fetchPrescriptionsService = () => {
  return axiosInstance.get('/prescriptions');
}; 