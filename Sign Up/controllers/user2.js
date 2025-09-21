const User  = require("../models/User");
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

const otpStore = new Map();

// Function to send SMS via Twilio
const sendSMS = async (phoneNumber, otp, username) => {
    try {
        // Format phone number - add +91 if it doesn't start with +
        let formattedPhone = phoneNumber.trim();
        if (!formattedPhone.startsWith('+')) {
            // If it's a 10-digit Indian number, add +91
            if (formattedPhone.length === 10 && /^\d{10}$/.test(formattedPhone)) {
                formattedPhone = '+91' + formattedPhone;
            } else {
                throw new Error('Please provide a valid 10-digit phone number');
            }
        }
        
        console.log('📱 Formatted phone number:', formattedPhone);
        
        const message = await client.messages.create({
            body: `Hello ${username}, your OTP for LexiGen signup is ${otp}. It will expire in 5 minutes.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: formattedPhone
        });
        
        console.log('SMS sent successfully. SID:', message.sid);
        return message;
    } catch (error) {
        console.error('SMS sending error:', error.message);
        throw new Error('Failed to send SMS. Please check your phone number and try again.');
    }
};

module.exports.renderSignupForm = (req,res)=>{
    res.render("signup");
}

module.exports.renderVerifyOtp = (req,res)=>{
    res.render("verify-otp");
}

module.exports.signup = async (req, res, next) => {
    try {
        console.log('🚀 Signup attempt started');
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

        // Send OTP via Twilio (SMS)
        console.log('📱 Attempting to send SMS to:', phone);
        try {
            await sendSMS(phone, phoneOtp, username);
            console.log('✅ SMS sent successfully');
        } catch (smsError) {
            console.error('❌ SMS Error:', smsError.message);
        }

        // Send OTP via Email
        console.log('📧 Attempting to send email to:', email);
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'LexiGen Signup - Email Verification OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #0d6efd;">Welcome to LexiGen!</h2>
                    <p>Hello <strong>${username}</strong>,</p>
                    <p>Your OTP for email verification is:</p>
                    <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; color: #0d6efd; border-radius: 8px; margin: 20px 0;">
                        ${emailOtp}
                    </div>
                    <p style="color: #6c757d; font-size: 14px;">This OTP will expire in 5 minutes.</p>
                    <p>Thank you for joining LexiGen!</p>
                </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('✅ Email sent successfully to:', email);
        } catch (emailError) {
            console.error('❌ Email Error:', emailError.message);
            console.log('🔑 EMAIL OTP for', email, ':', emailOtp, '(displayed due to email error)');
        }

        // Store user info temporarily in session
        req.session.tempUser = { username, email, password, phone };
        console.log('💾 Stored user in session');

        // Redirect to OTP verification page
        console.log('🔄 Redirecting to OTP verification');
        res.redirect("/verify-otp");
    } catch (err) {
        console.error('❌ Signup Error:', err);
        res.redirect("/signup");
    }
};



module.exports.verifyOtp = async (req, res, next) => {
    try {
        console.log('🔍 OTP Verification started');
        const { emailOtp, phoneOtp } = req.body;
        console.log('📝 Received OTPs - Email:', emailOtp, 'Phone:', phoneOtp);
        
        if (!req.session.tempUser) {
            console.log('❌ No tempUser in session');
            return res.send("Session expired. Please signup again.");
        }
        
        const { phone, username, email, password } = req.session.tempUser;
        console.log('👤 User from session:', { username, email, phone });

        const userKey = `${email}_${phone}`;
        console.log('🔑 Looking for key:', userKey);
        const storedOtps = otpStore.get(userKey);
        console.log('💾 Stored OTPs:', storedOtps);

        if (!storedOtps) {
            console.log('❌ No stored OTPs found');
            return res.send("OTP expired or invalid. Please signup again.");
        }

        // Check if OTPs are expired (5 minutes)
        const isExpired = (Date.now() - storedOtps.timestamp) > 5 * 60 * 1000;
        console.log('⏰ Expiry check - Current:', Date.now(), 'Stored:', storedOtps.timestamp, 'Expired:', isExpired);
        if (isExpired) {
            otpStore.delete(userKey);
            return res.send("OTP expired. Please signup again.");
        }

        // Verify both OTPs
        console.log('🔐 Comparing OTPs:');
        console.log('  Email: received =', emailOtp, 'stored =', storedOtps.emailOtp, 'match =', storedOtps.emailOtp == emailOtp);
        console.log('  Phone: received =', phoneOtp, 'stored =', storedOtps.phoneOtp, 'match =', storedOtps.phoneOtp == phoneOtp);
        
        if (storedOtps.emailOtp == emailOtp && storedOtps.phoneOtp == phoneOtp) {
            console.log('✅ Both OTPs match - proceeding with registration');
            // Both OTPs correct → register user
            try {
                const newUser = new User({ username, email, phone });
                const registeredUser = await User.register(newUser, password);

                req.login(registeredUser, (err) => {
                    if (err) return next(err);

                    // Clean up
                    otpStore.delete(userKey);
                    delete req.session.tempUser;

                    console.log('✅ User registered and logged in successfully');
                    res.redirect("http://localhost:3000/dashboard");
                });
            } catch (registerError) {
                console.error('❌ Registration Error:', registerError.message);
                
                // Clean up session data
                otpStore.delete(userKey);
                delete req.session.tempUser;
                
                if (registerError.name === 'UserExistsError') {
                    res.send("A user with this username or email already exists. Please choose a different username or login instead.");
                } else {
                    res.send("Registration failed: " + registerError.message);
                }
                return;
            }
        } else {
            console.log('❌ OTP mismatch');
            res.send("Invalid OTP(s). Please check both email and phone OTPs and try again.");
        }
    } catch (err) {
        console.error('❌ OTP Verification Error:', err);
        res.send("Error verifying OTP. Please try again.");
    }
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("login");
}

module.exports.login = async(req,res)=>{
    
    let redirectUrl = res.locals.redirectUrl || "http://localhost:3000/dashboard";
    res.redirect(redirectUrl);
}

module.exports.logOut = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        
        res.redirect("/");
    })
}

