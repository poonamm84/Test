const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, text, html) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: to,
            subject: subject,
            text: text,
            html: html
        };

        const result = await transporter.sendMail(mailOptions);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
};

const sendOTPEmail = async (to, otp, name) => {
    const subject = 'Your OTP for Restaurant Management System';
    const text = `Hello ${name},\n\nYour OTP for verification is: ${otp}\n\nThis OTP will expire in 10 minutes.\n\nBest regards,\nRestaurant Management Team`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Restaurant Management System</h2>
            <p>Hello <strong>${name}</strong>,</p>
            <p>Your OTP for verification is:</p>
            <div style="background-color: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0;">
                <h1 style="color: #007bff; font-size: 32px; margin: 0;">${otp}</h1>
            </div>
            <p>This OTP will expire in <strong>10 minutes</strong>.</p>
            <p>If you didn't request this OTP, please ignore this email.</p>
            <p>Best regards,<br>Restaurant Management Team</p>
        </div>
    `;

    return await sendEmail(to, subject, text, html);
};

module.exports = {
    sendEmail,
    sendOTPEmail
};