const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

const signupValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    
    body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    
    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    
    // Ensure either email or phone is provided
    body().custom((value, { req }) => {
        if (!req.body.email && !req.body.phone) {
            throw new Error('Either email or phone number is required');
        }
        return true;
    })
];

const loginValidation = [
    body('identifier')
        .notEmpty()
        .withMessage('Email or phone number is required'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

const otpValidation = [
    body('identifier')
        .notEmpty()
        .withMessage('Email or phone number is required'),
    
    body('otp')
        .isLength({ min: 6, max: 6 })
        .isNumeric()
        .withMessage('OTP must be a 6-digit number')
];

const adminLoginValidation = [
    body('adminId')
        .notEmpty()
        .withMessage('Admin ID is required'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

const superAdminLoginValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    
    body('securityCode')
        .isLength({ min: 6, max: 6 })
        .isNumeric()
        .withMessage('Security code must be a 6-digit number')
];

module.exports = {
    handleValidationErrors,
    signupValidation,
    loginValidation,
    otpValidation,
    adminLoginValidation,
    superAdminLoginValidation
};