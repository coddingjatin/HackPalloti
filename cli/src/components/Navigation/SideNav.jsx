"use client";

import React from "react";
import {
  BarChart3,
  Settings,
  FileText,
  Mail,
  Calendar,
  HelpCircle,
  Shield,
  Home,
  CreditCard,
  PieChart,
  MessageCircleMore,
  Lightbulb,
  Zap
} from "lucide-react";

import { Nav, Navbar, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const mainNavItems = [
  { icon: Home, label: "Overview", href: "/home" },
  // { icon: BarChart3, label: "RoadMap", href: "/tree" },
  { icon: CreditCard, label: "Project Idea", href: "/path" },
  { icon: PieChart, label: "Reports", href: "/reports" },
  { icon: Lightbulb, label: "Test", href: "/test" },
  { icon: Mail, label: "PictoFlow", href: "/pictoflow" },
  { icon: Zap, label: "Streaks", href: "/streaks" },  // <-- Added Streaks here
  { icon: FileText, label: "WorkFlow", href: "/workflow" },
];

const resourcesNavItems = [
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: MessageCircleMore, label: "Collaboration", href: "/meet" },
];

const settingsNavItems = [
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: HelpCircle, label: "Help Center", href: "/help" },
  { icon: Shield, label: "Security", href: "/security" },
];

export function SideNav() {
  return (
    <Navbar bg="light" expand="lg" className="flex-column align-items-start h-100">
      <Container fluid>
        <Navbar.Brand href="#">
          {/* Brand logo or title here if needed */}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="flex-column w-100">
            <Nav.Item className="mb-2">
              <Nav.Link disabled className="text-uppercase fw-bold">
                Main
              </Nav.Link>
            </Nav.Item>
            {mainNavItems.map((item) => (
              <Nav.Item key={item.href}>
                <Link to={item.href} className="nav-link">
                  <item.icon className="h-5 w-5 me-2" />
                  {item.label}
                </Link>
              </Nav.Item>
            ))}

            <Nav.Item className="mb-2 mt-3">
              <Nav.Link disabled className="text-uppercase fw-bold">
                Resources
              </Nav.Link>
            </Nav.Item>
            {resourcesNavItems.map((item) => (
              <Nav.Item key={item.href}>
                <Link to={item.href} className="nav-link">
                  <item.icon className="h-5 w-5 me-2" />
                  {item.label}
                </Link>
              </Nav.Item>
            ))}

            <Nav.Item className="mb-2 mt-3">
              <Nav.Link disabled className="text-uppercase fw-bold">
                Settings
              </Nav.Link>
            </Nav.Item>
            {settingsNavItems.map((item) => (
              <Nav.Item key={item.href}>
                <Link to={item.href} className="nav-link">
                  <item.icon className="h-5 w-5 me-2" />
                  {item.label}
                </Link>
              </Nav.Item>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
