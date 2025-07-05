import axios from 'axios';
import { getToken } from '@/utils/tokenUtils';

const getBaseURL = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;
  }
  
  if (process.env.NODE_ENV === 'production') {
    // Use the same domain (Next.js API routes will proxy to backend)
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://safe-webapp.vercel.app';
    return `${currentOrigin}/api/v1`;
  }
  
  return 'http://localhost:5001/api/v1';
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Axios Request:', config.url, 'Authorization:', config.headers.Authorization);
  return config;
});

export default axiosInstance; 