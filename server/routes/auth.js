const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { sendSMS } = require('../config/twilio');
const { sendOTPEmail } = require('../config/email');
const { generateOTP, isOTPExpired, getOTPExpiry } = require('../utils/otp');
const {
    signupValidation,
    loginValidation,
    otpValidation,
    adminLoginValidation,
    superAdminLoginValidation,
    handleValidationErrors
} = require('../middleware/validation');

const router = express.Router();

// Generate JWT token
const generateToken = (userId, role, additionalData = {}) => {
    return jwt.sign(
        { userId, role, ...additionalData },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

// POST /api/auth/signup - User signup with OTP
router.post('/signup', signupValidation, handleValidationErrors, async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const identifier = email || phone;

        // Check if user already exists in login_users
        const existingUser = await db.get(
            'SELECT id FROM login_users WHERE email = ? OR phone = ?',
            [email || '', phone || '']
        );

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email or phone number'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Generate OTP
        const otp = generateOTP();
        const otpExpires = getOTPExpiry();

        console.log(`🔐 Generated OTP for ${identifier}: ${otp}`);

        // Store in signup_users table
        const result = await db.run(
            `INSERT OR REPLACE INTO signup_users 
             (name, email, phone, password_hash, otp, otp_expires, is_verified) 
             VALUES (?, ?, ?, ?, ?, ?, 0)`,
            [name, email || null, phone || null, hashedPassword, otp, otpExpires]
        );

        // Send OTP
        let otpSent = false;
        let otpMethod = '';

        if (email) {
            const emailResult = await sendOTPEmail(email, otp, name);
            if (emailResult.success) {
                otpSent = true;
                otpMethod = 'email';
            }
        } else if (phone) {
            const smsResult = await sendSMS(phone, `Your Restaurant Management OTP is: ${otp}. Valid for 10 minutes.`);
            if (smsResult.success) {
                otpSent = true;
                otpMethod = 'sms';
            }
        }

        if (!otpSent) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send OTP. Please try again.'
            });
        }

        res.status(200).json({
            success: true,
            message: `OTP sent successfully via ${otpMethod}`,
            data: {
                identifier,
                otpMethod,
                expiresIn: '10 minutes'
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during signup'
        });
    }
});

// POST /api/auth/verify-otp - Verify OTP and complete signup
router.post('/verify-otp', otpValidation, handleValidationErrors, async (req, res) => {
    try {
        const { identifier, otp } = req.body;

        // Find user in signup_users table
        const signupUser = await db.get(
            'SELECT * FROM signup_users WHERE (email = ? OR phone = ?) AND otp = ?',
            [identifier, identifier, otp]
        );

        if (!signupUser) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        // Check if OTP is expired
        if (isOTPExpired(signupUser.otp_expires)) {
            return res.status(400).json({
                success: false,
                message: 'OTP has expired. Please request a new one.'
            });
        }

        // Move user to login_users table
        const result = await db.run(
            `INSERT INTO login_users (name, email, phone, password_hash, role, is_active) 
             VALUES (?, ?, ?, ?, 'customer', 1)`,
            [signupUser.name, signupUser.email, signupUser.phone, signupUser.password_hash]
        );

        // Remove from signup_users table
        await db.run('DELETE FROM signup_users WHERE id = ?', [signupUser.id]);

        // Generate JWT token
        const token = generateToken(result.id, 'customer');

        console.log(`✅ User verified and registered: ${identifier}`);

        res.status(201).json({
            success: true,
            message: 'Account verified and created successfully',
            data: {
                token,
                user: {
                    id: result.id,
                    name: signupUser.name,
                    email: signupUser.email,
                    phone: signupUser.phone,
                    role: 'customer'
                }
            }
        });

    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during OTP verification'
        });
    }
});

