import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ArrowRightCircle, Link } from 'react-bootstrap-icons';
import 'animate.css';
import TrackVisibility from 'react-on-screen';

export const Banner = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  const [index, setIndex] = useState(1);
  const toRotate = [ "Web Developer", "Web Designer", "UI/UX Designer" ];
  const period = 2000;

  // Typewriter effect for tagline
  const [taglineText, setTaglineText] = useState('');
  const [showTaglineCursor, setShowTaglineCursor] = useState(true);
  const fullTagline = "Turning legal jargon into plain language";
  const [taglineComplete, setTaglineComplete] = useState(false);
  const [isTaglineDeleting, setIsTaglineDeleting] = useState(false);
  const [taglineLoopDelay, setTaglineLoopDelay] = useState(false);



  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => { clearInterval(ticker) };
  }, [text]);

  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta(prevDelta => prevDelta / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setIndex(prevIndex => prevIndex - 1);
      setDelta(period);
    } else if (isDeleting && updatedText === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setIndex(1);
      setDelta(500);
    } else {
      setIndex(prevIndex => prevIndex + 1);
    }
  };

  // Typewriter effect for tagline with looping
  useEffect(() => {
    if (taglineLoopDelay) {
      // 2-second delay before starting new cycle
      const delayTimer = setTimeout(() => {
        setTaglineLoopDelay(false);
        setIsTaglineDeleting(false);
        setTaglineComplete(false);
      }, 2000);
      return () => clearTimeout(delayTimer);
    }

    const timer = setTimeout(() => {
      if (!isTaglineDeleting) {
        // Typing phase
        if (taglineText.length < fullTagline.length) {
          setTaglineText(fullTagline.slice(0, taglineText.length + 1));
        } else {
          setTaglineComplete(true);
          // Start deleting after 1.5 seconds
          setTimeout(() => {
            setIsTaglineDeleting(true);
            setTaglineComplete(false);
          }, 1500);
        }
      } else {
        // Deleting phase
        if (taglineText.length > 0) {
          setTaglineText(taglineText.slice(0, -1));
        } else {
          // Start loop delay
          setTaglineLoopDelay(true);
        }
      }
    }, isTaglineDeleting ? 40 : 80); // Faster deletion, slower typing

    return () => clearTimeout(timer);
  }, [taglineText, fullTagline, isTaglineDeleting, taglineLoopDelay]);

  // Cursor blinking effect for tagline
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowTaglineCursor(prev => !prev);
    }, 530); // Cursor blink speed

    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <section className="banner" id="home">
      <Container>
        <Row className="aligh-items-center">
          <Col xs={12} md={6} xl={7}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div
                  className={
                    isVisible ? "animate__animated animate__fadeIn" : ""
                  }
                >
                  <div style={{marginBottom: '20px'}}>
                    <h1 style={{
                      fontSize: '3rem', 
                      fontWeight: 'bold', 
                      marginBottom: '5px',
                      color: '#FFD700',
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 215, 0, 0.3)'
                    }}>
                      DocuLix
                    </h1>
                    <span className="tagline" style={{
                      fontSize: '1.3rem', 
                      color: '#00BFFF',
                      background: 'linear-gradient(45deg, #00BFFF, #87CEEB, #FFFFFF)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 191, 255, 0.6), 0 0 30px rgba(135, 206, 235, 0.4)',
                      fontWeight: '600',
                      fontFamily: 'Georgia, "Times New Roman", serif',
                      minHeight: '35px',
                      display: 'inline-block',
                      letterSpacing: '1px',
                      fontStyle: 'italic'
                    }}>
                      {taglineText}
                      <span 
                        className="typewriter-cursor"
                        style={{
                          opacity: showTaglineCursor ? 1 : 0,
                          color: '#FF6B6B',
                          background: 'linear-gradient(45deg, #FF6B6B, #FFD700)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          fontWeight: 'bold',
                          fontSize: '1.2em',
                          marginLeft: '3px',
                          textShadow: '0 0 10px rgba(255, 107, 107, 0.8)'
                        }}
                      >
                        |
                      </span>
                    </span>
                  </div>
                  <div style={{
                    background: 'rgba(30, 30, 60, 0.75)',
                    backdropFilter: 'blur(25px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(25px) saturate(180%)',
                    border: '2px solid rgba(255, 215, 0, 0.6)',
                    borderRadius: '25px',
                    padding: '35px',
                    marginBottom: '30px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, rgba(30, 30, 60, 0.05) 50%, rgba(0, 0, 0, 0.1) 100%)',
                      borderRadius: '25px',
                      pointerEvents: 'none'
                    }}></div>
                    <p style={{
                      margin: 0,
                      color: '#FFFFFF',
                      fontSize: '1.15rem',
                      lineHeight: '1.7',
                      fontWeight: 'bold',
                      position: 'relative',
                      zIndex: 1,
                      letterSpacing: '0.3px',
                      textAlign: 'justify'
                    }}>
                      Traditionally, analyzing legal documents is time-consuming and expensive. DocuLix automates the process by applying machine learning algorithms to identify relevant information and viewpoints, such as clauses, terms, and patterns. This significantly improves the speed and accuracy of legal research, identifies potential risks and opportunities, and enhances compliance. Legal analysis becomes quicker, easier, and more reliable.
                    </p>
                  </div>
                  <a href="http://localhost:8080/signup">
                    <button >
                      Get Started for free <ArrowRightCircle size={25} />
                    </button>
                  </a>
                </div>
              )}
            </TrackVisibility>
          </Col>
          <Col xs={12} md={6} xl={5}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div
                  className={
                    isVisible ? "animate__animated animate__zoomIn" : ""
                  }
                >
                  <img
                    src="/assets/img/image.jpg"
                    alt="Header Img"
                  />
                </div>
              )}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
