/**
 * Extract error message from various error formats
 * @param {any} error - The error object or response
 * @returns {string} - The extracted error message
 */
export const extractErrorMessage = (error) => {
  if (!error) return 'An error occurred';
  
  // If it's already a string, return it
  if (typeof error === 'string') return error;
  
  // If it's an object with a message property
  if (error.message) {
    if (typeof error.message === 'string') return error.message;
    if (typeof error.message === 'object') {
      return error.message.message || JSON.stringify(error.message);
    }
  }
  
  // If it's an API response object
  if (error.response?.data) {
    const data = error.response.data;
    if (typeof data === 'string') return data;
    if (data.message) return data.message;
    if (data.error) return data.error;
    return JSON.stringify(data);
  }
  
  // If it's an object with statusCode and message (backend format)
  if (error.statusCode && error.message) {
    return error.message;
  }
  
  // If it's an object with success and message
  if (error.success === false && error.message) {
    return error.message;
  }
  
  // Fallback: stringify the error
  try {
    return JSON.stringify(error);
  } catch {
    return 'An unknown error occurred';
  }
};

/**
 * Handle auth errors specifically
 * @param {any} error - The error object
 * @returns {string} - The extracted error message
 */
export const handleAuthError = (error) => {
  return extractErrorMessage(error);
};

export const handleApiError = (error) => {
  const message = error.data?.message || error.message || 'API error';
  const status = error.status || 500;
  const errorType = error.name || 'UnknownError';
  return {
    message,
    status,
    type: errorType,
    originalError: error
  };
};
export const isAuthError = (error) => {
  return error.status === 401 || error.status === 403;
};
export const isNetworkError = (error) => {
  return error.name === 'NetworkError' || !error.status;
};
export const getErrorMessage = (error) => {
  if (isNetworkError(error)) {
    return 'Network error. Please check your connection.';
  }
  if (isAuthError(error)) {
    return 'Authentication error. Please log in again.';
  }
  return error.message || 'An unexpected error occurred.';
}; 