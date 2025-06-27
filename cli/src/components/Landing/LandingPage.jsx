import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FeaturesSection from "./features";
import PricingSection from "./PricingSection";
import FooterSection from "./FooterSection";
import landingPageImage from "/Logoo1.png";
import Navbar from "./Navbar";
import HowItWorks from "./HowItWorks"; 

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f9f9f9",
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section
        className="hero-section d-flex align-items-center"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(90deg,rgba(109, 93, 252, 0.81) 0%, #89f7fe 100%)",
          paddingTop: "4rem",
          paddingBottom: "4rem",
          color: "#ffffff",
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="text-center text-lg-start mb-5 mb-lg-0">
              <h1 className="display-4 fw-bold mb-3" style={{ color: "#1c1c1e" }}>
                Tired of Boring {" "}
                <span
                  style={{
                    background: "linear-gradient(to right,rgb(255, 255, 255),rgb(255, 255, 255))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Video Lectures?
                </span>
              </h1>
              <p className="lead mb-4" style={{ maxWidth: "500px", color: "#eaf6ff" }}>
                 We Introduce an AI learning companion that understands you and progress to deliver personalized<br />
               gamified & personalized experiences, keeping you motivated, focused, and actively learning.
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
                <Button
                  onClick={() => navigate("/auth")}
                  variant="light"
                  size="lg"
                  className="px-4 fw-semibold shadow"
                  style={{
                    borderRadius: "30px",
                    backgroundColor: "#ffffff",
                    color: "#003973",
                  }}
                >
                  Get Started
                </Button>
                <Button
                  onClick={() => navigate("/help")}
                  variant="outline-light"
                  size="lg"
                  className="px-4 fw-semibold shadow"
                  style={{
                    borderRadius: "30px",
                    color: "#ffffff",
                    borderColor: "#ffffff",
                  }}
                >
                  Need Help ?
                </Button>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <img
                src={landingPageImage}
                alt="Hero Image"
                className="img-fluid rounded-4 shadow-lg"
                style={{
                  maxHeight: "400px",
                  objectFit: "cover",
                  animation: "float 6s ease-in-out infinite",
                }}
              />
            </Col>
          </Row>
        </Container>
      </section>
<div style={{ marginTop: "-33.5vh", lineHeight: "0", overflow: "hidden" }}>
  <svg
    viewBox="0 0 1440 320"
    style={{
      width: "100%",
      height: "auto",
      display: "block",
    }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#ffffff"
      fillOpacity="3"
      d="M0,96L60,122.7C120,149,240,203,360,202.7C480,203,600,149,720,133.3C840,117,960,139,1080,154.7C1200,171,1320,181,1380,186.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
    />
  </svg>
</div>
      {/* Float Animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      <section id="pricing">
        <PricingSection />
      </section>

      <section id="features">
        <FeaturesSection />
      </section>

    <HowItWorks/>

      <section id="contact">
        <FooterSection />
      </section>
    </div>
  );
};

export default LandingPage;
