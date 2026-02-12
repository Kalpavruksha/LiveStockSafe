# 📧 Email Notification Setup Guide

## Quick Setup (5 minutes)

### Option 1: Gmail (Recommended for Demo)

1. **Enable 2-Factor Authentication**
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**
   - Visit https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "LivestockSafe"
   - Copy the 16-character password

3. **Update .env**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx  # The app password
   ```

4. **Restart Server**
   ```bash
   cd server
   node index.js
   ```

### Option 2: Other Email Services

**Outlook/Hotmail:**
```env
EMAIL_SERVICE=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

**Yahoo:**
```env
EMAIL_SERVICE=yahoo
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password
```

**Custom SMTP:**
```env
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_USER=your-email@domain.com
EMAIL_PASS=your-password
```

## Testing Email Notifications

### 1. Add Email to User Account

When registering, the email field is optional but needed for notifications:

**Update User Model** (already done):
```javascript
{
  fullName: "John Herder",
  phone: "9876543210",
  aadhaar: "123456789012",
  email: "john@example.com",  // Add this
  password: "password123"
}
```

### 2. Report Theft

1. Login to the app
2. Go to Dashboard
3. Click on any animal
4. Click "Activate Theft Protocol"
5. Enter theft details
6. Submit

### 3. Check Email

You should receive an email like this:

```
Subject: 🚨 THEFT ALERT: BLG-SHEEP-001

[Professional HTML email with:]
- Animal details (Tag ID, Name, Breed)
- Incident timestamp
- Theft details
- Next steps for filing FIR
- Contact information
```

## Troubleshooting

### Email Not Sending?

**Check 1: Credentials**
```bash
# Test email config
node -e "console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS)"
```

**Check 2: Server Logs**
```bash
# Look for email errors
cd server
node index.js
# Watch for "Email notification failed" messages
```

**Check 3: Gmail Security**
- Ensure 2FA is enabled
- Use App Password, not regular password
- Check "Less secure app access" is OFF (use app passwords instead)

**Check 4: Spam Folder**
- Check recipient's spam/junk folder
- Mark as "Not Spam" if found

### Common Errors

**Error: "Invalid login"**
- Solution: Use App Password, not regular password

**Error: "Connection timeout"**
- Solution: Check firewall/antivirus blocking port 587

**Error: "Authentication failed"**
- Solution: Regenerate App Password

## Email Template Customization

Edit `server/services/emailService.js`:

```javascript
const mailOptions = {
    from: '"LivestockSafe Alert" <noreply@livestocksafe.com>',
    to: ownerEmail,
    subject: `🚨 THEFT ALERT: ${sheepData.name || sheepData.tagId}`,
    html: `
        <!-- Customize HTML here -->
    `
};
```

## Production Recommendations

### Use a Dedicated Email Service

For production, use professional email services:

1. **SendGrid** (Free tier: 100 emails/day)
   ```bash
   npm install @sendgrid/mail
   ```

2. **AWS SES** (Cheap, reliable)
   ```bash
   npm install aws-sdk
   ```

3. **Mailgun** (Developer-friendly)
   ```bash
   npm install mailgun-js
   ```

### Rate Limiting

Add rate limiting to prevent spam:

```javascript
const rateLimit = require('express-rate-limit');

const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each user to 5 emails per window
});

app.use('/api/sheep/:id/status', emailLimiter);
```

## Demo Mode

For demos without email setup, the system will:
- Log email details to console
- Continue theft reporting without errors
- Show success message to user

Check console for:
```
Email notification failed: [error message]
```

## Next Steps

Once email is working:
1. Test with multiple users
2. Customize email template
3. Add email verification on signup
4. Implement email preferences
5. Add unsubscribe links (for production)

---

**Need Help?** Check server logs or contact support.
