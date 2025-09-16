 import React, { createContext, useContext, useState, useEffect } from 'react';

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Check for stored authentication on app load
    const checkStoredAuth = () => {
      try {
        // Get current path to determine which auth to check
        const currentPath = window.location.pathname;
        let authPrefix = 'customer';
        
        if (currentPath.startsWith('/admin')) {
          authPrefix = 'admin';
        } else if (currentPath.startsWith('/super-admin')) {
          authPrefix = 'superadmin';
        }
        
        const storedUser = localStorage.getItem(`${authPrefix}_user`);
        const storedRole = localStorage.getItem(`${authPrefix}_role`);
        const storedToken = localStorage.getItem(`${authPrefix}_token`);
        
        if (storedUser && storedRole && storedToken) {
          const parsedUser = JSON.parse(storedUser);
            
          // Validate token is not expired
          try {
            const tokenPayload = JSON.parse(atob(storedToken.split('.')[1]));
            const currentTime = Date.now() / 1000;
            
            if (tokenPayload.exp && tokenPayload.exp > currentTime) {
              // Token is valid - check if role matches current path
              if ((authPrefix === 'customer' && storedRole === 'customer') ||
                  (authPrefix === 'admin' && storedRole === 'admin') ||
                  (authPrefix === 'superadmin' && storedRole === 'superadmin')) {
              setUser(parsedUser);
              setRole(storedRole);
              setToken(storedToken);
              setIsAuthenticated(true);
                console.log(`✅ ${authPrefix} authentication restored from localStorage`);
              } else {
                // Role doesn't match current path, clear auth
                console.log(`⚠️ Role mismatch for path, clearing ${authPrefix} auth`);
                clearAuthForRole(authPrefix);
              }
            } else {
              // Token expired, clear storage
              console.log(`⚠️ Token expired, clearing ${authPrefix} auth`);
              clearAuthForRole(authPrefix);
            }
          } catch (tokenError) {
            console.error('Error parsing token:', tokenError);
            clearAuthForRole(authPrefix);
          }
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear all auth data on error
        clearAllAuth();
      } finally {
        setAuthChecked(true);
      }
    };
    
    checkStoredAuth();
  }, []);

  const clearAuthForRole = (roleType) => {
    localStorage.removeItem(`${roleType}_user`);
    localStorage.removeItem(`${roleType}_role`);
    localStorage.removeItem(`${roleType}_token`);
  };

  const clearAllAuth = () => {
    ['customer', 'admin', 'superadmin'].forEach(roleType => {
      clearAuthForRole(roleType);
    });
  };

  const login = (userData, userRole, authToken) => {
    console.log('🔐 Logging in user:', userData.name, 'Role:', userRole);
    
    // Clear any existing auth for other roles to prevent conflicts
    clearAllAuth();
    
    setUser(userData);
    setRole(userRole);
    setToken(authToken);
    setIsAuthenticated(true);
    
    // Store auth data with role prefix for isolation
    localStorage.setItem(`${userRole}_user`, JSON.stringify(userData));
    localStorage.setItem(`${userRole}_role`, userRole);
    localStorage.setItem(`${userRole}_token`, authToken);
  };

  const logout = () => {
    console.log('🚪 Logging out user');
    const currentRole = role;
    setUser(null);
    setRole(null);
    setToken(null);
    setIsAuthenticated(false);
    
    // Only clear auth for current role
    if (currentRole) {
      clearAuthForRole(currentRole);
    } else {
      // Fallback: clear all auth if role is unknown
      clearAllAuth();
    }
  };

  // API helper function
  const apiCall = async (endpoint, options = {}) => {
    setIsLoading(true);
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      // Handle network errors gracefully
      if (!response.ok) {
        const data = await response.json().catch(() => ({ message: 'Network error occurred' }));
        
        // Only logout on authentication errors, not on other errors
        if (response.status === 401 && data.message && data.message.includes('token')) {
          console.log('🔒 Token expired or invalid, logging out');
          logout();
        }
        throw new Error(data.message || `API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      // Handle network connection errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.warn('⚠️ Network connection error - backend may not be running');
        throw new Error('Unable to connect to server. Please ensure the backend is running.');
      }
      
      // Log other errors for debugging
      if (!error.message.includes('fetch') && !error.message.includes('Network')) {
        console.error('API call error:', error);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    role,
    token,
    isAuthenticated,
    isLoading,
    authChecked,
    login,
    logout,
    apiCall
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};