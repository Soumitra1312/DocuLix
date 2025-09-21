# SMS Service Setup - 2Factor.in API

## Why 2Factor.in over Twilio?

 **More Cost-Effective**: Significantly cheaper than Twilio for Indian numbers
 **Better Indian Coverage**: Optimized for Indian telecom operators  
 **Simpler API**: No complex authentication tokens
 **Faster Delivery**: Direct carrier connections in India
 **No Phone Number Purchase**: No need to buy/maintain phone numbers

## Setup Instructions

### 1. Get API Key from 2Factor.in
1. Visit [2factor.in](https://2factor.in)
2. Sign up for an account
3. Go to Dashboard → API Keys
4. Copy your API key
5. Update `.env` file:
   ```
   TWOFACTOR_API_KEY=your-api-key-here
   ```

### 2. API Usage
The current implementation uses the simple SMS API:
```
GET https://2factor.in/API/V1/{API_KEY}/SMS/{Phone_Number}/{OTP}
```

### 3. Phone Number Format
- Use international format: `+919876543210`
- No spaces or special characters except `+`

## Features Implemented

1. **Automatic OTP Generation**: 6-digit random OTP
2. **Direct API Integration**: No SDK dependencies
3. **Error Handling**: Proper error logging and fallback
4. **Cost Optimization**: Pay per SMS, no monthly fees

## Testing

1. Ensure your 2Factor.in account has sufficient credits
2. Test with a valid Indian mobile number
3. Check delivery reports in 2Factor.in dashboard

## Cost Comparison (Approximate)

| Service | Cost per SMS (India) | Setup Cost |
|---------|---------------------|------------|
| Twilio  | ₹0.50-1.00         | Phone number rental |
| 2Factor.in | ₹0.10-0.20      | None |

## Troubleshooting

- **SMS not received**: Check phone number format and account credits
- **API errors**: Verify API key in .env file
- **Delivery issues**: Check 2Factor.in dashboard for delivery reports