import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, Phone, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const CustomerLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginMethod, setLoginMethod] = useState('email');
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login, apiCall } = useAuth();
  const { addNotification } = useNotification();

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation for signup
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        addNotification('Passwords do not match', 'error');
        return;
      }
      if (!formData.name || !formData.mobile || !formData.email || !formData.password) {
        addNotification('Please fill in all required fields', 'error');
        return;
      }
    }
    
    setIsLoading(true);

    const identifier = loginMethod === 'mobile' ? formData.mobile : formData.email;

    // First try to login
    apiCall('/auth/login', {
      method: 'POST',
      body: {
        identifier,
        password: formData.password
      }
    })
    .then(response => {
      if (response.success) {
        const user = response.data.user;
        login(user, user.role, response.data.token);
        addNotification('Login successful!', 'success');
        
        // Navigate based on role
        if (user.role === 'admin') {
          navigate('/admin');
        } else if (user.role === 'superadmin') {
          navigate('/super-admin');
        } else {
          navigate('/dashboard');
        }
      }
    })
    .catch(error => {
      // If login fails and we're in signup mode, try auto-signup
      if (!isLogin && error.message.includes('Invalid email/password')) {
        apiCall('/auth/auto-signup-login', {
          method: 'POST',
          body: {
            identifier,
            password: formData.password,
            name: formData.name,
            mobile: formData.mobile,
            email: formData.email
          }
        })
        .then(response => {
          if (response.success) {
            login(response.data.user, response.data.user.role, response.data.token);
            addNotification('Account created and logged in successfully!', 'success');
            navigate('/dashboard');
          }
        })
        .catch(signupError => {
          addNotification(signupError.message || 'Failed to create account', 'error');
        })
        .finally(() => {
          setIsLoading(false);
        });
      } else {
        addNotification(error.message || 'Login failed', 'error');
        setIsLoading(false);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5 text-white" />
              <ChefHat className="h-8 w-8 text-orange-400" />
              <span className="text-2xl font-bold text-white">RestaurantAI</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8">
            {/* Toggle */}
            <div className="flex bg-white/10 rounded-lg p-1 mb-8">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  isLogin
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-white hover:text-gray-300'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  !isLogin
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-white hover:text-gray-300'
                }`}
              >
                Sign Up
              </button>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-300 mt-2">
                {isLogin ? 'Sign in to your account' : 'Join the RestaurantAI community'}
              </p>
            </div>

            {/* Login Method Selector */}
            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => setLoginMethod('email')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
                  loginMethod === 'email'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <span>Email</span>
              </button>
              <button
                onClick={() => setLoginMethod('mobile')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
                  loginMethod === 'mobile'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>Mobile</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                    placeholder="Enter your mobile number"
                    required
                  />
                </div>
              )}

              {loginMethod === 'email' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address {!isLogin ? '*' : ''}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              )}

              {loginMethod === 'mobile' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                    placeholder="Enter your mobile number"
                    required
                  />
                </div>
              )}

              <div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password {!isLogin ? '*' : ''}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm pr-12"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-300">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;