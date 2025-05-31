import axios from 'axios';

// Create the API client instance
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling responses and errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Clear auth data and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
      }
    }
    
    // Handle validation errors
    if (error.response?.status === 422) {
      // Format validation errors for form handling
      const validationErrors = error.response.data?.errors || {};
      return Promise.reject({
        ...error,
        validationErrors,
      });
    }
    
    // Handle server errors
    if (error.response?.status && error.response.status >= 500) {
      // Log server errors or show a generic message
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

// Request methods
export const api = {
  get: (url, config) => 
    apiClient.get(url, config).then(response => response.data),
    
  post: (url, data, config) => 
    apiClient.post(url, data, config).then(response => response.data),
    
  put: (url, data, config) => 
    apiClient.put(url, data, config).then(response => response.data),
    
  patch: (url, data, config) => 
    apiClient.patch(url, data, config).then(response => response.data),
    
  delete: (url, config) => 
    apiClient.delete(url, config).then(response => response.data),
};

export default api; 