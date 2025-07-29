import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useNotification } from '../context/NotificationContext';
import { Calendar, Clock, Users, ArrowLeft, Check, MapPin, Star, Utensils, Wifi, Car } from 'lucide-react';

const BookingView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { restaurants, addBooking, updateTableStatus } = useData();
  const { addNotification } = useNotification();
  
  const restaurant = restaurants.find(r => r.id === parseInt(id));
  const [selectedTable, setSelectedTable] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    guests: 2,
    specialRequests: ''
  });

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  const handleTableSelect = (table) => {
    if (table.status === 'available') {
      setSelectedTable(table);
    }
  };

  const handleBooking = (e) => {
    e.preventDefault();
    if (!selectedTable) {
      addNotification('Please select a table', 'error');
      return;
    }

    const booking = {
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      tableId: selectedTable.id,
      tableNumber: selectedTable.number,
      ...bookingData,
      createdAt: new Date()
    };

    addBooking(booking);
    updateTableStatus(restaurant.id, selectedTable.id, 'reserved');
    addNotification('Table booked successfully!', 'success');
    navigate('/dashboard');
  };

  const getTableStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'reserved': return 'bg-yellow-500';
      case 'occupied': return 'bg-red-500';
      case 'cleaning': return 'bg-gray-500';
      default: return 'bg-gray-300';
    }
  };

  const getTableFeatureIcon = (type) => {
    switch (type) {
      case 'window': return <MapPin className="w-3 h-3" />;
      case 'private': return <Users className="w-3 h-3" />;
      case 'corner': return <Star className="w-3 h-3" />;
      default: return <Utensils className="w-3 h-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center space-x-2 text-gray-600">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">Book Table</h1>
            <div className="w-8"></div>
          </div>
        </div>
      </header>

      {/* Restaurant Info */}
      <div className="bg-white border-b px-4 py-4">
        <div className="flex items-center space-x-3">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">{restaurant.name}</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span>{restaurant.rating}</span>
              <span>•</span>
              <span>{restaurant.cuisine}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Date & Time Selection */}
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">When would you like to dine?</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date
              </label>
              <input
                type="date"
                value={bookingData.date}
                onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Time
              </label>
              <select
                value={bookingData.time}
                onChange={(e) => setBookingData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              >
                <option value="">Select time</option>
                {['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'].map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Party Size
            </label>
            <select
              value={bookingData.guests}
              onChange={(e) => setBookingData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {Array.from({ length: 8 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1} guest{i > 0 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Selection */}
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose your table</h3>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-3 mb-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Reserved</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Occupied</span>
            </div>
          </div>

          {/* Table Grid - Mobile Optimized */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {restaurant.tables.map(table => (
              <button
                key={table.id}
                className={`relative p-3 rounded-xl border-2 transition-all duration-300 ${
                  selectedTable?.id === table.id 
                    ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105' 
                    : table.status === 'available' 
                      ? 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md' 
                      : 'border-gray-200 bg-gray-50 opacity-60'
                } ${table.status !== 'available' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => handleTableSelect(table)}
                disabled={table.status !== 'available'}
              >
                {/* Status Indicator */}
                <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${getTableStatusColor(table.status)} ${
                  table.status === 'available' ? 'animate-pulse' : ''
                }`}></div>
                
                {/* Table Image */}
                <div className="w-full h-16 sm:h-20 bg-gray-100 rounded-lg mb-2 overflow-hidden relative">
                  <img
                    src={table.status === 'available' 
                      ? `https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop&crop=center`
                      : `https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop&crop=center`
                    }
                    alt={`Table ${table.number}`}
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      table.status === 'available' ? 'brightness-100' : 'brightness-50 grayscale'
                    }`}
                  />
                  {/* Table overlay with elegant design */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <div className="absolute bottom-1 left-1 right-1">
                    <div className="bg-white/90 backdrop-blur-sm rounded px-2 py-1">
                      <div className="text-xs font-semibold text-gray-800 text-center">
                        Table {table.number}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Table Info */}
                <div className="text-left">
                  <div className="flex items-center justify-between mb-1 text-xs sm:text-sm">
                    <span className="font-semibold text-gray-900">{table.capacity} seats</span>
                    <span className="text-gray-600 capitalize">{table.type}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      {getTableFeatureIcon(table.type)}
                      <span>Premium</span>
                    </div>
                    {table.features && (
                      <div className="flex items-center space-x-1">
                        <Wifi className="w-3 h-3 text-blue-500" />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {selectedTable && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Check className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-blue-900">Table {selectedTable.number} Selected ✨</p>
                  <p className="text-sm text-blue-700">Perfect for {selectedTable.capacity} guests • {selectedTable.type} seating • Premium location</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Special Requests */}
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Special Requests</h3>
          <textarea
            value={bookingData.specialRequests}
            onChange={(e) => setBookingData(prev => ({ ...prev, specialRequests: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Any dietary requirements, celebration notes, or special requests..."
          />
        </div>

        {/* Booking Summary */}
        {selectedTable && bookingData.date && bookingData.time && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Restaurant:</span>
                <span className="font-medium">{restaurant.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Table:</span>
                <span className="font-medium">Table {selectedTable.number} ({selectedTable.capacity} seats)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date & Time:</span>
                <span className="font-medium">{bookingData.date} at {bookingData.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Party Size:</span>
                <span className="font-medium">{bookingData.guests} guests</span>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Button */}
        <button
          onClick={handleBooking}
          disabled={!selectedTable || !bookingData.date || !bookingData.time}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center space-x-2"
        >
          <Check className="w-5 h-5" />
          <span>Confirm Booking</span>
        </button>
      </div>
    </div>
  );
};

export default BookingView;