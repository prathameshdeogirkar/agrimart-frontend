import api from './api';

/**
 * ✅ DECODE JWT: Extract claims from token
 * Returns decoded payload or null on error
 */
const decodeToken = (token) => {
  try {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const authService = {
  /**
   * ✅ REGISTER: Create new user account
   */
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
    });
    return response.data;
  },

  /**
   * ✅ LOGIN: Authenticate user, store JWT token ONLY
   * JWT is the single source of truth for role and user info
   */
  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    const { token } = response.data;
    if (token) {
      // ✅ Store ONLY the JWT token
      localStorage.setItem('token', token);
      // ✅ Do NOT store role, user, or any other data in localStorage
    }
    return response.data;
  },

  /**
   * ✅ LOGOUT: Clear token and reset all auth state
   */
  logout: () => {
    localStorage.removeItem('token');
    // Clean up any old cached data
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  },

  /**
   * ✅ GET TOKEN: Retrieve JWT from localStorage
   */
  getToken: () => {
    return localStorage.getItem('token');
  },

  /**
   * ✅ IS AUTHENTICATED: Check if JWT exists
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * ✅ DECODE TOKEN: Export for use in AuthContext
   * Always fresh decode, never cached
   */
  decodeToken,
};



