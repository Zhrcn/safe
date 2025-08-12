export const extractErrorMessage = (error) => {
  if (!error) return 'An error occurred';
  
  if (typeof error === 'string') return error;
  
  if (error.message) {
    if (typeof error.message === 'string') return error.message;
    if (typeof error.message === 'object') {
      return error.message.message || JSON.stringify(error.message);
    }
  }
  
  if (error.response?.data) {
    const data = error.response.data;
    if (typeof data === 'string') return data;
    if (data.message) return data.message;
    if (data.error) return data.error;
    return JSON.stringify(data);
  }
  
  if (error.statusCode && error.message) {
    return error.message;
  }
  
  if (error.success === false && error.message) {
    return error.message;
  }
  
  try {
    return JSON.stringify(error);
  } catch {
    return 'An unknown error occurred';
  }
};


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