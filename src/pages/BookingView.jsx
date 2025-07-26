import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useNotification } from '../context/NotificationContext';
import { Calendar, Clock, Users, ArrowLeft, Check } from 'lucide-react';

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

  const getTableColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-500 hover:bg-green-600';
      case 'reserved': return 'bg-yellow-500';
      case 'occupied': return 'bg-red-500';
      case 'cleaning': return 'bg-gray-500';
      default: return 'bg-gray-300';
    }
  };

  const getTableStatus = (status) => {
    switch (status) {
      case 'available': return 'Available';
      case 'reserved': return 'Reserved';
      case 'occupied': return 'Occupied';
      case 'cleaning': return 'Cleaning';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link to="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book a Table</h1>
          <p className="text-gray-600">Reserve your table at {restaurant.name}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Table Map */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Select Your Table</h2>
            
            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span>Reserved</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Occupied</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-500 rounded"></div>
                <span>Cleaning</span>
              </div>
            </div>

            {/* Table Layout */}
            <div className="relative bg-gray-100 rounded-lg p-8 min-h-[400px]">
              {restaurant.tables.map(table => (
                <button
                  key={table.id}
                  className={`absolute w-12 h-12 rounded-lg text-white font-semibold text-sm transition-all transform hover:scale-110 ${
                    getTableColor(table.status)
                  } ${selectedTable?.id === table.id ? 'ring-4 ring-blue-500' : ''} ${
                    table.status !== 'available' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                  }`}
                  style={{ left: table.x, top: table.y }}
                  onClick={() => handleTableSelect(table)}
                  disabled={table.status !== 'available'}
                  title={`Table ${table.number} - ${getTableStatus(table.status)} - ${table.capacity} seats`}
                >
                  {table.number}
                </button>
              ))}
            </div>

            {selectedTable && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900">Selected Table</h3>
                <p className="text-blue-800">
                  Table {selectedTable.number} - {selectedTable.capacity} seats
                </p>
              </div>
            )}
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
            
            <form onSubmit={handleBooking} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Date
                </label>
                <input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Time
                </label>
                <select
                  value={bookingData.time}
                  onChange={(e) => setBookingData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select time</option>
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    return [
                      <option key={`${hour}:00`} value={`${hour}:00`}>{hour}:00</option>,
                      <option key={`${hour}:30`} value={`${hour}:30`}>{hour}:30</option>
                    ];
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Number of Guests
                </label>
                <select
                  value={bookingData.guests}
                  onChange={(e) => setBookingData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} guest{i > 0 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests (Optional)
                </label>
                <textarea
                  value={bookingData.specialRequests}
                  onChange={(e) => setBookingData(prev => ({ ...prev, specialRequests: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any special requests or dietary requirements..."
                />
              </div>

              <button
                type="submit"
                disabled={!selectedTable}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
              >
                <Check className="w-5 h-5" />
                <span>Confirm Booking</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingView;