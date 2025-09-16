import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, role: userRole, authChecked } = useAuth();
  const location = useLocation();

  // Show loading spinner only while checking authentication
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // Redirect to appropriate login page if not authenticated
  if (!isAuthenticated) {
    if (role === 'admin') {
      return <Navigate to="/admin-dashboard-secret-portal-2025" state={{ from: location }} replace />;
    }
    if (role === 'superadmin') {
      return <Navigate to="/super-admin-control" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization
  if (role && userRole !== role) {
    // Role mismatch - redirect to appropriate login page
    if (role === 'admin') {
      return <Navigate to="/admin-dashboard-secret-portal-2025" state={{ from: location }} replace />;
    }
    if (role === 'superadmin') {
      return <Navigate to="/super-admin-control" state={{ from: location }} replace />;
    }
    if (role === 'customer') {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    // Fallback to home page for unknown roles
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;