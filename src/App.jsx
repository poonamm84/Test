import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { SuperAdminAuthProvider } from './context/SuperAdminAuthContext';
import { CustomerDataProvider } from './context/CustomerDataContext';
import { NotificationProvider } from './context/NotificationContext';
import HomePage from './pages/HomePage';
import CustomerLogin from './pages/CustomerLogin';
import CustomerSignup from './pages/CustomerSignup';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminLayout from './layouts/AdminLayout';
import SuperAdminLayout from './layouts/SuperAdminLayout';
import AdminLogin from './pages/AdminLogin';
import SuperAdminLogin from './pages/SuperAdminLogin';
import RestaurantView from './pages/RestaurantView';
import MenuView from './pages/MenuView';
import BookingView from './pages/BookingView';
import PreOrderView from './pages/PreOrderView';
import PaymentView from './pages/PaymentView';
import CustomerProtectedRoute from './components/CustomerProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import SuperAdminProtectedRoute from './components/SuperAdminProtectedRoute';
import NotificationToast from './components/NotificationToast';

// Customer App Section
const CustomerApp = () => {
  return (
    <>
      <NotificationToast />
      <CustomerAuthProvider>
        <CustomerDataProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<CustomerLogin />} />
            <Route path="/signup" element={<CustomerSignup />} />
            
            <Route path="/dashboard" element={
              <CustomerProtectedRoute>
                <CustomerDashboard />
              </CustomerProtectedRoute>
            } />
            
            <Route path="/restaurant/:id" element={
              <CustomerProtectedRoute>
                <RestaurantView />
              </CustomerProtectedRoute>
            } />
            
            <Route path="/restaurant/:id/menu" element={
              <CustomerProtectedRoute>
                <MenuView />
              </CustomerProtectedRoute>
            } />
            
            <Route path="/restaurant/:id/booking" element={
              <CustomerProtectedRoute>
                <BookingView />
              </CustomerProtectedRoute>
            } />
            
            <Route path="/restaurant/:id/preorder" element={
              <CustomerProtectedRoute>
                <PreOrderView />
              </CustomerProtectedRoute>
            } />
            
            <Route path="/payment" element={
              <CustomerProtectedRoute>
                <PaymentView />
              </CustomerProtectedRoute>
            } />
          </Routes>
        </CustomerDataProvider>
      </CustomerAuthProvider>
    </>
  );
};

// Admin App Section
const AdminApp = () => {
  return (
    <>
      <NotificationToast />
      <AdminAuthProvider>
        <Routes>
          <Route path="/admin-dashboard-secret-portal-2025" element={<AdminLogin />} />
          <Route path="/admin/*" element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          } />
        </Routes>
      </AdminAuthProvider>
    </>
  );
};

// Super Admin App Section
const SuperAdminApp = () => {
  return (
    <>
      <NotificationToast />
      <SuperAdminAuthProvider>
        <Routes>
          <Route path="/super-admin-control" element={<SuperAdminLogin />} />
          <Route path="/super-admin/*" element={
            <SuperAdminProtectedRoute>
              <SuperAdminLayout />
            </SuperAdminProtectedRoute>
          } />
        </Routes>
      </SuperAdminAuthProvider>
    </>
  );
};

function App() {
  return (
    <NotificationProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Customer Routes */}
            <Route path="/*" element={<CustomerApp />} />
            
            {/* Admin Routes */}
            <Route path="/admin-dashboard-secret-portal-2025" element={
              <>
                <NotificationToast />
                <AdminAuthProvider>
                  <AdminLogin />
                </AdminAuthProvider>
              </>
            } />
            <Route path="/admin/*" element={
              <>
                <NotificationToast />
                <AdminAuthProvider>
                  <AdminProtectedRoute>
                    <AdminLayout />
                  </AdminProtectedRoute>
                </AdminAuthProvider>
              </>
            } />
            
            {/* Super Admin Routes */}
            <Route path="/super-admin-control" element={
              <>
                <NotificationToast />
                <SuperAdminAuthProvider>
                  <SuperAdminLogin />
                </SuperAdminAuthProvider>
              </>
            } />
            <Route path="/super-admin/*" element={
              <>
                <NotificationToast />
                <SuperAdminAuthProvider>
                  <SuperAdminProtectedRoute>
                    <SuperAdminLayout />
                  </SuperAdminProtectedRoute>
                </SuperAdminAuthProvider>
              </>
            } />
          </Routes>
        </div>
      </Router>
    </NotificationProvider>
  );
}

export default App;