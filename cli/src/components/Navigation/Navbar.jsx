import React, { useEffect, useState } from "react";
import { Bell, Moon, Search, Sun, Users, Home, CreditCard } from "lucide-react";
import {
  Button,
  Form,
  Nav,
  Navbar,
  Dropdown,
  Container,
  Image,
  Badge,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom"; // For navigation
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import "./nav.css";

const Avatar = ({ src, alt, fallback, size = 32 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f0f0f0",
    }}
  >
    {src ? (
      <Image
        src={src}
        alt={alt}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    ) : (
      <span style={{ fontSize: size * 0.5, color: "#666" }}>{fallback}</span>
    )}
  </div>
);

export function NavBar() {
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch today's events on mount
    fetchTodayEvents();
  }, []);

  const fetchTodayEvents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/events/today", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      setEvents(data);
      setNotificationCount(data.length);
    } catch (error) {
      console.error("Error fetching today's events:", error);
    }
  };

  const handleBellClick = () => {
    fetchTodayEvents(); // Fetch events again when clicking the bell
    if (events.length > 0) {
      events.forEach((event) => {
        toast.info(`Upcoming Event: ${event.title} at ${new Date(event.start).toLocaleTimeString()}`);
      });
    } else {
      toast.info("No events for today!");
    }
    setNotificationCount(0); // Reset the count after clicking
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = async () => {
    try {
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        navigate("/auth"); // Redirect to home/login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="border-bottom sticky-top w-100">
        <Container fluid>
          <Navbar.Brand href="#" className="d-flex align-items-center">
            <img
              src="/logo.jpg"
              alt="Logo"
              width="70"
              height="70"
              className="d-inline-block align-top me-2"
            />
          </Navbar.Brand>

          {/* Search Bar */}
          <Form className="d-flex me-auto" style={{ width: "300px" }}>
            <div className="input-group">
              <span className="input-group-text">
                <Search size={16} />
              </span>
              <Form.Control
                type="search"
                placeholder="Search..."
                aria-label="Search"
              />
            </div>
          </Form>

          {/* Right Side Icons and Dropdown */}
          <Nav className="ms-auto align-items-center gap-3">
            {/* Theme Toggle Button */}
            <Button variant="light" onClick={toggleTheme}>
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </Button>

            {/* Notification Bell */}
            <Button className="btn btn-light" onClick={handleBellClick}>
              <div className="d-flex align-items-center">
                <Bell size={20} />
                {notificationCount > 0 && (
                  <Badge pill bg="danger" className="ms-2">
                    {notificationCount}
                  </Badge>
                )}
              </div>
            </Button>

            {/* Avatar Dropdown */}
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="light"
                id="dropdown-avatar"
                className="p-0"
                style={{ border: "none", boxShadow: "none" }}
              >
                <Avatar
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                  fallback="SC"
                  size={32}
                />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Header>Main</Dropdown.Header>
                <Dropdown.Item onClick={() => navigate("/profile")}>
                  <Users size={16} className="me-2" />
                  Profile
                </Dropdown.Item>

                <Dropdown.Item onClick={() => navigate("/auth")}>
                  <Home size={16} className="me-2" />
                  Login
                </Dropdown.Item>

                <Dropdown.Divider />

                <Dropdown.Item onClick={handleLogout} style={{ color: "red" }}>
                  <CreditCard size={16} className="me-2" />
                  Log out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Container>
      </Navbar>
      <ToastContainer />
    </>
  );
}
