import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Crown, Users, DollarSign, TrendingUp, Settings, Menu, X, 
  BarChart3, PieChart, Activity, Shield, Zap, Globe, 
  MessageSquare, Bell, UserCheck, Database, Cpu, Server,
  Plus, Edit, Trash2, Save, Eye, Search, Filter, Download,
  AlertTriangle, CheckCircle, XCircle, Clock, MapPin, Phone,
  Monitor, HardDrive, Wifi, Lock, Key, FileText, Mail,
  LineChart, Target, Award, Smartphone, Tablet, Laptop
} from 'lucide-react';
import NotificationToast from '../components/NotificationToast';
import { useNotification } from '../context/NotificationContext';

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const { restaurants } = useData();
  const { addNotification } = useNotification();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
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
    serverUptime: 99.98,
    dailyActiveUsers: 3420,
    conversionRate: 4.2,
    avgSessionDuration: 8.5
  });

  const [systemMetrics, setSystemMetrics] = useState({
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 38,
    networkTraffic: 1250,
    activeConnections: 2847,
    errorRate: 0.02,
    responseTime: 120,
    throughput: 1500,
    availability: 99.98
  });

  const [advancedAnalytics, setAdvancedAnalytics] = useState({
    userGrowth: [
      { month: 'Jan', users: 12000, revenue: 85000 },
      { month: 'Feb', users: 13200, revenue: 92000 },
      { month: 'Mar', users: 14100, revenue: 98000 },
      { month: 'Apr', users: 15420, revenue: 125480 }
    ],
    deviceBreakdown: {
      mobile: 68,
      desktop: 25,
      tablet: 7
    },
    topPerformingRestaurants: [
      { name: 'The Golden Spoon', revenue: 45000, orders: 1200, rating: 4.8 },
      { name: 'Sakura Sushi', revenue: 38000, orders: 980, rating: 4.6 },
      { name: "Mama's Italian", revenue: 42500, orders: 1100, rating: 4.7 }
    ],
    geographicData: [
      { region: 'North America', users: 8500, revenue: 75000 },
      { region: 'Europe', users: 4200, revenue: 32000 },
      { region: 'Asia', users: 2720, revenue: 18480 }
    ]
  });

  const [securityCenter, setSecurityCenter] = useState({
    threatLevel: 'Low',
    activeThreats: 0,
    blockedAttempts: 23,
    lastSecurityScan: '2025-01-15 10:30:00',
    vulnerabilities: 0,
    securityScore: 95,
    recentEvents: [
      { type: 'login', message: 'Admin login from new device', time: '2 hours ago', severity: 'info' },
      { type: 'security', message: 'Security scan completed', time: '6 hours ago', severity: 'success' },
      { type: 'blocked', message: '5 suspicious login attempts blocked', time: '1 day ago', severity: 'warning' }
    ]
  });

  const [databaseManagement, setDatabaseManagement] = useState({
    totalRecords: 1250000,
    databaseSize: '2.4 GB',
    backupStatus: 'Completed',
    lastBackup: '2025-01-15 02:00:00',
    queryPerformance: 95,
    connectionPool: 85,
    tables: [
      { name: 'users', records: 15420, size: '45 MB', lastUpdated: '2025-01-15 14:30' },
      { name: 'restaurants', records: 156, size: '2.1 MB', lastUpdated: '2025-01-15 12:15' },
      { name: 'orders', records: 89000, size: '180 MB', lastUpdated: '2025-01-15 15:45' },
      { name: 'bookings', records: 45000, size: '95 MB', lastUpdated: '2025-01-15 16:20' }
    ]
  });

  const [globalNotifications, setGlobalNotifications] = useState([
    {
      id: 1,
      type: 'system',
      title: 'System Maintenance Scheduled',
      message: 'Scheduled maintenance on Jan 20, 2025 from 2:00 AM - 4:00 AM EST',
      priority: 'high',
      sent: false,
      targetAudience: 'all'
    },
    {
      id: 2,
      type: 'feature',
      title: 'New AI Features Released',
      message: 'Enhanced recommendation engine now available for all restaurants',
      priority: 'medium',
      sent: true,
      targetAudience: 'admins'
    }
  ]);

  const [platformSettings, setPlatformSettings] = useState({
    maintenanceMode: false,
    allowNewRegistrations: true,
    maxRestaurantsPerAdmin: 5,
    sessionTimeout: 30,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    },
    emailSettings: {
      smtpServer: 'smtp.restaurantai.com',
      port: 587,
      encryption: 'TLS',
      fromEmail: 'noreply@restaurantai.com'
    },
    paymentSettings: {
      stripeEnabled: true,
      paypalEnabled: true,
      commissionRate: 2.5
    }
  });

  // Mobile responsive handler
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRestaurantSave = () => {
    if (editingRestaurant) {
      addNotification('Restaurant updated successfully', 'success');
      setEditingRestaurant(null);
    } else {
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

  const sendGlobalNotification = (notificationId) => {
    setGlobalNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, sent: true } : notif
    ));
    addNotification('Global notification sent successfully', 'success');
  };

  const updatePlatformSetting = (key, value) => {
    setPlatformSettings(prev => ({ ...prev, [key]: value }));
    addNotification('Platform setting updated', 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex relative overflow-hidden">
      <NotificationToast />
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && window.innerWidth < 1024 && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-50 w-72 bg-white/10 backdrop-blur-xl border-r border-white/20 transition-transform duration-300 flex flex-col relative`}>
        <div className="p-4 lg:p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Super Admin</h2>
                <p className="text-gray-300 text-xs">Platform Control Center</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:text-gray-300 transition-colors lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {[
              { id: 'overview', label: 'Platform Overview', icon: BarChart3 },
              { id: 'analytics', label: 'Advanced Analytics', icon: TrendingUp },
              { id: 'system-health', label: 'System Health', icon: Activity },
              { id: 'security', label: 'Security Center', icon: Shield },
              { id: 'database', label: 'Database Management', icon: Database },
              { id: 'restaurants', label: 'Restaurant Management', icon: Globe },
              { id: 'users', label: 'User Administration', icon: Users },
              { id: 'notifications', label: 'Global Notifications', icon: Bell },
              { id: 'settings', label: 'Platform Settings', icon: Settings }
            ].map(item => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 text-yellow-200 border border-yellow-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-white/20">
          <div className="text-white">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">{user?.name}</p>
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
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto relative z-10">
        {/* Header */}
        <header className="bg-white/5 backdrop-blur-md border-b border-white/20 px-4 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-white hover:text-gray-300"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white">
                  Platform Command Center
                </h1>
                <p className="text-gray-300 text-sm">Complete system oversight and control</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-green-500/20 border border-green-500/30 px-2 py-1 rounded-full">
                <span className="text-green-200 text-xs">System Operational</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full">
                <span className="text-white text-xs">{platformStats.systemHealth}% Health</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 lg:p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 lg:p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <span className="text-green-300 text-xs font-medium">+{platformStats.monthlyGrowth}%</span>
                  </div>
                  <h3 className="text-gray-300 text-xs mb-1">Total Revenue</h3>
                  <p className="text-lg lg:text-2xl font-bold text-white">${platformStats.totalRevenue.toLocaleString()}</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 lg:p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <Globe className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <span className="text-blue-300 text-xs font-medium">+15.2%</span>
                  </div>
                  <h3 className="text-gray-300 text-xs mb-1">Active Restaurants</h3>
                  <p className="text-lg lg:text-2xl font-bold text-white">{platformStats.totalRestaurants}</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 lg:p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <span className="text-purple-300 text-xs font-medium">+8.3%</span>
                  </div>
                  <h3 className="text-gray-300 text-xs mb-1">Platform Users</h3>
                  <p className="text-lg lg:text-2xl font-bold text-white">{platformStats.totalUsers.toLocaleString()}</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 lg:p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <Activity className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <span className="text-green-300 text-xs font-medium">99.98%</span>
                  </div>
                  <h3 className="text-gray-300 text-xs mb-1">System Health</h3>
                  <p className="text-lg lg:text-2xl font-bold text-white">{platformStats.systemHealth}%</p>
                </div>
              </div>

              {/* System Performance */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 lg:p-6 border border-white/20">
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

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 lg:p-6 border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                    Live Platform Activity
                  </h3>
                  <div className="space-y-4">
                    {[
                      { type: 'order', message: 'New order placed at The Golden Spoon', time: '2 min ago', color: 'text-green-300' },
                      { type: 'booking', message: 'Table reservation at Sakura Sushi', time: '5 min ago', color: 'text-blue-300' },
                      { type: 'user', message: 'New customer registration', time: '8 min ago', color: 'text-purple-300' },
                      { type: 'system', message: 'AI recommendation engine updated', time: '12 min ago', color: 'text-yellow-300' }
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
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* User Growth Chart */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 lg:p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <LineChart className="w-5 h-5 mr-2 text-blue-400" />
                  Advanced Analytics Dashboard
                </h3>
                
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Growth Metrics */}
                  <div>
                    <h4 className="text-lg font-medium text-white mb-4">User & Revenue Growth</h4>
                    <div className="space-y-3">
                      {advancedAnalytics.userGrowth.map((data, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div>
                            <p className="font-medium text-white">{data.month} 2025</p>
                            <p className="text-sm text-gray-300">{data.users.toLocaleString()} users</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-400">${data.revenue.toLocaleString()}</p>
                            <div className="w-20 h-2 bg-gray-700 rounded-full mt-1">
                              <div 
                                className="h-2 bg-green-500 rounded-full"
                                style={{ width: `${(data.revenue / 150000) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Device Breakdown */}
                  <div>
                    <h4 className="text-lg font-medium text-white mb-4">Device Usage</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="w-5 h-5 text-blue-400" />
                          <span className="text-white">Mobile</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-20 h-2 bg-gray-700 rounded-full">
                            <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${advancedAnalytics.deviceBreakdown.mobile}%` }}></div>
                          </div>
                          <span className="text-white font-medium">{advancedAnalytics.deviceBreakdown.mobile}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Laptop className="w-5 h-5 text-green-400" />
                          <span className="text-white">Desktop</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-20 h-2 bg-gray-700 rounded-full">
                            <div className="h-2 bg-green-500 rounded-full" style={{ width: `${advancedAnalytics.deviceBreakdown.desktop}%` }}></div>
                          </div>
                          <span className="text-white font-medium">{advancedAnalytics.deviceBreakdown.desktop}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Tablet className="w-5 h-5 text-purple-400" />
                          <span className="text-white">Tablet</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-20 h-2 bg-gray-700 rounded-full">
                            <div className="h-2 bg-purple-500 rounded-full" style={{ width: `${advancedAnalytics.deviceBreakdown.tablet}%` }}></div>
                          </div>
                          <span className="text-white font-medium">{advancedAnalytics.deviceBreakdown.tablet}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Performing Restaurants */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 lg:p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-400" />
                  Top Performing Restaurants
                </h3>
                <div className="grid lg:grid-cols-3 gap-4">
                  {advancedAnalytics.topPerformingRestaurants.map((restaurant, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-white">{restaurant.name}</h4>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                        }`}>
                          {index + 1}
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Revenue:</span>
                          <span className="text-green-400 font-medium">${restaurant.revenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Orders:</span>
                          <span className="text-blue-400 font-medium">{restaurant.orders}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Rating:</span>
                          <span className="text-yellow-400 font-medium">⭐ {restaurant.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system-health' && (
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 lg:p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Monitor className="w-5 h-5 mr-2 text-green-400" />
                  System Health Monitoring
                </h3>

                {/* Health Overview */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                    <div className="text-2xl font-bold text-green-400">{systemMetrics.availability}%</div>
                    <div className="text-sm text-green-300">Availability</div>
                  </div>
                  <div className="text-center p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                    <div className="text-2xl font-bold text-blue-400">{systemMetrics.responseTime}ms</div>
                    <div className="text-sm text-blue-300">Response Time</div>
                  </div>
                  <div className="text-center p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
                    <div className="text-2xl font-bold text-purple-400">{systemMetrics.throughput}</div>
                    <div className="text-sm text-purple-300">Requests/min</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                    <div className="text-2xl font-bold text-yellow-400">{systemMetrics.errorRate}%</div>
                    <div className="text-sm text-yellow-300">Error Rate</div>
                  </div>
                </div>

                {/* Detailed Metrics */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-4">Server Resources</h4>
                    <div className="space-y-4">
                      {[
                        { label: 'CPU Usage', value: systemMetrics.cpuUsage, icon: Cpu, color: 'blue' },
                        { label: 'Memory Usage', value: systemMetrics.memoryUsage, icon: HardDrive, color: 'green' },
                        { label: 'Disk Usage', value: systemMetrics.diskUsage, icon: Database, color: 'yellow' },
                      ].map((metric, index) => (
                        <div key={index} className="p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <metric.icon className="w-4 h-4 text-gray-300" />
                              <span className="text-white text-sm">{metric.label}</span>
                            </div>
                            <span className="text-white font-medium">{metric.value}%</span>
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

                  <div>
                    <h4 className="text-lg font-medium text-white mb-4">Network & Connections</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Active Connections</span>
                          <span className="text-white font-medium">{systemMetrics.activeConnections.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Network Traffic</span>
                          <span className="text-white font-medium">{systemMetrics.networkTraffic} MB/s</span>
                        </div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Server Uptime</span>
                          <span className="text-green-400 font-medium">{platformStats.serverUptime}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 lg:p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-400" />
                  Security Center
                </h3>

                {/* Security Overview */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                    <div className="text-2xl font-bold text-green-400">{securityCenter.securityScore}</div>
                    <div className="text-sm text-green-300">Security Score</div>
                  </div>
                  <div className="text-center p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                    <div className="text-2xl font-bold text-blue-400">{securityCenter.activeThreats}</div>
                    <div className="text-sm text-blue-300">Active Threats</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                    <div className="text-2xl font-bold text-yellow-400">{securityCenter.blockedAttempts}</div>
                    <div className="text-sm text-yellow-300">Blocked Today</div>
                  </div>
                  <div className="text-center p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
                    <div className="text-2xl font-bold text-purple-400">{securityCenter.vulnerabilities}</div>
                    <div className="text-sm text-purple-300">Vulnerabilities</div>
                  </div>
                </div>

                {/* Security Events */}
                <div>
                  <h4 className="text-lg font-medium text-white mb-4">Recent Security Events</h4>
                  <div className="space-y-3">
                    {securityCenter.recentEvents.map((event, index) => (
                      <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              event.severity === 'success' ? 'bg-green-500' :
                              event.severity === 'warning' ? 'bg-yellow-500' :
                              event.severity === 'error' ? 'bg-red-500' : 'bg-blue-500'
                            }`}></div>
                            <div>
                              <p className="text-white font-medium">{event.message}</p>
                              <p className="text-gray-400 text-sm">{event.time}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            event.severity === 'success' ? 'bg-green-100 text-green-800' :
                            event.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            event.severity === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {event.severity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security Actions */}
                <div className="flex flex-wrap gap-3 mt-6">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    <Shield className="w-4 h-4 inline mr-2" />
                    Run Security Scan
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Update Firewall Rules
                  </button>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                    <Key className="w-4 h-4 inline mr-2" />
                    Rotate API Keys
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 lg:p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Database className="w-5 h-5 mr-2 text-blue-400" />
                  Database Management
                </h3>

                {/* Database Overview */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                    <div className="text-xl font-bold text-blue-400">{databaseManagement.totalRecords.toLocaleString()}</div>
                    <div className="text-sm text-blue-300">Total Records</div>
                  </div>
                  <div className="text-center p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                    <div className="text-xl font-bold text-green-400">{databaseManagement.databaseSize}</div>
                    <div className="text-sm text-green-300">Database Size</div>
                  </div>
                  <div className="text-center p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
                    <div className="text-xl font-bold text-purple-400">{databaseManagement.queryPerformance}%</div>
                    <div className="text-sm text-purple-300">Query Performance</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                    <div className="text-xl font-bold text-yellow-400">{databaseManagement.connectionPool}%</div>
                    <div className="text-sm text-yellow-300">Connection Pool</div>
                  </div>
                </div>

                {/* Tables Overview */}
                <div>
                  <h4 className="text-lg font-medium text-white mb-4">Database Tables</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="text-left py-3 px-4 font-semibold text-gray-300 text-sm">Table Name</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-300 text-sm">Records</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-300 text-sm">Size</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-300 text-sm">Last Updated</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-300 text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {databaseManagement.tables.map((table, index) => (
                          <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                            <td className="py-3 px-4 text-white font-medium">{table.name}</td>
                            <td className="py-3 px-4 text-gray-300">{table.records.toLocaleString()}</td>
                            <td className="py-3 px-4 text-gray-300">{table.size}</td>
                            <td className="py-3 px-4 text-gray-300 text-sm">{table.lastUpdated}</td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <button className="text-blue-400 hover:text-blue-300 p-1">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="text-green-400 hover:text-green-300 p-1">
                                  <Download className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Database Actions */}
                <div className="flex flex-wrap gap-3 mt-6">
                  <button 
                    onClick={() => addNotification('Database backup initiated', 'success')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Download className="w-4 h-4 inline mr-2" />
                    Backup Database
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    <Activity className="w-4 h-4 inline mr-2" />
                    Optimize Performance
                  </button>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 lg:p-6 border border-white/20">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-blue-400" />
                    Global Notifications
                  </h3>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    <Plus className="w-4 h-4 inline mr-2" />
                    Create Notification
                  </button>
                </div>

                <div className="space-y-4">
                  {globalNotifications.map(notification => (
                    <div key={notification.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-3 lg:space-y-0">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-white">{notification.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              notification.priority === 'high' ? 'bg-red-100 text-red-800' :
                              notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {notification.priority}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              notification.sent ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {notification.sent ? 'Sent' : 'Draft'}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm mb-2">{notification.message}</p>
                          <p className="text-gray-400 text-xs">Target: {notification.targetAudience}</p>
                        </div>
                        <div className="flex space-x-2">
                          {!notification.sent && (
                            <button
                              onClick={() => sendGlobalNotification(notification.id)}
                              className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                              <Mail className="w-4 h-4 inline mr-1" />
                              Send
                            </button>
                          )}
                          <button className="text-blue-400 hover:text-blue-300 p-2">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-400 hover:text-red-300 p-2">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 lg:p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-blue-400" />
                  Platform Settings
                </h3>

                <div className="space-y-6">
                  {/* General Settings */}
                  <div>
                    <h4 className="text-lg font-medium text-white mb-4">General Settings</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Maintenance Mode</p>
                          <p className="text-gray-400 text-sm">Temporarily disable platform access</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={platformSettings.maintenanceMode}
                            onChange={(e) => updatePlatformSetting('maintenanceMode', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Allow New Registrations</p>
                          <p className="text-gray-400 text-sm">Enable new user registrations</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={platformSettings.allowNewRegistrations}
                            onChange={(e) => updatePlatformSetting('allowNewRegistrations', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="p-3 bg-white/5 rounded-lg">
                        <label className="block text-white font-medium mb-2">Session Timeout (minutes)</label>
                        <input
                          type="number"
                          value={platformSettings.sessionTimeout}
                          onChange={(e) => updatePlatformSetting('sessionTimeout', parseInt(e.target.value))}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Settings */}
                  <div>
                    <h4 className="text-lg font-medium text-white mb-4">Payment Settings</h4>
                    <div className="grid lg:grid-cols-2 gap-4">
                      <div className="p-3 bg-white/5 rounded-lg">
                        <label className="block text-white font-medium mb-2">Commission Rate (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={platformSettings.paymentSettings.commissionRate}
                          onChange={(e) => setPlatformSettings(prev => ({
                            ...prev,
                            paymentSettings: { ...prev.paymentSettings, commissionRate: parseFloat(e.target.value) }
                          }))}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white">Stripe Enabled</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={platformSettings.paymentSettings.stripeEnabled}
                              onChange={(e) => setPlatformSettings(prev => ({
                                ...prev,
                                paymentSettings: { ...prev.paymentSettings, stripeEnabled: e.target.checked }
                              }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white">PayPal Enabled</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={platformSettings.paymentSettings.paypalEnabled}
                              onChange={(e) => setPlatformSettings(prev => ({
                                ...prev,
                                paymentSettings: { ...prev.paymentSettings, paypalEnabled: e.target.checked }
                              }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => addNotification('Platform settings saved successfully', 'success')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Save All Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs with placeholder content */}
          {!['overview', 'analytics', 'system-health', 'security', 'database', 'notifications', 'settings'].includes(activeTab) && (
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 lg:p-8 border border-white/20">
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
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;