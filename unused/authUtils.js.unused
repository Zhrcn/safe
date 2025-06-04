/**
 * Utility functions for authentication-related operations
 */

/**
 * Check the authentication state and log detailed diagnostics
 * This function can be called in components or debug scripts to understand auth issues
 */
export const diagnoseAuthState = () => {
  console.group('🔍 Authentication State Diagnosis');
  
  try {
    // Check localStorage tokens
    const token = localStorage.getItem('safe_auth_token');
    const userData = localStorage.getItem('safe_user_data');
    
    console.log('Token in localStorage:', !!token);
    console.log('User data in localStorage:', !!userData);
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log('User role:', user.role);
        console.log('User email:', user.email);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    
    // Check cookies
    const cookies = document.cookie.split('; ');
    const authCookie = cookies.find(cookie => cookie.startsWith('safe_auth_token='));
    
    console.log('Auth cookie exists:', !!authCookie);
    if (authCookie) {
      console.log('Auth cookie:', authCookie);
    }
    
    // Browser security info
    console.log('Protocol:', window.location.protocol);
    console.log('Host:', window.location.host);
    console.log('Third-party cookies allowed:', document.cookie !== '');
    
    return {
      hasToken: !!token,
      hasUserData: !!userData,
      hasAuthCookie: !!authCookie,
      protocol: window.location.protocol,
      host: window.location.host
    };
  } catch (error) {
    console.error('Error in auth diagnosis:', error);
    return { error: error.message };
  } finally {
    console.groupEnd();
  }
};

/**
 * Call the API auth check endpoint and report detailed results
 * @returns {Promise<Object>} Authentication check results
 */
export const testAuthAPI = async () => {
  console.group('🔄 API Authentication Check');
  
  try {
    const token = localStorage.getItem('safe_auth_token');
    
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    console.log('Calling /api/auth/check with headers:', headers);
    
    const response = await fetch('/api/auth/check', {
      method: 'GET',
      headers,
      credentials: 'include' // Important for cookies
    });
    
    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Response data:', data);
    
    return {
      status: response.status,
      authenticated: data.authenticated,
      diagnostics: data.diagnostics || {},
      error: data.error
    };
  } catch (error) {
    console.error('Error in API auth check:', error);
    return { error: error.message };
  } finally {
    console.groupEnd();
  }
};

/**
 * Test the cookie setting functionality by using the refresh-cookie API
 * @param {string} token - The JWT token to set in the cookie
 * @returns {Promise<Object>} Results of the cookie refresh attempt
 */
export const testCookieSetting = async (token) => {
  console.group('🍪 Cookie Setting Test');
  
  try {
    if (!token) {
      token = localStorage.getItem('safe_auth_token');
      if (!token) {
        console.error('No token available for cookie test');
        return { success: false, error: 'No token available' };
      }
    }
    
    console.log('Using token for cookie test:', token.substring(0, 10) + '...');
    
    // Try setting via API
    const response = await fetch('/api/auth/refresh-cookie', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify({ token })
    });
    
    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Response data:', data);
    
    // Check if cookie was set
    setTimeout(() => {
      const cookies = document.cookie.split('; ');
      const authCookie = cookies.find(cookie => cookie.startsWith('safe_auth_token='));
      console.log('Auth cookie after API call:', !!authCookie);
    }, 500);
    
    return {
      status: response.status,
      success: response.ok,
      data
    };
  } catch (error) {
    console.error('Error in cookie setting test:', error);
    return { success: false, error: error.message };
  } finally {
    console.groupEnd();
  }
};

/**
 * Get the authentication token with priority order and fallbacks
 * @returns {string|null} The authentication token or null if not found
 */
export const getAuthToken = () => {
  try {
    // First try localStorage
    const token = localStorage.getItem('safe_auth_token');
    if (token) return token;
    
    // Then try cookies
    const cookies = document.cookie.split('; ');
    const authCookie = cookies.find(cookie => cookie.startsWith('safe_auth_token='));
    if (authCookie) {
      return authCookie.split('=')[1];
    }
    
    return null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};
