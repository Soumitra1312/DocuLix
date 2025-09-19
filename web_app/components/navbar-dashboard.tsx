import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import navIcon1 from '../assets/img/nav-icon1.svg';
import navIcon2 from '../assets/img/nav-icon2.svg';
import navIcon3 from '../assets/img/nav-icon3.svg';
import Link from "next/link";
import './navbar-dashboard.css';

export const NavBarDashboard = () => {
  const [activeLink, setActiveLink] = useState('dashboard');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [])

  const onUpdateActiveLink = (value: string) => {
    setActiveLink(value);
  }

  const handleLogout = () => {
    // Redirect to authentication server logout
    window.location.href = 'http://localhost:8080/logout';
  }

  return (
    <Navbar className={scrolled ? "scrolled" : ""} style={{padding: '18px 0', position: 'fixed', width: '100%', top: 0, zIndex: 9999}}>
      <Container>
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <img className="logo-css me-3" src="/assets/img/logo.jpg" alt="DocuLix Logo" style={{height: '40px', width: 'auto'}} />
          <div className="brand-name doculix-hover" style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', transition: 'color 0.3s ease', marginRight: '15px'}}>DocuLix</div>
          <div className="tagline" style={{fontSize: '0.9rem', color: '#aaa', fontStyle: 'italic'}}>Turning legal jargon into plain language</div>
        </Navbar.Brand>
        
        {/* User Welcome and Logout Section */}
        <Nav className="ms-auto d-flex align-items-center">
          <div className="d-flex align-items-center" style={{marginRight: '20px'}}>
            <span style={{color: '#fff', fontSize: '1rem', marginRight: '15px'}}>
              Welcome <strong style={{color: '#FFD700'}}>Soumitra</strong>!
            </span>
          </div>
          <button 
            onClick={handleLogout}
            style={{
              background: 'linear-gradient(135deg, #ff4757, #ff3742)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              padding: '8px 16px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 10px rgba(255, 71, 87, 0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #ff3742, #ff2f3a)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 71, 87, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #ff4757, #ff3742)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(255, 71, 87, 0.3)';
            }}
          >
            Logout
          </button>
        </Nav>
      </Container>
    </Navbar>
  );
};