// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);

  // Load user permissions on mount
  useEffect(() => {
    if (token && user) {
      fetchUserPermissions();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserPermissions = async () => {
    try {
      const response = await api.get('/user/profile');
      if (response.data?.permissions) {
        setPermissions(response.data.permissions);
      }
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);
    
    // Fetch permissions after login
    if (data.user?.permissions) {
      setPermissions(data.user.permissions);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setPermissions({});
  };

  const isAuthenticated = !!token;

  // Check if user has specific permission
  const hasPermission = (permission) => {
    if (user?.role === 'admin') return true;
    return permissions[permission] || false;
  };

  // Check if user has specific role
  const hasRole = (role) => {
    if (Array.isArray(role)) {
      return role.includes(user?.role);
    }
    return user?.role === role;
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    loading,
    permissions,
    hasPermission,
    hasRole,
    userRole: user?.role || 'viewer',
  };

  return (
    <AuthContext.Provider value={value}>
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