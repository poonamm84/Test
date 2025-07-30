# RestaurantAI Backend API

## Overview
Complete FastAPI backend for the RestaurantAI Management System with SQLite database integration.

## Features
- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Restaurant Management**: Complete CRUD operations for restaurants
- **User Administration**: User management with different roles (customer, admin, superadmin)
- **Menu Management**: Full menu item management per restaurant
- **Booking System**: Table reservation system
- **Order Management**: Complete order processing
- **AI Chat Integration**: Contextual AI responses
- **Admin Dashboard**: Restaurant-specific admin access
- **Super Admin Panel**: Platform-wide management

## Installation

1. **Install Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

2. **Run the Server**
```bash
python main.py
```

The server will start on `http://localhost:8000`

## Database
- **Type**: SQLite
- **File**: `restaurant_management.db` (auto-created)
- **Browser**: Use DB Browser for SQLite to view/edit data

## API Documentation
Visit `http://localhost:8000/docs` for interactive API documentation.

## Admin Credentials

### Restaurant Admin Login
- **Restaurant 1 (Golden Spoon)**: ID=`GS001`, Password=`golden123`
- **Restaurant 2 (Sakura Sushi)**: ID=`SS002`, Password=`sakura456`
- **Restaurant 3 (Mama's Italian)**: ID=`MI003`, Password=`mama789`

### Super Admin
- **Email**: `owner@restaurantai.com`
- **Password**: `superadmin2025`

### Customer Login
- **Email**: `john@example.com`
- **Password**: `customer123`

## Key Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/restaurant-admin-login` - Restaurant admin login

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/{id}` - Get restaurant details
- `GET /api/restaurants/{id}/menu` - Get restaurant menu
- `GET /api/restaurants/{id}/tables` - Get restaurant tables

### Admin
- `GET /api/admin/dashboard/{restaurant_id}` - Admin dashboard data
- `POST /api/admin/menu-items/{restaurant_id}` - Create menu item

### Super Admin
- `GET /api/superadmin/dashboard` - Platform statistics
- `GET /api/superadmin/restaurants` - All restaurants management
- `GET /api/superadmin/users` - All users management

### Bookings
- `POST /api/bookings` - Create booking

### AI Chat
- `POST /api/ai/chat` - AI chat responses

## Database Schema

### Tables
- `users` - User accounts with roles
- `restaurants` - Restaurant information
- `tables` - Restaurant tables
- `menu_items` - Menu items per restaurant
- `bookings` - Table reservations
- `orders` - Customer orders
- `order_items` - Order line items

## Security Features
- JWT token authentication
- Password hashing with SHA-256
- Role-based access control
- Restaurant-specific admin access
- CORS protection

## Development
- **Framework**: FastAPI
- **Database**: SQLite with context managers
- **Authentication**: JWT tokens
- **Documentation**: Auto-generated OpenAPI/Swagger