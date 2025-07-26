import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Crown, Users, DollarSign, TrendingUp, Settings, Menu, X, 
  BarChart3, PieChart, Activity, Shield, Zap, Globe, 
  MessageSquare, Bell, UserCheck, Database, Cpu
} from 'lucide-react';
import NotificationToast from '../components/NotificationToast';

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const { restaurants } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const mockSuperStats = {
    totalRevenue: 125480.50,
    totalRestaurants: restaurants.length,
    totalUsers: 15420,
    systemHealth: 98.5,
    activeOrders: 347,
    totalBookings: 2840
  };

  const mockAnalytics = {
    revenueGrowth: '+12.5%',
    userGrowth: '+8.3%',
    restaurantGrowth: '+15.2%',
    systemUptime: '99.98%'
  };

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
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">Super Admin</h2>
                  <p className="text-gray-300 text-xs">Platform Control</p>
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
              { id: 'analytics', label: 'Analytics Hub', icon: TrendingUp },
              { id: 'restaurants', label: 'Restaurant Management', icon: Globe },
              { id: 'users', label: 'User Administration', icon: Users },
              { id: 'ai-config', label: 'AI Configuration', icon: Cpu },
              { id: 'system', label: 'System Health', icon: Activity },
              { id: 'security', label: 'Security Center', icon: Shield },
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
                  {sidebarOpen && <span>{item.label}</span>}
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
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs text-gray-300">System Owner</p>
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Platform Command Center
              </h1>
              <p className="text-gray-300">Complete system oversight and control</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-green-500/20 border border-green-500/30 px-3 py-1 rounded-full">
                <span className="text-green-200 text-sm">System Operational</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-white text-sm">{mockSuperStats.systemHealth}% Health</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-green-300 text-sm font-medium">{mockAnalytics.revenueGrowth}</span>
                  </div>
                  <h3 className="text-gray-300 text-sm mb-1">Total Revenue</h3>
                  <p className="text-2xl font-bold text-white">${mockSuperStats.totalRevenue.toLocaleString()}</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-blue-300 text-sm font-medium">{mockAnalytics.restaurantGrowth}</span>
                  </div>
                  <h3 className="text-gray-300 text-sm mb-1">Active Restaurants</h3>
                  <p className="text-2xl font-bold text-white">{mockSuperStats.totalRestaurants}</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-purple-300 text-sm font-medium">{mockAnalytics.userGrowth}</span>
                  </div>
                  <h3 className="text-gray-300 text-sm mb-1">Platform Users</h3>
                  <p className="text-2xl font-bold text-white">{mockSuperStats.totalUsers.toLocaleString()}</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-green-300 text-sm font-medium">{mockAnalytics.systemUptime}</span>
                  </div>
                  <h3 className="text-gray-300 text-sm mb-1">System Health</h3>
                  <p className="text-2xl font-bold text-white">{mockSuperStats.systemHealth}%</p>
                </div>
              </div>

              {/* Real-time Activity */}
              <div className="grid lg:grid-cols-2 gap-8">
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

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                    Restaurant Performance
                  </h3>
                  <div className="space-y-4">
                    {restaurants.map((restaurant, index) => (
                      <div key={restaurant.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-white font-medium">{restaurant.name}</h4>
                          <span className="text-green-300 font-semibold">★ {restaurant.rating}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-300">
                          <span>Revenue Today</span>
                          <span>${(Math.random() * 2000 + 500).toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
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
                        defaultValue="7" 
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-sm text-gray-300 mt-2">
                        <span>Slow</span>
                        <span>Ultra Fast</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-3">AI Personality</label>
                    <select className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Professional & Helpful</option>
                      <option>Friendly & Casual</option>
                      <option>Sophisticated & Elegant</option>
                      <option>Enthusiastic & Energetic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-3">Language Support</label>
                    <div className="space-y-2">
                      {['English', 'Spanish', 'French', 'Italian', 'German'].map(lang => (
                        <label key={lang} className="flex items-center space-x-3">
                          <input type="checkbox" defaultChecked={lang === 'English'} className="rounded" />
                          <span className="text-gray-300">{lang}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <h4 className="text-green-200 font-semibold mb-2">AI Status: Online</h4>
                    <p className="text-green-300 text-sm">All AI modules functioning optimally</p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-white font-semibold mb-3">Recent AI Interactions</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-300">• 1,247 customer queries handled today</p>
                      <p className="text-gray-300">• 98.5% satisfaction rate</p>
                      <p className="text-gray-300">• Average response time: 0.8 seconds</p>
                      <p className="text-gray-300">• 156 bookings assisted</p>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium">
                    Deploy AI Updates
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs would be implemented similarly with glassmorphism design */}
          {activeTab !== 'overview' && activeTab !== 'ai-config' && (
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-semibold text-white mb-6 capitalize flex items-center">
                <Settings className="w-6 h-6 mr-3 text-blue-400" />
                {activeTab.replace('-', ' ')} Management
              </h3>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-gray-300 text-lg mb-2">Advanced {activeTab} Features</p>
                <p className="text-gray-400">This premium control panel section is under development. Comprehensive {activeTab} management tools will be available here.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;