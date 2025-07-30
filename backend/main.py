from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import sqlite3
import hashlib
import jwt
import datetime
from contextlib import contextmanager
import os
import uvicorn

# Initialize FastAPI app
app = FastAPI(
    title="RestaurantAI Management System",
    description="Complete restaurant management system with AI integration",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"

# Database setup
DATABASE_PATH = "restaurant_management.db"

@contextmanager
def get_db():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

# Initialize database
def init_database():
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                phone TEXT,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'customer',
                restaurant_id INTEGER,
                status TEXT DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Restaurants table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS restaurants (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                cuisine TEXT NOT NULL,
                description TEXT,
                address TEXT NOT NULL,
                phone TEXT NOT NULL,
                email TEXT,
                image_url TEXT,
                rating REAL DEFAULT 0.0,
                status TEXT DEFAULT 'active',
                admin_id TEXT UNIQUE NOT NULL,
                admin_password TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Tables table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS tables (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                restaurant_id INTEGER NOT NULL,
                table_number INTEGER NOT NULL,
                capacity INTEGER NOT NULL,
                status TEXT DEFAULT 'available',
                table_type TEXT DEFAULT 'standard',
                features TEXT,
                image_url TEXT,
                x_position REAL DEFAULT 0,
                y_position REAL DEFAULT 0,
                FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
            )
        ''')
        
        # Menu items table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS menu_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                restaurant_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                price REAL NOT NULL,
                description TEXT,
                image_url TEXT,
                dietary_info TEXT,
                is_available BOOLEAN DEFAULT 1,
                is_chef_special BOOLEAN DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
            )
        ''')
        
        # Bookings table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS bookings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                restaurant_id INTEGER NOT NULL,
                table_id INTEGER NOT NULL,
                booking_date DATE NOT NULL,
                booking_time TIME NOT NULL,
                party_size INTEGER NOT NULL,
                special_requests TEXT,
                status TEXT DEFAULT 'confirmed',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (restaurant_id) REFERENCES restaurants (id),
                FOREIGN KEY (table_id) REFERENCES tables (id)
            )
        ''')
        
        # Orders table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                restaurant_id INTEGER NOT NULL,
                table_id INTEGER,
                order_type TEXT NOT NULL,
                total_amount REAL NOT NULL,
                status TEXT DEFAULT 'pending',
                special_instructions TEXT,
                scheduled_time TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
            )
        ''')
        
        # Order items table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS order_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER NOT NULL,
                menu_item_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL,
                price REAL NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders (id),
                FOREIGN KEY (menu_item_id) REFERENCES menu_items (id)
            )
        ''')
        
        conn.commit()
        
        # Insert sample data
        insert_sample_data(cursor, conn)

def insert_sample_data(cursor, conn):
    # Check if data already exists
    cursor.execute("SELECT COUNT(*) FROM restaurants")
    if cursor.fetchone()[0] > 0:
        return
    
    # Insert sample restaurants with unique admin credentials
    restaurants_data = [
        (1, "The Golden Spoon", "Fine Dining", "Exquisite fine dining experience with contemporary cuisine", 
         "123 Gourmet Street, Downtown", "+1 (555) 123-4567", "contact@goldenspoon.com",
         "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg", 4.8, "active", 
         "GS001", "golden123"),
        (2, "Sakura Sushi", "Japanese", "Authentic Japanese cuisine with fresh sushi and sashimi",
         "456 Zen Garden Ave, Midtown", "+1 (555) 234-5678", "info@sakurasushi.com",
         "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg", 4.6, "active",
         "SS002", "sakura456"),
        (3, "Mama's Italian", "Italian", "Traditional Italian flavors in a cozy family atmosphere",
         "789 Pasta Lane, Little Italy", "+1 (555) 345-6789", "hello@mamasitalian.com",
         "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg", 4.7, "active",
         "MI003", "mama789")
    ]
    
    cursor.executemany('''
        INSERT INTO restaurants (id, name, cuisine, description, address, phone, email, image_url, rating, status, admin_id, admin_password)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', restaurants_data)
    
    # Insert sample users
    users_data = [
        ("Super Admin", "owner@restaurantai.com", "+1 (555) 000-0000", 
         hashlib.sha256("superadmin2025".encode()).hexdigest(), "superadmin", None, "active"),
        ("John Doe", "john@example.com", "+1 (555) 111-1111",
         hashlib.sha256("customer123".encode()).hexdigest(), "customer", None, "active"),
        ("Golden Spoon Admin", "admin@goldenspoon.com", "+1 (555) 123-4567",
         hashlib.sha256("golden123".encode()).hexdigest(), "admin", 1, "active"),
        ("Sakura Admin", "admin@sakurasushi.com", "+1 (555) 234-5678",
         hashlib.sha256("sakura456".encode()).hexdigest(), "admin", 2, "active"),
        ("Mama's Admin", "admin@mamasitalian.com", "+1 (555) 345-6789",
         hashlib.sha256("mama789".encode()).hexdigest(), "admin", 3, "active")
    ]
    
    cursor.executemany('''
        INSERT INTO users (name, email, phone, password_hash, role, restaurant_id, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', users_data)
    
    conn.commit()

# Pydantic models
class UserLogin(BaseModel):
    email: str
    password: str

class RestaurantAdminLogin(BaseModel):
    admin_id: str
    password: str

class UserCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    password: str
    role: str = "customer"

class RestaurantCreate(BaseModel):
    name: str
    cuisine: str
    description: str
    address: str
    phone: str
    email: str
    image_url: Optional[str] = None

class MenuItemCreate(BaseModel):
    name: str
    category: str
    price: float
    description: str
    image_url: Optional[str] = None
    dietary_info: Optional[str] = None
    is_chef_special: bool = False

class BookingCreate(BaseModel):
    restaurant_id: int
    table_id: int
    booking_date: str
    booking_time: str
    party_size: int
    special_requests: Optional[str] = None

# Utility functions
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

# API Routes

@app.get("/")
async def root():
    return {"message": "RestaurantAI Management System API", "version": "1.0.0"}

# Authentication endpoints
@app.post("/api/auth/login")
async def login(user_data: UserLogin):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, name, email, role, restaurant_id, status FROM users WHERE email = ? AND password_hash = ?",
            (user_data.email, hash_password(user_data.password))
        )
        user = cursor.fetchone()
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        if user['status'] != 'active':
            raise HTTPException(status_code=401, detail="Account is not active")
        
        token_data = {
            "user_id": user['id'],
            "email": user['email'],
            "role": user['role'],
            "restaurant_id": user['restaurant_id']
        }
        
        access_token = create_access_token(token_data)
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user['id'],
                "name": user['name'],
                "email": user['email'],
                "role": user['role'],
                "restaurant_id": user['restaurant_id']
            }
        }

@app.post("/api/auth/restaurant-admin-login")
async def restaurant_admin_login(admin_data: RestaurantAdminLogin):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, name, admin_id FROM restaurants WHERE admin_id = ? AND admin_password = ? AND status = 'active'",
            (admin_data.admin_id, admin_data.password)
        )
        restaurant = cursor.fetchone()
        
        if not restaurant:
            raise HTTPException(status_code=401, detail="Invalid restaurant admin credentials")
        
        token_data = {
            "user_id": f"restaurant_admin_{restaurant['id']}",
            "restaurant_id": restaurant['id'],
            "role": "admin",
            "admin_id": restaurant['admin_id']
        }
        
        access_token = create_access_token(token_data)
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "name": f"{restaurant['name']} Admin",
                "role": "admin",
                "restaurant_id": restaurant['id'],
                "admin_id": restaurant['admin_id']
            }
        }

# Restaurant endpoints
@app.get("/api/restaurants")
async def get_restaurants():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT r.*, COUNT(t.id) as table_count,
                   COUNT(CASE WHEN t.status = 'available' THEN 1 END) as available_tables
            FROM restaurants r
            LEFT JOIN tables t ON r.id = t.restaurant_id
            WHERE r.status = 'active'
            GROUP BY r.id
        """)
        restaurants = [dict(row) for row in cursor.fetchall()]
        return restaurants

@app.get("/api/restaurants/{restaurant_id}")
async def get_restaurant(restaurant_id: int):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM restaurants WHERE id = ? AND status = 'active'", (restaurant_id,))
        restaurant = cursor.fetchone()
        
        if not restaurant:
            raise HTTPException(status_code=404, detail="Restaurant not found")
        
        return dict(restaurant)

@app.get("/api/restaurants/{restaurant_id}/tables")
async def get_restaurant_tables(restaurant_id: int):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM tables WHERE restaurant_id = ?", (restaurant_id,))
        tables = [dict(row) for row in cursor.fetchall()]
        return tables

@app.get("/api/restaurants/{restaurant_id}/menu")
async def get_restaurant_menu(restaurant_id: int):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM menu_items WHERE restaurant_id = ? AND is_available = 1",
            (restaurant_id,)
        )
        menu_items = [dict(row) for row in cursor.fetchall()]
        return menu_items

# Admin endpoints
@app.get("/api/admin/dashboard/{restaurant_id}")
async def get_admin_dashboard(restaurant_id: int, current_user: dict = Depends(verify_token)):
    if current_user['role'] not in ['admin', 'superadmin']:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # For restaurant admin, ensure they can only access their own restaurant
    if current_user['role'] == 'admin' and current_user.get('restaurant_id') != restaurant_id:
        raise HTTPException(status_code=403, detail="Access denied to this restaurant")
    
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Get restaurant stats
        cursor.execute("""
            SELECT 
                COUNT(CASE WHEN DATE(created_at) = DATE('now') THEN 1 END) as today_orders,
                COUNT(CASE WHEN DATE(created_at) = DATE('now', '-1 day') THEN 1 END) as yesterday_orders,
                SUM(CASE WHEN DATE(created_at) = DATE('now') THEN total_amount ELSE 0 END) as today_revenue,
                SUM(CASE WHEN DATE(created_at) = DATE('now', '-1 day') THEN total_amount ELSE 0 END) as yesterday_revenue
            FROM orders WHERE restaurant_id = ?
        """, (restaurant_id,))
        
        stats = dict(cursor.fetchone())
        
        # Get recent orders
        cursor.execute("""
            SELECT o.*, u.name as customer_name, u.phone as customer_phone
            FROM orders o
            JOIN users u ON o.user_id = u.id
            WHERE o.restaurant_id = ?
            ORDER BY o.created_at DESC
            LIMIT 10
        """, (restaurant_id,))
        
        recent_orders = [dict(row) for row in cursor.fetchall()]
        
        # Get table status
        cursor.execute("SELECT * FROM tables WHERE restaurant_id = ?", (restaurant_id,))
        tables = [dict(row) for row in cursor.fetchall()]
        
        return {
            "stats": stats,
            "recent_orders": recent_orders,
            "tables": tables
        }

@app.post("/api/admin/menu-items/{restaurant_id}")
async def create_menu_item(restaurant_id: int, item: MenuItemCreate, current_user: dict = Depends(verify_token)):
    if current_user['role'] not in ['admin', 'superadmin']:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if current_user['role'] == 'admin' and current_user.get('restaurant_id') != restaurant_id:
        raise HTTPException(status_code=403, detail="Access denied to this restaurant")
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO menu_items (restaurant_id, name, category, price, description, image_url, dietary_info, is_chef_special)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (restaurant_id, item.name, item.category, item.price, item.description, 
              item.image_url, item.dietary_info, item.is_chef_special))
        
        conn.commit()
        return {"message": "Menu item created successfully", "id": cursor.lastrowid}

# Super Admin endpoints
@app.get("/api/superadmin/dashboard")
async def get_superadmin_dashboard(current_user: dict = Depends(verify_token)):
    if current_user['role'] != 'superadmin':
        raise HTTPException(status_code=403, detail="Super admin access required")
    
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Platform statistics
        cursor.execute("SELECT COUNT(*) as total_restaurants FROM restaurants WHERE status = 'active'")
        total_restaurants = cursor.fetchone()['total_restaurants']
        
        cursor.execute("SELECT COUNT(*) as total_users FROM users WHERE status = 'active'")
        total_users = cursor.fetchone()['total_users']
        
        cursor.execute("SELECT SUM(total_amount) as total_revenue FROM orders")
        total_revenue = cursor.fetchone()['total_revenue'] or 0
        
        cursor.execute("SELECT COUNT(*) as total_orders FROM orders")
        total_orders = cursor.fetchone()['total_orders']
        
        return {
            "platform_stats": {
                "total_restaurants": total_restaurants,
                "total_users": total_users,
                "total_revenue": total_revenue,
                "total_orders": total_orders
            }
        }

@app.get("/api/superadmin/restaurants")
async def get_all_restaurants_admin(current_user: dict = Depends(verify_token)):
    if current_user['role'] != 'superadmin':
        raise HTTPException(status_code=403, detail="Super admin access required")
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT r.*, 
                   COUNT(o.id) as total_orders,
                   SUM(o.total_amount) as total_revenue,
                   COUNT(u.id) as admin_count
            FROM restaurants r
            LEFT JOIN orders o ON r.id = o.restaurant_id
            LEFT JOIN users u ON r.id = u.restaurant_id AND u.role = 'admin'
            GROUP BY r.id
        """)
        restaurants = [dict(row) for row in cursor.fetchall()]
        return restaurants

@app.get("/api/superadmin/users")
async def get_all_users(current_user: dict = Depends(verify_token)):
    if current_user['role'] != 'superadmin':
        raise HTTPException(status_code=403, detail="Super admin access required")
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT u.id, u.name, u.email, u.phone, u.role, u.status, u.created_at,
                   r.name as restaurant_name,
                   COUNT(o.id) as total_orders,
                   SUM(o.total_amount) as total_spent
            FROM users u
            LEFT JOIN restaurants r ON u.restaurant_id = r.id
            LEFT JOIN orders o ON u.id = o.user_id
            GROUP BY u.id
        """)
        users = [dict(row) for row in cursor.fetchall()]
        return users

# Booking endpoints
@app.post("/api/bookings")
async def create_booking(booking: BookingCreate, current_user: dict = Depends(verify_token)):
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Check if table is available
        cursor.execute(
            "SELECT status FROM tables WHERE id = ? AND restaurant_id = ?",
            (booking.table_id, booking.restaurant_id)
        )
        table = cursor.fetchone()
        
        if not table or table['status'] != 'available':
            raise HTTPException(status_code=400, detail="Table is not available")
        
        # Create booking
        cursor.execute("""
            INSERT INTO bookings (user_id, restaurant_id, table_id, booking_date, booking_time, party_size, special_requests)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (current_user['user_id'], booking.restaurant_id, booking.table_id, 
              booking.booking_date, booking.booking_time, booking.party_size, booking.special_requests))
        
        # Update table status
        cursor.execute("UPDATE tables SET status = 'reserved' WHERE id = ?", (booking.table_id,))
        
        conn.commit()
        return {"message": "Booking created successfully", "booking_id": cursor.lastrowid}

# AI Chat endpoint
@app.post("/api/ai/chat")
async def ai_chat(message: dict):
    user_message = message.get("message", "").lower()
    
    # Enhanced AI responses
    if any(word in user_message for word in ['book', 'reservation', 'table']):
        return {
            "response": "I'd be happy to help you book a table! I can check availability for any of our partner restaurants. Which restaurant interests you, and what date and time would you prefer? I can also suggest the best tables based on your party size and preferences."
        }
    elif any(word in user_message for word in ['menu', 'food', 'dish', 'eat']):
        return {
            "response": "Great choice! I can help you explore our restaurant menus. Are you looking for a specific cuisine type? I can provide personalized recommendations based on dietary preferences, allergies, or your taste profile. What type of dining experience are you in the mood for?"
        }
    elif any(word in user_message for word in ['vegetarian', 'vegan', 'gluten', 'allergy']):
        return {
            "response": "I understand dietary requirements are important! I can filter all our restaurant options and menu items based on your specific needs. We have excellent vegetarian, vegan, gluten-free, and allergy-friendly options. What dietary preferences should I keep in mind?"
        }
    else:
        return {
            "response": "I'm here to make your dining experience exceptional! I can help with restaurant recommendations, table bookings, menu exploration, dietary accommodations, and special requests. What would you like to know more about?"
        }

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_database()
    print("Database initialized successfully!")
    print("\n" + "="*50)
    print("🚀 RestaurantAI Backend Server Started!")
    print("="*50)
    print("📊 Database: SQLite (restaurant_management.db)")
    print("🔐 Admin Credentials:")
    print("   Restaurant 1 (Golden Spoon): ID=GS001, Pass=golden123")
    print("   Restaurant 2 (Sakura Sushi): ID=SS002, Pass=sakura456") 
    print("   Restaurant 3 (Mama's Italian): ID=MI003, Pass=mama789")
    print("👑 Super Admin: owner@restaurantai.com / superadmin2025")
    print("="*50)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)