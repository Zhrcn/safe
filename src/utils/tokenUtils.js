import { jwtDecode } from 'jwt-decode';
import { AUTH_CONSTANTS } from '@/config/constants';
import { ROLES } from '@/config/app-config';

const TOKEN_KEY = 'safe_auth_token';
const isBrowser = typeof window !== 'undefined';

const cleanupOldTokens = () => {
    if (!isBrowser) return;
    localStorage.removeItem('token');
    localStorage.removeItem('auth_token');
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

export const setToken = (token) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_CONSTANTS.TOKEN_KEY, token);
    }
};

export const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(AUTH_CONSTANTS.TOKEN_KEY);
    }
    return null;
};

export const removeToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_CONSTANTS.TOKEN_KEY);
    }
};

export const hasValidToken = () => {
    const token = getToken();
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 > Date.now();
    } catch (error) {
        return false;
    }
};

export const getTokenExpiration = () => {
    const token = getToken();
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000; 
    } catch (error) {
        console.error('Error getting token expiration:', error);
        return null;
    }
};

export const isTokenExpiringSoon = () => {
    const expirationTime = getTokenExpiration();
    if (!expirationTime) return true;
    const fiveMinutes = 5 * 60 * 1000; 
    return expirationTime - Date.now() < fiveMinutes;
};

export const getUserData = () => {
  try {
    const userData = localStorage.getItem(AUTH_CONSTANTS.USER_STORAGE_KEY);
    if (!userData) return null;
    const parsedData = JSON.parse(userData);
    return {
      ...parsedData,
      role: parsedData.role?.toLowerCase() || ROLES.PATIENT
    };
  } catch (error) {
    console.error('Error getting user data from storage:', error);
    return null;
  }
};

export const setUserData = (userData) => {
  try {
    const dataToStore = {
      ...userData,
      role: userData.role?.toLowerCase() || ROLES.PATIENT
    };
    localStorage.setItem(AUTH_CONSTANTS.USER_STORAGE_KEY, JSON.stringify(dataToStore));
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

export const hasToken = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem(TOKEN_KEY);
        console.log('Checking token:', !!token);
        return !!token;
    }
    return false;
}; 