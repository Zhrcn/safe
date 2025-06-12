import { jwtDecode } from 'jwt-decode';
import { AUTH_CONSTANTS } from '@/config/constants';

// Token storage key
const TOKEN_KEY = AUTH_CONSTANTS.TOKEN_STORAGE_KEY || 'safe_auth_token';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Clean up any existing tokens with different keys
const cleanupOldTokens = () => {
    if (!isBrowser) return;
    localStorage.removeItem('token');
    localStorage.removeItem('auth_token');
    // Add any other old token keys here if needed
};

export const verifyToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
};

/**
 * Set the authentication token in localStorage
 * @param {string} token - The JWT token to store
 */
export const setToken = (token) => {
    if (!isBrowser) return;
    if (!token) {
        console.error('Attempting to set invalid token');
        return;
    }
    try {
        cleanupOldTokens(); // Clean up old tokens first
        localStorage.setItem(TOKEN_KEY, token);
        console.log('Token set successfully');
    } catch (error) {
        console.error('Error setting token:', error);
    }
};

/**
 * Get the authentication token from localStorage
 * @returns {string|null} The stored token or null if not found
 */
export const getToken = () => {
    if (!isBrowser) return null;
    try {
        const token = localStorage.getItem(TOKEN_KEY);
        console.log('Getting token:', token);
        return token;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

/**
 * Remove the authentication token from localStorage
 */
export const removeToken = () => {
    if (!isBrowser) return;
    try {
        localStorage.removeItem(TOKEN_KEY);
        console.log('Token removed');
    } catch (error) {
        console.error('Error removing token:', error);
    }
};

/**
 * Check if a token exists and is valid
 * @returns {boolean} True if token exists and is valid
 */
export const hasValidToken = () => {
    const token = getToken();
    if (!token) return false;

    try {
        // Basic JWT validation
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        return Date.now() < expirationTime;
    } catch (error) {
        console.error('Error validating token:', error);
        return false;
    }
};

// Get token expiration time
export const getTokenExpiration = () => {
    const token = getToken();
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000; // Convert to milliseconds
    } catch (error) {
        console.error('Error getting token expiration:', error);
        return null;
    }
};

// Check if token is about to expire (within 5 minutes)
export const isTokenExpiringSoon = () => {
    const expirationTime = getTokenExpiration();
    if (!expirationTime) return true;

    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
    return expirationTime - Date.now() < fiveMinutes;
};

export const getUserData = () => {
  try {
    const userData = localStorage.getItem(AUTH_CONSTANTS.USER_STORAGE_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data from storage:', error);
    return null;
  }
};

export const setUserData = (userData) => {
  try {
    localStorage.setItem(AUTH_CONSTANTS.USER_STORAGE_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Error setting user data in storage:', error);
  }
};

export const removeUserData = () => {
  try {
    localStorage.removeItem(AUTH_CONSTANTS.USER_STORAGE_KEY);
  } catch (error) {
    console.error('Error removing user data from storage:', error);
  }
};

// Check if token exists
export const hasToken = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        console.log('Checking token:', !!token);
        return !!token;
    }
    return false;
}; 