import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  BarChart, Users, DollarSign, Clock, Settings, Menu, X, MessageSquare, 
  Plus, Edit, Trash2, Save, Cancel, Eye, EyeOff, Star, MapPin, Phone,
  TrendingUp, ShoppingCart, Calendar, AlertCircle, CheckCircle, Package,
  Filter, Search, Download, Upload, RefreshCw, Bell, Activity
} from 'lucide-react';
import NotificationToast from '../components/NotificationToast';
import { useNotification } from '../context/NotificationContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { restaurants, orders, bookings, updateRestaurant, addMenuItem, updateMenuItem, deleteMenuItem } = useData();
  const { addNotification } = useNotification();
  
  const [selectedRestaurant, setSelectedRestaurant] = useState(restaurants[0]?.id || 1);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  // Mock data for admin functionality
  const [adminStats, setAdminStats] = useState({
    todayRevenue: 2450.75,
    todayOrders: 18,
    activeBookings: 12,
    avgRating: 4.7,
    totalCustomers: 156,
    monthlyRevenue: 45680.25,
    pendingOrders: 5,
    completedOrders: 13
  });

  const [recentOrders, setRecentOrders] = useState([
    { id: 1, customer: 'John Doe', items: 3, total: 45.99, status: 'preparing', time: '2:30 PM', table: 5 },
    { id: 2, customer: 'Jane Smith', items: 2, total: 32.50, status: 'ready', time: '2:45 PM', table: 8 },
    { id: 3, customer: 'Mike Johnson', items: 4, total: 67.25, status: 'delivered', time: '3:00 PM', table: 12 },
    { id: 4, customer: 'Sarah Wilson', items: 1, total: 18.75, status: 'preparing', time: '3:15 PM', table: 3 },
    { id: 5, customer: 'David Brown', items: 6, total: 89.50, status: 'pending', time: '3:20 PM', table: 15 }
  ]);

  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: "Grilled Salmon",
      category: "Mains",
      price: 28.99,
      description: "Fresh Atlantic salmon with herbs",
      image: "https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg",
      dietary: ["gluten-free", "healthy"],
      available: true,
      popularity: 85
    },
    {
      id: 2,
      name: "Caesar Salad",
      category: "Starters",
      price: 14.99,
      description: "Classic Caesar with croutons and parmesan",
      image: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg",
      dietary: ["vegetarian"],
      available: true,
      popularity: 72
    },
    {
      id: 3,
      name: "Chocolate Cake",
      category: "Desserts",
      price: 12.99,
      description: "Rich chocolate cake with vanilla ice cream",
      image: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg",
      dietary: ["vegetarian"],
      available: true,
      popularity: 91
    }
  ]);

  const updateOrderStatus = (orderId, newStatus) => {
    setRecentOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    addNotification(`Order #${orderId} status updated to ${newStatus}`, 'success');
  };

  const handleMenuItemSave = () => {
    if (editingItem) {
      setMenuItems(prev => prev.map(item => 
        item.id === editingItem.id ? editingItem : item
      ));
      addNotification('Menu item updated successfully', 'success');
    } else {
      const newItem = {
        ...newMenuItem,
        id: Date.now(),
        available: true,
        popularity: 0
      };
      setMenuItems(prev => [...prev, newItem]);
      addNotification('Menu item added successfully', 'success');
      setNewMenuItem({
        name: '',
        category: '',
        price: '',
        description: '',
        image: '',
        dietary: []
      });
      setShowAddForm(false);
    }
    setEditingItem(null);
  };

  const handleDeleteMenuItem = (itemId) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
    addNotification('Menu item deleted successfully', 'success');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'preparing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(menuItems.map(item => item.category))];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <NotificationToast />
      
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gradient-to-b from-slate-900 to-slate-800 transition-all duration-300 flex flex-col shadow-xl`}>
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h2 className="text-white font-bold text-lg">Admin Panel</h2>
                <p className="text-slate-300 text-sm">Restaurant Management</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:text-gray-300 transition-colors p-1 rounded"
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
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-600"
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
              { id: 'overview', label: 'Dashboard Overview', icon: BarChart },
              { id: 'orders', label: 'Order Management', icon: ShoppingCart },
              { id: 'bookings', label: 'Table Bookings', icon: Calendar },
              { id: 'menu', label: 'Menu Management', icon: Package },
              { id: 'customers', label: 'Customer Data', icon: Users },
              { id: 'analytics', label: 'Sales Analytics', icon: TrendingUp },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'settings', label: 'Restaurant Settings', icon: Settings }
            ].map(item => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-slate-700'
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
        <div className="p-4 border-t border-slate-700">
          {sidebarOpen ? (
            <div className="text-white">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs text-gray-300">Restaurant Admin</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full text-red-400 hover:text-red-300 text-sm mt-2 transition-colors bg-red-500/10 hover:bg-red-500/20 px-3 py-2 rounded-lg font-medium"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={logout}
              className="text-red-400 hover:text-red-300 transition-colors p-2 rounded"
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentRestaurant?.name} - Admin Dashboard
              </h1>
              <p className="text-gray-600">Manage your restaurant operations efficiently</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Online
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <RefreshCw className="w-4 h-4 inline mr-2" />
                Refresh Data
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Today's Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">${adminStats.todayRevenue}</p>
                      <p className="text-green-600 text-sm">+12.5% from yesterday</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Today's Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{adminStats.todayOrders}</p>
                      <p className="text-blue-600 text-sm">{adminStats.pendingOrders} pending</p>
                    </div>
                    <ShoppingCart className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Active Bookings</p>
                      <p className="text-2xl font-bold text-gray-900">{adminStats.activeBookings}</p>
                      <p className="text-purple-600 text-sm">Next: 7:30 PM</p>
                    </div>
                    <Calendar className="w-8 h-8 text-purple-500" />
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Avg Rating</p>
                      <p className="text-2xl font-bold text-gray-900">{adminStats.avgRating}</p>
                      <p className="text-yellow-600 text-sm">156 reviews</p>
                    </div>
                    <Star className="w-8 h-8 text-yellow-500" />
                  </div>
                </div>
              </div>

              {/* Charts and Activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Table Status */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-blue-600" />
                    Live Table Status
                  </h3>
                  <div className="grid grid-cols-6 gap-2 mb-4">
                    {currentRestaurant?.tables.map(table => (
                      <div
                        key={table.id}
                        className={`aspect-square rounded-lg flex flex-col items-center justify-center text-white font-semibold text-xs relative overflow-hidden ${
                          table.status === 'available' ? 'bg-green-500' :
                          table.status === 'reserved' ? 'bg-yellow-500' :
                          table.status === 'occupied' ? 'bg-red-500' : 'bg-gray-500'
                        }`}
                      >
                        <span className="text-lg">{table.number}</span>
                        <span className="text-xs">{table.capacity}p</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
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

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-green-600" />
                    Recent Activity
                  </h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {[
                      { type: 'order', message: 'New order from Table 5', time: '2 min ago', icon: ShoppingCart, color: 'text-blue-600' },
                      { type: 'booking', message: 'Table 8 reserved for 7:30 PM', time: '5 min ago', icon: Calendar, color: 'text-purple-600' },
                      { type: 'payment', message: 'Payment received - $45.99', time: '8 min ago', icon: DollarSign, color: 'text-green-600' },
                      { type: 'review', message: 'New 5-star review received', time: '12 min ago', icon: Star, color: 'text-yellow-600' },
                      { type: 'order', message: 'Order completed - Table 12', time: '15 min ago', icon: CheckCircle, color: 'text-green-600' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <activity.icon className={`w-5 h-5 ${activity.color}`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold flex items-center">
                    <ShoppingCart className="w-6 h-6 mr-2 text-blue-600" />
                    Order Management
                  </h3>
                  <div className="flex space-x-2">
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      <Download className="w-4 h-4 inline mr-2" />
                      Export Orders
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Table</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Items</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Time</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(order => (
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">#{order.id}</td>
                          <td className="py-3 px-4">{order.customer}</td>
                          <td className="py-3 px-4">Table {order.table}</td>
                          <td className="py-3 px-4">{order.items} items</td>
                          <td className="py-3 px-4 font-semibold">${order.total}</td>
                          <td className="py-3 px-4">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="preparing">Preparing</option>
                              <option value="ready">Ready</option>
                              <option value="delivered">Delivered</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{order.time}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-800">
                                <CheckCircle className="w-4 h-4" />
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

          {activeTab === 'menu' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                  <h3 className="text-xl font-semibold flex items-center">
                    <Package className="w-6 h-6 mr-2 text-blue-600" />
                    Menu Management
                  </h3>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    Add Menu Item
                  </button>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                  <div className="flex-1 relative">
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
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Add/Edit Form */}
                {(showAddForm || editingItem) && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h4 className="text-lg font-semibold mb-4">
                      {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Item Name"
                        value={editingItem ? editingItem.name : newMenuItem.name}
                        onChange={(e) => editingItem 
                          ? setEditingItem({...editingItem, name: e.target.value})
                          : setNewMenuItem({...newMenuItem, name: e.target.value})
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        value={editingItem ? editingItem.category : newMenuItem.category}
                        onChange={(e) => editingItem 
                          ? setEditingItem({...editingItem, category: e.target.value})
                          : setNewMenuItem({...newMenuItem, category: e.target.value})
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        value={editingItem ? editingItem.price : newMenuItem.price}
                        onChange={(e) => editingItem 
                          ? setEditingItem({...editingItem, price: parseFloat(e.target.value)})
                          : setNewMenuItem({...newMenuItem, price: e.target.value})
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="url"
                        placeholder="Image URL"
                        value={editingItem ? editingItem.image : newMenuItem.image}
                        onChange={(e) => editingItem 
                          ? setEditingItem({...editingItem, image: e.target.value})
                          : setNewMenuItem({...newMenuItem, image: e.target.value})
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <textarea
                        placeholder="Description"
                        value={editingItem ? editingItem.description : newMenuItem.description}
                        onChange={(e) => editingItem 
                          ? setEditingItem({...editingItem, description: e.target.value})
                          : setNewMenuItem({...newMenuItem, description: e.target.value})
                        }
                        className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                    </div>
                    <div className="flex space-x-4 mt-4">
                      <button
                        onClick={handleMenuItemSave}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save className="w-4 h-4 inline mr-2" />
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setShowAddForm(false);
                          setEditingItem(null);
                        }}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <Cancel className="w-4 h-4 inline mr-2" />
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Menu Items Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMenuItems.map(item => (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          <span className="text-green-600 font-bold">${item.price}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                        <div className="flex justify-between items-center mb-3">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            {item.category}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-gray-600">{item.popularity}%</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingItem(item)}
                            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            <Edit className="w-4 h-4 inline mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteMenuItem(item.id)}
                            className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            <Trash2 className="w-4 h-4 inline mr-1" />
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

          {/* Other tabs with placeholder content */}
          {!['overview', 'orders', 'menu'].includes(activeTab) && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-semibold mb-4 capitalize flex items-center">
                <Settings className="w-6 h-6 mr-2 text-blue-600" />
                {activeTab.replace('-', ' ')} Management
              </h3>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-gray-600 text-lg mb-2">Advanced {activeTab} Features</p>
                <p className="text-gray-500">This section provides comprehensive {activeTab} management tools for restaurant administrators.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;