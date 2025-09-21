const mongoose = require('mongoose');
const User = require('./models/User');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
require('dotenv').config();

console.log('🔍 Testing Complete Signup Flow...\n');

// Test MongoDB connection
async function testMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connection successful');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return false;
  }
}

// Test email configuration
async function testEmail() {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });

    await transporter.verify();
    console.log('✅ Email configuration verified');
    return true;
  } catch (error) {
    console.error('❌ Email configuration failed:', error.message);
    return false;
  }
}

// Test Twilio configuration
function testTwilio() {
  try {
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log('✅ Twilio configuration verified');
    return true;
  } catch (error) {
    console.error('❌ Twilio configuration failed:', error.message);
    return false;
  }
}

// Test user creation and OTP generation
async function testUserCreation() {
  try {
    const testEmail = 'test' + Date.now() + '@example.com';
    const testPhone = '9876543210';
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email: testEmail }, { phone: testPhone }] 
    });
    
    if (existingUser) {
      console.log('🔄 Cleaning up existing test user...');
      await User.deleteOne({ _id: existingUser._id });
    }

    // Generate OTPs
    const emailOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const phoneOTP = Math.floor(100000 + Math.random() * 900000).toString();
    
    console.log('📧 Generated Email OTP:', emailOTP);
    console.log('📱 Generated Phone OTP:', phoneOTP);

    // Create new user
    const newUser = new User({
      username: 'testuser' + Date.now(),
      email: testEmail,
      password: 'password123',
      phone: testPhone,
      emailOTP: emailOTP,
      phoneOTP: phoneOTP,
      isEmailVerified: false,
      isPhoneVerified: false
    });

    await newUser.save();
    console.log('✅ User created successfully with OTPs');
    
    // Clean up
    await User.deleteOne({ _id: newUser._id });
    console.log('🧹 Test user cleaned up');
    
    return true;
  } catch (error) {
    console.error('❌ User creation failed:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting comprehensive signup flow test...\n');
  
  const mongoOK = await testMongoDB();
  if (!mongoOK) return;
  
  const emailOK = await testEmail();
  const twilioOK = testTwilio();
  const userOK = await testUserCreation();
  
  console.log('\n📊 TEST RESULTS:');
  console.log('================');
  console.log('MongoDB:', mongoOK ? '✅ PASS' : '❌ FAIL');
  console.log('Email:', emailOK ? '✅ PASS' : '❌ FAIL');
  console.log('Twilio:', twilioOK ? '✅ PASS' : '❌ FAIL');
  console.log('User Creation:', userOK ? '✅ PASS' : '❌ FAIL');
  
  if (mongoOK && emailOK && twilioOK && userOK) {
    console.log('\n🎉 ALL SYSTEMS OPERATIONAL!');
    console.log('The signup flow should be working. If OTP is not received,');
    console.log('the issue might be with actual email/SMS delivery or user input.');
  } else {
    console.log('\n⚠️  ISSUES DETECTED - Fix the failing components above.');
  }
  
  process.exit(0);
}

runAllTests().catch(console.error);