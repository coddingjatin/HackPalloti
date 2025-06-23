import React from "react";
import { Container, Row, Col, ListGroup, Button, Form } from "react-bootstrap";
import { Facebook, Twitter, Instagram } from "react-bootstrap-icons";

const FooterSection = () => {
  return (
    <footer className="text-light pt-0" style={{ backgroundColor: "#111" }}>
      {/* Wavy Top Border */}
<div style={{ marginBottom: "-6.5vh" }}>
  <svg
    viewBox="0 0 1440 50"
    preserveAspectRatio="xMinYMin meet"
    style={{ display: "block", width: "100%", height: "auto" }}
  >
    <path
      fill="#ffffff"
      d="M0,20 C360,60 1080,-20 1440,20 L1440,0 L0,0 Z"
    ></path>
  </svg>
</div>

      <Container className="pt-5">
        <Row className="justify-content-between">
          {/* Left Column */}
          <Col xs={12} md={4} className="mb-4">
            <h4 className="fw-bold">SmartPath Buddy</h4>
            <p>
              Your AI-powered learning companion, designed to make education
              engaging and personalized. From gamified lessons to real-time
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="text-light">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-light">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-light">
                <Twitter size={24} />
              </a>
            </div>
          </Col>

          {/* Middle Column 1 */}
          <Col xs={6} md={2} className="mb-4">
            <h6 className="fw-bold">Explore</h6>
            <ListGroup variant="flush">
              <ListGroup.Item className="bg-transparent px-0 border-0">
                <a href="#blog" className="text-light text-decoration-none">
                </a>
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent px-0 border-0">
                <a href="#faqs" className="text-light text-decoration-none">
                  FAQs
                </a>
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent px-0 border-0">
                <a href="#contact" className="text-light text-decoration-none">
                  Contact
                </a>
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent px-0 border-0">
                <a href="#login" className="text-light text-decoration-none">
                  Log in
                </a>
              </ListGroup.Item>
            </ListGroup>
          </Col>

          {/* Right Column: Email Signup */}
          <Col xs={12} md={4}>
            <h6 className="fw-bold text-uppercase">Sign up for emails</h6>
            <p>Get first dibs on new arrivals and updates from us.</p>
            <Form className="d-flex">
              <Form.Control
                type="email"
                placeholder="Email"
                className="me-2"
              />
              <Button
                style={{
                  backgroundColor: "#d62828",
                  border: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Sign Me Up
              </Button>
            </Form>
          </Col>
        </Row>

        {/* Footer Bottom */}
        <Row className="text-center mt-4">
          <Col>
            <p className="text-muted small mb-0">
              © 2025 Hackroynx Project &nbsp; | &nbsp;
              <a href="#" className="text-muted text-decoration-none">
                Privacy Policy
              </a>{" "}
              &nbsp; | &nbsp;
              <a href="#" className="text-muted text-decoration-none">
                Cookie Policy
              </a>
              <br />
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default FooterSection;
