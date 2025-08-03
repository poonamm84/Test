# Restaurant Management System Backend

A complete Node.js backend with Express and REST API architecture for the Restaurant Management System.

## Features

- **User Authentication**: Signup with OTP verification, login with JWT tokens
- **Admin Authentication**: Restaurant-specific admin login
- **Super Admin**: Platform-wide management
- **Restaurant Management**: CRUD operations for restaurants
- **Menu Management**: Full menu item management
- **Order Management**: Order creation and status tracking
- **Booking System**: Table reservation system
- **Real-time Updates**: All changes reflected immediately
- **Security**: Password hashing, JWT tokens, rate limiting, CORS protection

## Quick Start

1. **Install Dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Setup Database**:
   ```bash
   npm run setup
   ```

3. **Configure Environment**:
   - Copy `.env.example` to `.env`
   - Update Twilio credentials and email settings

4. **Start Server**:
   ```bash
   npm run dev  # Development with auto-reload
   npm start    # Production
   ```

5. **Access the API**:
   - API Server: http://localhost:5000
   - Health Check: http://localhost:5000/health
   - API Documentation: http://localhost:5000/

## Database Schema

The system uses SQLite with the following tables:

### User Tables
- `signup_users` - Temporary storage during signup process
- `login_users` - Verified users who can login
- `users` - Admin and super admin accounts

### Restaurant Tables
- `restaurants` - Restaurant information and admin credentials
- `restaurant_tables` - Table management
- `menu_items` - Menu items for each restaurant

### Transaction Tables
- `bookings` - Table reservations
- `orders` - Customer orders
- `order_items` - Individual items in orders
- `order_status_history` - Order status tracking

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User signup with OTP
- `POST /api/auth/verify-otp` - Verify OTP and complete signup
- `POST /api/auth/resend-otp` - Resend OTP
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-login` - Admin login
- `POST /api/auth/super-admin-login` - Super admin login

### Public Endpoints
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant details
- `GET /api/restaurants/:id/menu` - Get restaurant menu
- `GET /api/restaurants/:id/tables` - Get restaurant tables

### Customer Endpoints (Requires Authentication)
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details

### Admin Endpoints (Requires Admin Token)
- `GET /api/admin/restaurant` - Get admin's restaurant
- `GET /api/admin/dashboard` - Get dashboard analytics
- `GET /api/admin/menu` - Get restaurant menu items
- `POST /api/admin/menu` - Create menu item
- `PUT /api/admin/menu/:id` - Update menu item
- `DELETE /api/admin/menu/:id` - Delete menu item
- `GET /api/admin/orders` - Get restaurant orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/bookings` - Get restaurant bookings

### Super Admin Endpoints (Requires Super Admin Token)
- `GET /api/super-admin/dashboard` - Get platform analytics
- `GET /api/super-admin/restaurants` - Get all restaurants
- `GET /api/super-admin/users` - Get all users
- `GET /api/super-admin/orders` - Get all orders
- `GET /api/super-admin/analytics` - Get detailed analytics

## Demo Credentials

### Restaurant Admins:
- **The Golden Spoon**: GS001 / admin123
- **Sakura Sushi**: SS002 / admin123  
- **Mama's Italian**: MI003 / admin123

### Super Admin:
- **Email**: owner@restaurantai.com
- **Password**: superadmin2025
- **Security Code**: 777888

## OTP Integration

The system supports OTP verification via:
- **SMS**: Using Twilio for phone number verification
- **Email**: Using Nodemailer for email verification

OTPs are 6-digit numbers valid for 10 minutes.

## Security Features

- Password hashing using bcryptjs
- JWT token authentication with 24-hour expiry
- Role-based access control
- Restaurant-specific admin isolation
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Input validation and sanitization
- SQL injection prevention

## Database Management

The database is automatically created and populated with sample data when you run `npm run setup`. The SQLite database file `restaurant.db` will be created in the `database` directory.

## Frontend Integration

The backend is designed to work seamlessly with the existing React frontend. All API endpoints match the expected frontend calls, and the authentication flow integrates with the existing auth context.

## Development

- The server runs with auto-reload enabled for development
- Database is automatically initialized with sample data
- All changes are immediately reflected in the database
- CORS is configured for local development

## Production Notes

- Change the `JWT_SECRET` in production
- Use environment variables for sensitive configuration
- Consider using PostgreSQL for production instead of SQLite
- Implement proper logging and monitoring
- Add rate limiting and additional security measures
- Set up proper SSL/TLS certificates

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors if applicable
}
```

## Success Responses

All successful API calls return:

```json
{
  "success": true,
  "message": "Success description",
  "data": {} // Response data
}
```

## Testing

You can test the API using tools like Postman or curl. The health check endpoint (`/health`) can be used to verify the server is running.

## Support

For issues or questions, please check the API documentation at the root endpoint (`/`) or contact the development team.