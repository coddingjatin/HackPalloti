import React from "react";
import { Container, Card, Button } from "react-bootstrap";
import { User, Sliders, Trash2 } from "lucide-react";

const Settings = () => {
  const cardStyle = {
    borderRadius: "20px",
    width: "300px",
    flexShrink: 0,
  };

  const containerStyle = {
    transform: "scale(1.0)",
    transformOrigin: "top center",
    backgroundColor: "#f7f9fc",
    minHeight: "100vh",
    paddingTop: "30px",
    paddingBottom: "30px",
  };

  return (
    <Container
      className="d-flex flex-column align-items-center"
      style={containerStyle}
    >
      {/* Header */}
      <Card className="shadow-sm p-4 text-center w-75 mb-4" style={{ borderRadius: "20px" }}>
        <h2 className="mb-3 d-flex align-items-center justify-content-center">
          <Sliders size={35} className="me-2 text-primary" />
          Settings
        </h2>
        <p className="text-muted">
          Manage your account, notifications, and preferences here.
        </p>
      </Card>

      {/* Horizontal Card Group */}
      <div className="d-flex justify-content-center gap-4 flex-wrap">
        {/* Profile Settings */}
        <Card className="shadow-sm" style={cardStyle}>
          <Card.Body>
            <h5 className="d-flex align-items-center">
              <User size={22} className="me-2 text-info" />
              Profile Settings
            </h5>
           <p className="text-muted">Update your profile information and avatar.</p>
<a href="/profile" className="btn btn-info">Edit Profile</a>
            <p className="text-muted">Update your profile information and avatar.</p>
            <Button variant="info">Edit Profile</Button>
          </Card.Body>
        </Card>

        {/* Preferences */}
        <Card className="shadow-sm" style={cardStyle}>
          <Card.Body>
            <h5 className="d-flex align-items-center">
              <Sliders size={22} className="me-2 text-success" />
              Preferences
            </h5>
            <p className="text-muted">Customize your app Schedule and plan your day.</p>
            <a href="/calendar" className="btn btn-success">Edit Schedule</a>
            <p className="text-muted">Customize your app experience and theme.</p>
            <Button variant="success">Edit Preferences</Button>
          </Card.Body>
        </Card>

        {/* Delete Account */}
        <Card className="shadow-sm" style={cardStyle}>
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
      </div>
    </Container>
  );
};

export default Settings;