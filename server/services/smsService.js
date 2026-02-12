const twilio = require('twilio');

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

let twilioClient = null;

// Initialize Twilio client
const initializeTwilio = () => {
    if (!accountSid || !authToken || !twilioPhone) {
        console.log('⚠️  Twilio not configured - SMS will run in MOCK mode');
        return null;
    }

    try {
        twilioClient = twilio(accountSid, authToken);
        console.log('✅ Twilio SMS service initialized');
        return twilioClient;
    } catch (error) {
        console.error('Twilio initialization error:', error.message);
        return null;
    }
};

// Send SMS notification
const sendSMS = async (phoneNumber, message) => {
    // Mock mode if Twilio not configured
    if (!twilioClient) {
        console.log('\n📱 SMS NOTIFICATION (MOCK MODE):');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`To: ${phoneNumber}`);
        console.log(`Message: ${message}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        return { success: true, mock: true };
    }

    // Production mode with real Twilio
    try {
        const result = await twilioClient.messages.create({
            body: message,
            from: twilioPhone,
            to: phoneNumber
        });

        console.log(`✅ SMS sent to ${phoneNumber} - SID: ${result.sid}`);
        return { success: true, sid: result.sid };
    } catch (error) {
        console.error('SMS send error:', error.message);
        return { success: false, error: error.message };
    }
};

// Send theft alert SMS
const sendTheftAlertSMS = async (ownerPhone, sheepData) => {
    if (!ownerPhone) {
        console.log('No phone number available for SMS');
        return;
    }

    // Format phone number (ensure it starts with country code)
    let formattedPhone = ownerPhone;
    if (!formattedPhone.startsWith('+')) {
        // Assume India (+91) if no country code
        formattedPhone = `+91${formattedPhone}`;
    }

    const message = `🚨 LIVESTOCKSAFE THEFT ALERT

Animal: ${sheepData.name || sheepData.tagId}
Tag ID: ${sheepData.tagId}
Status: STOLEN
Time: ${new Date(sheepData.theftReportedAt).toLocaleString('en-IN')}

Details: ${sheepData.theftDetails || 'No details provided'}

This alert has been broadcast to all regional nodes. File FIR immediately.

- LivestockSafe Digital Security`;

    return await sendSMS(formattedPhone, message);
};

// Send verification alert SMS (when someone scans a stolen animal's QR)
const sendVerificationAlertSMS = async (ownerPhone, sheepData, scannerInfo) => {
    if (!ownerPhone) return;

    let formattedPhone = ownerPhone;
    if (!formattedPhone.startsWith('+')) {
        formattedPhone = `+91${formattedPhone}`;
    }

    const message = `⚠️ LIVESTOCKSAFE ALERT

Someone scanned your STOLEN animal's QR code!

Animal: ${sheepData.tagId}
Time: ${new Date().toLocaleString('en-IN')}
${scannerInfo ? `Location: ${scannerInfo}` : ''}

This may be a sighting or attempted sale. Contact police immediately.

- LivestockSafe`;

    return await sendSMS(formattedPhone, message);
};

// Initialize on module load
initializeTwilio();

module.exports = {
    sendSMS,
    sendTheftAlertSMS,
    sendVerificationAlertSMS,
    initializeTwilio
};
