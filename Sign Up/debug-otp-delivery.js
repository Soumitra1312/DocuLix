const nodemailer = require('nodemailer');
const twilio = require('twilio');
require('dotenv').config();

console.log('🔍 DEBUGGING OTP DELIVERY ISSUE\n');

// Test email sending directly
async function testEmailDelivery() {
  console.log('📧 Testing Email Delivery...');
  
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection
    await transporter.verify();
    console.log('✅ Email transporter verified');

    // Send test OTP email
    const testOTP = '123456';
    const testEmail = 'doculix92@gmail.com';
    
    const mailOptions = {
      from: `"DocuLix Support" <${process.env.SMTP_USER}>`,
      to: testEmail,
      subject: '🔐 Your DocuLix Email OTP Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; text-align: center; margin-bottom: 30px;">
              🔐 DocuLix Email Verification
            </h2>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              Your email verification code is:
            </p>
            <div style="background-color: #007bff; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 5px; margin: 20px 0; letter-spacing: 3px;">
              ${testOTP}
            </div>
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

    console.log('📤 Sending test email to:', testEmail);
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('📋 Message ID:', result.messageId);
    console.log('📨 Response:', result.response);
    
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    console.error('🔍 Error details:', error);
    return false;
  }
}

// Test SMS sending directly
async function testSMSDelivery() {
  console.log('\n📱 Testing SMS Delivery...');
  
  try {
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
    
    const testOTP = '654321';
    const testPhone = '+919876543210'; // Make sure this is your real phone with country code
    
    console.log('📤 Sending SMS to:', testPhone);
    
    const message = await client.messages.create({
      body: `🔐 DocuLix Phone Verification\n\nYour phone verification code is: ${testOTP}\n\nThis code expires in 10 minutes. Do not share this code.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: testPhone
    });
    
    console.log('✅ SMS sent successfully!');
    console.log('📋 Message SID:', message.sid);
    console.log('📊 Status:', message.status);
    
    return true;
  } catch (error) {
    console.error('❌ SMS sending failed:', error.message);
    console.error('🔍 Error details:', error);
    return false;
  }
}

// Run tests
async function runDeliveryTests() {
  console.log('🚀 Starting OTP Delivery Tests...\n');
  
  console.log('📋 Configuration Check:');
  console.log('SMTP_HOST:', process.env.SMTP_HOST || 'MISSING');
  console.log('SMTP_USER:', process.env.SMTP_USER || 'MISSING');
  console.log('TWILIO_SID:', process.env.TWILIO_SID ? 'SET' : 'MISSING');
  console.log('TWILIO_PHONE:', process.env.TWILIO_PHONE_NUMBER || 'MISSING');
  console.log('');
  
  const emailSuccess = await testEmailDelivery();
  const smsSuccess = await testSMSDelivery();
  
  console.log('\n📊 DELIVERY TEST RESULTS:');
  console.log('========================');
  console.log('Email:', emailSuccess ? '✅ SUCCESS' : '❌ FAILED');
  console.log('SMS:', smsSuccess ? '✅ SUCCESS' : '❌ FAILED');
  
  if (emailSuccess && smsSuccess) {
    console.log('\n🎉 BOTH EMAIL AND SMS WORKING!');
    console.log('Check your email and phone now for the test OTPs.');
    console.log('If you receive these test messages, the issue is in the signup form logic.');
  } else {
    console.log('\n⚠️  DELIVERY ISSUES DETECTED');
    console.log('Fix the failing delivery methods above.');
  }
  
  process.exit(0);
}

runDeliveryTests().catch(console.error);