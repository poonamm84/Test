import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SuperAdminSidebar from '../components/SuperAdminSidebar';
import SuperAdminOverview from '../pages/superadmin/SuperAdminOverview';
import SuperAdminRestaurants from '../pages/superadmin/SuperAdminRestaurants';
import SuperAdminUsers from '../pages/superadmin/SuperAdminUsers';
import SuperAdminAnalytics from '../pages/superadmin/SuperAdminAnalytics';
import SuperAdminMonitoring from '../pages/superadmin/SuperAdminMonitoring';
import SuperAdminNotifications from '../pages/superadmin/SuperAdminNotifications';
import SuperAdminSettings from '../pages/superadmin/SuperAdminSettings';

const SuperAdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SuperAdminSidebar />
      <div className="flex-1 ml-64 p-8">
        <Routes>
          <Route path="/" element={<SuperAdminOverview />} />
          <Route path="/restaurants" element={<SuperAdminRestaurants />} />
          <Route path="/users" element={<SuperAdminUsers />} />
          <Route path="/analytics" element={<SuperAdminAnalytics />} />
          <Route path="/monitoring" element={<SuperAdminMonitoring />} />
          <Route path="/notifications" element={<SuperAdminNotifications />} />
          <Route path="/settings" element={<SuperAdminSettings />} />
        </Routes>
      </div>
    </div>
  );
};

export default SuperAdminLayout;