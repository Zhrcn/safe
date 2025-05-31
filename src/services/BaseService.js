import axios from 'axios';
import { API_BASE_URL } from '@/lib/config';

// Constants
const TOKEN_STORAGE_KEY = 'safe_auth_token';
const USER_STORAGE_KEY = 'safe_user_data';

export default class BaseService {
  constructor(basePath = '') {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}${basePath}`,
      headers: {
        'Content-Type': 'application/json',
      },
      // Include credentials for cookie-based auth
      withCredentials: true,
    });
    
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle network errors (CORS issues, etc.)
        if (!error.response) {
          console.error('Network error:', error.message);
          
          // Check if it might be a CORS issue
          if (error.message === 'Network Error') {
            console.warn('Possible CORS issue. Check server configuration.');
          }
        }
        else if (error.response) {
          const { status } = error.response;
          
          if (status === 401) {
            // Only redirect to login if the error is not from the auth check endpoint
            if (!error.config.url.includes('/auth/check')) {
              localStorage.removeItem('safe_auth_token');
              localStorage.removeItem('safe_user_data');
              
              // Don't redirect if already on login page or home page
              const currentPath = window.location.pathname;
              if (currentPath !== '/login' && currentPath !== '/') {
                window.location.href = '/login';
              }
            }
          }
          
          if (status === 403) {
            console.error('Permission denied');
          }
          
          if (status === 404) {
            console.error('Resource not found');
          }
          
          if (status >= 500) {
            console.error('Server error');
          }
        }
        
        return Promise.reject(error);
      }
    );
  }
  
  /** 
   * @param {string} url 
   * @param {Object} params 
   * @param {Object} config 
   * @returns {Promise} 
   */
  async get(url, params = {}, config = {}) {
    try {
      const response = await this.api.get(url, { 
        params, 
        ...config,
        withCredentials: true 
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  /**
   * @param {string} url 
   * @param {Object} data 
   * @param {Object} config 
   * @returns {Promise} 
   */
  async post(url, data = {}, config = {}) {
    try {
      const response = await this.api.post(url, data, { 
        ...config,
        withCredentials: true 
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  /**
   * @param {string} url 
   * @param {Object} data 
   * @param {Object} config 
   * @returns {Promise} 
   */
  async put(url, data = {}, config = {}) {
    try {
      const response = await this.api.put(url, data, { 
        ...config,
        withCredentials: true 
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  /** 
   * @param {string} url 
   * @param {Object} data 
   * @param {Object} config 
   * @returns {Promise} 
   */
  async patch(url, data = {}, config = {}) {
    try {
      const response = await this.api.patch(url, data, { 
        ...config,
        withCredentials: true 
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  /**
   * @param {string} url 
   * @param {Object} config 
   * @returns {Promise}
   */
  async delete(url, config = {}) {
    try {
      const response = await this.api.delete(url, { 
        ...config,
        withCredentials: true 
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  /**
   * @param {Error} error - The error object
   * @private
   */
  handleError(error) {
    if (error.response) {
      console.error('API Error Response:', error.response.data);
    } else if (error.request) {
      console.error('API No Response:', error.request);
    } else {
      console.error('API Request Error:', error.message);
    }
  }
} 