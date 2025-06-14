import React from "react";
import { Container, Row, Col, ListGroup, Button } from "react-bootstrap";
import { Facebook, Twitter, Instagram } from "react-bootstrap-icons";

const FooterSection = () => {
  return (
    <footer className="bg-dark text-light py-5">
      <>
        <Row className="justify-content-center">
          {/* Column 1: Logo and Description */}
          <Col xs={12} md={4} className="text-center mb-4 mb-md-0">
            <h3 className="fw-bold text-primary">AI Platform</h3>
            <p className="text-muted">
              Empowering personalized learning with AI to help you reach your
              goals.
            </p>
            <Button variant="outline-light" className="mt-3">
              Get Started
            </Button>
          </Col>

          {/* Column 2: Quick Links */}
          <Col xs={12} md={3} className="text-center mb-4 mb-md-0">
            <h5 className="fw-bold mb-3">Quick Links</h5>
            <ListGroup className="list-unstyled">
              <ListGroup.Item as="li" className="bg-dark border-0">
                <a href="#home" className="text-light text-decoration-none">
                  Home
                </a>
              </ListGroup.Item>
              <ListGroup.Item as="li" className="bg-dark border-0">
                <a href="#about" className="text-light text-decoration-none">
                  About
                </a>
              </ListGroup.Item>
              <ListGroup.Item as="li" className="bg-dark border-0">
                <a href="#pricing" className="text-light text-decoration-none">
                  Pricing
                </a>
              </ListGroup.Item>
              <ListGroup.Item as="li" className="bg-dark border-0">
                <a href="#contact" className="text-light text-decoration-none">
                  Contact
                </a>
              </ListGroup.Item>
            </ListGroup>
          </Col>

          {/* Column 3: Social Media Links */}
          <Col xs={12} md={3} className="text-center">
            <h5 className="fw-bold mb-3">Follow Us</h5>
            <div className="d-flex justify-content-center">
              <Button variant="link" className="text-light mx-2">
                <Facebook size={30} />
              </Button>
              <Button variant="link" className="text-light mx-2">
                <Twitter size={30} />
              </Button>
              <Button variant="link" className="text-light mx-2">
                <Instagram size={30} />
              </Button>
            </div>
          </Col>
        </Row>

        <Row className="text-center mt-5">
          <Col xs={12}>
            <p className="text-muted mb-0">
              &copy; 2025 AI Platform. All Rights Reserved.
            </p>
          </Col>
        </Row>
      </>
    </footer>
  );
};

export default FooterSection;
