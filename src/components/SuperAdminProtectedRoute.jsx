import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSuperAdminAuth } from '../context/SuperAdminAuthContext';

const SuperAdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, authChecked } = useSuperAdminAuth();
  const location = useLocation();

  // Show loading spinner only while checking authentication
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            Checking super admin authentication...
          </p>
        </div>
      </div>
    );
  }

  // Redirect to super admin login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/super-admin-control" state={{ from: location }} replace />;
  }

  return children;
};

export default SuperAdminProtectedRoute;