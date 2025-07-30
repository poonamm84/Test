import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { 
  BarChart3, Users, ShoppingBag, Star, TrendingUp, Clock, 
  ChefHat, Calendar, DollarSign, Eye, Edit, Trash2, Plus, 
  Search, Filter, Bell, Settings, LogOut, Menu as MenuIcon,
  MapPin, Phone, Mail
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [restaurantData, setRestaurantData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has restaurant access
    if (!user?.restaurant_id) {
      addNotification('No restaurant access found', 'error');
      navigate('/');
      return;
    }
    
    fetchRestaurantData();
    fetchDashboardData();
  }, [user]);

  const fetchRestaurantData = async () => {
    try {
      // In a real app, this would be an API call
      // For now, using mock data based on restaurant_id
      const mockRestaurants = {
        1: {
          id: 1,
          name: "The Golden Spoon",
          cuisine: "Fine Dining",
          address: "123 Gourmet Street, Downtown",
          phone: "+1 (555) 123-4567",
          email: "contact@goldenspoon.com",
          image: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg",
          rating: 4.8,
          admin_id: "GS001"
        },
        2: {
          id: 2,
          name: "Sakura Sushi",
          cuisine: "Japanese",
          address: "456 Zen Garden Ave, Midtown",
          phone: "+1 (555) 234-5678",
          email: "info@sakurasushi.com",
          image: "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg",
          rating: 4.6,
          admin_id: "SS002"
        },
        3: {
          id: 3,
          name: "Mama's Italian",
          cuisine: "Italian",
          address: "789 Pasta Lane, Little Italy",
          phone: "+1 (555) 345-6789",
          email: "hello@mamasitalian.com",
          image: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg",
          rating: 4.7,
          admin_id: "MI003"
        }
      };
      
      setRestaurantData(mockRestaurants[user.restaurant_id]);
    } catch (error) {
      addNotification('Failed to load restaurant data', 'error');
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Mock dashboard data specific to the restaurant
      const mockDashboardData = {
        stats: {
          today_revenue: 3247.50,
          yesterday_revenue: 2890.25,
          today_orders: 24,
          yesterday_orders: 19,
          active_bookings: 15,
          total_customers: 1247
        },
        recent_orders: [
          {
            id: 1,
            customer_name: "Sarah Johnson",
            customer_phone: "+1 (555) 111-2222",
            total_amount: 89.50,
            status: "preparing",
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            customer_name: "Mike Chen",
            customer_phone: "+1 (555) 333-4444",
            total_amount: 156.75,
            status: "ready",
            created_at: new Date(Date.now() - 1800000).toISOString()
          }
        ]
      };
      
      setDashboardData(mockDashboardData);
    } catch (error) {
      addNotification('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Mock data - in real app, this would come from API
  const mockMenuItems = [
    {
      id: 1,
      name: "Wagyu Beef Tenderloin",
      category: "Mains",
      price: 89.99,
      description: "Premium wagyu beef with truffle sauce",
      image: "https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg",
      available: true,
      dietary: ["gluten-free"]
    },
    {
      id: 2,
      name: "Pan-Seared Salmon",
      category: "Mains",
      price: 32.99,
      description: "Fresh Atlantic salmon with lemon herb butter",
      image: "https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg",
      available: true,
      dietary: ["gluten-free", "keto"]
    },
    {
      id: 3,
      name: "Truffle Arancini",
      category: "Starters",
      price: 18.99,
      description: "Crispy risotto balls with black truffle",
      image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
      available: false,
      dietary: ["vegetarian"]
    },
    {
      id: 4,
      name: "Chocolate Soufflé",
      category: "Desserts",
      price: 16.99,
      description: "Warm chocolate soufflé with vanilla ice cream",
      image: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg",
      available: true,
      dietary: ["vegetarian"]
    }
  ];

  if (loading || !restaurantData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading restaurant dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = dashboardData ? {
    revenue: { 
      value: dashboardData.stats.today_revenue, 
      change: ((dashboardData.stats.today_revenue - dashboardData.stats.yesterday_revenue) / dashboardData.stats.yesterday_revenue * 100).toFixed(1), 
      label: "Today's Revenue" 
    },
    orders: { 
      value: dashboardData.stats.today_orders, 
      change: ((dashboardData.stats.today_orders - dashboardData.stats.yesterday_orders) / dashboardData.stats.yesterday_orders * 100).toFixed(1), 
      label: "Orders Today" 
    },
    bookings: { 
      value: dashboardData.stats.active_bookings, 
      change: 5.2, 
      label: "Active Bookings" 
    },
    rating: { 
      value: restaurantData.rating, 
      change: 0.1, 
      label: "Average Rating" 
    }
  } : {};

  const filteredMenuItems = mockMenuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(mockMenuItems.map(item => item.category))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <ChefHat className="h-8 w-8 text-orange-500" />
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{restaurantData.name}</h1>
                <p className="text-sm sm:text-base text-gray-600">Admin Dashboard - {restaurantData.cuisine}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-semibold text-gray-900">{user?.name}</p>
              </div>
              <div className="sm:hidden">
                <p className="text-sm font-semibold text-gray-900">Hi, {user?.name}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 text-red-600 hover:text-red-800 transition-colors text-sm sm:text-base"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="px-4 sm:px-6 lg:px-8 overflow-x-auto">
          <div className="flex space-x-4 sm:space-x-8 min-w-max">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'orders', label: 'Orders', icon: ShoppingBag },
              { id: 'menu', label: 'Menu', icon: ChefHat },
              { id: 'bookings', label: 'Bookings', icon: Calendar },
              { id: 'customers', label: 'Customers', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Restaurant Info Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <img
                src={restaurantData.image}
                alt={restaurantData.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{restaurantData.name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{restaurantData.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{restaurantData.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{restaurantData.email}</span>
                  </div>
                </div>
                <div className="mt-2 flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold">{restaurantData.rating}</span>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {restaurantData.cuisine}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    ID: {restaurantData.admin_id}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {Object.entries(stats).map(([key, stat]) => (
                  <div key={key} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-lg sm:text-2xl font-bold text-gray-900">
                          {key === 'revenue' ? `$${stat.value}` : stat.value}
                        </p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-full">
                        {key === 'revenue' && <DollarSign className="w-6 h-6 text-blue-600" />}
                        {key === 'orders' && <ShoppingBag className="w-6 h-6 text-blue-600" />}
                        {key === 'bookings' && <Calendar className="w-6 h-6 text-blue-600" />}
                        {key === 'rating' && <Star className="w-6 h-6 text-blue-600" />}
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-4 flex items-center">
                      <TrendingUp className={`w-4 h-4 mr-1 ${
                        stat.change > 0 ? 'text-green-500' : 'text-red-500'
                      }`} />
                      <span className={`text-xs sm:text-sm font-medium ${
                        stat.change > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change > 0 ? '+' : ''}{stat.change}%
                      </span>
                      <span className="text-xs text-gray-500 ml-1">vs yesterday</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Recent Orders
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {dashboardData?.recent_orders.map(order => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 text-sm sm:text-base">{order.customer_name}</p>
                          <p className="text-xs sm:text-sm text-gray-600">${order.total_amount}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'ready' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {order.status}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(order.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    Today's Highlights
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-green-900 text-sm sm:text-base">Peak Hour: 7:30 PM</p>
                        <p className="text-xs sm:text-sm text-green-700">Highest order volume</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-blue-900 text-sm sm:text-base">Top Item: Wagyu Steak</p>
                        <p className="text-xs sm:text-sm text-blue-700">8 orders today</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-purple-900 text-sm sm:text-base">VIP Customer</p>
                        <p className="text-xs sm:text-sm text-purple-700">Table 12 - Anniversary</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="space-y-6">
              {/* Menu Controls */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                  <h2 className="text-2xl font-bold text-gray-900">Menu Management</h2>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Add Item</span>
                  </button>
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search menu items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Menu Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMenuItems.map(item => (
                  <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.available ? 'Available' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                        <span className="text-xl font-bold text-green-600">${item.price}</span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {item.category}
                        </span>
                        <div className="flex space-x-1">
                          {item.dietary.map(diet => (
                            <span key={diet} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {diet}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2">
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other tabs would go here */}
          {activeTab !== 'dashboard' && activeTab !== 'menu' && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
              </h2>
              <p className="text-gray-600">This section is under development.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;