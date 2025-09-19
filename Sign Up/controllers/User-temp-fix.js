const User = require("../models/User");
const twilio = require("twilio");
const nodemailer = require("nodemailer");

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Configure email transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

// TEMPORARY FIX: SMS function that doesn't fail the signup process
const sendSMS = async (phoneNumber, otp, username) => {
    try {
        let formattedPhone = phoneNumber;
        console.log('📱 Original phone:', phoneNumber);
        
        if (phoneNumber && !phoneNumber.startsWith('+')) {
            formattedPhone = phoneNumber.replace(/\D/g, '');
            
            if (formattedPhone.length === 10 && /^\d{10}$/.test(formattedPhone)) {
                formattedPhone = '+91' + formattedPhone;
            } else {
                throw new Error('Please provide a valid 10-digit phone number');
            }
        }
        
        console.log('📱 Formatted phone number:', formattedPhone);
        
        const message = await client.messages.create({
            body: `Hello ${username}, your OTP for DocuLix signup is ${otp}. It will expire in 5 minutes.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: formattedPhone
        });
        
        console.log('✅ SMS sent successfully. SID:', message.sid);
        return message;
    } catch (error) {
        console.error('❌ SMS sending error:', error.message);
        console.log('📱 PHONE OTP for', phoneNumber, ':', otp, '(SMS failed - displayed in console)');
        // DON'T throw error - let signup continue with email-only
        return null;
    }
};

module.exports.signup = async (req, res, next) => {
    try {
        console.log('🚀 Signup attempt started');
        console.log('📦 Request body:', req.body);
        console.log('📦 Content-Type:', req.headers['content-type']);
        
        const { username, email, password, phone } = req.body;
        console.log('📝 User details:', { username, email, phone: phone });

        // Generate separate OTPs for email and phone
        const emailOtp = Math.floor(100000 + Math.random() * 900000);
        const phoneOtp = Math.floor(100000 + Math.random() * 900000);
        console.log('🔢 Generated OTPs - Email:', emailOtp, 'Phone:', phoneOtp);

        // Store OTPs temporarily with user identifier
        const userKey = `${email}_${phone}`;
        otpStore.set(userKey, { emailOtp, phoneOtp, timestamp: Date.now() });
        console.log('💾 Stored OTPs for key:', userKey);

        // Send OTP via Twilio (SMS) - won't fail signup if SMS fails
        console.log('📱 Attempting to send SMS to:', phone);
        const smsResult = await sendSMS(phone, phoneOtp, username);
        if (smsResult) {
            console.log('✅ SMS sent successfully');
        } else {
            console.log('⚠️  SMS failed - continuing with email-only verification');
            console.log('📱 PHONE OTP:', phoneOtp, '(Use this if you need phone verification)');
        }

        // Send OTP via Email
        console.log('📧 Attempting to send email to:', email);
        const mailOptions = {
            from: `"DocuLix Support" <${process.env.SMTP_USER}>`,
            to: email,
            subject: '🔐 Your DocuLix Email OTP Verification Code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; text-align: center; margin-bottom: 30px;">
                            🔐 DocuLix Email Verification
                        </h2>
                        <p style="color: #555; font-size: 16px; line-height: 1.6;">
                            Hello <strong>${username}</strong>,
                        </p>
                        <p style="color: #555; font-size: 16px; line-height: 1.6;">
                            Your email verification code is:
                        </p>
                        <div style="background-color: #007bff; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 5px; margin: 20px 0; letter-spacing: 3px;">
                            ${emailOtp}
                        </div>
                        ${smsResult ? `
                        <p style="color: #555; font-size: 16px; line-height: 1.6;">
                            A separate SMS verification code has been sent to your phone: ${phone}
                        </p>
                        ` : `
                        <div style="background-color: #ffc107; color: #856404; padding: 10px; border-radius: 5px; margin: 20px 0;">
                            <strong>Note:</strong> SMS verification is temporarily unavailable. You can complete signup using email verification only.
                            ${phoneOtp ? `<br><strong>Phone OTP (for reference):</strong> ${phoneOtp}` : ''}
                        </div>
                        `}
                        <p style="color: #777; font-size: 14px; text-align: center;">
                            This code will expire in 10 minutes. Do not share this code with anyone.
                        </p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            This is an automated message from DocuLix. Please do not reply to this email.
                        </p>
                    </div>
                </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('✅ Email sent successfully to:', email);
        } catch (emailError) {
            console.error('❌ Email Error:', emailError.message);
            console.log('🔑 EMAIL OTP for', email, ':', emailOtp, '(displayed due to email error)');
            throw new Error('Failed to send verification email. Please try again.');
        }

        // Store user info temporarily in session
        req.session.tempUser = { username, email, password, phone };
        console.log('💾 Stored user in session');

        console.log('✅ Signup process completed - redirecting to OTP verification');
        res.render('otp-verification', { 
            email: email, 
            phone: phone,
            smsWorking: !!smsResult
        });
        
    } catch (error) {
        console.error('❌ Signup error:', error.message);
        res.render('signup', { 
            error: error.message || 'Signup failed. Please try again.' 
        });
    }
};

// Rest of the file remains the same... (keeping verify function, etc.)
// Copy the rest from the original User.js file