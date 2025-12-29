import { createContext, useState, useContext, useEffect } from 'react';
import auth from '../config/auth';

// Create Context
const AuthContext = createContext(null);

// Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  // Login function
  const login = async (credentials) => {
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

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    loading,
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