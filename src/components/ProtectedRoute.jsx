import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, role: userRole } = useAuth();

  if (!isAuthenticated) {
    if (role === 'admin') return <Navigate to="/admin-dashboard-secret-portal-2025" replace />;
    if (role === 'superadmin') return <Navigate to="/super-admin-control" replace />;
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;