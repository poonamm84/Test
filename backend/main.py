from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import sqlite3
import hashlib
import jwt
import datetime
from contextlib import contextmanager
import json
import uvicorn

# FastAPI app initialization
app = FastAPI(title="Restaurant Management API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
SECRET_KEY = "restaurant_management_secret_key_2025"
ALGORITHM = "HS256"

# Database file
DATABASE_FILE = "restaurant_management.db"

# Pydantic models
class UserSignup(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class AdminLogin(BaseModel):
    admin_id: str
    password: str

class SuperAdminLogin(BaseModel):
    email: str
    password: str
    security_code: str

class MenuItem(BaseModel):
    name: str
    category: str
    price: float
    description: str
    image: str
    dietary: Optional[List[str]] = []
    available: bool = True

class RestaurantCreate(BaseModel):
    name: str
    cuisine: str
    address: str
    phone: str
    description: str
    image: str
    admin_id: str
    admin_password: str

class BookingCreate(BaseModel):
    restaurant_id: int
    table_id: int
    date: str
    time: str
    guests: int
    special_requests: Optional[str] = ""

class OrderCreate(BaseModel):
    restaurant_id: int
    items: List[dict]
    order_type: str
    scheduled_time: Optional[str] = None
    special_instructions: Optional[str] = ""

class AIMessage(BaseModel):
    message: str
    context: Optional[dict] = {}

# Database context manager
@contextmanager
def get_db():
    conn = sqlite3.connect(DATABASE_FILE)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

# Database initialization
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
                role TEXT DEFAULT 'customer',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT 1
            )
        ''')
        
        # Restaurants table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS restaurants (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                cuisine TEXT NOT NULL,
                rating REAL DEFAULT 4.5,
                image TEXT,
                address TEXT,
                phone TEXT,
                description TEXT,
                admin_id TEXT UNIQUE NOT NULL,
                admin_password_hash TEXT NOT NULL,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Tables table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS tables (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                restaurant_id INTEGER,
                number INTEGER NOT NULL,
                capacity INTEGER NOT NULL,
                status TEXT DEFAULT 'available',
                type TEXT DEFAULT 'standard',
                features TEXT,
                image TEXT,
                FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
            )
        ''')
        
        # Menu items table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS menu_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                restaurant_id INTEGER,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                price REAL NOT NULL,
                description TEXT,
                image TEXT,
                dietary TEXT,
                chef_special BOOLEAN DEFAULT 0,
                available BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
            )
        ''')
        
        # Bookings table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS bookings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                restaurant_id INTEGER,
                table_id INTEGER,
                date TEXT NOT NULL,
                time TEXT NOT NULL,
                guests INTEGER NOT NULL,
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
                user_id INTEGER,
                restaurant_id INTEGER,
                order_type TEXT NOT NULL,
                status TEXT DEFAULT 'pending',
                total_amount REAL NOT NULL,
                scheduled_time TEXT,
                special_instructions TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
            )
        ''')
        
        # Order items table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS order_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER,
                menu_item_id INTEGER,
                quantity INTEGER NOT NULL,
                price REAL NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders (id),
                FOREIGN KEY (menu_item_id) REFERENCES menu_items (id)
            )
        ''')
        
        # AI chat history table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS ai_chat_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                message TEXT NOT NULL,
                response TEXT NOT NULL,
                context TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        conn.commit()
        
        # Insert sample data
        insert_sample_data(cursor)
        conn.commit()

def insert_sample_data(cursor):
    # Check if data already exists
    cursor.execute("SELECT COUNT(*) FROM restaurants")
    if cursor.fetchone()[0] > 0:
        return
    
    # Sample restaurants with admin credentials
    restaurants_data = [
        (1, "The Golden Spoon", "Fine Dining", 4.8, "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg", 
         "123 Gourmet Street, Downtown", "+1 (555) 123-4567", 
         "Exquisite fine dining experience with contemporary cuisine", 
         "GS001", hash_password("golden123")),
        (2, "Sakura Sushi", "Japanese", 4.6, "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg",
         "456 Zen Garden Ave, Midtown", "+1 (555) 234-5678",
         "Authentic Japanese cuisine with fresh sushi and sashimi",
         "SS002", hash_password("sakura456")),
        (3, "Mama's Italian", "Italian", 4.7, "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg",
         "789 Pasta Lane, Little Italy", "+1 (555) 345-6789",
         "Traditional Italian flavors in a cozy family atmosphere",
         "MI003", hash_password("mama789"))
    ]
    
    cursor.executemany('''
        INSERT INTO restaurants (id, name, cuisine, rating, image, address, phone, description, admin_id, admin_password_hash)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', restaurants_data)
    
    # Sample tables for each restaurant
    tables_data = []
    for restaurant_id in [1, 2, 3]:
        for i in range(1, 21):
            tables_data.append((
                restaurant_id, i, [2, 4, 6, 8][i % 4], 
                ['available', 'reserved', 'occupied'][i % 3] if i > 15 else 'available',
                ['window', 'corner', 'center', 'private'][i % 4],
                json.dumps(['WiFi', 'Power Outlet', 'Premium View']),
                f"https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop&crop=center"
            ))
    
    cursor.executemany('''
        INSERT INTO tables (restaurant_id, number, capacity, status, type, features, image)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', tables_data)
    
    # Sample menu items
    menu_items_data = [
        # Golden Spoon menu
        (1, "Wagyu Beef Tenderloin", "Mains", 89.99, "Premium wagyu beef with truffle sauce", 
         "https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg", 
         json.dumps(["gluten-free"]), 1),
        (1, "Pan-Seared Salmon", "Mains", 32.99, "Fresh Atlantic salmon with lemon herb butter", 
         "https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg", 
         json.dumps(["gluten-free", "healthy"]), 0),
        (1, "Truffle Arancini", "Starters", 18.99, "Crispy risotto balls with black truffle", 
         "https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg", 
         json.dumps(["vegetarian"]), 0),
        
        # Sakura Sushi menu
        (2, "Sashimi Platter", "Sashimi", 45.99, "Fresh selection of tuna, salmon, and yellowtail", 
         "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg", 
         json.dumps(["gluten-free", "healthy"]), 0),
        (2, "Dragon Roll", "Sushi", 18.99, "Eel and cucumber topped with avocado", 
         "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg", 
         json.dumps([]), 0),
        (2, "Miso Soup", "Starters", 6.99, "Traditional soybean paste soup", 
         "https://images.pexels.com/photos/5409751/pexels-photo-5409751.jpeg", 
         json.dumps(["vegetarian", "healthy"]), 0),
        
        # Mama's Italian menu
        (3, "Margherita Pizza", "Pizza", 22.99, "Fresh mozzarella, tomato sauce, and basil", 
         "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg", 
         json.dumps(["vegetarian"]), 0),
        (3, "Fettuccine Alfredo", "Pasta", 19.99, "Creamy parmesan sauce with fresh fettuccine", 
         "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg", 
         json.dumps(["vegetarian"]), 0),
        (3, "Tiramisu", "Desserts", 12.99, "Classic Italian dessert with coffee", 
         "https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg", 
         json.dumps(["vegetarian"]), 0)
    ]
    
    cursor.executemany('''
        INSERT INTO menu_items (restaurant_id, name, category, price, description, image, dietary, chef_special)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', menu_items_data)
    
    # Sample super admin user
    cursor.execute('''
        INSERT INTO users (name, email, password_hash, role)
        VALUES (?, ?, ?, ?)
    ''', ("Platform Owner", "owner@restaurantai.com", hash_password("superadmin2025"), "superadmin"))

# Utility functions
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

def create_jwt_token(data: dict):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_jwt_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# API Routes

@app.on_event("startup")
async def startup_event():
    init_database()

@app.get("/")
async def root():
    return {"message": "Restaurant Management API is running"}

# Authentication endpoints
@app.post("/api/auth/signup")
async def signup(user_data: UserSignup):
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute("SELECT id FROM users WHERE email = ?", (user_data.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Create user
        cursor.execute('''
            INSERT INTO users (name, email, phone, password_hash)
            VALUES (?, ?, ?, ?)
        ''', (user_data.name, user_data.email, user_data.phone, hash_password(user_data.password)))
        
        user_id = cursor.lastrowid
        conn.commit()
        
        # Create JWT token
        token = create_jwt_token({"user_id": user_id, "email": user_data.email, "role": "customer"})
        
        return {
            "token": token,
            "user": {
                "id": user_id,
                "name": user_data.name,
                "email": user_data.email,
                "role": "customer"
            }
        }

@app.post("/api/auth/login")
async def login(login_data: UserLogin):
    with get_db() as conn:
        cursor = conn.cursor()
        
        cursor.execute("SELECT id, name, email, password_hash, role FROM users WHERE email = ?", (login_data.email,))
        user = cursor.fetchone()
        
        if not user or not verify_password(login_data.password, user['password_hash']):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        token = create_jwt_token({"user_id": user['id'], "email": user['email'], "role": user['role']})
        
        return {
            "token": token,
            "user": {
                "id": user['id'],
                "name": user['name'],
                "email": user['email'],
                "role": user['role']
            }
        }

@app.post("/api/auth/admin-login")
async def admin_login(login_data: AdminLogin):
    with get_db() as conn:
        cursor = conn.cursor()
        
        cursor.execute("SELECT id, name, admin_id FROM restaurants WHERE admin_id = ? AND admin_password_hash = ?", 
                      (login_data.admin_id, hash_password(login_data.password)))
        restaurant = cursor.fetchone()
        
        if not restaurant:
            raise HTTPException(status_code=401, detail="Invalid admin credentials")
        
        token = create_jwt_token({
            "restaurant_id": restaurant['id'], 
            "admin_id": restaurant['admin_id'], 
            "role": "admin"
        })
        
        return {
            "token": token,
            "restaurant": {
                "id": restaurant['id'],
                "name": restaurant['name'],
                "admin_id": restaurant['admin_id'],
                "role": "admin"
            }
        }

@app.post("/api/auth/superadmin-login")
async def superadmin_login(login_data: SuperAdminLogin):
    if (login_data.email != "owner@restaurantai.com" or 
        login_data.password != "superadmin2025" or 
        login_data.security_code != "777888"):
        raise HTTPException(status_code=401, detail="Invalid super admin credentials")
    
    token = create_jwt_token({"email": login_data.email, "role": "superadmin"})
    
    return {
        "token": token,
        "user": {
            "email": login_data.email,
            "name": "Platform Owner",
            "role": "superadmin"
        }
    }

# Restaurant endpoints
@app.get("/api/restaurants")
async def get_restaurants():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM restaurants WHERE is_active = 1")
        restaurants = [dict(row) for row in cursor.fetchall()]
        
        # Get table count for each restaurant
        for restaurant in restaurants:
            cursor.execute("SELECT COUNT(*) as total, COUNT(CASE WHEN status = 'available' THEN 1 END) as available FROM tables WHERE restaurant_id = ?", (restaurant['id'],))
            table_info = cursor.fetchone()
            restaurant['total_tables'] = table_info['total']
            restaurant['available_tables'] = table_info['available']
        
        return restaurants

@app.get("/api/restaurants/{restaurant_id}")
async def get_restaurant(restaurant_id: int):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM restaurants WHERE id = ? AND is_active = 1", (restaurant_id,))
        restaurant = cursor.fetchone()
        
        if not restaurant:
            raise HTTPException(status_code=404, detail="Restaurant not found")
        
        # Get tables
        cursor.execute("SELECT * FROM tables WHERE restaurant_id = ?", (restaurant_id,))
        tables = [dict(row) for row in cursor.fetchall()]
        
        restaurant_dict = dict(restaurant)
        restaurant_dict['tables'] = tables
        
        return restaurant_dict

@app.get("/api/restaurants/{restaurant_id}/menu")
async def get_menu(restaurant_id: int):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM menu_items WHERE restaurant_id = ? AND available = 1", (restaurant_id,))
        menu_items = [dict(row) for row in cursor.fetchall()]
        
        # Parse dietary JSON
        for item in menu_items:
            if item['dietary']:
                item['dietary'] = json.loads(item['dietary'])
            else:
                item['dietary'] = []
        
        return menu_items

# Admin endpoints
@app.get("/api/admin/dashboard/{restaurant_id}")
async def get_admin_dashboard(restaurant_id: int, token_data: dict = Depends(verify_jwt_token)):
    if token_data.get('role') != 'admin' or token_data.get('restaurant_id') != restaurant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Restaurant info
        cursor.execute("SELECT * FROM restaurants WHERE id = ?", (restaurant_id,))
        restaurant = dict(cursor.fetchone())
        
        # Statistics
        cursor.execute("SELECT COUNT(*) as total_orders, COALESCE(SUM(total_amount), 0) as total_revenue FROM orders WHERE restaurant_id = ?", (restaurant_id,))
        stats = dict(cursor.fetchone())
        
        cursor.execute("SELECT COUNT(*) as total_bookings FROM bookings WHERE restaurant_id = ?", (restaurant_id,))
        booking_stats = dict(cursor.fetchone())
        
        cursor.execute("SELECT COUNT(*) as total_tables, COUNT(CASE WHEN status = 'available' THEN 1 END) as available_tables FROM tables WHERE restaurant_id = ?", (restaurant_id,))
        table_stats = dict(cursor.fetchone())
        
        # Recent orders
        cursor.execute('''
            SELECT o.*, u.name as customer_name 
            FROM orders o 
            LEFT JOIN users u ON o.user_id = u.id 
            WHERE o.restaurant_id = ? 
            ORDER BY o.created_at DESC 
            LIMIT 10
        ''', (restaurant_id,))
        recent_orders = [dict(row) for row in cursor.fetchall()]
        
        # Menu items
        cursor.execute("SELECT * FROM menu_items WHERE restaurant_id = ?", (restaurant_id,))
        menu_items = [dict(row) for row in cursor.fetchall()]
        
        return {
            "restaurant": restaurant,
            "statistics": {
                **stats,
                **booking_stats,
                **table_stats
            },
            "recent_orders": recent_orders,
            "menu_items": menu_items
        }

@app.post("/api/admin/menu-items/{restaurant_id}")
async def create_menu_item(restaurant_id: int, item: MenuItem, token_data: dict = Depends(verify_jwt_token)):
    if token_data.get('role') != 'admin' or token_data.get('restaurant_id') != restaurant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO menu_items (restaurant_id, name, category, price, description, image, dietary, available)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (restaurant_id, item.name, item.category, item.price, item.description, 
              item.image, json.dumps(item.dietary), item.available))
        
        item_id = cursor.lastrowid
        conn.commit()
        
        return {"id": item_id, "message": "Menu item created successfully"}

@app.put("/api/admin/menu-items/{restaurant_id}/{item_id}")
async def update_menu_item(restaurant_id: int, item_id: int, item: MenuItem, token_data: dict = Depends(verify_jwt_token)):
    if token_data.get('role') != 'admin' or token_data.get('restaurant_id') != restaurant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE menu_items 
            SET name = ?, category = ?, price = ?, description = ?, image = ?, dietary = ?, available = ?
            WHERE id = ? AND restaurant_id = ?
        ''', (item.name, item.category, item.price, item.description, 
              item.image, json.dumps(item.dietary), item.available, item_id, restaurant_id))
        
        conn.commit()
        
        return {"message": "Menu item updated successfully"}

@app.delete("/api/admin/menu-items/{restaurant_id}/{item_id}")
async def delete_menu_item(restaurant_id: int, item_id: int, token_data: dict = Depends(verify_jwt_token)):
    if token_data.get('role') != 'admin' or token_data.get('restaurant_id') != restaurant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM menu_items WHERE id = ? AND restaurant_id = ?", (item_id, restaurant_id))
        conn.commit()
        
        return {"message": "Menu item deleted successfully"}

# Super Admin endpoints
@app.get("/api/superadmin/dashboard")
async def get_superadmin_dashboard(token_data: dict = Depends(verify_jwt_token)):
    if token_data.get('role') != 'superadmin':
        raise HTTPException(status_code=403, detail="Access denied")
    
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Platform statistics
        cursor.execute("SELECT COUNT(*) as total_restaurants FROM restaurants WHERE is_active = 1")
        restaurant_count = cursor.fetchone()['total_restaurants']
        
        cursor.execute("SELECT COUNT(*) as total_users FROM users WHERE role = 'customer'")
        user_count = cursor.fetchone()['total_users']
        
        cursor.execute("SELECT COALESCE(SUM(total_amount), 0) as total_revenue FROM orders")
        revenue = cursor.fetchone()['total_revenue']
        
        cursor.execute("SELECT COUNT(*) as total_orders FROM orders")
        order_count = cursor.fetchone()['total_orders']
        
        # All restaurants
        cursor.execute("SELECT * FROM restaurants ORDER BY created_at DESC")
        restaurants = [dict(row) for row in cursor.fetchall()]
        
        # All users
        cursor.execute("SELECT id, name, email, role, created_at, is_active FROM users ORDER BY created_at DESC")
        users = [dict(row) for row in cursor.fetchall()]
        
        return {
            "statistics": {
                "total_restaurants": restaurant_count,
                "total_users": user_count,
                "total_revenue": revenue,
                "total_orders": order_count
            },
            "restaurants": restaurants,
            "users": users
        }

@app.post("/api/superadmin/restaurants")
async def create_restaurant(restaurant: RestaurantCreate, token_data: dict = Depends(verify_jwt_token)):
    if token_data.get('role') != 'superadmin':
        raise HTTPException(status_code=403, detail="Access denied")
    
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Check if admin_id already exists
        cursor.execute("SELECT id FROM restaurants WHERE admin_id = ?", (restaurant.admin_id,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Admin ID already exists")
        
        cursor.execute('''
            INSERT INTO restaurants (name, cuisine, address, phone, description, image, admin_id, admin_password_hash)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (restaurant.name, restaurant.cuisine, restaurant.address, restaurant.phone,
              restaurant.description, restaurant.image, restaurant.admin_id, 
              hash_password(restaurant.admin_password)))
        
        restaurant_id = cursor.lastrowid
        conn.commit()
        
        return {"id": restaurant_id, "message": "Restaurant created successfully"}

# Booking endpoints
@app.post("/api/bookings")
async def create_booking(booking: BookingCreate, token_data: dict = Depends(verify_jwt_token)):
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Check table availability
        cursor.execute("SELECT status FROM tables WHERE id = ? AND restaurant_id = ?", 
                      (booking.table_id, booking.restaurant_id))
        table = cursor.fetchone()
        
        if not table or table['status'] != 'available':
            raise HTTPException(status_code=400, detail="Table not available")
        
        # Create booking
        cursor.execute('''
            INSERT INTO bookings (user_id, restaurant_id, table_id, date, time, guests, special_requests)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (token_data['user_id'], booking.restaurant_id, booking.table_id,
              booking.date, booking.time, booking.guests, booking.special_requests))
        
        # Update table status
        cursor.execute("UPDATE tables SET status = 'reserved' WHERE id = ?", (booking.table_id,))
        
        booking_id = cursor.lastrowid
        conn.commit()
        
        return {"id": booking_id, "message": "Booking created successfully"}

# AI Chat endpoint
@app.post("/api/ai/chat")
async def ai_chat(message: AIMessage, token_data: dict = Depends(verify_jwt_token)):
    # Enhanced AI responses based on context
    user_message = message.message.lower()
    
    # Context-aware responses
    if any(word in user_message for word in ['book', 'reservation', 'table']):
        response = "I'd be happy to help you book a table! I can check availability for any of our partner restaurants. Which restaurant interests you, and what date and time would you prefer? I can also suggest the best tables based on your party size and preferences."
    
    elif any(word in user_message for word in ['menu', 'food', 'dish', 'eat', 'cuisine']):
        response = "Great choice! I can help you explore our restaurant menus. Are you looking for a specific cuisine type? I can provide personalized recommendations based on dietary preferences, allergies, or your taste profile. What type of dining experience are you in the mood for?"
    
    elif any(word in user_message for word in ['vegetarian', 'vegan', 'gluten', 'allergy', 'dietary']):
        response = "I understand dietary requirements are important! I can filter all our restaurant options and menu items based on your specific needs. We have excellent vegetarian, vegan, gluten-free, and allergy-friendly options. What dietary preferences should I keep in mind for your recommendations?"
    
    elif any(word in user_message for word in ['recommend', 'suggest', 'best', 'good']):
        response = "I'd love to recommend the perfect restaurant for you! To give you the best suggestions, could you tell me: What type of cuisine do you prefer? What's your budget range? Are you looking for a romantic dinner, family meal, or business lunch? Any specific location preferences?"
    
    elif any(word in user_message for word in ['price', 'cost', 'budget', 'expensive', 'cheap']):
        response = "I can help you find restaurants that fit your budget perfectly! Our partner restaurants range from casual dining to fine dining experiences. What's your preferred price range per person? I can show you great options with transparent pricing and no hidden fees."
    
    elif any(word in user_message for word in ['location', 'address', 'direction', 'near', 'close']):
        response = "I can help you find restaurants in your preferred area! Are you looking for something nearby, or do you have a specific neighborhood in mind? I can also provide directions and estimated travel times to any of our partner restaurants."
    
    elif any(word in user_message for word in ['open', 'hours', 'time', 'available', 'closed']):
        response = "I can check real-time availability and operating hours for all our restaurants! Most of our partners are open for lunch and dinner, with some offering breakfast and late-night dining. Which restaurant are you interested in, and what time were you planning to visit?"
    
    elif any(word in user_message for word in ['birthday', 'anniversary', 'celebration', 'special', 'party']):
        response = "How wonderful! I'd love to help make your special occasion memorable. I can recommend restaurants with romantic ambiance, private dining rooms, or special celebration packages. Many of our partners offer complimentary desserts for birthdays and anniversaries. What's the occasion, and how many guests will be joining you?"
    
    else:
        responses = [
            "I'm here to make your dining experience exceptional! I can help with restaurant recommendations, table bookings, menu exploration, dietary accommodations, and special requests. What would you like to know more about?",
            "As your AI dining assistant, I have access to real-time information about all our partner restaurants. I can help you discover new cuisines, find the perfect ambiance, and ensure your dietary needs are met. How can I assist you today?",
            "I'm designed to understand your dining preferences and provide personalized recommendations. Whether you're looking for a quick bite, romantic dinner, or family celebration, I can guide you to the perfect restaurant experience. What are you in the mood for?",
            "My goal is to connect you with the perfect dining experience! I can suggest restaurants, help with bookings, explain menu items, accommodate dietary restrictions, and even help plan special celebrations. What dining experience are you looking for today?"
        ]
        response = responses[hash(user_message) % len(responses)]
    
    # Save chat history
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO ai_chat_history (user_id, message, response, context)
            VALUES (?, ?, ?, ?)
        ''', (token_data.get('user_id'), message.message, response, json.dumps(message.context)))
        conn.commit()
    
    return {"response": response}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)