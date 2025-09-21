import { Container, Row, Col } from "react-bootstrap";

export const Foooter = () => {
  return (
    <footer style={{
      marginTop: '60px',
      padding: '40px 20px',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      textAlign: 'center',
      color: '#fff'
    }}>
      <div style={{maxWidth: '800px', margin: '0 auto'}}>
        {/* Team Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          fontSize: '16px'
        }}>
          <span style={{marginRight: '8px'}}>👥</span>
          <span>Designed and Developed by Team DocuLix</span>
        </div>
        
        {/* Contact Info */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px',
          marginBottom: '30px'
        }}>
          {/* Email */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            color: '#aaa'
          }}>
            <span style={{marginRight: '8px', fontSize: '16px'}}>📧</span>
            <a 
              href="mailto:doculix92@gmail.com" 
              className="footer-link"
              style={{
                color: '#FFD700',
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}
            >
              doculix92@gmail.com
            </a>
          </div>
          
          {/* Phone */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            color: '#aaa'
          }}>
            <span style={{marginRight: '8px', fontSize: '16px'}}>📞</span>
            <a 
              href="tel:8210016623" 
              className="footer-link"
              style={{
                color: '#FFD700',
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}
            >
              +91 8210016623
            </a>
          </div>
        </div>
        
        {/* Copyright */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '20px',
          fontSize: '12px',
          color: '#777',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{marginRight: '8px'}}>©</span>
          <span>All rights reserved</span>
        </div>
      </div>
    </footer>
  );
};
