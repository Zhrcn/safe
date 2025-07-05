const getApiUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
  }
  
  // Production: Use the same domain as frontend but with port 5001
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://safe-webapp.vercel.app';
  const baseUrl = currentOrigin.replace(/:\d+/, ''); // Remove any existing port
  return process.env.NEXT_PUBLIC_API_URL || `${baseUrl}:5001`;
};

export const API_BASE_URL = getApiUrl();

if (typeof window !== 'undefined') {
  console.log('API Base URL:', API_BASE_URL);
  console.log('Current Origin:', window.location.origin);
}