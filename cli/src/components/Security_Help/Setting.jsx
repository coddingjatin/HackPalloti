import React from "react";
import { Container, Card, Button } from "react-bootstrap";
import { User, Bell, Sliders, Trash2 } from "lucide-react";

const Settings = () => {
  return (
    <Container className="mt d-flex flex-column align-items-center">
      {/* Header */}
      <Card className="shadow-sm p-4 text-center w-75">
        <h2 className="mb-3 d-flex align-items-center justify-content-center">
          <Sliders size={35} className="me-2 text-primary" />
          Settings
        </h2>
        <p className="text-muted">
          Manage your account, notifications, and preferences here.
        </p>
      </Card>

      {/* Profile Settings */}
      <Card className="mt-4 w-75 shadow-sm">
        <Card.Body>
          <h5 className="d-flex align-items-center">
            <User size={22} className="me-2 text-info" />
            Profile Settings
          </h5>
          <p className="text-muted">Update your profile information and avatar.</p>
          <Button variant="info">Edit Profile</Button>
        </Card.Body>
      </Card>

      {/* Preferences */}
      <Card className="mt-3 w-75 shadow-sm">
        <Card.Body>
          <h5 className="d-flex align-items-center">
            <Sliders size={22} className="me-2 text-success" />
            Preferences
          </h5>
          <p className="text-muted">Customize your app experience and theme.</p>
          <Button variant="success">Edit Preferences</Button>
        </Card.Body>
      </Card>

      {/* Account Deletion */}
      <Card className="mt-3 w-75 shadow-sm">
        <Card.Body>
          <h5 className="d-flex align-items-center text-danger">
            <Trash2 size={22} className="me-2" />
            Delete Account
          </h5>
          <p className="text-muted">
            Permanently delete your account. This action cannot be undone.
          </p>
          <Button variant="danger">Delete Account</Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Settings;
