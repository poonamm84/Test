import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCustomerAuth } from './CustomerAuthContext';

const CustomerDataContext = createContext();

export const useCustomerData = () => {
  const context = useContext(CustomerDataContext);
  if (!context) {
    throw new Error('useCustomerData must be used within a CustomerDataProvider');
  }
  return context;
};

export const CustomerDataProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const { apiCall, isAuthenticated, authChecked, token } = useCustomerAuth();

  // Load data from localStorage on mount
  useEffect(() => {
    const loadStoredData = () => {
      try {
        const storedRestaurants = localStorage.getItem('customer_restaurants');
        const storedOrders = localStorage.getItem('customer_orders');
        const storedBookings = localStorage.getItem('customer_bookings');
        const storedCart = localStorage.getItem('customer_cart');
        
        if (storedRestaurants) {
          setRestaurants(JSON.parse(storedRestaurants));
        }
        if (storedOrders) {
          setOrders(JSON.parse(storedOrders));
        }
        if (storedBookings) {
          setBookings(JSON.parse(storedBookings));
        }
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
        
        console.log('📦 Customer data restored from localStorage');
      } catch (error) {
        console.error('Error loading stored customer data:', error);
      }
    };
    
    loadStoredData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (restaurants.length > 0) {
      localStorage.setItem('customer_restaurants', JSON.stringify(restaurants));
    }
  }, [restaurants]);

  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('customer_orders', JSON.stringify(orders));
    }
  }, [orders]);

  useEffect(() => {
    if (bookings.length > 0) {
      localStorage.setItem('customer_bookings', JSON.stringify(bookings));
    }
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('customer_cart', JSON.stringify(cart));
  }, [cart]);

  // Load restaurants from API
  const loadRestaurants = async () => {
    setIsLoading(true);
    try {
      const result = await apiCall('/restaurants');
      if (result && result.success) {
        setRestaurants(result.data || []);
        setDataLoaded(true);
        console.log('🏪 Customer restaurants loaded from API');
      } else if (result && Array.isArray(result)) {
        // Handle direct array response from backend
        setRestaurants(result.data);
        setDataLoaded(true);
      } else if (Array.isArray(result)) {
        setRestaurants(result);
        setDataLoaded(true);
        console.log('🏪 Customer restaurants loaded from API (direct array)');
      } else {
        console.warn('Unexpected restaurants response format:', result);
        setRestaurants([]);
        setDataLoaded(true);
      }
    } catch (error) {
      console.warn('⚠️ Failed to load restaurants from API:', error.message);
      // Keep existing data on network errors, don't replace with fallback
      console.log('Keeping existing restaurant data due to network error');
    } finally {
      setIsLoading(false);
    }
  };

  // Load restaurants when authentication is ready
  React.useEffect(() => {
    if (authChecked) {
      loadRestaurants();
      
      // Set up periodic refresh for all users (authenticated or not)
      const interval = setInterval(() => {
        loadRestaurants();
      }, 30000); // Refresh every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [authChecked, isAuthenticated, token]);

  // Force refresh restaurants data
  const refreshRestaurants = async () => {
    await loadRestaurants();
  };

  const addToCart = (item, restaurantId) => {
    setCart(prev => [...prev, { ...item, restaurantId, id: Date.now() }]);
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const addBooking = (booking) => {
    setBookings(prev => [...prev, { ...booking, id: Date.now(), status: 'confirmed' }]);
  };

  const updateTableStatus = (restaurantId, tableId, status) => {
    setRestaurants(prev => prev.map(restaurant => {
      if (restaurant.id === restaurantId) {
        return {
          ...restaurant,
          tables: restaurant.tables.map(table => 
            table.id === tableId ? { ...table, status } : table
          )
        };
      }
      return restaurant;
    }));
  };

  const loadUserOrders = async () => {
    if (!isAuthenticated || !token) return;
    
    try {
      const result = await apiCall('/orders');
      if (result && result.success) {
        setOrders(result.data);
        console.log('📋 Customer orders loaded from API');
      }
    } catch (error) {
      console.warn('⚠️ Failed to load customer orders:', error.message);
    }
  };

  const loadUserBookings = async () => {
    if (!isAuthenticated || !token) return;
    
    try {
      const result = await apiCall('/bookings');
      if (result && result.success) {
        setBookings(result.data);
        console.log('📅 Customer bookings loaded from API');
      }
    } catch (error) {
      console.warn('⚠️ Failed to load customer bookings:', error.message);
    }
  };

  const value = {
    restaurants,
    isLoading,
    dataLoaded,
    loadRestaurants,
    refreshRestaurants,
    orders,
    bookings,
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    addBooking,
    updateTableStatus,
    loadUserOrders,
    loadUserBookings
  };

  return (
    <CustomerDataContext.Provider value={value}>
      {children}
    </CustomerDataContext.Provider>
  );
};