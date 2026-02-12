# 📱 SMS Notification Setup Guide

## 🎯 SMS is Now Implemented!

SMS notifications have been added to LivestockSafe! When an animal is reported stolen, the owner receives:
- ✅ Email notification
- ✅ Push notification  
- ✅ **SMS notification** (NEW!)

---

## 🚀 Quick Setup Options

### Option 1: Demo Mode (No Setup Required) ✅ **RECOMMENDED FOR TESTING**

**SMS already works in MOCK mode!**

- No Twilio account needed
- SMS messages are logged to console
- Perfect for demos and testing
- Everything else works perfectly

**To see it in action:**
1. Report an animal as stolen
2. Check your server console
3. You'll see the SMS message that would be sent!

```
📱 SMS NOTIFICATION (MOCK MODE):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: +919876543210
Message: 🚨 LIVESTOCKSAFE THEFT ALERT

Animal: BLG-SHEEP-001
Tag ID: BLG-SHEEP-001
Status: STOLEN
...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Option 2: Real SMS with Twilio (Production)

**For sending actual SMS messages:**

#### Step 1: Create Free Twilio Account

1. Visit: https://www.twilio.com/try-twilio
2. Sign up (FREE trial includes $15 credit)
3. Verify your phone number

#### Step 2: Get Credentials

After signing up, you'll get:
- **Account SID** (starts with `AC...`)
- **Auth Token** (32-character string)
- **Phone Number** (format: `+1234567890`)

Find these at: https://console.twilio.com/

#### Step 3: Update `.env`

```env
# SMS Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_32_character_auth_token_here
TWILIO_PHONE_NUMBER=+15551234567
```

#### Step 4: Restart Server

```bash
cd server
node index.js
```

You should see:
```
✅ Twilio SMS service initialized
```

---

## 📱 SMS Message Format

When theft is reported, owner receives:

```
🚨 LIVESTOCKSAFE THEFT ALERT

Animal: Sultan
Tag ID: BLG-SHEEP-001
Status: STOLEN
Time: 12/02/2026, 3:45:30 pm

Details: Stolen from grazing area

This alert has been broadcast to all regional nodes. 
File FIR immediately.

- LivestockSafe Digital Security
```

---

## 💰 Twilio Pricing (India)

### Free Trial
- **$15 credit** (₹1200+)
- Enough for **~500 SMS**
- Perfect for demos and testing

### Production Pricing
- **₹0.50 - ₹2.00 per SMS** (depending on country)
- Very affordable for critical alerts
- Pay-as-you-go, no monthly fees

---

## 🌍 International Support

SMS works worldwide! Just update phone numbers:

**India**: `+919876543210`  
**USA**: `+15551234567`  
**UK**: `+447911123456`

The system automatically adds `+91` (India) if no country code is provided.

---

## 🔧 Testing

### Test in Mock Mode (Current Setup)
```bash
1. Start server: cd server && node index.js
2. Report theft in the app
3. Check console for SMS message
```

### Test with Real Twilio
```bash
1. Add Twilio credentials to .env
2. Restart server
3. Report theft
4. Owner receives actual SMS!
```

---

## 🎯 When to Use Each Mode

### Mock Mode (Current) ✅
- ✅ Perfect for demos
- ✅ No cost
- ✅ No setup needed
- ✅ Shows in console
- ✅ Great for hackathons

### Real Twilio 📱
- ✅ Production deployment
- ✅ Real user notifications
- ✅ Actual SMS delivery
- ✅ Professional service
- ✅ Delivery tracking

---

## 🚨 Troubleshooting

### SMS not showing in console?
- Check server is running
- Look for "SMS NOTIFICATION (MOCK MODE)" in logs
- Ensure theft was actually reported

### Want to switch to real SMS?
- Get Twilio account
- Add credentials to `.env`
- Restart server
- That's it!

### Phone number format issues?
- System auto-adds +91 for India
- Or manually format: `+919876543210`
- No spaces or dashes

---

## 📊 Notification Matrix

When theft is reported, owner receives:

| Channel | Status | Setup Required |
|---------|--------|----------------|
| 📧 Email | ✅ Working | Gmail credentials |
| 📱 Push | ✅ Ready | Firebase (optional) |
| 💬 SMS | ✅ Working | None (mock mode) |
| 🌐 Web Alert | ✅ Working | None |

---

## 🎉 Summary

**SMS is READY TO USE!**

- ✅ Already implemented
- ✅ Works in mock mode (no setup)
- ✅ Easy to upgrade to real SMS
- ✅ Integrated with theft reporting
- ✅ Automatic phone formatting
- ✅ Professional message templates

**For demos**: Use mock mode (current setup)  
**For production**: Add Twilio credentials

---

## 🔗 Useful Links

- Twilio Free Trial: https://www.twilio.com/try-twilio
- Twilio Console: https://console.twilio.com/
- Twilio Pricing: https://www.twilio.com/sms/pricing
- Twilio Docs: https://www.twilio.com/docs/sms

---

**Questions?** The SMS system is production-ready and works perfectly in mock mode for demos! 🚀
