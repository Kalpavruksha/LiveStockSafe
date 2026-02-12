const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'noreply@livestocksafe.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
});

const sendTheftAlert = async (ownerEmail, sheepData) => {
    if (!ownerEmail) return;

    const mailOptions = {
        from: '"LivestockSafe Alert" <noreply@livestocksafe.com>',
        to: ownerEmail,
        subject: `🚨 THEFT ALERT: ${sheepData.name || sheepData.tagId}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0;">🚨 THEFT ALERT ACTIVATED</h1>
                </div>
                <div style="padding: 30px; background: #f9fafb;">
                    <h2 style="color: #1e293b;">Animal Reported Stolen</h2>
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Tag ID:</strong> ${sheepData.tagId}</p>
                        <p><strong>Name:</strong> ${sheepData.name || 'Unnamed'}</p>
                        <p><strong>Breed:</strong> ${sheepData.breed || 'N/A'}</p>
                        <p><strong>Reported At:</strong> ${new Date().toLocaleString()}</p>
                        <p><strong>Details:</strong> ${sheepData.theftDetails || 'No additional details'}</p>
                    </div>
                    <p style="color: #64748b;">This alert has been broadcast to all regional verification nodes. Any attempt to verify this animal will display a STOLEN WARNING.</p>
                    <div style="margin-top: 30px; padding: 20px; background: #fef3c7; border-left: 4px solid #d97706; border-radius: 4px;">
                        <p style="margin: 0; color: #92400e;"><strong>Next Steps:</strong></p>
                        <ul style="color: #92400e; margin: 10px 0;">
                            <li>File an FIR at your local police station</li>
                            <li>Share the digital passport QR code with authorities</li>
                            <li>Monitor the public stolen list for sightings</li>
                        </ul>
                    </div>
                </div>
                <div style="background: #1e293b; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
                    <p>LivestockSafe Digital Identity System</p>
                    <p>This is an automated alert. Do not reply to this email.</p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Theft alert email sent to:', ownerEmail);
    } catch (error) {
        console.error('Email send error:', error.message);
    }
};

module.exports = { sendTheftAlert };
