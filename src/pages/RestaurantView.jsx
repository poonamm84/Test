import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCustomerData } from '../context/CustomerDataContext';
import { Star, MapPin, Phone, Clock, ArrowLeft, Calendar, Menu } from 'lucide-react';

const RestaurantView = () => {
  const { id } = useParams();
  const { restaurants } = useCustomerData();
  const restaurant = restaurants.find(r => r.id === parseInt(id));

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

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

      {/* Restaurant Hero */}
      <div className="relative h-96">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-8 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{restaurant.name}</h1>
              <div className="flex flex-wrap items-center gap-6 text-lg">
                <div className="flex items-center space-x-2">
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  <span>{restaurant.rating} Rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-6 h-6" />
                  <span>{restaurant.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-6 h-6" />
                  <span>{restaurant.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-6 h-6" />
                  <span>Open until 11:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {restaurant.name}</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {restaurant.description}
              </p>
              <p className="text-gray-600 leading-relaxed">
                Experience culinary excellence at {restaurant.name}, where every dish tells a story of passion, 
                tradition, and innovation. Our expert chefs use only the finest ingredients to create memorable 
                dining experiences that will delight your senses.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Restaurant Features</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  'Premium Dining Experience',
                  'Fresh Local Ingredients',
                  'Expert Chef Team',
                  'Romantic Ambiance',
                  'Private Dining Rooms',
                  'Extensive Wine Selection',
                  'Dietary Accommodations',
                  'Exceptional Service'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-4">
                <Link
                  to={`/restaurant/${restaurant.id}/booking`}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium flex items-center justify-center space-x-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book a Table</span>
                </Link>
                
                <Link
                  to={`/restaurant/${restaurant.id}/menu`}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <Menu className="w-5 h-5" />
                  <span>View Menu</span>
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Opening Hours</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>11:00 AM - 11:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 12:00 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>10:00 AM - 10:00 PM</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Contact Info</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{restaurant.phone}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 mt-0.5" />
                    <span>{restaurant.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantView;