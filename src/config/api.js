const getApiUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
  }
  
  // Production: Use environment variable or default to your production backend URL
  return process.env.NEXT_PUBLIC_API_URL || 'https://safe-backend.onrender.com';
};

export const API_BASE_URL = getApiUrl();

if (typeof window !== 'undefined') {
  console.log('API Base URL:', API_BASE_URL);
  console.log('Current Origin:', window.location.origin);
}