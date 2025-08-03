const crypto = require('crypto');

// Generate 6-digit OTP
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

// Check if OTP is expired (10 minutes)
const isOTPExpired = (otpExpires) => {
    return new Date() > new Date(otpExpires);
};

// Get OTP expiry time (10 minutes from now)
const getOTPExpiry = () => {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 10);
    return expiry.toISOString();
};

module.exports = {
    generateOTP,
    isOTPExpired,
    getOTPExpiry
};