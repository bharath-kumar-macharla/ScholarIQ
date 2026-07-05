import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Failed to restore session:", error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setLoading(false);
    };

    initAuth();

    // Listen for auth errors from interceptor
    const handleAuthError = () => {
      setUser(null);
      setIsAuthenticated(false);
    };
    window.addEventListener('auth-error', handleAuthError);
    return () => window.removeEventListener('auth-error', handleAuthError);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    handleAuthResponse(res.data);
    return res.data;
  };

  const register = async (userData, isProvider = false) => {
    const endpoint = isProvider ? '/auth/register/provider' : '/auth/register';
    const res = await api.post(endpoint, userData);
    handleAuthResponse(res.data);
    return res.data;
  };
  
  const googleLogin = async (googleData) => {
    const res = await api.post('/auth/google', googleData);
    handleAuthResponse(res.data);
    return res.data;
  };

  const handleAuthResponse = (data) => {
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      setUser(data.user);
      setIsAuthenticated(true);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, register, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
