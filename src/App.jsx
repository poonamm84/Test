import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CustomerLogin from './pages/CustomerLogin';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminLogin from './pages/SuperAdminLogin';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import RestaurantView from './pages/RestaurantView';
import MenuView from './pages/MenuView';
import BookingView from './pages/BookingView';
import PreOrderView from './pages/PreOrderView';
import PaymentView from './pages/PaymentView';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading with premium animation
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-purple-500/20 border-b-purple-500 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">RestaurantAI Platform</h2>
          <p className="text-blue-200 animate-pulse">Initializing AI-Powered Experience...</p>
          <div className="mt-4 w-64 h-1 bg-gray-700 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" style={{ width: '100%', animation: 'loading 2s ease-in-out' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <DataProvider>
        <NotificationProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<CustomerLogin />} />
                <Route path="/admin-portal-secure" element={<AdminLogin />} />
                <Route path="/super-admin-control" element={<SuperAdminLogin />} />
                
                <Route path="/dashboard" element={
                  <ProtectedRoute role="customer">
                    <CustomerDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/restaurant/:id" element={
                  <ProtectedRoute role="customer">
                    <RestaurantView />
                  </ProtectedRoute>
                } />
                
                <Route path="/restaurant/:id/menu" element={
                  <ProtectedRoute role="customer">
                    <MenuView />
                  </ProtectedRoute>
                } />
                
                <Route path="/restaurant/:id/booking" element={
                  <ProtectedRoute role="customer">
                    <BookingView />
                  </ProtectedRoute>
                } />
                
                <Route path="/restaurant/:id/preorder" element={
                  <ProtectedRoute role="customer">
                    <PreOrderView />
                  </ProtectedRoute>
                } />
                
                <Route path="/payment" element={
                  <ProtectedRoute role="customer">
                    <PaymentView />
                  </ProtectedRoute>
                } />
                
                <Route path="/admin" element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/super-admin" element={
                  <ProtectedRoute role="superadmin">
                    <SuperAdminDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </NotificationProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;