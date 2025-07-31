import React, { useState } from 'react';
import { Calendar, Clock, Users, ArrowLeft, Check, MapPin, Star, Utensils, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

function App() {
  const [showTableCards, setShowTableCards] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showImageView, setShowImageView] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    guests: 2,
    specialRequests: ''
  });

  // Restaurant data
  const restaurant = {
    id: 1,
    name: "Foo Palladium Ahmedabad",
    cuisine: "Chinese, Sushi, Asian, Japanese",
    rating: 4.4,
    priceForTwo: "₹2,500",
    location: "Thaltej, Ahmedabad • 4.9 km",
    image: "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop"
  };

  // Table types with detailed information
  const tableTypes = [
    {
      id: 1,
      name: "Couple Table",
      type: "couple",
      capacity: 2,
      description: "Perfect for intimate dining with stunning city views",
      image: "https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      minSpend: "₹1,500",
      features: ["Window view", "Romantic ambiance", "Perfect for couples"],
      availableSlots: ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"],
      gallery: [
        "https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        "https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
      ]
    },
    {
      id: 2,
      name: "Family Table",
      type: "family",
      capacity: 4,
      description: "Spacious seating in the heart of the restaurant",
      image: "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      minSpend: "₹2,500",
      features: ["Central location", "Great for families", "Vibrant atmosphere"],
      availableSlots: ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"],
      gallery: [
        "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        "https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
      ]
    },
    {
      id: 3,
      name: "Large Group Table",
      type: "group",
      capacity: 6,
      description: "Exclusive booth for special occasions and complete privacy",
      image: "https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      minSpend: "₹4,000",
      features: ["Complete privacy", "Premium service", "Special occasions"],
      availableSlots: ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30"],
      gallery: [
        "https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        "https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
      ]
    }
  ];

  const handleBookTableClick = () => {
    setShowTableCards(true);
    };

  const handleTableClick = (table) => {
    setSelectedTable(table);
    setCurrentImageIndex(0);
    setShowImageView(true);
  };

  const handleTableSelect = (table) => {
    setSelectedTable(table);
    setShowImageView(true);
    setBookingData(prev => ({ ...prev, guests: table.capacity }));
  };

  const handleBackToTableCards = () => {
    setShowImageView(false);
  };

  const handleBackToMain = () => {
    setShowTableCards(false); 
    setShowImageView(false);  
  };

  const handleBooking = (e) => {
    e.preventDefault();
    if (!selectedTable || !bookingData.date || !bookingData.time) {
      alert('Please fill in all required fields');
      return;
    }

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? tableTypes.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === tableTypes.length - 1 ? 0 : prevIndex + 1
    );
  };
    
    alert(`Table booked successfully!\n\nTable: ${selectedTable.name}\nDate: ${bookingData.date}\nTime: ${bookingData.time}\nGuests: ${bookingData.guests}`);
    
    // Reset form
    setShowTableCards(false);
    setShowImageView(false);
    setSelectedTable(null);
    setBookingData({
      date: '',
      time: '',
      guests: 2,
      specialRequests: ''
    });
  };

  const nextImage = () => {
    if (selectedTable) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedTable.gallery.length);
    }
  };

  const prevImage = () => {
    if (selectedTable) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedTable.gallery.length) % selectedTable.gallery.length);
    }
  };


  // Choose Your Table View
  if (!showImageView) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <header className="bg-white/90 backdrop-blur-md shadow-sm border-b sticky top-0 z-40">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <button 
                onClick={handleBackToMain} 
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors hover:bg-gray-100 px-2 py-1 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Back</span>
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Choose Your Table</h1>
              <div className="w-16"></div>
            </div>
          </div>
        </header>

        <div className="px-4 py-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your Perfect Table</h2>
            <p className="text-gray-600 text-sm">Choose from our carefully curated seating options</p>
          </div>
          
          <div className="flex overflow-x-auto gap-4 px-2 snap-x snap-mandatory scroll-smooth">
            {tableTypes.map((tableType) => (
              <div key={tableType.id} className="bg-white rounded-2xl shadow-lg border min-w-[280px] max-w-xs snap-center shrink-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 aspect-[3/4]">
                <div className="relative">
                  <div className="h-40 overflow-hidden rounded-t-2xl">
                    <img
                      src={tableType.image}
                      alt={tableType.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  
                  <div className="absolute top-3 right-3">
                    <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                      {tableType.capacity} seats
                    </div>
                  </div>
                </div>
                
                <div className="p-4 flex flex-col justify-between h-[calc(100%-10rem)]">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-base font-bold text-gray-900 mb-1">{tableType.name}</h4>
                      <p className="text-gray-600 text-xs leading-relaxed">{tableType.description}</p>
                    </div>
                    <div className="text-right ml-2">
                      <div className="text-sm font-bold text-green-600">{tableType.minSpend}</div>
                      <div className="text-xs text-gray-500">min spend</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {tableType.features.map((feature, index) => (
                      <span key={index} className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => handleTableSelect(tableType)}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-2.5 px-4 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold flex items-center justify-center space-x-2 text-sm transform hover:scale-105 active:scale-95"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View This Table</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Table Detail and Booking View
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={handleBackToTableCards} 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors hover:bg-gray-100 px-2 py-1 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">{selectedTable.name}</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      <div className="bg-white mx-4 mt-4 rounded-2xl shadow-lg border overflow-hidden">
        <div className="relative">
          <div className="h-56 overflow-hidden">
            <img
              src={selectedTable.gallery[currentImageIndex]}
              alt={selectedTable.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {selectedTable.gallery.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
          
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {selectedTable.gallery.length}
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-16">
            <h2 className="text-xl font-bold text-white mb-2">{selectedTable.name}</h2>
            <p className="text-white/90 text-sm">{selectedTable.description}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <div className="bg-white rounded-2xl shadow-lg border p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Table Details</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-gray-900">{selectedTable.capacity}</div>
              <div className="text-sm text-gray-600">Seating Capacity</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-gray-900">{selectedTable.minSpend}</div>
              <div className="text-sm text-gray-600">Minimum Spend</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Features:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedTable.features.map((feature, index) => (
                <span key={index} className="bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full font-medium">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Your Table</h3>
          
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                required
              >
                <option value="">Select time</option>
                {selectedTable.availableSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Party Size
            </label>
            <select
              value={bookingData.guests}
              onChange={(e) => setBookingData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            >
              {Array.from({ length: selectedTable.capacity }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1} guest{i > 0 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
            <textarea
              value={bookingData.specialRequests}
              onChange={(e) => setBookingData(prev => ({ ...prev, specialRequests: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              placeholder="Any dietary requirements, celebration notes, or special requests..."
            />
          </div>
        </div>

        {bookingData.date && bookingData.time && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Table Type:</span>
                <span className="font-medium">{selectedTable.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Capacity:</span>
                <span className="font-medium">{selectedTable.capacity} guests</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date & Time:</span>
                <span className="font-medium">{bookingData.date} at {bookingData.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Party Size:</span>
                <span className="font-medium">{bookingData.guests} guests</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Minimum Spend:</span>
                <span className="font-medium text-green-600">{selectedTable.minSpend}</span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleBooking}
          disabled={!bookingData.date || !bookingData.time}
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 px-6 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center space-x-2 transform hover:scale-105 active:scale-95"
        >
          <Check className="w-5 h-5" />
          <span>Confirm Booking</span>
        </button>
      </div>
    </div>
  );
}

export default App;