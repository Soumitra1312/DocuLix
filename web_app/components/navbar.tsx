import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import navIcon1 from '../assets/img/nav-icon1.svg';
import navIcon2 from '../assets/img/nav-icon2.svg';
import navIcon3 from '../assets/img/nav-icon3.svg';
import Link from "next/link";
// ...existing code...

export const NavBar = () => {
  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  // Removed session/auth logic

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

  return (
    <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
      <Container>
        <Navbar.Brand href="/" className="d-flex align-items-center" style={{marginRight: '30px'}}>
          <img className="logo-css me-2" src="/assets/img/logo.jpg" alt="DocuLix Logo" style={{height: '40px', width: 'auto'}} />
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <div className="brand-name doculix-hover" style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', transition: 'color 0.3s ease', lineHeight: '1.2'}}>DocuLix</div>
            <div className="tagline" style={{fontSize: '0.75rem', color: '#aaa', lineHeight: '1', marginTop: '2px'}}>Turning legal jargon into plain language</div>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto" style={{marginLeft: 'auto', paddingLeft: '50px'}}>
            <Nav.Link
              href="#home"
              className={
                activeLink === "home" ? "active navbar-link" : "navbar-link"
              }
              onClick={() => onUpdateActiveLink("home")}
              style={{marginLeft: '20px'}}
            >
              Home
            </Nav.Link>
            <Nav.Link
              href="#features"
              className={
                activeLink === "features" ? "active navbar-link" : "navbar-link"
              }
              onClick={() => onUpdateActiveLink("features")}
              style={{marginLeft: '20px'}}
            >
              Features
            </Nav.Link>
            <Nav.Link
              href="#connect"
              className={
                activeLink === "contact" ? "active navbar-link" : "navbar-link"
              }
              onClick={() => onUpdateActiveLink("contact")}
              style={{marginLeft: '20px'}}
            >
              Contact Us
            </Nav.Link>
            <Nav.Link
              href="http://localhost:8080/login"
              className="navbar-link"
              style={{marginLeft: '20px'}}
            >
              Sign In
            </Nav.Link>
          </Nav>

          {/* Removed sign-in/sign-out UI */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
