import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

type EmailData = {
  to: string;
  subject: string;
  html: string;
  from: string;
  replyTo: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { to, subject, html, from, replyTo }: EmailData = req.body;

  try {
    console.log('Email API called with:', { to, subject, from });
    console.log('Environment check:', {
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASSWORD: process.env.SMTP_PASSWORD ? `${process.env.SMTP_PASSWORD.substring(0, 4)}...` : 'missing'
    });

    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      throw new Error('SMTP credentials not configured properly');
    }

    // Create nodemailer transporter with enhanced Gmail settings
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use Gmail service for better compatibility
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // Your email
        pass: process.env.SMTP_PASSWORD, // Your app password
      },
      tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
      },
      debug: true, // Enable debug output
      logger: true // Enable logging
    });

    // Verify transporter
    await transporter.verify();
    console.log('SMTP transporter verified successfully');

    // Send email
    const info = await transporter.sendMail({
      from: `"Legal AI Contact" <${process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      html: html,
      replyTo: replyTo,
    });

    console.log('Email sent successfully:', info.messageId);
    res.status(200).json({ message: 'Email sent successfully' });
    
  } catch (error) {
    console.error('Error sending email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ 
      message: 'Failed to send email', 
      error: errorMessage,
      config: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        userConfigured: !!process.env.SMTP_USER,
        passwordConfigured: !!process.env.SMTP_PASSWORD
      }
    });
  }
}