import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000')
  : (import.meta.env.VITE_API_BASE_URL && !import.meta.env.VITE_API_BASE_URL.includes('localhost')
      ? import.meta.env.VITE_API_BASE_URL
      : 'https://blood-donation-server1.vercel.app');

// Create a custom Axios instance
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// Axios Request Interceptor to append JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('blood_donation_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('blood_donation_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Validate token and fetch user details on load
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/users/profile');
        setUser(response.data);
      } catch (err) {
        console.error('Failed to validate token:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: receivedToken, user: loggedUser } = response.data;
      
      localStorage.setItem('blood_donation_token', receivedToken);
      setToken(receivedToken);
      setUser(loggedUser);
      return loggedUser;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', userData);
      const { token: receivedToken, user: registeredUser } = response.data;
      
      localStorage.setItem('blood_donation_token', receivedToken);
      setToken(receivedToken);
      setUser(registeredUser);
      return registeredUser;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('blood_donation_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      setUser(response.data);
      return response.data;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update profile.';
      throw new Error(errMsg);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
