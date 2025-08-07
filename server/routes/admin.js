const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { authenticateToken, authorizeRole, authorizeRestaurantAdmin } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'uploads', 'photos');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'table-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Middleware to ensure admin access
router.use(authenticateToken);
router.use(authorizeRole(['admin']));

// GET /api/admin/restaurant - Get admin's restaurant details
router.get('/restaurant', async (req, res) => {
    try {
        const restaurantId = req.user.restaurant_id;

        const restaurant = await db.get(`
            SELECT id, name, cuisine, rating, image, address, phone, description, is_active, created_at
            FROM restaurants 
            WHERE id = ?
        `, [restaurantId]);

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Restaurant details retrieved successfully',
            data: restaurant
        });

    } catch (error) {
        console.error('Get admin restaurant error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching restaurant details'
        });
    }
});

// GET /api/admin/dashboard - Get dashboard analytics
router.get('/dashboard', async (req, res) => {
    try {
        const restaurantId = req.user.restaurant_id;

        // Get basic stats
        const stats = await Promise.all([
            db.get('SELECT COUNT(*) as total_orders FROM orders WHERE restaurant_id = ?', [restaurantId]),
            db.get('SELECT COUNT(*) as pending_orders FROM orders WHERE restaurant_id = ? AND status = "pending"', [restaurantId]),
            db.get('SELECT COUNT(*) as total_bookings FROM bookings WHERE restaurant_id = ?', [restaurantId]),
            db.get('SELECT COUNT(*) as todays_bookings FROM bookings WHERE restaurant_id = ? AND date = date("now")', [restaurantId]),
            db.get('SELECT SUM(total_amount) as total_revenue FROM orders WHERE restaurant_id = ? AND status = "completed"', [restaurantId]),
            db.get('SELECT COUNT(*) as total_menu_items FROM menu_items WHERE restaurant_id = ?', [restaurantId]),
            db.get('SELECT COUNT(*) as available_tables FROM restaurant_tables WHERE restaurant_id = ? AND status = "available"', [restaurantId])
        ]);

        const dashboardData = {
            totalOrders: stats[0].total_orders || 0,
            pendingOrders: stats[1].pending_orders || 0,
            totalBookings: stats[2].total_bookings || 0,
            todaysBookings: stats[3].todays_bookings || 0,
            totalRevenue: stats[4].total_revenue || 0,
            totalMenuItems: stats[5].total_menu_items || 0,
            availableTables: stats[6].available_tables || 0
        };

        // Get recent orders
        const recentOrders = await db.all(`
            SELECT 
                o.id, o.order_type, o.status, o.total_amount, o.created_at,
                lu.name as customer_name
            FROM orders o
            JOIN login_users lu ON o.user_id = lu.id
            WHERE o.restaurant_id = ?
            ORDER BY o.created_at DESC
            LIMIT 10
        `, [restaurantId]);

        // Get recent bookings
        const recentBookings = await db.all(`
            SELECT 
                b.id, b.date, b.time, b.guests, b.status, b.created_at,
                lu.name as customer_name, rt.table_number
            FROM bookings b
            JOIN login_users lu ON b.user_id = lu.id
            JOIN restaurant_tables rt ON b.table_id = rt.id
            WHERE b.restaurant_id = ?
            ORDER BY b.created_at DESC
            LIMIT 10
        `, [restaurantId]);

        res.status(200).json({
            success: true,
            message: 'Dashboard data retrieved successfully',
            data: {
                stats: dashboardData,
                recentOrders,
                recentBookings
            }
        });

    } catch (error) {
        console.error('Get admin dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching dashboard data'
        });
    }
});

// GET /api/admin/menu - Get restaurant menu items
router.get('/menu', async (req, res) => {
    try {
        const restaurantId = req.user.restaurant_id;

        const menuItems = await db.all(`
            SELECT id, name, category, price, description, image, dietary, chef_special, available, created_at, updated_at
            FROM menu_items 
            WHERE restaurant_id = ?
            ORDER BY category, name
        `, [restaurantId]);

        res.status(200).json({
            success: true,
            message: 'Menu items retrieved successfully',
            data: menuItems
        });

    } catch (error) {
        console.error('Get admin menu error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching menu items'
        });
    }
});

