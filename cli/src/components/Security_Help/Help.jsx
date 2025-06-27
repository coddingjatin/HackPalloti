import React from "react";
import { Container, Card, Accordion, Button, Row, Col } from "react-bootstrap";
import { HelpCircle, Mail, Phone, Lock, Shield, Headphones, CheckCircle, AlertCircle, Info } from "lucide-react";

const HelpCenter = () => {
  return (
    <Container>
      <Row className="justify-content-start">
        <Col md={{ span: 8, offset: 2 }} className="d-flex flex-column align-items-center">
          {/* Header */}
          <Card className="shadow-sm p-4 text-center w-100">
            <h2 className="mb-3 d-flex align-items-center justify-content-center">
              <HelpCircle size={35} className="me-2 text-primary" />
              Help Center
            </h2>
            <p className="text-muted">
              Find answers to common questions or reach out for support.
            </p>
          </Card>

          {/* FAQ Section */}
          <Accordion defaultActiveKey="0" className="mt-4 w-100 shadow-sm">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <Lock size={20} className="me-2 text-secondary" /> How do I reset my password?
              </Accordion.Header>
              <Accordion.Body className="d-flex align-items-start">
                <CheckCircle size={24} className="me-3 text-success" />
                You can reset your password from the <strong>Security Settings</strong> under your profile.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <Shield size={20} className="me-2 text-secondary" /> Is my data secure?
              </Accordion.Header>
              <Accordion.Body className="d-flex align-items-start">
                <AlertCircle size={24} className="me-3 text-warning" />
                Yes! We use <strong>AES-256 encryption</strong> to keep your data safe.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>
                <Headphones size={20} className="me-2 text-secondary" /> How do I contact support?
              </Accordion.Header>
              <Accordion.Body className="d-flex align-items-start">
                <Info size={24} className="me-3 text-info" />
                You can contact us via email or phone below.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          {/* Contact Support Section */}
          <Card className="mt-4 w-100 shadow-sm p-4 text-center">
            <h5 className="mb-3 d-flex align-items-center justify-content-center">
              <HelpCircle size={24} className="me-2 text-primary" />
              Need More Help?
            </h5>
            <p className="text-muted">Reach out to our support team anytime.</p>
            <Row className="justify-content-center">
              <Col xs="auto">
                <Button variant="primary" className="d-flex align-items-center">
                  <Mail size={18} className="me-2" /> Email Support
                </Button>
              </Col>
              <Col xs="auto">
                <Button variant="success" className="d-flex align-items-center">
                  <Phone size={18} className="me-2" /> Call Support
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HelpCenter;