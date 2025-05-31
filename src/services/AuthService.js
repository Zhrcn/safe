import BaseService from './BaseService';

/**
 * AuthService - Service for authentication-related API calls
 */
export default class AuthService extends BaseService {
  constructor() {
    super('/auth');
  }
  
  /**
   * Login a user
   * 
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} role - User role
   * @returns {Promise} The login response
   */
  async login(email, password, role) {
    return this.post('/login', { email, password, role });
  }
  
  /**
   * Register a new user
   * 
   * @param {Object} userData - User registration data
   * @returns {Promise} The registration response
   */
  async register(userData) {
    return this.post('/register', userData);
  }
  
  /**
   * Logout the current user
   * 
   * @returns {Promise} The logout response
   */
  async logout() {
    return this.post('/logout');
  }
  
  /**
   * Request a password reset
   * 
   * @param {string} email - User email
   * @returns {Promise} The password reset request response
   */
  async requestPasswordReset(email) {
    return this.post('/password-reset/request', { email });
  }
  
  /**
   * Reset a password with a token
   * 
   * @param {string} token - Password reset token
   * @param {string} newPassword - New password
   * @returns {Promise} The password reset response
   */
  async resetPassword(token, newPassword) {
    return this.post('/password-reset/reset', { token, newPassword });
  }
  
  /**
   * Verify a user's email
   * 
   * @param {string} token - Email verification token
   * @returns {Promise} The email verification response
   */
  async verifyEmail(token) {
    return this.post('/verify-email', { token });
  }
  
  /**
   * Refresh the authentication token
   * 
   * @returns {Promise} The token refresh response
   */
  async refreshToken() {
    return this.post('/refresh-token');
  }
  
  /**
   * Check if the current user is authenticated
   * 
   * @returns {Promise} The authentication status
   */
  async checkAuth() {
    return this.get('/check');
  }
} 