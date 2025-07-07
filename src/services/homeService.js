import axiosInstance from '@/store/services/axiosInstance';

export const fetchHomeData = async () => {
  const response = await axiosInstance.get('/api/home');
  return response.data;
}; 