const getApiUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
  }
  
  // Production: Use the same domain and port as the unified server
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://safe-webapp.vercel.app';
  return process.env.NEXT_PUBLIC_API_URL || currentOrigin;
};

export const API_BASE_URL = getApiUrl();

if (typeof window !== 'undefined') {
  console.log('API Base URL:', API_BASE_URL);
  console.log('Current Origin:', window.location.origin);
}