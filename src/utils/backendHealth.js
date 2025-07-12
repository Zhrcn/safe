const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add a timeout to prevent hanging
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      status: 'healthy',
      backend: 'connected',
      message: 'Backend server is running',
      data
    };
  } catch (error) {
    console.error('Backend health check failed:', error);
    
    if (error.name === 'AbortError') {
      return {
        status: 'unhealthy',
        backend: 'timeout',
        message: 'Backend server is not responding (timeout)',
        error: error.message
      };
    }
    
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return {
        status: 'unhealthy',
        backend: 'unreachable',
        message: 'Backend server is not reachable - please check if the server is running',
        error: error.message
      };
    }
    
    return {
      status: 'unhealthy',
      backend: 'error',
      message: 'Backend server error',
      error: error.message
    };
  }
};

export const getBackendStatus = () => {
  return {
    url: API_BASE_URL,
    socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL || API_BASE_URL,
    environment: process.env.NODE_ENV || 'development'
  };
}; 