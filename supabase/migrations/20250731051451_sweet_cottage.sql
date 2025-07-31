-- Restaurant Management System Database Schema
-- Copy and execute these queries in DB Browser for SQLite

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1
);

-- Restaurants table
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
);

-- Tables table
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
);

-- Menu items table
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
);

-- Bookings table
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
);

-- Orders table
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
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    menu_item_id INTEGER,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders (id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items (id)
);

-- AI chat history table
CREATE TABLE IF NOT EXISTS ai_chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    context TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Sample data insertion (optional - the backend will auto-insert this)

-- Sample restaurants with admin credentials
INSERT OR IGNORE INTO restaurants (id, name, cuisine, rating, image, address, phone, description, admin_id, admin_password_hash) VALUES
(1, 'The Golden Spoon', 'Fine Dining', 4.8, 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg', '123 Gourmet Street, Downtown', '+1 (555) 123-4567', 'Exquisite fine dining experience with contemporary cuisine', 'GS001', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3'),
(2, 'Sakura Sushi', 'Japanese', 4.6, 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg', '456 Zen Garden Ave, Midtown', '+1 (555) 234-5678', 'Authentic Japanese cuisine with fresh sushi and sashimi', 'SS002', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'),
(3, 'Mama''s Italian', 'Italian', 4.7, 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg', '789 Pasta Lane, Little Italy', '+1 (555) 345-6789', 'Traditional Italian flavors in a cozy family atmosphere', 'MI003', 'c6ba91b90d922e159893f46c387e5dc1b3dc5c101a5a4522f03b987177a24a91');

-- Sample super admin user
INSERT OR IGNORE INTO users (name, email, password_hash, role) VALUES
('Platform Owner', 'owner@restaurantai.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'superadmin');