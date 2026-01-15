import { createContext, useState, useContext, useEffect } from 'react';
import auth from '../config/auth';
import api from '../config/api';

// Create Context
const AuthContext = createContext(null);

// Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const init = async () => {
      const currentUser = auth.getCurrentUser();
      setUser(currentUser);
      // If token exists, refresh user from backend to avoid stale localStorage data
      if (auth.isAuthenticated()) {
        try {
          const refreshed = await refreshUser()
          if (refreshed) setUser(refreshed)
        } catch (e) {
          // ignore
        }
      }
      setLoading(false);
    }
    init()
  }, []);

  // Login function
  const login = async (credentials) => {
    // Check if email has declined instructor request BEFORE logging in
    if (credentials.email) {
      try {
        const checkRes = await api.post('/instructors/check-declined', { email: credentials.email });
        if (checkRes.data?.declined) {
          throw new Error('Your instructor request has been declined. You cannot login with this account.');
        }
      } catch (err) {
        if (err.message && err.message.includes('declined')) {
          throw err;
        }
        // Ignore network errors and proceed
      }
    }
    
    const response = await auth.login(credentials);
    setUser(response.user);
    return response;
  };

  // Register function
  const register = async (userData) => {
    const response = await auth.register(userData);
    setUser(response.user);
    return response;
  };

  // Logout function
  const logout = async () => {
    await auth.logout();
    setUser(null);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && auth.isAuthenticated();
  };

  // Refresh user data from backend (useful after payment/enrollment)
  const refreshUser = async () => {
    try {
      const res = await api.get('/student/dashboard');
      const newUser = res.data?.user || null;
      if (newUser) {
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
      }
      return newUser;
    } catch (e) {
      return null;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    loading,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}