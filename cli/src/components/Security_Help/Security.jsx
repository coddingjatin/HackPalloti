import React from "react";
import { ShieldCheck, Lock, EyeOff, Key } from "lucide-react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";

const Security = () => {
  return (
    <Container className="mt d-flex flex-column align-items-center">
      {/* Header */}
      <Card className="shadow-sm p-4 text-center w-75">
        <h2 className="mb-3 d-flex align-items-center justify-content-center">
          <ShieldCheck size={35} className="me-2 text-success" />
          Security & Privacy
        </h2>
        <p className="text-muted">
          Your data is encrypted and protected. We use industry-standard security measures.
        </p>
      </Card>

      {/* Two-Factor Authentication (2FA) */}
      <Card className="mt-4 w-75 shadow-sm">
        <Card.Body>
          <h5 className="d-flex align-items-center">
            <Lock size={22} className="me-2 text-primary" />
            Two-Factor Authentication (2FA)
          </h5>
          <p className="text-muted">
            Enable 2FA for an extra layer of security on your account.
          </p>
          <Button variant="primary">Enable 2FA</Button>
        </Card.Body>
      </Card>

      {/* Password Management */}
      <Card className="mt-3 w-75 shadow-sm">
        <Card.Body>
          <h5 className="d-flex align-items-center">
            <Key size={22} className="me-2 text-warning" />
            Password Management
          </h5>
          <p className="text-muted">
            Change your password regularly to enhance security.
          </p>
          <Button variant="secondary">Change Password</Button>
        </Card.Body>
      </Card>

      {/* Data Privacy */}
      <Card className="mt-3 w-75 shadow-sm">
        <Card.Body>
          <h5 className="d-flex align-items-center">
            <EyeOff size={22} className="me-2 text-danger" />
            Data Privacy
          </h5>
          <p className="text-muted">
            We never share your personal data without your consent.
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Security;
