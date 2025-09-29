const express = require('express');
const db = require('../config/database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Validation middleware
const bookingValidation = [
    body('restaurantId').isInt({ min: 1 }).withMessage('Valid restaurant ID is required'),
    body('tableId').isInt({ min: 1 }).withMessage('Valid table ID is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format (HH:MM) is required'),
    body('guests').isInt({ min: 1, max: 20 }).withMessage('Number of guests must be between 1 and 20'),
    body('specialRequests').optional().isLength({ max: 500 }).withMessage('Special requests must be less than 500 characters')
];

// POST /api/bookings - Create a new booking
router.post('/', authenticateToken, authorizeRole(['customer']), bookingValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { restaurantId, tableId, date, time, guests, specialRequests } = req.body;
        const userId = req.user.id;

        // Verify restaurant exists and is active
        const restaurant = await db.get(
            'SELECT id, name FROM restaurants WHERE id = ? AND is_active = 1',
            [restaurantId]
        );

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }

        // Verify table exists and belongs to restaurant
        const table = await db.get(
            'SELECT id, table_number, capacity, status FROM restaurant_tables WHERE id = ? AND restaurant_id = ?',
            [tableId, restaurantId]
        );

        if (!table) {
            return res.status(404).json({
                success: false,
                message: 'Table not found'
            });
        }

        // Check if table has sufficient capacity
        if (guests > table.capacity) {
            return res.status(400).json({
                success: false,
                message: `Table capacity is ${table.capacity}, but you requested ${guests} guests`
            });
        }

        // Check if table is available (basic check - in production, you'd check for specific date/time conflicts)
        if (table.status !== 'available') {
            return res.status(400).json({
                success: false,
                message: 'Table is not available'
            });
        }

        // Create booking
        const result = await db.run(`
            INSERT INTO bookings (user_id, restaurant_id, table_id, date, time, guests, special_requests, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed')
        `, [userId, restaurantId, tableId, date, time, guests, specialRequests || null]);

        // Update table status to reserved
        await db.run(
            'UPDATE restaurant_tables SET status = "reserved" WHERE id = ?',
            [tableId]
        );

        console.log(`✅ Booking created: User ${userId} booked table ${table.table_number} at ${restaurant.name}`);

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: {
                bookingId: result.id,
                restaurantName: restaurant.name,
                tableNumber: table.table_number,
                date,
                time,
                guests,
                status: 'confirmed'
            }
        });

    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while creating booking'
        });
    }
});

// GET /api/bookings - Get user's bookings
router.get('/', authenticateToken, authorizeRole(['customer']), async (req, res) => {
    try {
        const userId = req.user.id;

        const bookings = await db.all(`
            SELECT 
                b.id, b.date, b.time, b.guests, b.special_requests, b.status, b.created_at,
                r.name as restaurant_name, r.address as restaurant_address, r.phone as restaurant_phone,
                rt.table_number, rt.capacity as table_capacity
            FROM bookings b
            JOIN restaurants r ON b.restaurant_id = r.id
            JOIN restaurant_tables rt ON b.table_id = rt.id
            WHERE b.user_id = ?
            ORDER BY b.date DESC, b.time DESC
        `, [userId]);

        res.status(200).json({
            success: true,
            message: 'Bookings retrieved successfully',
            data: bookings
        });

    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching bookings'
        });
    }
});

// GET /api/bookings/:id - Get specific booking details
router.get('/:id', authenticateToken, authorizeRole(['customer']), async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const booking = await db.get(`
            SELECT 
                b.id, b.date, b.time, b.guests, b.special_requests, b.status, b.created_at,
                r.name as restaurant_name, r.address as restaurant_address, r.phone as restaurant_phone,
                rt.table_number, rt.capacity as table_capacity
            FROM bookings b
            JOIN restaurants r ON b.restaurant_id = r.id
            JOIN restaurant_tables rt ON b.table_id = rt.id
            WHERE b.id = ? AND b.user_id = ?
        `, [id, userId]);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Booking details retrieved successfully',
            data: booking
        });

    } catch (error) {
        console.error('Get booking details error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching booking details'
        });
    }
});

// PUT /api/bookings/:id/cancel - Cancel a booking
router.put('/:id/cancel', authenticateToken, authorizeRole(['customer']), async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Get booking details
        const booking = await db.get(
            'SELECT id, table_id, status FROM bookings WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Booking is already cancelled'
            });
        }

        // Update booking status
        await db.run(
            'UPDATE bookings SET status = "cancelled", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [id]
        );

        // Update table status back to available
        await db.run(
            'UPDATE restaurant_tables SET status = "available" WHERE id = ?',
            [booking.table_id]
        );

        console.log(`✅ Booking cancelled: Booking ID ${id} by User ${userId}`);

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully'
        });

    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while cancelling booking'
        });
    }
});

// PUT /api/bookings/:id/status - Update booking status (for admin use)
router.put('/:id/status', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const restaurantId = req.user.restaurant_id;

        if (!['confirmed', 'completed', 'cancelled', 'no-show'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        // Get booking details and verify it belongs to admin's restaurant
        const booking = await db.get(
            'SELECT id, table_id, status, user_id FROM bookings WHERE id = ? AND restaurant_id = ?',
            [id, restaurantId]
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Update booking status
        await db.run(
            'UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [status, id]
        );

        // Update table status based on booking status
        let tableStatus = 'available';
        if (status === 'confirmed') {
            tableStatus = 'reserved';
        } else if (status === 'completed' || status === 'cancelled' || status === 'no-show') {
            tableStatus = 'available';
        }

        await db.run(
            'UPDATE restaurant_tables SET status = ? WHERE id = ?',
            [tableStatus, booking.table_id]
        );

        console.log(`✅ Booking status updated: Booking ID ${id} changed to ${status} by Admin ${req.user.id}`);

        res.status(200).json({
            success: true,
            message: 'Booking status updated successfully',
            data: {
                bookingId: id,
                newStatus: status,
                updated: true
            }
        });

    } catch (error) {
        console.error('Update booking status error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while updating booking status'
        });
    }
});

module.exports = router;