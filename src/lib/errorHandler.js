/**
 * Standardized error handling for API responses
 * @param {Error} error - The error object
 * @param {string} defaultMessage - Default error message if none is provided
 * @returns {Object} Standardized error response object
 */
export function handleApiError(error, defaultMessage = 'An error occurred') {
  console.error('API Error:', error);
  
  // Determine error type and appropriate status code
  let status = 500;
  let errorMessage = defaultMessage;
  let errorType = 'server_error';
  
  if (error.name === 'ValidationError') {
    status = 400;
    errorMessage = 'Validation error';
    errorType = 'validation_error';
  } else if (error.name === 'MongoServerError' && error.code === 11000) {
    status = 409;
    errorMessage = 'Duplicate entry';
    errorType = 'duplicate_error';
  } else if (error.message === 'Operation timed out' || error.message.includes('timed out')) {
    status = 504;
    errorMessage = 'Request timed out';
    errorType = 'timeout_error';
  } else if (error.message.includes('not found')) {
    status = 404;
    errorMessage = error.message;
    errorType = 'not_found';
  } else if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    status = 401;
    errorMessage = 'Authentication error';
    errorType = 'auth_error';
  }
  
  return {
    success: false,
    error: errorMessage,
    message: error.message,
    status,
    headers: { 'x-error-type': errorType, 'x-data-source': 'error' }
  };
}

/**
 * Safely handles errors with fallback to mock data
 * @param {Error} error - The error object
 * @param {Function} mockDataFn - Function that returns mock data
 * @param {string} errorContext - Context where the error occurred (for logging)
 * @returns {Object} Object containing data and headers for response
 */
export function handleErrorWithMockData(error, mockDataFn, errorContext = 'API') {
  console.error(`${errorContext} Error:`, error);
  
  const mockData = mockDataFn();
  
  return {
    data: mockData,
    status: 200, // Return 200 with mock data instead of error status
    headers: { 
      'x-data-source': 'mock',
      'x-data-completeness': 'partial',
      'x-error-type': error.name || 'server_error',
      'x-error-message': error.message
    }
  };
}
