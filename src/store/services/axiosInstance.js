import axios from 'axios';
import { getToken } from '@/utils/tokenUtils';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
    : 'http://localhost:5001/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  console.log('AXIOS TOKEN (from localStorage):', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance; 