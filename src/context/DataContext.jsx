import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Mock data for restaurants
const mockRestaurants = [
  {
    id: 1,
    name: "The Golden Spoon",
    cuisine: "Fine Dining",
    rating: 4.8,
    image: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg",
    address: "123 Gourmet Street, Downtown",
    phone: "+1 (555) 123-4567",
    description: "Exquisite fine dining experience with contemporary cuisine",
    tables: Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      number: i + 1,
      capacity: [2, 4, 6, 8][Math.floor(Math.random() * 4)],
      status: ['available', 'reserved', 'occupied', 'cleaning'][Math.floor(Math.random() * 4)],
      x: (i % 5) * 80 + 50,
      y: Math.floor(i / 5) * 80 + 50
    }))
  },
  {
    id: 2,
    name: "Sakura Sushi",
    cuisine: "Japanese",
    rating: 4.6,
    image: "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg",
    address: "456 Zen Garden Ave, Midtown",
    phone: "+1 (555) 234-5678",
    description: "Authentic Japanese cuisine with fresh sushi and sashimi",
    tables: Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      number: i + 1,
      capacity: [2, 4, 6][Math.floor(Math.random() * 3)],
      status: ['available', 'reserved', 'occupied', 'cleaning'][Math.floor(Math.random() * 4)],
      x: (i % 5) * 80 + 50,
      y: Math.floor(i / 5) * 80 + 50
    }))
  },
  {
    id: 3,
    name: "Mama's Italian",
    cuisine: "Italian",
    rating: 4.7,
    image: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg",
    address: "789 Pasta Lane, Little Italy",
    phone: "+1 (555) 345-6789",
    description: "Traditional Italian flavors in a cozy family atmosphere",
    tables: Array.from({ length: 18 }, (_, i) => ({
      id: i + 1,
      number: i + 1,
      capacity: [2, 4, 6, 8][Math.floor(Math.random() * 4)],
      status: ['available', 'reserved', 'occupied', 'cleaning'][Math.floor(Math.random() * 4)],
      x: (i % 6) * 70 + 40,
      y: Math.floor(i / 6) * 70 + 40
    }))
  }
];

// Mock menu data
const mockMenuItems = {
  1: [
    {
      id: 1,
      name: "Wagyu Beef Tenderloin",
      category: "Mains",
      price: 89.99,
      description: "Premium wagyu beef with truffle sauce and seasonal vegetables",
      image: "https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg",
      dietary: ["gluten-free"],
      chef_special: true
    },
    {
      id: 2,
      name: "Pan-Seared Salmon",
      category: "Mains",
      price: 32.99,
      description: "Fresh Atlantic salmon with lemon herb butter and quinoa",
      image: "https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg",
      dietary: ["gluten-free", "healthy"]
    },
    {
      id: 3,
      name: "Truffle Arancini",
      category: "Starters",
      price: 18.99,
      description: "Crispy risotto balls with black truffle and parmesan",
      image: "https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg",
      dietary: ["vegetarian"]
    }
  ]
};

export const DataProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [cart, setCart] = useState([]);

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

  const getMenuItems = (restaurantId) => {
    return mockMenuItems[restaurantId] || [];
  };

  const value = {
    restaurants,
    orders,
    bookings,
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    addBooking,
    updateTableStatus,
    getMenuItems
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};