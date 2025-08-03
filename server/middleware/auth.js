const jwt = require('jsonwebtoken');
const db = require('../config/database');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access token required' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user details from database
        let user;
        if (decoded.role === 'customer') {
            user = await db.get(
                'SELECT id, name, email, phone, role FROM login_users WHERE id = ? AND is_active = 1',
                [decoded.userId]
            );
        } else {
            user = await db.get(
                'SELECT id, name, email, phone, role, restaurant_id, admin_id FROM users WHERE id = ? AND is_active = 1',
                [decoded.userId]
            );
        }

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token - user not found' 
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(403).json({ 
            success: false, 
            message: 'Invalid or expired token' 
        });
    }
};

const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: 'Insufficient permissions' 
            });
        }

        next();
    };
};

const authorizeRestaurantAdmin = async (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ 
            success: false, 
            message: 'Admin access required' 
        });
    }

    // Check if admin is accessing their own restaurant data
    const restaurantId = req.params.restaurantId || req.body.restaurantId;
    if (restaurantId && parseInt(restaurantId) !== req.user.restaurant_id) {
        return res.status(403).json({ 
            success: false, 
            message: 'Access denied - not your restaurant' 
        });
    }

    next();
};

module.exports = {
    authenticateToken,
    authorizeRole,
    authorizeRestaurantAdmin
};