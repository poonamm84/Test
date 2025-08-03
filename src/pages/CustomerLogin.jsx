import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, Mail, Phone, MessageSquare, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const CustomerLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginMethod, setLoginMethod] = useState('email');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    name: '',
    otp: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
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

  const handleSendOTP = () => {
    if (!formData.phone && !formData.email) {
      addNotification('Please enter email or phone number', 'error');
      return;
    }
    
    setIsLoading(true);
    
    const identifier = formData.email || formData.phone;
    
    // For OTP method, we need to send signup request first
    const signupData = {
      name: formData.name || 'Customer',
      email: formData.email || null,
      phone: formData.phone || null,
      password: formData.password || 'temp123'
    };

    apiCall('/auth/signup', {
      method: 'POST',
      body: signupData
    })
    .then(response => {
      if (response.success) {
        setOtpSent(true);
        addNotification(`OTP sent to ${identifier}`, 'success');
      }
    })
    .catch(error => {
      addNotification(error.message || 'Failed to send OTP', 'error');
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const identifier = formData.email || formData.phone;

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
            name: formData.name || 'Customer'
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

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const identifier = formData.email || formData.phone;
    
    apiCall('/auth/verify-otp', {
      method: 'POST',
      body: {
        identifier,
        otp: formData.otp
      }
    })
    .then(response => {
      if (response.success) {
        login(response.data.user, response.data.user.role, response.data.token);
        addNotification('Account verified successfully!', 'success');
        navigate('/dashboard');
      }
    })
    .catch(error => {
      addNotification(error.message || 'OTP verification failed', 'error');
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  const handleResendOTP = () => {
    setIsLoading(true);
    const identifier = formData.email || formData.phone;
    
    apiCall('/auth/resend-otp', {
      method: 'POST',
      body: { identifier }
    })
    .then(response => {
      if (response.success) {
        addNotification('OTP resent successfully!', 'success');
      }
    })
    .catch(error => {
      addNotification(error.message || 'Failed to resend OTP', 'error');
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  // If we're in OTP verification step
  if (otpStep) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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

        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
          <div className="w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white">Verify Your Account</h2>
                <p className="text-gray-300 mt-2">Enter the OTP sent to your {formData.email ? 'email' : 'phone'}</p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm text-center text-2xl tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || formData.otp.length !== 6}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </button>
              <button
                onClick={() => setLoginMethod('phone')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
                  loginMethod === 'phone'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>Phone</span>
              </button>
              <button
                onClick={() => setLoginMethod('otp')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
                  loginMethod === 'otp'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>OTP</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
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

              {loginMethod === 'email' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
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

              {loginMethod === 'phone' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              )}

              {loginMethod === 'otp' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {!isLogin ? 'Email or Phone Number' : 'Phone Number'}
                  </label>
                  {!isLogin ? (
                    <div className="space-y-4">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                        placeholder="Enter email (optional)"
                      />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                        placeholder="Enter phone (optional)"
                      />
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                        placeholder="Enter phone number"
                        required
                      />
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={isLoading || otpSent}
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Sending...' : otpSent ? 'Sent' : 'Send OTP'}
                      </button>
                    </div>
                  )}
                  
                  {otpSent && isLogin && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Enter OTP
                      </label>
                      <input
                        type="text"
                        name="otp"
                        value={formData.otp}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        required
                      />
                    </div>
                  )}
                </div>
              )}

              {!isLogin && loginMethod === 'otp' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
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
              )}

              {(loginMethod === 'email' || loginMethod === 'phone') && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
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
              )}

              {!isLogin && (loginMethod === 'email' || loginMethod === 'phone') && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
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