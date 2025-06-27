import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import React from "react";
import "./Navbar.css";
import logo from '/logo.jpg';
const Navbar = () => {
  return (
    <nav className="custom-navbar">
      <div className="nav-logo">
        <img src={logo} alt="Logo" />
        <span><b>SmartPath Buddy</b></span>
      </div>
      <div className="nav-links">
        <a href="#features">Features</a>
        <a href="#pricing">About</a>
        <a href="#contact">Contact</a>
        <a href="/auth" className="nav-login-btn">Login</a>
      </div>
    </nav>
    
  );
};

export default Navbar;