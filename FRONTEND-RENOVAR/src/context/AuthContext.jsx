import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { checkUserIdentifier, loginWithPassword, firstTimeLogin } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokenData = localStorage.getItem('authToken');
    if (tokenData) {
      try {
        const parsedToken = JSON.parse(tokenData);
        const decodedToken = jwtDecode(parsedToken.access_token);
        setUser({ ...parsedToken, decoded: decodedToken });
      } catch (error) {
        console.error("Error decoding token from localStorage", error);
        localStorage.removeItem('authToken');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (tokenData) => {
    try {
      const decodedToken = jwtDecode(tokenData.access_token);
      const userData = { ...tokenData, decoded: decodedToken };
      localStorage.setItem('authToken', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Error decoding token", error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  useEffect(() => {
    let activityTimer;

    const resetTimer = () => {
      clearTimeout(activityTimer);
      activityTimer = setTimeout(() => {
        logout();
      }, 15 * 60 * 1000); // 15 minutes
    };

    const handleActivity = () => {
      resetTimer();
    };

    // Event listeners for user activity
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('click', handleActivity);

    resetTimer(); // Initial timer setup

    return () => {
      clearTimeout(activityTimer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      logout, 
      isAuthenticated: !!user,
      loading,
      // Nuevas funciones de login
      checkUserIdentifier,
      loginWithPassword: async (email, password) => {
        const tokenData = await loginWithPassword(email, password);
        handleLogin(tokenData);
      },
      firstTimeLogin: async (identifier, password) => {
        const tokenData = await firstTimeLogin(identifier, password);
        handleLogin(tokenData);
      }
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
