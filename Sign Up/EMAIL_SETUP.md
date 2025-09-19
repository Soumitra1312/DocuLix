# Email Setup Instructions for OTP Verification

## Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the generated 16-character password

3. **Update .env file** with your credentials:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```

## Alternative Email Providers

If not using Gmail, update the transporter configuration in `controllers/User.js`:

### Outlook/Hotmail:
```javascript
const transporter = nodemailer.createTransporter({
    service: 'hotmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
```

### Custom SMTP:
```javascript
const transporter = nodemailer.createTransporter({
    host: 'your-smtp-host.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
```

## Testing

After configuring, test the signup process:
1. Fill out the signup form
2. Check both email and SMS for OTP codes
3. Enter both OTPs in the verification form
4. Complete registration

## Security Notes

- OTPs expire after 5 minutes
- Both email and phone OTPs are required for verification
- Use environment variables for sensitive credentials
- Consider using a production email service for live applications