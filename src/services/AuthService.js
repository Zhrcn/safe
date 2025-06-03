import BaseService from './BaseService';


export default class AuthService extends BaseService {
  constructor() {
    super('/auth');
  }
  

  async login(email, password, role) {
    return this.post('/login', { email, password, role });
  }
  
  async register(userData) {
    return this.post('/register', userData);
  }
  

  async logout() {
    return this.post('/logout');
  }
  
  async requestPasswordReset(email) {
    return this.post('/password-reset/request', { email });
  }
  

  async resetPassword(token, newPassword) {
    return this.post('/password-reset/reset', { token, newPassword });
  }

  async verifyEmail(token) {
    return this.post('/verify-email', { token });
  }
  

  async refreshToken() {
    return this.post('/refresh-token');
  }
  

  async checkAuth() {
    return this.get('/check');
  }
  
  /**
   * Sets the authentication cookie on the server
   * This is used as a backup authentication method
   * @param {string} token - JWT token
   * @returns {Promise<Object>} Response from the server
   */
  async setCookie(token) {
    return this.post('/set-cookie', { token });
  }
} 