// POST /api/admin/menu - Create new menu item
router.post('/menu', [
    body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name is required and must be less than 100 characters'),
    body('category').trim().isLength({ min: 1, max: 50 }).withMessage('Category is required and must be less than 50 characters'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('description').optional().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
    body('image').optional().isURL().withMessage('Image must be a valid URL'),
    body('dietary').optional().isLength({ max: 100 }).withMessage('Dietary info must be less than 100 characters'),
    body('chef_special').optional().isBoolean().withMessage('Chef special must be a boolean')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const restaurantId = req.user.restaurant_id;
        const { name, category, price, description, image, dietary, chef_special } = req.body;

        const result = await db.run(`
            INSERT INTO menu_items (restaurant_id, name, category, price, description, image, dietary, chef_special, available)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
        `, [restaurantId, name, category, price, description || null, image || null, dietary || null, chef_special || false]);

        console.log(`✅ Menu item created: ${name} by Admin ${req.user.id}`);

        res.status(201).json({
            success: true,
            message: 'Menu item created successfully',
            data: {
                id: result.id,
                name,
                category,
                price
            }
        });

    } catch (error) {
        console.error('Create menu item error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while creating menu item'
        });
    }
});

// PUT /api/admin/menu/:id - Update menu item
router.put('/menu/:id', [
    body('name').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Name must be less than 100 characters'),
    body('category').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Category must be less than 50 characters'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('description').optional().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
    body('image').optional().isURL().withMessage('Image must be a valid URL'),
    body('dietary').optional().isLength({ max: 100 }).withMessage('Dietary info must be less than 100 characters'),
    body('chef_special').optional().isBoolean().withMessage('Chef special must be a boolean'),
    body('available').optional().isBoolean().withMessage('Available must be a boolean')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { id } = req.params;
        const restaurantId = req.user.restaurant_id;

        // Check if menu item exists and belongs to admin's restaurant
        const existingItem = await db.get(
            'SELECT id FROM menu_items WHERE id = ? AND restaurant_id = ?',
            [id, restaurantId]
        );

        if (!existingItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        // Build update query dynamically
        const updateFields = [];
        const updateValues = [];

        const allowedFields = ['name', 'category', 'price', 'description', 'image', 'dietary', 'chef_special', 'available'];
        
        for (const field of allowedFields) {
            if (req.body.hasOwnProperty(field)) {
                updateFields.push(`${field} = ?`);
                updateValues.push(req.body[field]);
            }
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields to update'
            });
        }

        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        updateValues.push(id);

        await db.run(
            `UPDATE menu_items SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );

        console.log(`✅ Menu item updated: ID ${id} by Admin ${req.user.id}`);

        res.status(200).json({
            success: true,
            message: 'Menu item updated successfully'
        });

    } catch (error) {
        console.error('Update menu item error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while updating menu item'
        });
    }
});

// DELETE /api/admin/menu/:id - Delete menu item
router.delete('/menu/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const restaurantId = req.user.restaurant_id;

        const result = await db.run(
            'DELETE FROM menu_items WHERE id = ? AND restaurant_id = ?',
            [id, restaurantId]
        );

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        console.log(`✅ Menu item deleted: ID ${id} by Admin ${req.user.id}`);

        res.status(200).json({
            success: true,
            message: 'Menu item deleted successfully'
        });

    } catch (error) {
        console.error('Delete menu item error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while deleting menu item'
        });
    }
});

// GET /api/admin/orders - Get restaurant orders
router.get('/orders', async (req, res) => {
    try {
        const restaurantId = req.user.restaurant_id;
        const { status, limit = 50 } = req.query;

        let query = `
            SELECT 
                o.id, o.order_type, o.status, o.total_amount, o.scheduled_time, 
                o.special_instructions, o.created_at,
                lu.name as customer_name, lu.email as customer_email, lu.phone as customer_phone
            FROM orders o
            JOIN login_users lu ON o.user_id = lu.id
            WHERE o.restaurant_id = ?
        `;
        
        const queryParams = [restaurantId];

        if (status) {
            query += ' AND o.status = ?';
            queryParams.push(status);
        }

        query += ' ORDER BY o.created_at DESC LIMIT ?';
        queryParams.push(parseInt(limit));

        const orders = await db.all(query, queryParams);

        // Get order items for each order
        for (const order of orders) {
            const orderItems = await db.all(`
                SELECT 
                    oi.quantity, oi.price,
                    mi.name as item_name
                FROM order_items oi
                JOIN menu_items mi ON oi.menu_item_id = mi.id
                WHERE oi.order_id = ?
            `, [order.id]);
            
            order.items = orderItems;
        }

        res.status(200).json({
            success: true,
            message: 'Orders retrieved successfully',
            data: orders
        });

    } catch (error) {
        console.error('Get admin orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching orders'
        });
    }
});

// PUT /api/admin/orders/:id/status - Update order status
router.put('/orders/:id/status', [
    body('status').isIn(['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { id } = req.params;
        const { status } = req.body;
        const restaurantId = req.user.restaurant_id;

        // Check if order exists and belongs to admin's restaurant
        const existingOrder = await db.get(
            'SELECT id, status as current_status FROM orders WHERE id = ? AND restaurant_id = ?',
            [id, restaurantId]
        );

        if (!existingOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Update order status
        await db.run(
            'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [status, id]
        );

        // Add to status history
        await db.run(`
            INSERT INTO order_status_history (order_id, status, changed_by, notes)
            VALUES (?, ?, ?, ?)
        `, [id, status, req.user.id, `Status changed from ${existingOrder.current_status} to ${status}`]);

        console.log(`✅ Order status updated: Order ${id} changed to ${status} by Admin ${req.user.id}`);

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: {
                orderId: id,
                newStatus: status
            }
        });

    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while updating order status'
        });
    }
});

// GET /api/admin/bookings - Get restaurant bookings
router.get('/bookings', async (req, res) => {
    try {
        const restaurantId = req.user.restaurant_id;
        const { date, status, limit = 50 } = req.query;

        let query = `
            SELECT 
                b.id, b.date, b.time, b.guests, b.special_requests, b.status, b.created_at,
                lu.name as customer_name, lu.email as customer_email, lu.phone as customer_phone,
                rt.table_number, rt.capacity as table_capacity
            FROM bookings b
            JOIN login_users lu ON b.user_id = lu.id
            JOIN restaurant_tables rt ON b.table_id = rt.id
            WHERE b.restaurant_id = ?
        `;
        
        const queryParams = [restaurantId];

        if (date) {
            query += ' AND b.date = ?';
            queryParams.push(date);
        }

        if (status) {
            query += ' AND b.status = ?';
            queryParams.push(status);
        }

        query += ' ORDER BY b.date DESC, b.time DESC LIMIT ?';
        queryParams.push(parseInt(limit));

        const bookings = await db.all(query, queryParams);

        res.status(200).json({
            success: true,
            message: 'Bookings retrieved successfully',
            data: bookings
        });

    } catch (error) {
        console.error('Get admin bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching bookings'
        });
    }
});

// GET /api/admin/table-photos - Get table photos for admin's restaurant
router.get('/table-photos', async (req, res) => {
    try {
        const restaurantId = req.user.restaurant_id;

        const photos = await db.all(`
            SELECT id, table_type, photo_path, description, is_active, created_at
            FROM table_photos 
            WHERE restaurant_id = ? AND is_active = 1
            ORDER BY table_type, created_at DESC
        `, [restaurantId]);

        res.status(200).json({
            success: true,
            message: 'Table photos retrieved successfully',
            data: photos
        });

    } catch (error) {
        console.error('Get table photos error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching table photos'
        });
    }
});

// POST /api/admin/table-photos - Upload table photo
router.post('/table-photos', upload.single('photo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Photo file is required'
            });
        }

        const { table_type, description } = req.body;
        const restaurantId = req.user.restaurant_id;
        const photoPath = `/uploads/photos/${req.file.filename}`;

        if (!table_type) {
            return res.status(400).json({
                success: false,
                message: 'Table type is required'
            });
        }

        const result = await db.run(`
            INSERT INTO table_photos (restaurant_id, table_type, photo_path, description)
            VALUES (?, ?, ?, ?)
        `, [restaurantId, table_type, photoPath, description || null]);

        console.log(`✅ Table photo uploaded: ${table_type} by Admin ${req.user.id}`);

        res.status(201).json({
            success: true,
            message: 'Table photo uploaded successfully',
            data: {
                id: result.id,
                table_type,
                photo_path: photoPath,
                description
            }
        });

    } catch (error) {
        console.error('Upload table photo error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while uploading photo'
        });
    }
});

// DELETE /api/admin/table-photos/:id - Delete table photo
router.delete('/table-photos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const restaurantId = req.user.restaurant_id;

        // Get photo details
        const photo = await db.get(
            'SELECT photo_path FROM table_photos WHERE id = ? AND restaurant_id = ?',
            [id, restaurantId]
        );

        if (!photo) {
            return res.status(404).json({
                success: false,
                message: 'Photo not found'
            });
        }

        // Delete from database
        await db.run(
            'DELETE FROM table_photos WHERE id = ? AND restaurant_id = ?',
            [id, restaurantId]
        );

        // Delete file from filesystem
        const filePath = path.join(__dirname, '..', photo.photo_path);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        console.log(`✅ Table photo deleted: ID ${id} by Admin ${req.user.id}`);

        res.status(200).json({
            success: true,
            message: 'Table photo deleted successfully'
        });

    } catch (error) {
        console.error('Delete table photo error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while deleting photo'
        });
    }
});

module.exports = router;