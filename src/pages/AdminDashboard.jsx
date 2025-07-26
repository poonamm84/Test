import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { BarChart, Users, DollarSign, Clock, Settings, Menu, X, MessageSquare } from 'lucide-react';
import NotificationToast from '../components/NotificationToast';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { restaurants } = useData();
  const [selectedRestaurant, setSelectedRestaurant] = useState(restaurants[0]?.id || 1);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentRestaurant = restaurants.find(r => r.id === selectedRestaurant);

  const mockStats = {
    todayRevenue: 2450.75,
    todayOrders: 18,
    activeBookings: 12,
    avgRating: 4.7
  };

  const mockOrders = [
    { id: 1, customer: 'John Doe', items: 3, total: 45.99, status: 'preparing', time: '2:30 PM' },
    { id: 2, customer: 'Jane Smith', items: 2, total: 32.50, status: 'ready', time: '2:45 PM' },
    { id: 3, customer: 'Mike Johnson', items: 4, total: 67.25, status: 'delivered', time: '3:00 PM' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <NotificationToast />
      
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gradient-to-b from-slate-900 to-slate-800 transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h2 className="text-white font-bold text-lg">Admin Panel</h2>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:text-gray-300 transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Restaurant Selector */}
        {sidebarOpen && (
          <div className="p-4 border-b border-slate-700">
            <label className="block text-gray-300 text-sm mb-2">Select Restaurant</label>
            <select
              value={selectedRestaurant}
              onChange={(e) => setSelectedRestaurant(parseInt(e.target.value))}
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {restaurants.map(restaurant => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart },
              { id: 'orders', label: 'Orders', icon: Clock },
              { id: 'customers', label: 'Customers', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: DollarSign },
              { id: 'ai-support', label: 'AI Support', icon: MessageSquare },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(item => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-slate-700">
          {sidebarOpen ? (
            <div className="text-white">
              <p className="text-sm text-gray-300">Signed in as</p>
              <p className="font-semibold">{user?.name}</p>
              <button
                onClick={logout}
                className="text-red-400 hover:text-red-300 text-sm mt-2 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={logout}
              className="text-red-400 hover:text-red-300 transition-colors"
              title="Sign out"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentRestaurant?.name} Dashboard
              </h1>
              <p className="text-gray-600">Manage your restaurant operations</p>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Today's Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">${mockStats.todayRevenue}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Today's Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{mockStats.todayOrders}</p>
                    </div>
                    <Clock className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Active Bookings</p>
                      <p className="text-2xl font-bold text-gray-900">{mockStats.activeBookings}</p>
                    </div>
                    <Users className="w-8 h-8 text-purple-500" />
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Avg Rating</p>
                      <p className="text-2xl font-bold text-gray-900">{mockStats.avgRating}</p>
                    </div>
                    <BarChart className="w-8 h-8 text-yellow-500" />
                  </div>
                </div>
              </div>

              {/* Table Status */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Table Status</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {currentRestaurant?.tables.map(table => (
                      <div
                        key={table.id}
                        className={`aspect-square rounded-lg flex items-center justify-center text-white font-semibold text-sm ${
                          table.status === 'available' ? 'bg-green-500' :
                          table.status === 'reserved' ? 'bg-yellow-500' :
                          table.status === 'occupied' ? 'bg-red-500' : 'bg-gray-500'
                        }`}
                      >
                        {table.number}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                      <span>Reserved</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span>Occupied</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-500 rounded"></div>
                      <span>Cleaning</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                  <div className="space-y-3">
                    {mockOrders.map(order => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold">{order.customer}</p>
                          <p className="text-sm text-gray-600">{order.items} items • ${order.total}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">{order.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai-support' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">AI Support Chat</h3>
              <div className="bg-gray-50 rounded-lg p-4 h-96 mb-4 overflow-y-auto">
                <div className="space-y-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <p className="font-semibold text-blue-900">AI Assistant</p>
                    <p className="text-blue-800">Hello! I'm here to help you manage your restaurant operations. What would you like assistance with?</p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Ask me anything about restaurant management..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Send
                </button>
              </div>
            </div>
          )}

          {/* Other tabs would be implemented similarly */}
          {activeTab !== 'overview' && activeTab !== 'ai-support' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 capitalize">{activeTab} Management</h3>
              <p className="text-gray-600">This section is under development. Advanced {activeTab} management features will be available here.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;