// POST /api/auth/resend-otp - Resend OTP
router.post('/resend-otp', async (req, res) => {
    try {
        const { identifier } = req.body;

        if (!identifier) {
            return res.status(400).json({
                success: false,
                message: 'Email or phone number is required'
            });
        }

        // Find user in signup_users table
        const signupUser = await db.get(
            'SELECT * FROM signup_users WHERE email = ? OR phone = ?',
            [identifier, identifier]
        );

        if (!signupUser) {
            return res.status(404).json({
                success: false,
                message: 'No pending signup found for this identifier'
            });
        }

        // Generate new OTP
        const otp = generateOTP();
        const otpExpires = getOTPExpiry();

        console.log(`🔐 Resent OTP for ${identifier}: ${otp}`);

        // Update OTP in database
        await db.run(
            'UPDATE signup_users SET otp = ?, otp_expires = ? WHERE id = ?',
            [otp, otpExpires, signupUser.id]
        );

        // Send OTP
        let otpSent = false;
        let otpMethod = '';

        if (signupUser.email && signupUser.email === identifier) {
            const emailResult = await sendOTPEmail(signupUser.email, otp, signupUser.name);
            if (emailResult.success) {
                otpSent = true;
                otpMethod = 'email';
            }
        } else if (signupUser.phone && signupUser.phone === identifier) {
            const smsResult = await sendSMS(signupUser.phone, `Your Restaurant Management OTP is: ${otp}. Valid for 10 minutes.`);
            if (smsResult.success) {
                otpSent = true;
                otpMethod = 'sms';
            }
        }

        if (!otpSent) {
            return res.status(500).json({
                success: false,
                message: 'Failed to resend OTP. Please try again.'
            });
        }

        res.status(200).json({
            success: true,
            message: `OTP resent successfully via ${otpMethod}`,
            data: {
                identifier,
                otpMethod,
                expiresIn: '10 minutes'
            }
        });

    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while resending OTP'
        });
    }
});

// POST /api/auth/login - User login
router.post('/login', loginValidation, handleValidationErrors, async (req, res) => {
    try {
        const { identifier, password } = req.body;

        // Find user in login_users table
        const user = await db.get(
            'SELECT * FROM login_users WHERE (email = ? OR phone = ?) AND is_active = 1',
            [identifier, identifier]
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = generateToken(user.id, user.role);

        console.log(`✅ User logged in: ${identifier}`);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during login'
        });
    }
});

// POST /api/auth/admin-login - Admin login
router.post('/admin-login', adminLoginValidation, handleValidationErrors, async (req, res) => {
    try {
        const { adminId, password } = req.body;

        // Find admin in restaurants table
        const restaurant = await db.get(
            'SELECT * FROM restaurants WHERE admin_id = ? AND is_active = 1',
            [adminId]
        );

        if (!restaurant) {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin credentials'
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, restaurant.admin_password_hash);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin credentials'
            });
        }

        // Get admin user details
        const adminUser = await db.get(
            'SELECT * FROM users WHERE admin_id = ? AND role = "admin" AND is_active = 1',
            [adminId]
        );

        if (!adminUser) {
            return res.status(401).json({
                success: false,
                message: 'Admin user not found'
            });
        }

        // Generate JWT token
        const token = generateToken(adminUser.id, 'admin', { 
            restaurantId: restaurant.id,
            adminId: adminId
        });

        console.log(`✅ Admin logged in: ${adminId} for restaurant: ${restaurant.name}`);

        res.status(200).json({
            success: true,
            message: 'Admin login successful',
            data: {
                token,
                user: {
                    id: adminUser.id,
                    name: adminUser.name,
                    email: adminUser.email,
                    role: 'admin',
                    restaurantId: restaurant.id,
                    restaurantName: restaurant.name,
                    adminId: adminId
                }
            }
        });

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during admin login'
        });
    }
});

// POST /api/auth/super-admin-login - Super admin login
router.post('/super-admin-login', superAdminLoginValidation, handleValidationErrors, async (req, res) => {
    try {
        const { email, password, securityCode } = req.body;

        // Verify security code (hardcoded for demo)
        if (securityCode !== '777888') {
            return res.status(401).json({
                success: false,
                message: 'Invalid security code'
            });
        }

        // Find super admin in users table
        const superAdmin = await db.get(
            'SELECT * FROM users WHERE email = ? AND role = "superadmin" AND is_active = 1',
            [email]
        );

        if (!superAdmin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid super admin credentials'
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, superAdmin.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid super admin credentials'
            });
        }

        // Generate JWT token
        const token = generateToken(superAdmin.id, 'superadmin');

        console.log(`✅ Super admin logged in: ${email}`);

        res.status(200).json({
            success: true,
            message: 'Super admin login successful',
            data: {
                token,
                user: {
                    id: superAdmin.id,
                    name: superAdmin.name,
                    email: superAdmin.email,
                    role: 'superadmin'
                }
            }
        });

    } catch (error) {
        console.error('Super admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during super admin login'
        });
    }
});

module.exports = router;