import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FeaturesSection from "./features";
import PricingSection from "./PricingSection";
import FooterSection from "./FooterSection";
import langdingPageImage from './logo2.jpg';

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-none">
      <section className="hero-section text-center text-lg-start">
        <Container className="py-4">
          <Row className="align-items-center justify-content-center">
            <Col lg={6} className="text-center text-lg-start">
              <h1 className="display-4 fw-bold text-primary">
                🚀 Transform Your Learning Journey!
              </h1>
              <p className="lead text-muted mt-3">
                AI-powered, personalized learning paths designed just for YOU!
              </p>
              <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3 mt-4">
                <Button
                  onClick={() => navigate("/auth")}
                  variant="primary"
                  size="lg"
                  className="px-4 py-2"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate("/help")}
                  variant="outline-primary"
                  size="lg"
                  className="px-4 py-2"
                >
                  Learn More
                </Button>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <img
                src={langdingPageImage}
                alt="Learning AI"
                className="img-fluid rounded shadow-lg"
                style={{ maxWidth: "75%", height: "auto" }}
              />
            </Col>
          </Row>
        </Container>
      </section>
      <FeaturesSection />
      <PricingSection />
      <FooterSection />
    </div>
  );
};

export default LandingPage;
