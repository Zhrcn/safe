import axiosInstance from '../axiosInstance';
import { setToken, getToken, removeToken } from '@/utils/tokenUtils';
import { AUTH_CONSTANTS } from '@/config/constants';

export const login = async (credentials) => {
  const res = await axiosInstance.post(AUTH_CONSTANTS.API_ENDPOINTS.LOGIN, {
    ...credentials,
    role: credentials.role?.toLowerCase(),
  });
  if (res.data.success && res.data.data) {
    setToken(res.data.data.token);
    return {
      success: true,
      user: { ...res.data.data.user, role: res.data.data.user.role?.toLowerCase() },
      token: res.data.data.token,
    };
  }
  return {
    success: false,
    message: res.data.message || AUTH_CONSTANTS.ERROR_MESSAGES.INVALID_CREDENTIALS,
  };
};

export const verifyToken = async () => {
  const res = await axiosInstance.get(AUTH_CONSTANTS.API_ENDPOINTS.CURRENT_USER);
  if (res.data.success && res.data.data) {
    return {
      success: true,
      user: { ...res.data.data, role: res.data.data.role?.toLowerCase() },
    };
  }
  removeToken();
  return {
    success: false,
    message: res.data.message || AUTH_CONSTANTS.ERROR_MESSAGES.INVALID_TOKEN,
  };
};

export const logout = async () => {
  const res = await axiosInstance.post(AUTH_CONSTANTS.API_ENDPOINTS.LOGOUT);
  removeToken();
  return {
    success: true,
    message: res.data.message || AUTH_CONSTANTS.SUCCESS_MESSAGES.LOGOUT_SUCCESS,
  };
};

export const register = async (userData) => {
  const res = await axiosInstance.post(AUTH_CONSTANTS.API_ENDPOINTS.REGISTER, userData);
  if (res.data.success && res.data.data) {
    return res.data.data;
  }
  return {
    success: false,
    message: res.data.message || 'Registration failed',
  };
};

export const resetPassword = async (data) => {
  const res = await axiosInstance.post(AUTH_CONSTANTS.API_ENDPOINTS.RESET_PASSWORD, data);
  if (res.data.success) {
    return true;
  }
  return false;
};

export const updatePassword = async (data) => {
  const res = await axiosInstance.post(AUTH_CONSTANTS.API_ENDPOINTS.UPDATE_PASSWORD, data);
  if (res.data.success) {
    return true;
  }
  return false;
}; 