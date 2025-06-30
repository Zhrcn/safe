// API Configuration
const getApiUrl = () => {
  // For development
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
  }
  
  // For production - replace with your actual deployed backend URL
  return process.env.NEXT_PUBLIC_API_URL || 'https://your-backend-domain.com';
};

export const API_BASE_URL = getApiUrl();

// Log the API URL for debugging
if (typeof window !== 'undefined') {
  console.log('API Base URL:', API_BASE_URL);
  console.log('Current Origin:', window.location.origin);
}