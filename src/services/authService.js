import { apiRequest, getToken, setToken } from './api';

const USER_KEY = 'taskflow_user';

export const authService = {
  /**
   * Log in user using OAuth2 password flow (form-urlencoded)
   */
  async login(username, password) {
    const params = new URLSearchParams();
    params.append('username', username.trim());
    params.append('password', password);

    const data = await apiRequest('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (data && data.access_token) {
      setToken(data.access_token);
      const user = await this.getMe();
      return { token: data.access_token, user };
    }

    throw new Error('No access token received from server');
  },

  /**
   * Register a new user
   */
  async register(username, email, password) {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username: username.trim(),
        email: email.trim(),
        password,
      }),
    });
  },

  /**
   * Fetch current authenticated user info
   */
  async getMe() {
    try {
      const user = await apiRequest('/auth/me', { method: 'GET' });
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return user;
    } catch (error) {
      if (error.status === 401) {
        this.logout();
      }
      throw error;
    }
  },

  /**
   * Logout user and clear tokens
   */
  logout() {
    setToken(null);
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Get cached user from localStorage
   */
  getCachedUser() {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  },

  /**
   * Check if token is present
   */
  isAuthenticated() {
    return Boolean(getToken());
  },
};
