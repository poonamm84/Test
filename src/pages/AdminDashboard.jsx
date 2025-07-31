import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { 
  BarChart3, Users, DollarSign, Calendar, 
  TrendingUp, Clock, Star, MapPin, Phone,
  ShoppingBag, Plus, Edit, Trash2, Award,
  Eye, Settings, Utensils, Filter, Search
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('overview');
  const [restaurantData, setRestaurantData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/admin-dashboard-secret-portal-2025');
        return;
      }

      const response = await fetch(`http://localhost:8000/api/admin/dashboard/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
        setRestaurantData(data.restaurant);
      } else {
        addNotification('Failed to load dashboard data', 'error');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      addNotification('Error loading dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!restaurantData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No restaurant data found</h2>
          <p className="text-gray-600">Please contact support if this issue persists.</p>
        </div>
      </div>
    );
  }

  const currentRestaurant = restaurantData;
  const statistics = dashboardData?.statistics || {};
  const recentOrders = dashboardData?.recent_orders || [];
  const menuItems = dashboardData?.menu_items || [];

  const stats = [
    {
      title: "Today's Revenue",
      value: `$${statistics.total_revenue || 0}`,
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-500"
    },
    {
      title: "Active Orders",
      value: statistics.total_orders || 0,
      change: "+8.2%",
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-500"
    },
    {
      title: "Table Bookings",
      value: statistics.total_bookings || 0,
      change: "+15.3%",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-500"
    },
    {
      title: "Available Tables",
      value: `${statistics.available_tables || 0}/${statistics.total_tables || 0}`,
      change: "Real-time",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">{currentRestaurant.name}</h1>
              <p className="text-gray-600 text-sm md:text-base">Admin Dashboard - {user?.admin_id}</p>
            </div>
            <button
              onClick={logout}
              className="px-3 py-2 md:px-4 md:py-2 text-red-600 hover:text-red-800 transition-colors text-sm md:text-base"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Restaurant Info Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 md:-mt-16 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 md:space-x-6">
            <img
              src={currentRestaurant.image}
              alt={currentRestaurant?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">{currentRestaurant?.name}</h2>
              <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-current" />
                  <span>{currentRestaurant?.rating}</span>
                </div>
                <div className="hidden sm:flex items-center space-x-1">
                  <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="truncate max-w-xs">{currentRestaurant?.address}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="w-3 h-3 md:w-4 md:h-4" />
                  <span>{currentRestaurant?.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 md:mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-2 md:mb-4">
                <div className={`p-2 md:p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <span className={`text-xs font-medium ${stat.color} hidden sm:inline`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-base md:text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-xs md:text-sm text-gray-600 leading-tight">{stat.title}</p>
              <span className={`text-xs font-medium ${stat.color} sm:hidden mt-1 block`}>
                {stat.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 md:mb-8">
        <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-1">
          <div className="flex space-x-1 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'orders', label: 'Orders', icon: ShoppingBag },
              { id: 'menu', label: 'Menu', icon: Utensils },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp, className: 'hidden sm:flex' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-1 md:space-x-2 px-2 md:px-4 py-2 md:py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                } ${tab.className || ''}`}
              >
                <tab.icon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-xs md:text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-4 md:gap-8">
            {/* Recent Orders */}
            <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Recent Orders</h3>
              <div className="space-y-3 md:space-y-4">
                {recentOrders.slice(0, 5).map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1 text-sm md:text-base">
                        <span className="font-semibold text-gray-900">#{order.id}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'ready' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-gray-600">{order.customer_name || 'Guest'} • ${order.total_amount}</p>
                    </div>
                    <div className="text-right text-xs md:text-sm">
                      <p className="font-semibold text-gray-900">{order.order_type}</p>
                      <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Restaurant Performance</h3>
              <div className="space-y-3 md:space-y-4">
                {[
                  { label: 'Total Revenue', value: `$${statistics.total_revenue || 0}`, icon: DollarSign },
                  { label: 'Total Orders', value: statistics.total_orders || 0, icon: ShoppingBag },
                  { label: 'Total Bookings', value: statistics.total_bookings || 0, icon: Calendar },
                  { label: 'Restaurant Rating', value: `${currentRestaurant.rating}/5`, icon: Star }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                      <span className="text-sm md:text-base text-gray-600">{item.label}</span>
                    </div>
                    <span className="font-semibold text-gray-900 text-sm md:text-base">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Order Management</h3>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>New Order</span>
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { id: '#1234', customer: 'John Doe', items: 3, total: '$45.99', status: 'preparing', time: '10 min ago' },
                { id: '#1235', customer: 'Jane Smith', items: 2, total: '$78.50', status: 'ready', time: '15 min ago' },
                { id: '#1236', customer: 'Mike Johnson', items: 4, total: '$32.25', status: 'delivered', time: '25 min ago' }
              ].map((order, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-semibold text-gray-900">{order.id}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'ready' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{order.customer} • {order.items} items • {order.time}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold text-gray-900">{order.total}</span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 space-y-2 sm:space-y-0">
              <h3 className="text-base md:text-lg font-semibold text-gray-900">Menu Management</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Plus className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-sm md:text-base">Add Item</span>
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {menuItems.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2 text-sm md:text-base">
                    <h4 className="font-semibold text-gray-900 line-clamp-2">{item.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 mb-2">{item.category}</p>
                  <p className="text-sm md:text-lg font-bold text-gray-900 mb-3">${item.price}</p>
                  <div className="flex space-x-2 text-sm">
                    <button className="flex-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                      Edit
                    </button>
                    <button className="flex-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
              <div className="space-y-4">
                {[
                  { period: 'Today', amount: '$1,247', change: '+12%' },
                  { period: 'This Week', amount: '$8,432', change: '+8%' },
                  { period: 'This Month', amount: '$32,156', change: '+15%' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{item.period}</span>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900">{item.amount}</span>
                      <span className="text-green-600 text-sm ml-2">{item.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Items</h3>
              <div className="space-y-4">
                {[
                  { name: 'Wagyu Steak', orders: 45, revenue: '$2,025' },
                  { name: 'Salmon Teriyaki', orders: 38, revenue: '$1,254' },
                  { name: 'Truffle Pasta', orders: 32, revenue: '$896' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900">{item.name}</span>
                      <p className="text-sm text-gray-600">{item.orders} orders</p>
                    </div>
                    <span className="font-semibold text-gray-900">{item.revenue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;