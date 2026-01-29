import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ... (getRole and useEffect remain same)
  /**
   * ✅ SINGLE SOURCE OF TRUTH: Derive role from JWT token
   * Never cache, always fresh decode from token
   */
  const getRole = () => {
    if (!authService.isAuthenticated()) {
      return 'USER'; // Default for unauthenticated
    }
    const token = authService.getToken();
    const decoded = authService.decodeToken(token);
    return decoded?.role || 'USER';
  };

  /**
   * ✅ Initialize: Check if user was logged in (JWT exists)
   * Extract user info fresh from token on app load
   */
  useEffect(() => {
    if (authService.isAuthenticated()) {
      const token = authService.getToken();
      const decoded = authService.decodeToken(token);
      if (decoded?.sub) {
        setUser({ email: decoded.sub });
      }
    }
    setLoading(false);
  }, []);

  /**
   * ✅ Login: Store JWT, extract user info fresh
   */
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      // After login, extract user from fresh JWT decode
      if (authService.isAuthenticated()) {
        const token = authService.getToken();
        const decoded = authService.decodeToken(token);
        setUser({ email: decoded?.sub });
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  };

  /**
   * ✅ Register: Call service, user logs in after
   */
  const register = async (name, email, password) => {
    try {
      await authService.register(name, email, password);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  /**
   * ✅ Logout: Clear JWT token and reset user state
   * Auth resets automatically because getRole() will return 'USER'
   */
  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success('You have been logged out successfully');
    navigate('/');
  };

  // ✅ Helpers for role checking
  const role = getRole();
  const isAdmin = role === 'ADMIN';
  const isUser = role === 'USER';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        login,
        register,
        logout,
        loading,
        isAdmin,
        isUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};



