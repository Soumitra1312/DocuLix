import { Carousel } from 'react-bootstrap';
import 'react-multi-carousel/lib/styles.css';
import { useEffect } from 'react';
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

// Custom arrow components with better design
const CustomPrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      style={{
        position: "absolute",
        top: "50%",
        left: "-75px",
        transform: "translateY(-50%)",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        background: "linear-gradient(90.21deg, #AA367C -5.91%, #4A2FBD 111.58%)",
        border: "none",
        cursor: "pointer",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        transition: "all 0.3s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(-50%) scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)";
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
};

const CustomNextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      style={{
        position: "absolute",
        top: "50%",
        right: "-75px",
        transform: "translateY(-50%)",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        background: "linear-gradient(90.21deg, #AA367C -5.91%, #4A2FBD 111.58%)",
        border: "none",
        cursor: "pointer",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        transition: "all 0.3s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(-50%) scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)";
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
};

export const Skills: React.FC = () => {
  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: false,
    centerPadding: '0px',
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    swipeToSlide: true,
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  };

  useEffect(() => {
    // Perform any necessary side effects here
  }, []);

  return (
    <section className="skill" id="features">
      <style jsx>{`
        .skill-slider {
          position: relative;
          margin: 0 80px;
        }
        .skill-slider .slick-list {
          overflow: visible;
        }
        .skill-slider .slick-track {
          display: flex;
          align-items: center;
        }
        .skill-slider .slick-slide {
          padding: 0 15px;
        }
        /* Hide all default slick arrows */
        .skill-slider .slick-arrow:before {
          display: none !important;
          content: '' !important;
        }
        .skill-slider .slick-prev:before,
        .skill-slider .slick-next:before {
          display: none !important;
        }
        /* Hide default arrow styling */
        .skill-slider .slick-prev,
        .skill-slider .slick-next {
          background: transparent !important;
        }
        .skill-slider .slick-prev:before,
        .skill-slider .slick-next:before {
          font-size: 0 !important;
          opacity: 0 !important;
        }
        @media (max-width: 768px) {
          .skill-slider {
            margin: 0 20px;
          }
        }
      `}</style>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="skill-bx wow zoomIn">
              <h2 style={{color: '#FFD700'}}>Features</h2>
              <p>Our platform offers variety of fabulous features.</p>
              <Slider {...settings} className="owl-carousel owl-theme skill-slider">
                <div className="item">
                  <img src="https://i.postimg.cc/k41pQ35K/Untitled-design-1.png" alt="Image" />
                  <h5>Automated Legal Document Analysis</h5>
                </div>
                <div className="item">
                  <img src="https://i.postimg.cc/43F6wJzf/Untitled-design.png" alt="Image" />
                  <h5>Ask your contract yourself</h5>
                </div>
                <div className="item">
                  <img src="https://i.postimg.cc/Gp5qSPks/Untitled-design-3.png" alt="Image" />
                  <h5>Identification of Risks and Opportunities</h5>
                </div>
                <div className="item">
                  <img src="https://i.postimg.cc/J0tYz6Mx/Untitled-design-2.png" alt="Image" />
                  <h5>Enhanced Speed and Accuracy</h5>
                </div>
                <div className="item">
                  <img src="https://i.postimg.cc/k41pQ35K/Untitled-design-1.png" alt="Image" />
                  <h5>Smart Contract Review</h5>
                </div>
                <div className="item">
                  <img src="https://i.postimg.cc/43F6wJzf/Untitled-design.png" alt="Image" />
                  <h5>Compliance Checking</h5>
                </div>
                <div className="item">
                  <img src="https://i.postimg.cc/Gp5qSPks/Untitled-design-3.png" alt="Image" />
                  <h5>Clause-by-Clause Analysis</h5>
                </div>
                <div className="item">
                  <img src="https://i.postimg.cc/J0tYz6Mx/Untitled-design-2.png" alt="Image" />
                  <h5>AI-Powered Insights</h5>
                </div>
                <div className="item">
                  <img src="https://i.postimg.cc/k41pQ35K/Untitled-design-1.png" alt="Image" />
                  <h5>Intelligent Document Search</h5>
                </div>
                <div className="item">
                  <img src="https://i.postimg.cc/43F6wJzf/Untitled-design.png" alt="Image" />
                  <h5>Legal Alert System</h5>
                </div>
              </Slider>
            </div>
          </div>
        </div>
      </div>
      <img src="https://i.postimg.cc/1Xz09km7/Untitled-design-3.png" className="background-image-left"  alt="Image" />
    </section>
  );
};

export default Skills;
