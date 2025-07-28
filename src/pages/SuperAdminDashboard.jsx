import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Crown, Users, DollarSign, TrendingUp, Settings, Menu, X, 
  BarChart3, PieChart, Activity, Shield, Zap, Globe, 
  MessageSquare, Bell, UserCheck, Database, Cpu, Server,
  Plus, Edit, Trash2, Save, Eye, Search, Filter, Download,
  AlertTriangle, CheckCircle, XCircle, Clock, MapPin, Phone
} from 'lucide-react';
import NotificationToast from '../components/NotificationToast';
import { useNotification } from '../context/NotificationContext';

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const { restaurants } = useData();
  const { addNotification } = useNotification();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [showAddRestaurant, setShowAddRestaurant] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    cuisine: '',
    address: '',
    phone: '',
    description: '',
    image: ''
  });

  const [platformStats, setPlatformStats] = useState({
    totalRevenue: 125480.50,
    totalRestaurants: restaurants.length,
    totalUsers: 15420,
    systemHealth: 98.5,
    activeOrders: 347,
    totalBookings: 2840,
    monthlyGrowth: 12.5,
    serverUptime: 99.98
  });

  const [systemMetrics, setSystemMetrics] = useState({
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 38,
    networkTraffic: 1250,
    activeConnections: 2847,
    errorRate: 0.02
  });

  const [platformUsers, setPlatformUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'customer', status: 'active', joinDate: '2024-01-15', orders: 23 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'admin', status: 'active', joinDate: '2024-02-20', orders: 0 },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'customer', status: 'inactive', joinDate: '2024-03-10', orders: 8 },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'customer', status: 'active', joinDate: '2024-01-05', orders: 45 }
  ]);

  const [aiConfig, setAiConfig] = useState({
    responseSpeed: 7,
    personality: 'professional',
    languages: ['English', 'Spanish', 'French'],
    voiceEnabled: true,
    learningMode: true,
    contextMemory: 10
  });

  const handleRestaurantSave = () => {
    if (editingRestaurant) {
      // Update existing restaurant logic
      addNotification('Restaurant updated successfully', 'success');
      setEditingRestaurant(null);
    } else {
      // Add new restaurant logic
      const restaurant = {
        ...newRestaurant,
        id: Date.now(),
        rating: 0,
        tables: []
      };
      addNotification('Restaurant added successfully', 'success');
      setNewRestaurant({
        name: '',
        cuisine: '',
        address: '',
        phone: '',
        description: '',
        image: ''
      });
      setShowAddRestaurant(false);
    }
  };

  const handleUserStatusChange = (userId, newStatus) => {
    setPlatformUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
    addNotification(`User status updated to ${newStatus}`, 'success');
  };

  const updateAiConfig = (key, value) => {
    setAiConfig(prev => ({ ...prev, [key]: value }));
    addNotification('AI configuration updated', 'success');
  };

  const filteredUsers = platformUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex relative overflow-hidden">
      <NotificationToast />
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-16'} bg-white/10 backdrop-blur-xl border-r border-white/20 transition-all duration-300 flex flex-col relative z-10`}>
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">Super Admin</h2>
                  <p className="text-gray-300 text-xs">Platform Control Center</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:text-gray-300 transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {[
              { id: 'overview', label: 'Platform Overview', icon: BarChart3 },
              { id: 'analytics', label: 'Advanced Analytics', icon: TrendingUp },
              { id: 'restaurants', label: 'Restaurant Management', icon: Globe },
              { id: 'users', label: 'User Administration', icon: Users },
              { id: 'ai-config', label: 'AI Configuration', icon: Cpu },
              { id: 'system', label: 'System Health', icon: Activity },
              { id: 'security', label: 'Security Center', icon: Shield },
              { id: 'database', label: 'Database Management', icon: Database },
              { id: 'notifications', label: 'Global Notifications', icon: Bell },
              { id: 'settings', label: 'Platform Settings', icon: Settings }
            ].map(item => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 text-yellow-200 border border-yellow-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-white/20">
          {sidebarOpen ? (
            <div className="text-white">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs text-gray-300">Platform Owner</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full text-red-400 hover:text-red-300 text-sm font-medium transition-colors bg-red-500/10 hover:bg-red-500/20 px-3 py-2 rounded-lg"
              >
                Secure Logout
              </button>
            </div>
          ) : (
            <button
              onClick={logout}
              className="text-red-400 hover:text-red-300 transition-colors"
              title="Secure Logout"
            >
              <Crown className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto relative z-10">
        {/* Header */}
        <header className="bg-white/5 backdrop-blur-md border-b border-white/20 px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Platform Command Center
              </h1>
              <p className="text-gray-300">Complete system oversight and control</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-green-500/20 border border-green-500/30 px-3 py-1 rounded-full">
                <span className="text-green-200 text-sm">System Operational</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-white text-sm">{platformStats.systemHealth}% Health</span>
              </div>
              <div className="bg-blue-500/20 border border-blue-500/30 px-3 py-1 rounded-full">
                <span className="text-blue-200 text-sm">{platformStats.serverUptime}% Uptime</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-green-300 text-sm font-medium">+{platformStats.monthlyGrowth}%</span>
                  </div>
                  <h3 className="text-gray-300 text-sm mb-1">Total Revenue</h3>
                  <p className="text-2xl font-bold text-white">${platformStats.totalRevenue.toLocaleString()}</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-blue-300 text-sm font-medium">+15.2%</span>
                  </div>
                  <h3 className="text-gray-300 text-sm mb-1">Active Restaurants</h3>
                  <p className="text-2xl font-bold text-white">{platformStats.totalRestaurants}</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-purple-300 text-sm font-medium">+8.3%</span>
                  </div>
                  <h3 className="text-gray-300 text-sm mb-1">Platform Users</h3>
                  <p className="text-2xl font-bold text-white">{platformStats.totalUsers.toLocaleString()}</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-green-300 text-sm font-medium">99.98%</span>
                  </div>
                  <h3 className="text-gray-300 text-sm mb-1">System Health</h3>
                  <p className="text-2xl font-bold text-white">{platformStats.systemHealth}%</p>
                </div>
              </div>

              {/* System Metrics */}
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <Server className="w-5 h-5 mr-2 text-blue-400" />
                    System Performance
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: 'CPU Usage', value: systemMetrics.cpuUsage, color: 'blue' },
                      { label: 'Memory Usage', value: systemMetrics.memoryUsage, color: 'green' },
                      { label: 'Disk Usage', value: systemMetrics.diskUsage, color: 'yellow' },
                    ].map((metric, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm text-gray-300 mb-2">
                          <span>{metric.label}</span>
                          <span>{metric.value}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className={`bg-gradient-to-r from-${metric.color}-500 to-${metric.color}-600 h-2 rounded-full transition-all duration-1000`}
                            style={{ width: `${metric.value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                    Live Platform Activity
                  </h3>
                  <div className="space-y-4">
                    {[
                      { type: 'order', message: 'New order placed at The Golden Spoon', time: '2 min ago', color: 'text-green-300' },
                      { type: 'booking', message: 'Table reservation at Sakura Sushi', time: '5 min ago', color: 'text-blue-300' },
                      { type: 'user', message: 'New customer registration', time: '8 min ago', color: 'text-purple-300' },
                      { type: 'system', message: 'AI recommendation engine updated', time: '12 min ago', color: 'text-yellow-300' },
                      { type: 'admin', message: 'Menu updated at Mama\'s Italian', time: '15 min ago', color: 'text-orange-300' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ color: activity.color.replace('text-', '') }}></div>
                        <div className="flex-1">
                          <p className="text-white text-sm">{activity.message}</p>
                          <p className="text-gray-400 text-xs">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Restaurant Performance */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                  Restaurant Performance Overview
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurants.map((restaurant, index) => (
                    <div key={restaurant.id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-white font-medium">{restaurant.name}</h4>
                        <span className="text-green-300 font-semibold">★ {restaurant.rating}</span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-300">
                        <div className="flex justify-between">
                          <span>Revenue Today</span>
                          <span className="text-green-300">${(Math.random() * 2000 + 500).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Orders</span>
                          <span className="text-blue-300">{Math.floor(Math.random() * 50 + 10)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tables Available</span>
                          <span className="text-purple-300">{restaurant.tables.filter(t => t.status === 'available').length}</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.random() * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'restaurants' && (
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    <Globe className="w-6 h-6 mr-2 text-blue-400" />
                    Restaurant Management
                  </h3>
                  <button
                    onClick={() => setShowAddRestaurant(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    Add Restaurant
                  </button>
                </div>

                {/* Add Restaurant Form */}
                {showAddRestaurant && (
                  <div className="bg-white/5 rounded-lg p-6 mb-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-4">Add New Restaurant</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Restaurant Name"
                        value={newRestaurant.name}
                        onChange={(e) => setNewRestaurant({...newRestaurant, name: e.target.value})}
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Cuisine Type"
                        value={newRestaurant.cuisine}
                        onChange={(e) => setNewRestaurant({...newRestaurant, cuisine: e.target.value})}
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Address"
                        value={newRestaurant.address}
                        onChange={(e) => setNewRestaurant({...newRestaurant, address: e.target.value})}
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={newRestaurant.phone}
                        onChange={(e) => setNewRestaurant({...newRestaurant, phone: e.target.value})}
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="url"
                        placeholder="Image URL"
                        value={newRestaurant.image}
                        onChange={(e) => setNewRestaurant({...newRestaurant, image: e.target.value})}
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <textarea
                        placeholder="Description"
                        value={newRestaurant.description}
                        onChange={(e) => setNewRestaurant({...newRestaurant, description: e.target.value})}
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                    </div>
                    <div className="flex space-x-4 mt-4">
                      <button
                        onClick={handleRestaurantSave}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save className="w-4 h-4 inline mr-2" />
                        Save Restaurant
                      </button>
                      <button
                        onClick={() => setShowAddRestaurant(false)}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Restaurant List */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurants.map(restaurant => (
                    <div key={restaurant.id} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-32 object-cover rounded-lg mb-4"
                      />
                      <h4 className="text-white font-semibold mb-2">{restaurant.name}</h4>
                      <div className="space-y-1 text-sm text-gray-300 mb-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{restaurant.address}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>{restaurant.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rating: {restaurant.rating}</span>
                          <span>Tables: {restaurant.tables.length}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingRestaurant(restaurant)}
                          className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Edit className="w-4 h-4 inline mr-1" />
                          Edit
                        </button>
                        <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm">
                          <Eye className="w-4 h-4 inline mr-1" />
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    <Users className="w-6 h-6 mr-2 text-blue-400" />
                    User Administration
                  </h3>
                  <div className="flex space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      <Download className="w-4 h-4 inline mr-2" />
                      Export
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-3 px-4 font-semibold text-gray-300">User</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-300">Role</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-300">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-300">Join Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-300">Orders</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => (
                        <tr key={user.id} className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4">
                            <div>
                              <p className="text-white font-medium">{user.name}</p>
                              <p className="text-gray-400 text-sm">{user.email}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={user.status}
                              onChange={(e) => handleUserStatusChange(user.id, e.target.value)}
                              className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                user.status === 'active' 
                                  ? 'bg-green-100 text-green-800 border-green-200' 
                                  : 'bg-red-100 text-red-800 border-red-200'
                              }`}
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                              <option value="suspended">Suspended</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-gray-300">{user.joinDate}</td>
                          <td className="py-3 px-4 text-gray-300">{user.orders}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button className="text-blue-400 hover:text-blue-300">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-yellow-400 hover:text-yellow-300">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-red-400 hover:text-red-300">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai-config' && (
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <Cpu className="w-6 h-6 mr-3 text-blue-400" />
                AI System Configuration
              </h3>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-white font-medium mb-3">AI Response Speed</label>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        value={aiConfig.responseSpeed}
                        onChange={(e) => updateAiConfig('responseSpeed', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-sm text-gray-300 mt-2">
                        <span>Slow</span>
                        <span>Current: {aiConfig.responseSpeed}</span>
                        <span>Ultra Fast</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-3">AI Personality</label>
                    <select 
                      value={aiConfig.personality}
                      onChange={(e) => updateAiConfig('personality', e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="professional">Professional & Helpful</option>
                      <option value="friendly">Friendly & Casual</option>
                      <option value="sophisticated">Sophisticated & Elegant</option>
                      <option value="enthusiastic">Enthusiastic & Energetic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-3">Language Support</label>
                    <div className="space-y-2">
                      {['English', 'Spanish', 'French', 'Italian', 'German'].map(lang => (
                        <label key={lang} className="flex items-center space-x-3">
                          <input 
                            type="checkbox" 
                            checked={aiConfig.languages.includes(lang)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                updateAiConfig('languages', [...aiConfig.languages, lang]);
                              } else {
                                updateAiConfig('languages', aiConfig.languages.filter(l => l !== lang));
                              }
                            }}
                            className="rounded" 
                          />
                          <span className="text-gray-300">{lang}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-3">Context Memory (conversations)</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={aiConfig.contextMemory}
                      onChange={(e) => updateAiConfig('contextMemory', parseInt(e.target.value))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <h4 className="text-green-200 font-semibold mb-2 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      AI Status: Online
                    </h4>
                    <p className="text-green-300 text-sm">All AI modules functioning optimally</p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-white font-semibold mb-3">AI Performance Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Queries Handled Today</span>
                        <span className="text-white">1,247</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Satisfaction Rate</span>
                        <span className="text-green-300">98.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Avg Response Time</span>
                        <span className="text-blue-300">0.8s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Bookings Assisted</span>
                        <span className="text-purple-300">156</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Learning Progress</span>
                        <span className="text-yellow-300">87%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input 
                        type="checkbox" 
                        checked={aiConfig.voiceEnabled}
                        onChange={(e) => updateAiConfig('voiceEnabled', e.target.checked)}
                        className="rounded" 
                      />
                      <span className="text-gray-300">Enable Voice Responses</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input 
                        type="checkbox" 
                        checked={aiConfig.learningMode}
                        onChange={(e) => updateAiConfig('learningMode', e.target.checked)}
                        className="rounded" 
                      />
                      <span className="text-gray-300">Continuous Learning Mode</span>
                    </label>
                  </div>

                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium">
                    Deploy AI Updates
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs with enhanced placeholder content */}
          {!['overview', 'restaurants', 'users', 'ai-config'].includes(activeTab) && (
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-semibold text-white mb-6 capitalize flex items-center">
                <Settings className="w-6 h-6 mr-3 text-blue-400" />
                {activeTab.replace('-', ' ')} Management
              </h3>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-gray-300 text-lg mb-2">Advanced {activeTab.replace('-', ' ')} Features</p>
                <p className="text-gray-400">This premium control panel section provides comprehensive {activeTab.replace('-', ' ')} management tools for platform administrators.</p>
                <div className="mt-6 grid md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-white font-medium mb-2">Real-time Monitoring</h4>
                    <p className="text-gray-400 text-sm">Live system monitoring and alerts</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-white font-medium mb-2">Advanced Analytics</h4>
                    <p className="text-gray-400 text-sm">Detailed performance insights</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-white font-medium mb-2">Automated Management</h4>
                    <p className="text-gray-400 text-sm">Smart automation tools</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;