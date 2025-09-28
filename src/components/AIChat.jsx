import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Mic, MicOff, X, Minimize2, Maximize2, Volume2, VolumeX, Bot, User } from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useCustomerData } from '../context/CustomerDataContext';

const AIChat = () => {
  const { user } = useCustomerAuth();
  const { restaurants } = useCustomerData();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: `Hello${user?.name ? ` ${user.name}` : ''}! I'm your AI restaurant assistant powered by advanced AI. I can help you with bookings, menu recommendations, dietary preferences, and answer questions about our ${restaurants.length} partner restaurants. How can I assist you today?`, sender: 'ai', timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [position, setPosition] = useState({ 
    x: typeof window !== 'undefined' ? Math.max(20, window.innerWidth - 420) : 20, 
    y: 100 
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Responsive positioning
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setPosition({ x: 10, y: 10 });
      } else {
        setPosition({ x: Math.max(20, window.innerWidth - 420), y: 100 });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Enhanced AI responses with Gemini API integration
  const getContextualResponse = async (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Create context about available restaurants
    const restaurantContext = restaurants.map(r => 
      `${r.name} (${r.cuisine}) - Rating: ${r.rating}, Address: ${r.address}, Available tables: ${r.available_tables || 0}`
    ).join('\n');
    
    const systemPrompt = `You are an AI restaurant assistant for RestaurantAI platform. You help customers with:
    - Restaurant recommendations and bookings
    - Menu suggestions and dietary accommodations
    - Table reservations and availability
    - Special occasion planning
    - Cuisine preferences and food allergies
    
    Current available restaurants:
    ${restaurantContext}
    
    User context: ${user?.name ? `Customer name is ${user.name}` : 'Guest user'}
    
    Provide helpful, personalized responses about dining experiences. Be friendly, knowledgeable, and focus on helping customers find the perfect dining experience.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBj2JX-nIFFUkAEoCumuoR13f-I6adgcXY`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nUser message: ${userMessage}\n\nPlease provide a helpful response about restaurants, bookings, or dining recommendations.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 200,
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiResponse) {
          return aiResponse.trim();
        }
      }
    } catch (error) {
      console.error('Gemini API error:', error);
    }

    // Fallback to contextual responses if Gemini API fails
    return getLocalContextualResponse(message);
  };

  // Local fallback responses
  const getLocalContextualResponse = (message) => {
    
    // Booking related
    if (message.includes('book') || message.includes('reservation') || message.includes('table')) {
      return `I'd be happy to help you book a table! We have ${restaurants.length} amazing partner restaurants available. Which restaurant interests you, and what date and time would you prefer? I can also suggest the best tables based on your party size.`;
    }
    
    // Menu and food related
    if (message.includes('menu') || message.includes('food') || message.includes('dish') || message.includes('eat')) {
      return "Great choice! I can help you explore our restaurant menus. Are you looking for a specific cuisine type? I can also provide personalized recommendations based on dietary preferences, allergies, or your taste profile. What type of dining experience are you in the mood for?";
    }
    
    // Dietary restrictions
    if (message.includes('vegetarian') || message.includes('vegan') || message.includes('gluten') || message.includes('allergy')) {
      return "I understand dietary requirements are important! I can filter all our restaurant options and menu items based on your specific needs. We have excellent vegetarian, vegan, gluten-free, and allergy-friendly options. What dietary preferences should I keep in mind for your recommendations?";
    }
    
    // Restaurant recommendations
    if (message.includes('recommend') || message.includes('suggest') || message.includes('best')) {
      const topRestaurants = restaurants.slice(0, 3).map(r => `${r.name} (${r.cuisine}, ${r.rating}★)`).join(', ');
      return `I'd love to recommend the perfect restaurant for you! Our top-rated options include: ${topRestaurants}. What type of cuisine do you prefer? What's your budget range? Are you looking for a romantic dinner, family meal, or business lunch?`;
    }
    
    // Pricing and budget
    if (message.includes('price') || message.includes('cost') || message.includes('budget') || message.includes('expensive')) {
      return "I can help you find restaurants that fit your budget perfectly! Our partner restaurants range from casual dining to fine dining experiences. What's your preferred price range per person? I can show you great options with transparent pricing and no hidden fees.";
    }
    
    // Location and directions
    if (message.includes('location') || message.includes('address') || message.includes('direction') || message.includes('near')) {
      return "I can help you find restaurants in your preferred area! Are you looking for something nearby, or do you have a specific neighborhood in mind? I can also provide directions and estimated travel times to any of our partner restaurants.";
    }
    
    // Hours and availability
    if (message.includes('open') || message.includes('hours') || message.includes('time') || message.includes('available')) {
      return "I can check real-time availability and operating hours for all our restaurants! Most of our partners are open for lunch and dinner, with some offering breakfast and late-night dining. Which restaurant are you interested in, and what time were you planning to visit?";
    }
    
    // Special occasions
    if (message.includes('birthday') || message.includes('anniversary') || message.includes('celebration') || message.includes('special')) {
      return "How wonderful! I'd love to help make your special occasion memorable. I can recommend restaurants with romantic ambiance, private dining rooms, or special celebration packages. Many of our partners offer complimentary desserts for birthdays and anniversaries. What's the occasion, and how many guests will be joining you?";
    }
    
    // Default responses for general queries
    const defaultResponses = [
      `I'm here to make your dining experience exceptional! I can help with restaurant recommendations, table bookings, menu exploration, dietary accommodations, and special requests. We have ${restaurants.length} amazing restaurants to choose from. What would you like to know more about?`,
      `As your AI dining assistant, I have access to real-time information about all our ${restaurants.length} partner restaurants. I can help you discover new cuisines, find the perfect ambiance, and ensure your dietary needs are met. How can I assist you today?`,
      `I'm designed to understand your dining preferences and provide personalized recommendations. Whether you're looking for a quick bite, romantic dinner, or family celebration, I can guide you to the perfect restaurant experience from our curated selection. What are you in the mood for?`,
      `I can help you navigate our extensive network of ${restaurants.length} restaurants with intelligent recommendations based on your preferences, location, budget, and dietary needs. I also provide real-time availability and can assist with special requests. What would you like to explore?`,
      `My goal is to connect you with the perfect dining experience! I can suggest restaurants, help with bookings, explain menu items, accommodate dietary restrictions, and even help plan special celebrations. What dining experience are you looking for today?`
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const speakText = (text) => {
    if (voiceEnabled && synthRef.current && 'speechSynthesis' in window) {
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    // Generate contextual response with Gemini AI
    try {
      const aiResponseText = await getContextualResponse(currentInput);
      const aiResponse = {
        id: messages.length + 2,
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      
      speakText(aiResponse.text);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const fallbackResponse = {
        id: messages.length + 2,
        text: "I apologize, but I'm having trouble processing your request right now. Please try again, and I'll do my best to help you with your dining needs!",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackResponse]);
      setIsTyping(false);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (voiceEnabled && synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = chatRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const isMobile = window.innerWidth < 768;
      const maxX = window.innerWidth - (isMobile ? 320 : 400);
      const maxY = window.innerHeight - (isMinimized ? 70 : 550);
      
      setPosition({
        x: Math.max(0, Math.min(maxX, e.clientX - dragOffset.x)),
        y: Math.max(0, Math.min(maxY, e.clientY - dragOffset.y))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed ${isMobile ? 'bottom-4 right-4' : 'bottom-6 right-6'} bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 md:p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-50 animate-pulse`}
      >
        <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
        <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full animate-ping"></div>
      </button>
    );
  }

  return (
    <div
      ref={chatRef}
      className="fixed z-50 bg-slate-900/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/60 overflow-hidden"
      style={{
        left: position.x,
        top: position.y,
        width: isMobile ? '90vw' : (isMinimized ? '320px' : '400px'),
        height: isMinimized ? '70px' : (isMobile ? '80vh' : '550px'),
        maxWidth: isMobile ? '350px' : '400px'
      }}
    >
      {/* Header */}
      <div
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 md:p-4 rounded-t-2xl cursor-move flex items-center justify-between shadow-lg"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="relative">
            <Bot className="w-5 h-5 md:w-6 md:h-6 text-white" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h3 className="font-semibold text-sm md:text-base">AI Restaurant Assistant</h3>
            <p className="text-xs text-blue-100">Smart Dining Helper</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 md:space-x-2">
          <button
            onClick={toggleVoice}
            className="text-white hover:text-gray-200 transition-colors p-1"
            title={voiceEnabled ? "Disable Voice" : "Enable Voice"}
          >
            {voiceEnabled ? <Volume2 className="w-3 h-3 md:w-4 md:h-4" /> : <VolumeX className="w-3 h-3 md:w-4 md:h-4" />}
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-3 h-3 md:w-4 md:h-4" /> : <Minimize2 className="w-3 h-3 md:w-4 md:h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-3 h-3 md:w-4 md:h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 p-3 md:p-4 space-y-3 md:space-y-4 overflow-y-auto bg-slate-800/80" style={{ height: isMobile ? 'calc(80vh - 140px)' : '380px' }}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' ? 'bg-blue-600' : 'bg-purple-600'
                  }`}>
                    {message.sender === 'user' ? 
                      <User className="w-3 h-3 text-white" /> : 
                      <Bot className="w-3 h-3 text-white" />
                    }
                  </div>
                  <div
                    className={`p-3 rounded-2xl backdrop-blur-sm border shadow-lg ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-400/50 shadow-blue-500/30'
                        : 'bg-slate-700/95 text-white border-slate-600/60 shadow-slate-900/30'
                    }`}
                  >
                    <p className="text-xs md:text-sm leading-relaxed text-white font-medium">{message.text}</p>
                    <p className="text-xs opacity-70 mt-2 text-slate-200">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-slate-700/95 backdrop-blur-sm text-white p-3 rounded-2xl border border-slate-600/60 shadow-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isSpeaking && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                    <Volume2 className="w-3 h-3 text-white animate-pulse" />
                  </div>
                  <div className="bg-green-600/90 backdrop-blur-sm text-white p-3 rounded-2xl border border-green-500/50 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs md:text-sm text-white">Speaking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 md:p-4 bg-slate-800/95 backdrop-blur-sm border-t border-slate-600/60">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about restaurants, bookings, menus..."
                className="flex-1 px-3 py-2 md:px-4 md:py-3 bg-slate-700/95 border border-slate-600/60 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm text-sm md:text-base"
              />
              <button
                onClick={handleVoiceInput}
                className={`p-2 md:p-3 rounded-xl transition-all duration-200 ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-slate-700/95 text-white hover:bg-slate-600/95 border border-slate-600/60'
                }`}
                title={isListening ? "Stop listening" : "Start voice input"}
              >
                {isListening ? <MicOff className="w-3 h-3 md:w-4 md:h-4" /> : <Mic className="w-3 h-3 md:w-4 md:h-4" />}
              </button>
              <button
                onClick={handleSendMessage}
                disabled={inputMessage.trim() === ''}
                className="p-2 md:p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <Send className="w-3 h-3 md:w-4 md:h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AIChat;