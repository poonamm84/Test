import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  BarChart, Users, DollarSign, Clock, Settings, Menu, X, MessageSquare, Plus, Edit, Trash2, Save, 
  Eye, EyeOff, Star, MapPin, Phone, TrendingUp, ShoppingCart, Calendar, AlertCircle, CheckCircle, 
  Package, Filter, Search, Download, Upload, RefreshCw, Bell, Activity, PieChart, Target, Award,
  UserCheck, CreditCard, Utensils, Coffee, Wifi, Car, Heart, ThumbsUp
} from 'lucide-react';
import NotificationToast from '../components/NotificationToast';
import { useNotification } from '../context/NotificationContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { restaurants, orders, bookings, updateRestaurant, addMenuItem, updateMenuItem, deleteMenuItem } = useData();
  const { addNotification } = useNotification();
  
  const [selectedRestaurant, setSelectedRestaurant] = useState(restaurants[0]?.id || 1);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [editingItem, setEditingItem] = useState(null);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image: '',
    dietary: []
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const currentRestaurant = restaurants.find(r => r.id === selectedRestaurant);

  // Enhanced admin stats
  const [adminStats, setAdminStats] = useState({
    todayRevenue: 3247.85,
    todayOrders: 24,
    activeBookings: 15,
    avgRating: 4.8,
    totalCustomers: 234,
    monthlyRevenue: 67890.50,
    pendingOrders: 3,
    completedOrders: 21,
    weeklyGrowth: 12.3,
    customerSatisfaction: 97.8,
    repeatCustomers: 89,
    avgOrderValue: 48.75
  });

  const [tableBookings, setTableBookings] = useState([
    { 
      id: 1, 
      customerName: 'John Smith', 
      tableNumber: 5, 
      date: '2025-01-16', 
      time: '19:00', 
      guests: 4, 
      status: 'confirmed',
      phone: '+1 234-567-8901',
      specialRequests: 'Anniversary dinner - need quiet table'
    },
    { 
      id: 2, 
      customerName: 'Sarah Johnson', 
      tableNumber: 8, 
      date: '2025-01-16', 
      time: '20:30', 
      guests: 2, 
      status: 'pending',
      phone: '+1 234-567-8902',
      specialRequests: 'Vegetarian menu required'
    },
    { 
      id: 3, 
      customerName: 'Mike Davis', 
      tableNumber: 12, 
      date: '2025-01-17', 
      time: '18:30', 
      guests: 6, 
      status: 'confirmed',
      phone: '+1 234-567-8903',
      specialRequests: 'Business dinner - need private area'
    },
    {
      id: 4,
      customerName: 'Emily Chen',
      tableNumber: 3,
      date: '2025-01-17',
      time: '19:30',
      guests: 3,
      status: 'confirmed',
      phone: '+1 234-567-8904',
      specialRequests: 'Birthday celebration - cake arrangement needed'
    }
  ]);

  const [customerData, setCustomerData] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1 234-567-8901',
      totalOrders: 28,
      totalSpent: 1456.90,
      lastVisit: '2025-01-14',
      favoriteItems: ['Wagyu Beef Tenderloin', 'Truffle Arancini'],
      loyaltyPoints: 520,
      status: 'VIP'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 234-567-8902',
      totalOrders: 19,
      totalSpent: 847.60,
      lastVisit: '2025-01-13',
      favoriteItems: ['Pan-Seared Salmon', 'Chocolate Soufflé'],
      loyaltyPoints: 340,
      status: 'Regular'
    },
    {
      id: 3,
      name: 'Emily Chen',
      email: 'emily.chen@email.com',
      phone: '+1 234-567-8903',
      totalOrders: 12,
      totalSpent: 567.25,
      lastVisit: '2025-01-15',
      favoriteItems: ['Lobster Thermidor', 'Truffle Arancini'],
      loyaltyPoints: 225,
      status: 'Regular'
    },
    {
      id: 4,
      name: 'Mike Davis',
      email: 'mike.davis@email.com',
      phone: '+1 234-567-8904',
      totalOrders: 35,
      totalSpent: 2134.80,
      lastVisit: '2025-01-14',
      favoriteItems: ['Wagyu Beef Tenderloin', 'Pan-Seared Salmon'],
      loyaltyPoints: 780,
      status: 'VIP'
    }
  ]);

  const [salesAnalytics, setSalesAnalytics] = useState({
    dailySales: [
      { date: '2025-01-10', revenue: 2847, orders: 34 },
      { date: '2025-01-11', revenue: 3156, orders: 38 },
      { date: '2025-01-12', revenue: 2934, orders: 36 },
      { date: '2025-01-13', revenue: 3478, orders: 42 },
      { date: '2025-01-14', revenue: 3247, orders: 39 },
      { date: '2025-01-15', revenue: 3689, orders: 45 }
    ],
    topItems: [
      { name: 'Wagyu Beef Tenderloin', orders: 67, revenue: 6023.33 },
      { name: 'Pan-Seared Salmon', orders: 89, revenue: 2936.11 },
      { name: 'Lobster Thermidor', orders: 45, revenue: 2969.55 },
      { name: 'Truffle Arancini', orders: 124, revenue: 2355.76 },
      { name: 'Chocolate Soufflé', orders: 78, revenue: 1325.22 }
    ],
    peakHours: [
      { hour: '18:00-19:00', orders: 23 },
      { hour: '19:00-20:00', orders: 34 },
      { hour: '20:00-21:00', orders: 28 },
      { hour: '21:00-22:00', orders: 19 }
    ]
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'booking',
      title: 'VIP Table Booking',
      message: 'Table 12 reserved for anniversary dinner - 6 guests',
      time: '3 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'order',
      title: 'High-Value Order',
      message: 'Order #247 - $340 total with premium wine selection',
      time: '8 minutes ago',
      read: false
    },
    {
      id: 3,
      type: 'review',
      title: 'New 5-Star Review',
      message: '"Outstanding wagyu beef and impeccable service!" - John S.',
      time: '25 minutes ago',
      read: true
    },
    {
      id: 4,
      type: 'inventory',
      title: 'Low Stock Alert',
      message: 'Wagyu beef running low - only 3 portions remaining',
      time: '45 minutes ago',
      read: false
    },
    {
      id: 5,
      type: 'staff',
      title: 'Staff Schedule Update',
      message: 'Weekend shift coverage confirmed for all positions',
      time: '1 hour ago',
      read: true
    }
  ]);

  const [restaurantSettings, setRestaurantSettings] = useState({
    name: currentRestaurant?.name || '',
    cuisine: currentRestaurant?.cuisine || '',
    address: currentRestaurant?.address || '',
    phone: currentRestaurant?.phone || '',
    openingHours: {
      monday: { open: '11:00', close: '22:00', closed: false },
      tuesday: { open: '11:00', close: '22:00', closed: false },
      wednesday: { open: '11:00', close: '22:00', closed: false },
      thursday: { open: '11:00', close: '22:00', closed: false },
      friday: { open: '11:00', close: '23:00', closed: false },
      saturday: { open: '10:00', close: '23:00', closed: false },
      sunday: { open: '10:00', close: '21:00', closed: false }
    },
    features: ['WiFi', 'Parking', 'Outdoor Seating', 'Live Music'],
    paymentMethods: ['Cash', 'Credit Card', 'Digital Wallet'],
    deliveryRadius: 5,
    minimumOrder: 25
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

  const updateBookingStatus = (bookingId, newStatus) => {
    setTableBookings(prev => prev.map(booking => 
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    ));
    addNotification(`Booking #${bookingId} status updated to ${newStatus}`, 'success');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

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
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-50 w-64 bg-gradient-to-b from-slate-900 to-slate-800 transition-transform duration-300 flex flex-col shadow-xl h-full`}>
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-bold text-lg">Admin Panel</h2>
              <p className="text-slate-300 text-sm">Restaurant Management</p>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:text-gray-300 transition-colors p-1 rounded lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Restaurant Selector */}
        <div className="p-4 border-b border-slate-700">
          <label className="block text-gray-300 text-sm mb-2">Select Restaurant</label>
          <select
            value={selectedRestaurant}
            onChange={(e) => setSelectedRestaurant(parseInt(e.target.value))}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-600 text-sm"
          >
            {restaurants.map(restaurant => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: BarChart },
              { id: 'bookings', label: 'Table Bookings', icon: Calendar },
              { id: 'orders', label: 'Order Management', icon: ShoppingCart },
              { id: 'customers', label: 'Customer Data', icon: Users },
              { id: 'analytics', label: 'Sales Analytics', icon: TrendingUp },
              { id: 'menu', label: 'Menu Management', icon: Package },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'settings', label: 'Restaurant Settings', icon: Settings }
            ].map(item => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 text-sm ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-slate-700'
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
        <div className="p-4 border-t border-slate-700">
          <div className="text-white">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-sm">{user?.name}</p>
                <p className="text-xs text-gray-300">Restaurant Admin</p>
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
                  {currentRestaurant?.name} - Admin
                </h1>
                <p className="text-gray-600 text-sm">Manage your restaurant operations</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                Online
              </div>
              <button className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
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
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-xs font-medium">Today's Revenue</p>
                      <p className="text-lg lg:text-2xl font-bold text-gray-900">${adminStats.todayRevenue}</p>
                      <p className="text-green-600 text-xs">+{adminStats.weeklyGrowth}%</p>
                    </div>
                    <DollarSign className="w-6 h-6 lg:w-8 lg:h-8 text-green-500" />
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-xs font-medium">Today's Orders</p>
                      <p className="text-lg lg:text-2xl font-bold text-gray-900">{adminStats.todayOrders}</p>
                      <p className="text-blue-600 text-xs">{adminStats.pendingOrders} pending</p>
                    </div>
                    <ShoppingCart className="w-6 h-6 lg:w-8 lg:h-8 text-blue-500" />
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-xs font-medium">Active Bookings</p>
                      <p className="text-lg lg:text-2xl font-bold text-gray-900">{adminStats.activeBookings}</p>
                      <p className="text-purple-600 text-xs">Next: 7:30 PM</p>
                    </div>
                    <Calendar className="w-6 h-6 lg:w-8 lg:h-8 text-purple-500" />
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-xs font-medium">Avg Rating</p>
                      <p className="text-lg lg:text-2xl font-bold text-gray-900">{adminStats.avgRating}</p>
                      <p className="text-yellow-600 text-xs">{adminStats.totalCustomers} reviews</p>
                    </div>
                    <Star className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-500" />
                  </div>
                </div>
              </div>

              {/* Table Status - Mobile Optimized */}
              <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-600" />
                  Live Table Status
                </h3>
                
                {/* Mobile Table Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
                  {currentRestaurant?.tables.map(table => (
                    <div
                      key={table.id}
                      className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-white font-semibold text-xs overflow-hidden shadow-lg ${
                        table.status === 'available' ? 'bg-green-500' :
                        table.status === 'reserved' ? 'bg-yellow-500' :
                        table.status === 'occupied' ? 'bg-red-500' : 'bg-gray-500'
                      }`}
                    >
                      {/* Table Image Background */}
                      <div className="absolute inset-0 opacity-30">
                        <img
                          src={`https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`}
                          alt={`Table ${table.number}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Table Info */}
                      <div className="relative z-10 text-center">
                        <span className="text-sm lg:text-base font-bold">{table.number}</span>
                        <div className="text-xs">{table.capacity}p</div>
                        {table.type && (
                          <div className="text-xs opacity-80 capitalize">{table.type}</div>
                        )}
                      </div>
                      
                      {/* Status Indicator */}
                      <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-80"></div>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Available ({currentRestaurant?.tables.filter(t => t.status === 'available').length})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span>Reserved ({currentRestaurant?.tables.filter(t => t.status === 'reserved').length})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Occupied ({currentRestaurant?.tables.filter(t => t.status === 'occupied').length})</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                  <h3 className="text-xl font-semibold flex items-center">
                    <Calendar className="w-6 h-6 mr-2 text-blue-600" />
                    Table Bookings
                  </h3>
                  <div className="flex space-x-2">
                    <button className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                      <Plus className="w-4 h-4 inline mr-1" />
                      New Booking
                    </button>
                    <button className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      <Download className="w-4 h-4 inline mr-1" />
                      Export
                    </button>
                  </div>
                </div>
                
                {/* Mobile-friendly booking cards */}
                <div className="space-y-4">
                  {tableBookings.map(booking => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{booking.customerName}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <div>📅 {booking.date} at {booking.time}</div>
                            <div>🪑 Table {booking.tableNumber}</div>
                            <div>👥 {booking.guests} guests</div>
                            <div>📞 {booking.phone}</div>
                          </div>
                          {booking.specialRequests && (
                            <div className="mt-2 text-sm text-gray-500">
                              💬 {booking.specialRequests}
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <select
                            value={booking.status}
                            onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button className="text-blue-600 hover:text-blue-800 p-1">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                  <h3 className="text-xl font-semibold flex items-center">
                    <Users className="w-6 h-6 mr-2 text-blue-600" />
                    Customer Data
                  </h3>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search customers..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <button className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                      <Download className="w-4 h-4 inline mr-1" />
                      Export
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {customerData.map(customer => (
                    <div key={customer.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-3 lg:space-y-0">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{customer.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              customer.status === 'VIP' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {customer.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                            <div>📧 {customer.email}</div>
                            <div>📞 {customer.phone}</div>
                            <div>🛍️ {customer.totalOrders} orders</div>
                            <div>💰 ${customer.totalSpent}</div>
                            <div>📅 Last: {customer.lastVisit}</div>
                            <div>⭐ {customer.loyaltyPoints} points</div>
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            ❤️ Favorites: {customer.favoriteItems.join(', ')}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 p-1">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-800 p-1">
                            <MessageSquare className="w-4 h-4" />
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
                {/* Daily Sales Chart */}
                <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    Daily Sales Trend
                  </h3>
                  <div className="space-y-3">
                    {salesAnalytics.dailySales.map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{day.date}</p>
                          <p className="text-sm text-gray-600">{day.orders} orders</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">${day.revenue}</p>
                          <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                            <div 
                              className="h-2 bg-green-500 rounded-full"
                              style={{ width: `${(day.revenue / 2000) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Items */}
                <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-yellow-600" />
                    Top Selling Items
                  </h3>
                  <div className="space-y-3">
                    {salesAnalytics.topItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">{item.orders} orders</p>
                          </div>
                        </div>
                        <p className="font-semibold text-green-600">${item.revenue}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Peak Hours */}
              <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Peak Hours Analysis
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {salesAnalytics.peakHours.map((hour, index) => (
                    <div key={index} className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="font-semibold text-blue-900">{hour.hour}</p>
                      <p className="text-2xl font-bold text-blue-600">{hour.orders}</p>
                      <p className="text-sm text-blue-700">orders</p>
                    </div>
                  ))}
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
                    Notifications
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
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${notification.read ? 'bg-gray-400' : 'bg-blue-500'}`}></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-gray-900">{notification.title}</h4>
                            <span className="text-xs text-gray-500">{notification.time}</span>
                          </div>
                          <p className="text-sm text-gray-600">{notification.message}</p>
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
                  Restaurant Settings
                </h3>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div>
                    <h4 className="text-lg font-medium mb-4">Basic Information</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name</label>
                        <input
                          type="text"
                          value={restaurantSettings.name}
                          onChange={(e) => setRestaurantSettings(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine Type</label>
                        <input
                          type="text"
                          value={restaurantSettings.cuisine}
                          onChange={(e) => setRestaurantSettings(prev => ({ ...prev, cuisine: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <input
                          type="text"
                          value={restaurantSettings.address}
                          onChange={(e) => setRestaurantSettings(prev => ({ ...prev, address: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Opening Hours */}
                  <div>
                    <h4 className="text-lg font-medium mb-4">Opening Hours</h4>
                    <div className="space-y-3">
                      {Object.entries(restaurantSettings.openingHours).map(([day, hours]) => (
                        <div key={day} className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                          <div className="w-20">
                            <span className="font-medium capitalize">{day}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={!hours.closed}
                              onChange={(e) => setRestaurantSettings(prev => ({
                                ...prev,
                                openingHours: {
                                  ...prev.openingHours,
                                  [day]: { ...hours, closed: !e.target.checked }
                                }
                              }))}
                              className="rounded"
                            />
                            <span className="text-sm">Open</span>
                          </div>
                          {!hours.closed && (
                            <>
                              <input
                                type="time"
                                value={hours.open}
                                onChange={(e) => setRestaurantSettings(prev => ({
                                  ...prev,
                                  openingHours: {
                                    ...prev.openingHours,
                                    [day]: { ...hours, open: e.target.value }
                                  }
                                }))}
                                className="px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                              <span className="text-sm">to</span>
                              <input
                                type="time"
                                value={hours.close}
                                onChange={(e) => setRestaurantSettings(prev => ({
                                  ...prev,
                                  openingHours: {
                                    ...prev.openingHours,
                                    [day]: { ...hours, close: e.target.value }
                                  }
                                }))}
                                className="px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="text-lg font-medium mb-4">Restaurant Features</h4>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {['WiFi', 'Parking', 'Outdoor Seating', 'Live Music', 'Delivery', 'Takeout', 'Wheelchair Accessible', 'Pet Friendly'].map(feature => (
                        <label key={feature} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={restaurantSettings.features.includes(feature)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setRestaurantSettings(prev => ({
                                  ...prev,
                                  features: [...prev.features, feature]
                                }));
                              } else {
                                setRestaurantSettings(prev => ({
                                  ...prev,
                                  features: prev.features.filter(f => f !== feature)
                                }));
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{feature}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => addNotification('Restaurant settings updated successfully', 'success')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Menu Management Tab */}
          {activeTab === 'menu' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                  <h3 className="text-xl font-semibold flex items-center">
                    <Package className="w-6 h-6 mr-2 text-blue-600" />
                    Menu Management
                  </h3>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    Add Item
                  </button>
                </div>

                {/* Add Form */}
                {showAddForm && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="text-lg font-semibold mb-4">Add New Menu Item</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Item Name"
                        value={newMenuItem.name}
                        onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <select
                        value={newMenuItem.category}
                        onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="">Select Category</option>
                        <option value="Starters">Starters</option>
                        <option value="Mains">Mains</option>
                        <option value="Desserts">Desserts</option>
                        <option value="Beverages">Beverages</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Price"
                        value={newMenuItem.price}
                        onChange={(e) => setNewMenuItem({...newMenuItem, price: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <input
                        type="url"
                        placeholder="Image URL"
                        value={newMenuItem.image}
                        onChange={(e) => setNewMenuItem({...newMenuItem, image: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <textarea
                        placeholder="Description"
                        value={newMenuItem.description}
                        onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})}
                        className="lg:col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        rows={3}
                      />
                    </div>
                    <div className="flex space-x-3 mt-4">
                      <button
                        onClick={() => {
                          addNotification('Menu item added successfully', 'success');
                          setShowAddForm(false);
                          setNewMenuItem({ name: '', category: '', price: '', description: '', image: '', dietary: [] });
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <Save className="w-4 h-4 inline mr-1" />
                        Save
                      </button>
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Menu Items Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {[
                    { id: 1, name: 'Grilled Salmon', category: 'Mains', price: 28.99, image: 'https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg' },
                    { id: 2, name: 'Caesar Salad', category: 'Starters', price: 14.99, image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg' },
                    { id: 3, name: 'Chocolate Cake', category: 'Desserts', price: 12.99, image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg' }
                  ].map(item => (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                          <span className="text-green-600 font-bold text-sm">${item.price}</span>
                        </div>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {item.category}
                        </span>
                        <div className="flex space-x-2 mt-3">
                          <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-xs">
                            <Edit className="w-3 h-3 inline mr-1" />
                            Edit
                          </button>
                          <button className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-xs">
                            <Trash2 className="w-3 h-3 inline mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold flex items-center">
                    <ShoppingCart className="w-6 h-6 mr-2 text-blue-600" />
                    Order Management
                  </h3>
                  <button className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                    <Download className="w-4 h-4 inline mr-1" />
                    Export
                  </button>
                </div>
                
                <div className="space-y-4">
                  {[
                    { id: 1, customer: 'John Doe', items: 3, total: 45.99, status: 'preparing', time: '2:30 PM', table: 5 },
                    { id: 2, customer: 'Jane Smith', items: 2, total: 32.50, status: 'ready', time: '2:45 PM', table: 8 },
                    { id: 3, customer: 'Mike Johnson', items: 4, total: 67.25, status: 'delivered', time: '3:00 PM', table: 12 }
                  ].map(order => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900">Order #{order.id}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <div>👤 {order.customer}</div>
                            <div>🪑 Table {order.table}</div>
                            <div>🛍️ {order.items} items</div>
                            <div>💰 ${order.total}</div>
                            <div>⏰ {order.time}</div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <select
                            value={order.status}
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="delivered">Delivered</option>
                          </select>
                          <button className="text-blue-600 hover:text-blue-800 p-1">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;