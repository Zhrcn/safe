const getApiUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
  }
  
  return process.env.NEXT_PUBLIC_API_URL || 'https://your-backend-domain.com';
};

export const API_BASE_URL = getApiUrl();

if (typeof window !== 'undefined') {
  console.log('API Base URL:', API_BASE_URL);
  console.log('Current Origin:', window.location.origin);
}