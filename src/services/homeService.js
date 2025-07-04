import axiosInstance from '@/store/services/axiosInstance';

export const fetchHomeData = async () => {
  // Adjust the endpoint as needed for your backend
  const response = await axiosInstance.get('/api/home');
  return response.data;
}; 