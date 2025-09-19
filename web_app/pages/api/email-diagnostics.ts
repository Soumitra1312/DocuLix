import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const testPasswords = [
    'mvpdupchzivpzuln',           // Current format
    'mvpd uphc zivp zuln',       // With spaces
    'mvpd-uphc-zivp-zuln',       // With dashes
  ];

  const diagnostics = {
    environment: {
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASSWORD_LENGTH: process.env.SMTP_PASSWORD?.length || 0,
      SMTP_PASSWORD_FIRST_4: process.env.SMTP_PASSWORD?.substring(0, 4),
      SMTP_PASSWORD_LAST_4: process.env.SMTP_PASSWORD?.substring(-4),
    },
    suggestions: [
      '1. Ensure 2-step verification is enabled on Gmail',
      '2. Generate a new app password from Google Account → Security → App passwords',
      '3. Use the exact 16-character password without spaces or dashes',
      '4. Make sure to use the gmail account email as SMTP_USER',
      '5. Restart the Next.js server after updating .env.local'
    ],
    testPasswords: testPasswords.map(pwd => ({
      password: pwd,
      length: pwd.length,
      format: pwd.includes(' ') ? 'with spaces' : pwd.includes('-') ? 'with dashes' : 'no spaces'
    }))
  };

  res.status(200).json(diagnostics);
}