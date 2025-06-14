import React from "react";
import { Container, Card, Accordion, Button, Row, Col } from "react-bootstrap";
import { HelpCircle, Mail, Phone, Lock, Shield, Headphones } from "lucide-react";

const HelpCenter = () => {
  return (
    <Container className="mtd-flex flex-column align-items-center">
      {/* Header */}
      <Card className="shadow-sm p-4 text-center w-75">
        <h2 className="mb-3 d-flex align-items-center justify-content-center">
          <HelpCircle size={35} className="me-2 text-primary" />
          Help Center
        </h2>
        <p className="text-muted">
          Find answers to common questions or reach out for support.
        </p>
      </Card>

      {/* FAQ Section */}
      <Accordion defaultActiveKey="0" className="mt-4 w-75 shadow-sm">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <Lock size={20} className="me-2 text-secondary" /> How do I reset my password?
          </Accordion.Header>
          <Accordion.Body>
            You can reset your password from the <strong>Security Settings</strong> under your profile.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <Shield size={20} className="me-2 text-secondary" /> Is my data secure?
          </Accordion.Header>
          <Accordion.Body>
            Yes! We use <strong>AES-256 encryption</strong> to keep your data safe.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>
            <Headphones size={20} className="me-2 text-secondary" /> How do I contact support?
          </Accordion.Header>
          <Accordion.Body>
            You can contact us via email or phone below.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* Contact Support Section */}
      <Card className="mt-4 w-75 shadow-sm p-4 text-center">
        <h5 className="mb-3">Need More Help?</h5>
        <p className="text-muted">Reach out to our support team anytime.</p>
        <Row className="justify-content-center">
          <Col xs="auto">
            <Button variant="primary" className="d-flex align-items-center">
              <Mail size={18} className="me-2" /> Email Support
            </Button>
          </Col>
          <Col xs="auto">
            <Button variant="success" className="d-flex align-items-center mt-3">
              <Phone size={18} className="me-2" /> Call Support
            </Button>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default HelpCenter;
