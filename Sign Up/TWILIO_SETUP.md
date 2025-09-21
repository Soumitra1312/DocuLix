# Twilio Setup Guide for SMS OTP

## Quick Setup Steps

### 1. **Create Twilio Account**
1. Go to [twilio.com](https://www.twilio.com)
2. Sign up for a free account
3. Complete phone verification

### 2. **Get Your Credentials**
After login, from your Twilio Console Dashboard:

**Account SID & Auth Token:**
- Find these on your main dashboard
- Copy both values

**Phone Number:**
- Go to **Phone Numbers** → **Manage** → **Active numbers**
- If you don't have one, get a free trial number
- Copy the phone number (format: +1234567890)

### 3. **Update .env File**
Replace the placeholder values in `.env`:

```env
TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

### 4. **Trial Account Limitations**
- **Free Credits**: $15.50 trial credit
- **Verified Numbers Only**: Can only send to verified phone numbers
- **Twilio Branding**: Messages include "Sent from your Twilio trial account"

### 5. **Add Test Phone Number**
1. Go to **Phone Numbers** → **Manage** → **Verified Caller IDs**
2. Click **Add a new number**
3. Enter your phone number for testing
4. Complete verification process

## 🔧 **Current Configuration**

The app will send SMS like:
```
Hello [username], your OTP for LexiGen signup is [6-digit-code]. It will expire in 5 minutes.
Sent from your Twilio trial account - Free Message.
```

##  **Testing Steps**

1. Update `.env` with your real Twilio credentials
2. Start the server: `node app.js`
3. Go to `http://localhost:8080/signup`
4. Use a verified phone number for testing
5. Check for SMS delivery

##  **Pricing** (After Trial)
- **SMS**: ~$0.0075 per message
- **Phone Number**: $1/month
- **No setup fees**

##  **Troubleshooting**
- **SMS not received**: Check if phone number is verified in trial account
- **Invalid credentials**: Double-check SID and Auth Token
- **Wrong phone format**: Use international format (+1234567890)

---
**Need your Twilio credentials? Get them from:** [Twilio Console](https://console.twilio.com)