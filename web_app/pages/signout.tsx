import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function SignOut() {
  const router = useRouter();
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Complete animation after 3 seconds
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleVisitAgain = () => {
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Signed Out - DocuLix</title>
        <meta name="description" content="You have been signed out of DocuLix" />
      </Head>
      
      <div className="signout-container">
        {/* Background Animation */}
        <div className="background-animation">
          <div className="floating-particles">
            {[...Array(20)].map((_, i) => (
              <div key={i} className={`particle particle-${i + 1}`}></div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="signout-content">
          {/* Logo Section */}
          <div className="logo-section">
            <img 
              src="/assets/img/logo.jpg" 
              alt="DocuLix Logo" 
              className="signout-logo"
            />
            <h1 className="brand-name">DocuLix</h1>
            <p className="brand-tagline">Turning legal jargon into plain language</p>
          </div>

          {/* Sign Out Message */}
          <div className={`message-section ${animationComplete ? 'fade-in' : ''}`}>
            <div className="signout-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17L21 12L16 7" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12H9" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <h2 className="signout-title">You've Been Signed Out</h2>
            <p className="signout-description">
              Thank you for using DocuLix! Your session has ended securely.
            </p>
            <p className="signout-subtitle">
              We hope you found our legal document analysis helpful.
            </p>
          </div>

          {/* Action Button */}
          <div className={`action-section ${animationComplete ? 'slide-up' : ''}`}>
            <button 
              className="visit-again-btn"
              onClick={handleVisitAgain}
            >
              <span>Visit Again</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21M21 12L13 4M21 12L13 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Footer Message */}
          <div className={`footer-message ${animationComplete ? 'fade-in-delayed' : ''}`}>
            <p>
              <span className="emoji">✨</span>
              Need help with more legal documents? We're here whenever you need us!
              <span className="emoji">✨</span>
            </p>
            <div className="contact-info">
              <p>Team DocuLix - Making Legal Documents Accessible</p>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="decorative-elements">
          <div className="golden-circle circle-1"></div>
          <div className="golden-circle circle-2"></div>
          <div className="golden-circle circle-3"></div>
        </div>
      </div>
    </>
  );
}