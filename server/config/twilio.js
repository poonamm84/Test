const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

const sendSMS = async (to, message) => {
    try {
        // Check if Twilio credentials are configured
        if (!accountSid || !authToken || !twilioPhoneNumber) {
            console.log('⚠️ Twilio not configured - simulating OTP send');
            // For demo purposes, simulate successful SMS sending
            return { success: true, sid: 'demo_' + Date.now() };
        }

        const result = await client.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: to
        });
        return { success: true, sid: result.sid };
    } catch (error) {
        console.error('Error sending SMS:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendSMS
};