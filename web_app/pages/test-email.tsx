import { useState } from 'react';

export default function TestEmail() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const testEmail = async () => {
    setLoading(true);
    setStatus('Testing email...');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'doculix92@gmail.com', // Send to your configured email
          subject: 'Test Email from Legal AI',
          html: '<h1>Test Email</h1><p>This is a test email to verify the email functionality is working.</p>',
          from: 'doculix92@gmail.com',
          replyTo: 'doculix92@gmail.com'
        }),
      });

      const result = await response.text();
      
      if (response.ok) {
        setStatus('✅ Email sent successfully! Check your inbox.');
      } else {
        setStatus(`❌ Email failed: ${response.status} - ${result}`);
      }
    } catch (error) {
      setStatus(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Email Test Page</h1>
      <button 
        onClick={testEmail} 
        disabled={loading}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          margin: '20px'
        }}
      >
        {loading ? 'Sending...' : 'Test Email'}
      </button>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '5px',
        minHeight: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {status || 'Click the button to test email functionality'}
      </div>

      <div style={{ marginTop: '30px', textAlign: 'left', backgroundColor: '#f1f1f1', padding: '20px', borderRadius: '5px' }}>
        <h3>Email Configuration:</h3>
        <p><strong>SMTP Host:</strong> {process.env.SMTP_HOST || 'Not configured'}</p>
        <p><strong>SMTP Port:</strong> {process.env.SMTP_PORT || 'Not configured'}</p>
        <p><strong>SMTP User:</strong> {process.env.SMTP_USER || 'Not configured'}</p>
        <p><strong>Contact Email:</strong> {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'Not configured'}</p>
      </div>
    </div>
  );
}