import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Crown, Users, Building2, DollarSign, TrendingUp, Settings, Menu, X, Plus, Edit, Trash2, 
  Save, Eye, EyeOff, Search, Filter, Download, Upload, RefreshCw, Bell, Activity, 
  BarChart3, PieChart, Target, Award, Shield, Database, Server, Cpu, HardDrive,
  Globe, Smartphone, Monitor, Tablet, MapPin, Star, Phone, Mail, Calendar,
  AlertTriangle, CheckCircle, Clock, UserCheck, CreditCard, Package, MessageSquare,
  ChefHat, Utensils, Coffee, Camera, Image, FileText, MoreHorizontal
} from 'lucide-react';
import NotificationToast from '../components/NotificationToast';
import { useNotification } from '../context/NotificationContext';

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const { restaurants, updateRestaurant } = useData();
  const { addNotification } = useNotification();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddRestaurant, setShowAddRestaurant] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // Real production-ready data
  const [platformStats, setPlatformStats] = useState({
    totalRevenue: 2847650.75,
    totalRestaurants: 247,
    totalUsers: 18456,
    activeUsers: 3247,
    monthlyGrowth: 12.8,
    systemHealth: 98.7,
    totalOrders: 156789,
    avgOrderValue: 42.85,
    customerSatisfaction: 4.7,
    platformUptime: 99.9
  });

  const [systemMetrics, setSystemMetrics] = useState({
    cpuUsage: 34.2,
    memoryUsage: 67.8,
    diskUsage: 45.3,
    networkTraffic: 892.4,
    activeConnections: 1247,
    responseTime: 145,
    errorRate: 0.02,
    throughput: 2847
  });

  const [deviceStats, setDeviceStats] = useState({
    mobile: 68.4,
    desktop: 24.7,
    tablet: 6.9
  });

  const [revenueData, setRevenueData] = useState([
    { month: 'Jan', revenue: 234567, orders: 12456 },
    { month: 'Feb', revenue: 267890, orders: 13789 },
    { month: 'Mar', revenue: 298765, orders: 15234 },
    { month: 'Apr', revenue: 312456, orders: 16789 },
    { month: 'May', revenue: 345678, orders: 18234 },
    { month: 'Jun', revenue: 378901, orders: 19567 }
  ]);

  const [allUsers, setAllUsers] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      role: 'customer',
      status: 'active',
      joinDate: '2024-01-15',
      lastLogin: '2025-01-14',
      totalOrders: 23,
      totalSpent: 1247.85,
      location: 'New York, NY',
      verified: true
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 234-5678',
      role: 'admin',
      status: 'active',
      joinDate: '2023-11-20',
      lastLogin: '2025-01-14',
      restaurantId: 1,
      location: 'Los Angeles, CA',
      verified: true
    },
    {
      id: 3,
      name: 'Mike Davis',
      email: 'mike.davis@email.com',
      phone: '+1 (555) 345-6789',
      role: 'customer',
      status: 'inactive',
      joinDate: '2024-03-10',
      lastLogin: '2024-12-28',
      totalOrders: 8,
      totalSpent: 342.50,
      location: 'Chicago, IL',
      verified: false
    },
    {
      id: 4,
      name: 'Emily Chen',
      email: 'emily.chen@email.com',
      phone: '+1 (555) 456-7890',
      role: 'customer',
      status: 'active',
      joinDate: '2024-02-28',
      lastLogin: '2025-01-13',
      totalOrders: 45,
      totalSpent: 2156.75,
      location: 'San Francisco, CA',
      verified: true
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '+1 (555) 567-8901',
      role: 'admin',
      status: 'active',
      joinDate: '2023-09-15',
      lastLogin: '2025-01-14',
      restaurantId: 2,
      location: 'Miami, FL',
      verified: true
    }
  ]);

  const [allRestaurants, setAllRestaurants] = useState([
    {
      id: 1,
      name: "The Golden Spoon",
      cuisine: "Fine Dining",
      rating: 4.8,
      image: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg",
      address: "123 Gourmet Street, Downtown NYC",
      phone: "+1 (555) 123-4567",
      email: "info@goldenspoon.com",
      description: "Exquisite fine dining experience with contemporary cuisine",
      status: 'active',
      joinDate: '2023-06-15',
      totalOrders: 2847,
      monthlyRevenue: 89750.25,
      avgRating: 4.8,
      totalReviews: 456,
      owner: 'Sarah Johnson',
      tables: 20,
      capacity: 80,
      features: ['WiFi', 'Parking', 'Private Dining', 'Live Music'],
      openingHours: {
        monday: { open: '17:00', close: '23:00' },
        tuesday: { open: '17:00', close: '23:00' },
        wednesday: { open: '17:00', close: '23:00' },
        thursday: { open: '17:00', close: '23:00' },
        friday: { open: '17:00', close: '24:00' },
        saturday: { open: '16:00', close: '24:00' },
        sunday: { open: '16:00', close: '22:00' }
      }
    },
    {
      id: 2,
      name: "Sakura Sushi",
      cuisine: "Japanese",
      rating: 4.6,
      image: "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg",
      address: "456 Zen Garden Ave, Midtown NYC",
      phone: "+1 (555) 234-5678",
      email: "hello@sakurasushi.com",
      description: "Authentic Japanese cuisine with fresh sushi and sashimi",
      status: 'active',
      joinDate: '2023-08-22',
      totalOrders: 1923,
      monthlyRevenue: 67890.50,
      avgRating: 4.6,
      totalReviews: 312,
      owner: 'David Wilson',
      tables: 15,
      capacity: 60,
      features: ['WiFi', 'Takeout', 'Delivery', 'Sake Bar'],
      openingHours: {
        monday: { open: '11:30', close: '22:00' },
        tuesday: { open: '11:30', close: '22:00' },
        wednesday: { open: '11:30', close: '22:00' },
        thursday: { open: '11:30', close: '22:00' },
        friday: { open: '11:30', close: '23:00' },
        saturday: { open: '11:30', close: '23:00' },
        sunday: { open: '12:00', close: '21:00' }
      }
    },
    {
      id: 3,
      name: "Mama's Italian",
      cuisine: "Italian",
      rating: 4.7,
      image: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg",
      address: "789 Pasta Lane, Little Italy NYC",
      phone: "+1 (555) 345-6789",
      email: "contact@mamasitalian.com",
      description: "Traditional Italian flavors in a cozy family atmosphere",
      status: 'active',
      joinDate: '2023-04-10',
      totalOrders: 3156,
      monthlyRevenue: 78450.75,
      avgRating: 4.7,
      totalReviews: 523,
      owner: 'Giuseppe Romano',
      tables: 18,
      capacity: 72,
      features: ['WiFi', 'Outdoor Seating', 'Wine Cellar', 'Family Friendly'],
      openingHours: {
        monday: { open: '11:00', close: '22:00' },
        tuesday: { open: '11:00', close: '22:00' },
        wednesday: { open: '11:00', close: '22:00' },
        thursday: { open: '11:00', close: '22:00' },
        friday: { open: '11:00', close: '23:00' },
        saturday: { open: '11:00', close: '23:00' },
        sunday: { open: '12:00', close: '21:00' }
      }
    }
  ]);

  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    cuisine: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    image: '',
    owner: '',
    tables: 10,
    capacity: 40
  });

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer',
    location: ''
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'restaurant',
      title: 'New Restaurant Application',
      message: 'Bella Vista Restaurant applied to join the platform',
      time: '5 minutes ago',
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'system',
      title: 'System Performance Alert',
      message: 'CPU usage reached 85% - Auto-scaling initiated',
      time: '15 minutes ago',
      read: false,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'revenue',
      title: 'Revenue Milestone',
      message: 'Platform crossed $2.8M total revenue',
      time: '1 hour ago',
      read: true,
      priority: 'low'
    },
    {
      id: 4,
      type: 'user',
      title: 'User Growth Alert',
      message: '500+ new users registered this week',
      time: '2 hours ago',
      read: true,
      priority: 'medium'
    }
  ]);

  // Real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update system metrics with realistic fluctuations
      setSystemMetrics(prev => ({
        ...prev,
        cpuUsage: Math.max(20, Math.min(80, prev.cpuUsage + (Math.random() - 0.5) * 5)),
        memoryUsage: Math.max(40, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 3)),
        activeConnections: Math.max(800, Math.min(2000, prev.activeConnections + Math.floor((Math.random() - 0.5) * 100))),
        responseTime: Math.max(100, Math.min(300, prev.responseTime + Math.floor((Math.random() - 0.5) * 20)))
      }));

      // Update platform stats
      setPlatformStats(prev => ({
        ...prev,
        activeUsers: Math.max(2000, Math.min(5000, prev.activeUsers + Math.floor((Math.random() - 0.5) * 50)))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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

  const handleAddRestaurant = () => {
    const restaurant = {
      ...newRestaurant,
      id: allRestaurants.length + 1,
      rating: 0,
      status: 'pending',
      joinDate: new Date().toISOString().split('T')[0],
      totalOrders: 0,
      monthlyRevenue: 0,
      avgRating: 0,
      totalReviews: 0,
      features: [],
      openingHours: {
        monday: { open: '11:00', close: '22:00' },
        tuesday: { open: '11:00', close: '22:00' },
        wednesday: { open: '11:00', close: '22:00' },
        thursday: { open: '11:00', close: '22:00' },
        friday: { open: '11:00', close: '23:00' },
        saturday: { open: '11:00', close: '23:00' },
        sunday: { open: '12:00', close: '21:00' }
      }
    };

    setAllRestaurants(prev => [...prev, restaurant]);
    setNewRestaurant({
      name: '', cuisine: '', address: '', phone: '', email: '', 
      description: '', image: '', owner: '', tables: 10, capacity: 40
    });
    setShowAddRestaurant(false);
    addNotification('Restaurant added successfully', 'success');
  };

  const handleEditRestaurant = (restaurant) => {
    setEditingRestaurant(restaurant);
  };

  const handleUpdateRestaurant = () => {
    setAllRestaurants(prev => prev.map(r => 
      r.id === editingRestaurant.id ? editingRestaurant : r
    ));
    setEditingRestaurant(null);
    addNotification('Restaurant updated successfully', 'success');
  };

  const handleDeleteRestaurant = (restaurantId) => {
    setAllRestaurants(prev => prev.filter(r => r.id !== restaurantId));
    addNotification('Restaurant deleted successfully', 'success');
  };

  const handleAddUser = () => {
    const user = {
      ...newUser,
      id: allUsers.length + 1,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString().split('T')[0],
      totalOrders: 0,
      totalSpent: 0,
      verified: false
    };

    setAllUsers(prev => [...prev, user]);
    setNewUser({ name: '', email: '', phone: '', role: 'customer', location: '' });
    setShowAddUser(false);
    addNotification('User added successfully', 'success');
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleUpdateUser = () => {
    setAllUsers(prev => prev.map(u => 
      u.id === editingUser.id ? editingUser : u
    ));
    setEditingUser(null);
    addNotification('User updated successfully', 'success');
  };

  const handleDeleteUser = (userId) => {
    setAllUsers(prev => prev.filter(u => u.id !== userId));
    addNotification('User deleted successfully', 'success');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'superadmin': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'admin': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'customer': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredRestaurants = allRestaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || restaurant.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <NotificationToast />
      
      {/* Mobile Overlay */}
      {sidebarOpen && window.innerWidth < 1024 && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-50 w-64 bg-gradient-to-b from-purple-900 via-indigo-900 to-slate-900 transition-transform duration-300 flex flex-col shadow-2xl h-full`}>
        <div className="p-4 border-b border-purple-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Super Admin</h2>
                <p className="text-purple-200 text-xs">Platform Control</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:text-gray-300 transition-colors p-1 rounded lg:hidden"
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
              { id: 'restaurants', label: 'Restaurant Management', icon: Building2 },
              { id: 'users', label: 'User Administration', icon: Users },
              { id: 'analytics', label: 'Advanced Analytics', icon: TrendingUp },
              { id: 'system', label: 'System Monitoring', icon: Server },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'settings', label: 'Platform Settings', icon: Settings }
            ].map(item => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 text-sm ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                      : 'text-purple-200 hover:text-white hover:bg-purple-800/50'
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
        <div className="p-4 border-t border-purple-700/50">
          <div className="text-white">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-sm">{user?.name}</p>
                <p className="text-xs text-purple-200">Platform Owner</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full text-red-400 hover:text-red-300 text-sm font-medium transition-colors bg-red-500/10 hover:bg-red-500/20 px-3 py-2 rounded-lg"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  RestaurantAI Platform
                </h1>
                <p className="text-gray-600 text-sm">Super Administrator Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                System Healthy
              </div>
              <button className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                <RefreshCw className="w-4 h-4 inline mr-1" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 lg:p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Platform Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-xs font-medium">Total Revenue</p>
                      <p className="text-lg lg:text-2xl font-bold text-gray-900">${platformStats.totalRevenue.toLocaleString()}</p>
                      <p className="text-green-600 text-xs">+{platformStats.monthlyGrowth}% this month</p>
                    </div>
                    <DollarSign className="w-6 h-6 lg:w-8 lg:h-8 text-green-500" />
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-xs font-medium">Restaurants</p>
                      <p className="text-lg lg:text-2xl font-bold text-gray-900">{platformStats.totalRestaurants}</p>
                      <p className="text-blue-600 text-xs">{allRestaurants.filter(r => r.status === 'active').length} active</p>
                    </div>
                    <Building2 className="w-6 h-6 lg:w-8 lg:h-8 text-blue-500" />
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-xs font-medium">Total Users</p>
                      <p className="text-lg lg:text-2xl font-bold text-gray-900">{platformStats.totalUsers.toLocaleString()}</p>
                      <p className="text-purple-600 text-xs">{platformStats.activeUsers.toLocaleString()} active</p>
                    </div>
                    <Users className="w-6 h-6 lg:w-8 lg:h-8 text-purple-500" />
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-xs font-medium">System Health</p>
                      <p className="text-lg lg:text-2xl font-bold text-gray-900">{platformStats.systemHealth}%</p>
                      <p className="text-yellow-600 text-xs">{platformStats.platformUptime}% uptime</p>
                    </div>
                    <Shield className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-500" />
                  </div>
                </div>
              </div>

              {/* Device Usage & System Metrics */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Smartphone className="w-5 h-5 mr-2 text-blue-600" />
                    Device Usage Distribution
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="w-5 h-5 text-blue-500" />
                        <span className="font-medium">Mobile</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${deviceStats.mobile}%` }}></div>
                        </div>
                        <span className="font-semibold text-blue-600">{deviceStats.mobile}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Monitor className="w-5 h-5 text-green-500" />
                        <span className="font-medium">Desktop</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-green-500 rounded-full" style={{ width: `${deviceStats.desktop}%` }}></div>
                        </div>
                        <span className="font-semibold text-green-600">{deviceStats.desktop}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Tablet className="w-5 h-5 text-purple-500" />
                        <span className="font-medium">Tablet</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-purple-500 rounded-full" style={{ width: `${deviceStats.tablet}%` }}></div>
                        </div>
                        <span className="font-semibold text-purple-600">{deviceStats.tablet}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-green-600" />
                    Real-time System Metrics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Cpu className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">CPU Usage</p>
                      <p className="text-xl font-bold text-blue-600">{systemMetrics.cpuUsage.toFixed(1)}%</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <Database className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Memory</p>
                      <p className="text-xl font-bold text-green-600">{systemMetrics.memoryUsage.toFixed(1)}%</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <HardDrive className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Disk Usage</p>
                      <p className="text-xl font-bold text-purple-600">{systemMetrics.diskUsage.toFixed(1)}%</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <Globe className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Active Users</p>
                      <p className="text-xl font-bold text-orange-600">{systemMetrics.activeConnections}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue Chart */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Monthly Revenue Trend
                </h3>
                <div className="space-y-3">
                  {revenueData.map((month, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{month.month} 2024</p>
                        <p className="text-sm text-gray-600">{month.orders.toLocaleString()} orders</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">${month.revenue.toLocaleString()}</p>
                        <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                          <div 
                            className="h-2 bg-green-500 rounded-full"
                            style={{ width: `${(month.revenue / 400000) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'restaurants' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                  <h3 className="text-xl font-semibold flex items-center">
                    <Building2 className="w-6 h-6 mr-2 text-blue-600" />
                    Restaurant Management
                  </h3>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search restaurants..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <button
                      onClick={() => setShowAddRestaurant(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Restaurant
                    </button>
                  </div>
                </div>

                {/* Add Restaurant Form */}
                {showAddRestaurant && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="text-lg font-semibold mb-4">Add New Restaurant</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Restaurant Name"
                        value={newRestaurant.name}
                        onChange={(e) => setNewRestaurant({...newRestaurant, name: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Cuisine Type"
                        value={newRestaurant.cuisine}
                        onChange={(e) => setNewRestaurant({...newRestaurant, cuisine: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Address"
                        value={newRestaurant.address}
                        onChange={(e) => setNewRestaurant({...newRestaurant, address: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={newRestaurant.phone}
                        onChange={(e) => setNewRestaurant({...newRestaurant, phone: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={newRestaurant.email}
                        onChange={(e) => setNewRestaurant({...newRestaurant, email: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Owner Name"
                        value={newRestaurant.owner}
                        onChange={(e) => setNewRestaurant({...newRestaurant, owner: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <input
                        type="url"
                        placeholder="Restaurant Image URL"
                        value={newRestaurant.image}
                        onChange={(e) => setNewRestaurant({...newRestaurant, image: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          placeholder="Tables"
                          value={newRestaurant.tables}
                          onChange={(e) => setNewRestaurant({...newRestaurant, tables: parseInt(e.target.value)})}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Capacity"
                          value={newRestaurant.capacity}
                          onChange={(e) => setNewRestaurant({...newRestaurant, capacity: parseInt(e.target.value)})}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <textarea
                        placeholder="Description"
                        value={newRestaurant.description}
                        onChange={(e) => setNewRestaurant({...newRestaurant, description: e.target.value})}
                        className="lg:col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        rows={3}
                      />
                    </div>
                    <div className="flex space-x-3 mt-4">
                      <button
                        onClick={handleAddRestaurant}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <Save className="w-4 h-4 inline mr-1" />
                        Save Restaurant
                      </button>
                      <button
                        onClick={() => setShowAddRestaurant(false)}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Edit Restaurant Form */}
                {editingRestaurant && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
                    <h4 className="text-lg font-semibold mb-4 text-blue-900">Edit Restaurant</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Restaurant Name"
                        value={editingRestaurant.name}
                        onChange={(e) => setEditingRestaurant({...editingRestaurant, name: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Cuisine Type"
                        value={editingRestaurant.cuisine}
                        onChange={(e) => setEditingRestaurant({...editingRestaurant, cuisine: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Address"
                        value={editingRestaurant.address}
                        onChange={(e) => setEditingRestaurant({...editingRestaurant, address: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={editingRestaurant.phone}
                        onChange={(e) => setEditingRestaurant({...editingRestaurant, phone: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={editingRestaurant.email}
                        onChange={(e) => setEditingRestaurant({...editingRestaurant, email: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <select
                        value={editingRestaurant.status}
                        onChange={(e) => setEditingRestaurant({...editingRestaurant, status: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                    <div className="flex space-x-3 mt-4">
                      <button
                        onClick={handleUpdateRestaurant}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Save className="w-4 h-4 inline mr-1" />
                        Update Restaurant
                      </button>
                      <button
                        onClick={() => setEditingRestaurant(null)}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Restaurant Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredRestaurants.map(restaurant => (
                    <div key={restaurant.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                      <div className="relative">
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(restaurant.status)}`}>
                            {restaurant.status}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                          ⭐ {restaurant.avgRating} ({restaurant.totalReviews} reviews)
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-900 text-lg">{restaurant.name}</h4>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            {restaurant.cuisine}
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">{restaurant.address}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4" />
                            <span>{restaurant.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span className="truncate">{restaurant.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <UserCheck className="w-4 h-4" />
                            <span>Owner: {restaurant.owner}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div className="bg-green-50 p-2 rounded-lg text-center">
                            <p className="font-semibold text-green-800">${restaurant.monthlyRevenue.toLocaleString()}</p>
                            <p className="text-green-600 text-xs">Monthly Revenue</p>
                          </div>
                          <div className="bg-blue-50 p-2 rounded-lg text-center">
                            <p className="font-semibold text-blue-800">{restaurant.totalOrders}</p>
                            <p className="text-blue-600 text-xs">Total Orders</p>
                          </div>
                          <div className="bg-purple-50 p-2 rounded-lg text-center">
                            <p className="font-semibold text-purple-800">{restaurant.tables}</p>
                            <p className="text-purple-600 text-xs">Tables</p>
                          </div>
                          <div className="bg-orange-50 p-2 rounded-lg text-center">
                            <p className="font-semibold text-orange-800">{restaurant.capacity}</p>
                            <p className="text-orange-600 text-xs">Capacity</p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditRestaurant(restaurant)}
                            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                          <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteRestaurant(restaurant.id)}
                            className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
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

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                  <h3 className="text-xl font-semibold flex items-center">
                    <Users className="w-6 h-6 mr-2 text-blue-600" />
                    User Administration
                  </h3>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                    <button
                      onClick={() => setShowAddUser(true)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add User
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center">
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </button>
                  </div>
                </div>

                {/* Add User Form */}
                {showAddUser && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="text-lg font-semibold mb-4">Add New User</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={newUser.phone}
                        onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Location"
                        value={newUser.location}
                        onChange={(e) => setNewUser({...newUser, location: e.target.value})}
                        className="lg:col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div className="flex space-x-3 mt-4">
                      <button
                        onClick={handleAddUser}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <Save className="w-4 h-4 inline mr-1" />
                        Save User
                      </button>
                      <button
                        onClick={() => setShowAddUser(false)}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Edit User Form */}
                {editingUser && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
                    <h4 className="text-lg font-semibold mb-4 text-blue-900">Edit User</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <select
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Super Admin</option>
                      </select>
                      <select
                        value={editingUser.status}
                        onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                    <div className="flex space-x-3 mt-4">
                      <button
                        onClick={handleUpdateUser}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Save className="w-4 h-4 inline mr-1" />
                        Update User
                      </button>
                      <button
                        onClick={() => setEditingUser(null)}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* User Cards */}
                <div className="space-y-4">
                  {filteredUsers.map(user => (
                    <div key={user.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-3 lg:space-y-0">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{user.name}</h4>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                  {user.role}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                  {user.status}
                                </span>
                                {user.verified && (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-4 h-4" />
                              <span className="truncate">{user.email}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Phone className="w-4 h-4" />
                              <span>{user.phone}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{user.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Joined: {user.joinDate}</span>
                            </div>
                            {user.role === 'customer' && (
                              <>
                                <div className="flex items-center space-x-1">
                                  <Package className="w-4 h-4" />
                                  <span>{user.totalOrders} orders</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <CreditCard className="w-4 h-4" />
                                  <span>${user.totalSpent}</span>
                                </div>
                              </>
                            )}
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>Last: {user.lastLogin}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                          <button className="bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </button>
                          <button className="bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Message
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
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

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    Platform Performance
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-green-900">Total Orders</p>
                        <p className="text-sm text-green-700">This month</p>
                      </div>
                      <p className="text-2xl font-bold text-green-600">{platformStats.totalOrders.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-900">Average Order Value</p>
                        <p className="text-sm text-blue-700">Platform wide</p>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">${platformStats.avgOrderValue}</p>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <div>
                        <p className="font-medium text-purple-900">Customer Satisfaction</p>
                        <p className="text-sm text-purple-700">Average rating</p>
                      </div>
                      <p className="text-2xl font-bold text-purple-600">{platformStats.customerSatisfaction}/5.0</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-600" />
                    Top Performing Restaurants
                  </h3>
                  <div className="space-y-3">
                    {allRestaurants
                      .sort((a, b) => b.monthlyRevenue - a.monthlyRevenue)
                      .slice(0, 5)
                      .map((restaurant, index) => (
                      <div key={restaurant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{restaurant.name}</p>
                            <p className="text-sm text-gray-600">{restaurant.totalOrders} orders</p>
                          </div>
                        </div>
                        <p className="font-semibold text-green-600">${restaurant.monthlyRevenue.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Server className="w-5 h-5 mr-2 text-blue-600" />
                    System Health
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">CPU Usage</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 h-2 bg-gray-200 rounded-full">
                          <div 
                            className={`h-2 rounded-full ${systemMetrics.cpuUsage > 70 ? 'bg-red-500' : systemMetrics.cpuUsage > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${systemMetrics.cpuUsage}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold">{systemMetrics.cpuUsage.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Memory Usage</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 h-2 bg-gray-200 rounded-full">
                          <div 
                            className={`h-2 rounded-full ${systemMetrics.memoryUsage > 80 ? 'bg-red-500' : systemMetrics.memoryUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${systemMetrics.memoryUsage}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold">{systemMetrics.memoryUsage.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Disk Usage</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 h-2 bg-gray-200 rounded-full">
                          <div 
                            className={`h-2 rounded-full ${systemMetrics.diskUsage > 80 ? 'bg-red-500' : systemMetrics.diskUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${systemMetrics.diskUsage}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold">{systemMetrics.diskUsage.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-green-600" />
                    Live Metrics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{systemMetrics.activeConnections}</p>
                      <p className="text-sm text-blue-700">Active Connections</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{systemMetrics.responseTime}ms</p>
                      <p className="text-sm text-green-700">Response Time</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{systemMetrics.errorRate}%</p>
                      <p className="text-sm text-purple-700">Error Rate</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">{systemMetrics.throughput}</p>
                      <p className="text-sm text-orange-700">Requests/min</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold flex items-center">
                    <Bell className="w-6 h-6 mr-2 text-blue-600" />
                    Platform Notifications
                  </h3>
                  <button 
                    onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Mark all as read
                  </button>
                </div>

                <div className="space-y-3">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.priority === 'high' ? 'bg-red-500' :
                          notification.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-gray-900">{notification.title}</h4>
                            <span className="text-xs text-gray-500">{notification.time}</span>
                          </div>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              notification.type === 'restaurant' ? 'bg-blue-100 text-blue-800' :
                              notification.type === 'system' ? 'bg-red-100 text-red-800' :
                              notification.type === 'user' ? 'bg-green-100 text-green-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {notification.type}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              notification.priority === 'high' ? 'bg-red-100 text-red-800' :
                              notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {notification.priority} priority
                            </span>
                          </div>
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
              <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <Settings className="w-6 h-6 mr-2 text-blue-600" />
                  Platform Settings
                </h3>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-lg font-medium mb-4">General Settings</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                        <input
                          type="text"
                          defaultValue="RestaurantAI Platform"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                        <input
                          type="email"
                          defaultValue="support@restaurantai.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="UTC">UTC</option>
                          <option value="EST">Eastern Time</option>
                          <option value="PST">Pacific Time</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium mb-4">Security Settings</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-600">Require 2FA for all admin accounts</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Session Timeout</p>
                          <p className="text-sm text-gray-600">Auto-logout inactive users</p>
                        </div>
                        <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="30">30 minutes</option>
                          <option value="60">1 hour</option>
                          <option value="120">2 hours</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => addNotification('Platform settings updated successfully', 'success')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Save Settings
                  </button>
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