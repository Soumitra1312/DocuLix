import { useState } from "react";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import contactImg from "../assets/img/contact-img.svg";
import 'animate.css';
import TrackVisibility from 'react-on-screen';

interface FormDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

export const Contact = () => {
  const formInitialDetails: FormDetails = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  };
  const [formDetails, setFormDetails] = useState<FormDetails>(formInitialDetails);
  const [buttonText, setButtonText] = useState('Send');
  const [status, setStatus] = useState<{ success?: boolean; message?: string }>({});
  const [showModal, setShowModal] = useState(false);
  const onFormUpdate = (category: keyof FormDetails, value: string) => {
      setFormDetails({
        ...formDetails,
        [category]: value
      });
    };

  // Email validation function
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation function
  const isValidPhone = (phone: string): boolean => {
    // Remove all non-digits and check if it's 10-15 digits
    const phoneDigits = phone.replace(/\D/g, '');
    return phoneDigits.length >= 10 && phoneDigits.length <= 15;
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    // This will prevent page refresh
    e.preventDefault();
    
    // Validate required fields
    if (!formDetails.firstName.trim() || !formDetails.lastName.trim() || !formDetails.email.trim() || !formDetails.phone.trim() || !formDetails.message.trim()) {
      setStatus({ success: false, message: 'Please fill in all fields.' });
      return;
    }

    // Validate email format
    if (!isValidEmail(formDetails.email)) {
      setStatus({ success: false, message: 'Please enter a valid email address.' });
      return;
    }

    // Validate phone format
    if (!isValidPhone(formDetails.phone)) {
      setStatus({ success: false, message: 'Please enter a valid phone number (10-15 digits).' });
      return;
    }

    setButtonText("Sending...");
    
    try {
      // Create email content
      const emailContent = {
        to: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'doculix92@gmail.com',
        subject: `New Contact Form Submission from ${formDetails.firstName} ${formDetails.lastName}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${formDetails.firstName} ${formDetails.lastName}</p>
          <p><strong>Email:</strong> ${formDetails.email}</p>
          <p><strong>Phone:</strong> ${formDetails.phone}</p>
          <p><strong>Message:</strong></p>
          <p>${formDetails.message}</p>
        `,
        from: formDetails.email,
        replyTo: formDetails.email
      };

      // Send email using a simple email service (you'll need to implement this endpoint)
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailContent),
      });

      setButtonText("Send");
      
      if (response.ok) {
        setStatus({ success: true, message: 'Message sent successfully!' });
        setFormDetails(formInitialDetails);
        setShowModal(true); // Show success popup
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Email API error:', errorData);
        setStatus({ 
          success: false, 
          message: `Failed to send message: ${errorData.message || 'Please try again.'}`
        });
      }
    } catch (error) {
      setButtonText("Send");
      console.error('Contact form error:', error);
      setStatus({ 
        success: false, 
        message: `Network error: ${error instanceof Error ? error.message : 'Please check your connection and try again.'}`
      });
    }
  };



  return (
    <section className="contact" id="connect">
      <Container>
        <Row className="align-items-center">
          <Col xs={12} md={6}>
            <TrackVisibility>
              {({ isVisible }) =>
                <img className={isVisible ? "animate__animated animate__zoomIn" : ""} src="https://i.postimg.cc/yxq273Ck/Untitled-design-4.png"alt="Contact Us" />
              }
            </TrackVisibility>
          </Col>
          <Col xs={12} md={6}>
            <TrackVisibility>
              {({ isVisible }) =>
                <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                  <h2 style={{color: '#FFD700'}}>Get In Touch</h2>
                  <form onSubmit={submit}>
                    <Row>
                      <Col xs={12} sm={6} className="px-1">
                        <input type="text" value={formDetails.firstName} placeholder="First Name" onChange={(e) => onFormUpdate('firstName', e.target.value)} />
                      </Col>
                      <Col xs={12} sm={6} className="px-1">
                        <input type="text" value={formDetails.lastName} placeholder="Last Name" onChange={(e) => onFormUpdate('lastName', e.target.value)} />
                      </Col>
                      <Col xs={12} sm={6} className="px-1">
                        <input type="email" value={formDetails.email} placeholder="Email Address" onChange={(e) => onFormUpdate('email', e.target.value)} />
                      </Col>
                      <Col xs={12} sm={6} className="px-1">
                        <input type="tel" value={formDetails.phone} placeholder="Phone No." onChange={(e) => onFormUpdate('phone', e.target.value)} />
                      </Col>
                      <Col xs={12} className="px-1">
                        <textarea rows={6} value={formDetails.message} placeholder="Message" onChange={(e) => onFormUpdate('message', e.target.value)}></textarea>
                        <button type="submit" className="send-button" style={{
                          position: 'relative',
                          overflow: 'hidden',
                          transition: 'all 0.3s ease',
                          background: 'linear-gradient(135deg, #4A90E2, #357ABD)',
                          border: '2px solid #FFD700',
                          borderRadius: '8px',
                          padding: '16px 32px',
                          color: '#FFFFFF',
                          fontWeight: 'bold',
                          fontSize: '20px',
                          cursor: 'pointer',
                          boxShadow: '0 4px 15px rgba(74, 144, 226, 0.3)',
                          minWidth: '140px',
                          minHeight: '50px'
                        }}>
                          <span className="button-text" style={{
                            position: 'relative',
                            zIndex: 2,
                            transition: 'color 0.3s ease'
                          }}>{buttonText}</span>
                          <div className="button-overlay" style={{
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#000000',
                            transition: 'left 0.4s ease',
                            zIndex: 1
                          }}></div>
                        </button>
                      </Col>
                      {
                        status.message &&
                        <Col>
                          <p className={status.success === false ? "danger" : "success"}>{status.message}</p>
                        </Col>
                      }
                    </Row>
                  </form>
                </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>

      {/* Success Modal Popup */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #dee2e6' }}>
          <Modal.Title style={{ color: '#212529', fontWeight: 'bold' }}>Message Sent!</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#ffffff', color: '#212529' }}>
          <div className="text-center">
            <div style={{ fontSize: '48px', color: '#28a745', marginBottom: '20px' }}>
              ✓
            </div>
            <h4 style={{ color: '#212529', marginBottom: '15px' }}>Thank you for contacting us!</h4>
            <p style={{ color: '#6c757d', fontSize: '16px' }}>Your message has been sent successfully. We'll get back to you within 24 hours.</p>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#ffffff', borderTop: '1px solid #dee2e6' }}>
          <Button 
            variant="primary" 
            onClick={() => setShowModal(false)}
            style={{ 
              backgroundColor: '#007bff', 
              borderColor: '#007bff',
              color: '#ffffff',
              fontWeight: '500'
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};
