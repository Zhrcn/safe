import { useState, useCallback } from 'react';
import { useNotification } from '@/components/ui/Notification';

/**
 * Custom hook for making API calls with consistent error handling and loading states
 * 
 * @template T
 * @template P
 * @param {(params: P) => Promise<T>} apiFunction - The API function to call
 * @param {Object} options - Options for the API call
 * @param {boolean} options.showSuccessNotification - Whether to show success notifications
 * @param {boolean} options.showErrorNotification - Whether to show error notifications
 * @param {string} options.successMessage - Custom success message
 * @returns {Object} API call state and execute function
 */
export function useAPI(apiFunction, options = {}) {
  const {
    showSuccessNotification = false,
    showErrorNotification = true,
    successMessage = 'Operation completed successfully'
  } = options;
  
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const notification = useNotification();
  
  const execute = useCallback(async (params) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunction(params);
      setData(result);
      
      if (showSuccessNotification) {
        notification.showNotification(successMessage, 'success');
      }
      
      return { success: true, data: result };
    } catch (err) {
      console.error('API Error:', err);
      
      const errorMessage = err.response?.data?.error || err.message || 'An error occurred';
      setError(errorMessage);
      
      if (showErrorNotification) {
        notification.showNotification(errorMessage, 'error');
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [apiFunction, notification, showSuccessNotification, showErrorNotification, successMessage]);
  
  return {
    data,
    error,
    loading,
    execute,
    reset: useCallback(() => {
      setData(null);
      setError(null);
      setLoading(false);
    }, [])
  };
} 