# URGENT: Email OTP Setup Required

## Current Issues Fixed:
 **Phone Number**: Now automatically adds +91 for Indian numbers  
 **Email**: Needs Gmail App Password setup

##  Gmail App Password Setup (Required)

### Step 1: Enable 2-Factor Authentication
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click **Security** → **2-Step Verification**
3. Follow steps to enable 2FA with your phone

### Step 2: Generate App Password
1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select **Mail** from dropdown
3. Click **Generate**
4. Copy the 16-character password (like: `abcd efgh ijkl mnop`)

### Step 3: Update .env File
Replace in your `.env`:
```env
EMAIL_USER=your-actual-gmail@gmail.com
EMAIL_PASS=your-16-character-app-password
```

##  Current Status

**Phone SMS**:  Will work (auto-formats +91)  
**Email OTP**:  Shows in console logs until you set up Gmail

##  Quick Test

1. Update `.env` with real Gmail credentials
2. Try signup with phone number: `8210016623` (will become `+918210016623`)
3. Check console logs for Email OTP until Gmail is configured

##  Twilio Requirements

Your phone number must be **verified** in Twilio console for trial account:
1. Go to [console.twilio.com](https://console.twilio.com)
2. **Phone Numbers** → **Manage** → **Verified Caller IDs**  
3. Add `+918210016623` for testing

---

**Need help?** Check the server console logs - OTPs will be displayed there until email is properly configured!