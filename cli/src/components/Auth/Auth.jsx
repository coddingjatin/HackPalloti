import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Auth = () => {
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    newPassword: "",
    resetCode: "",
  });
  const [resetRequested, setResetRequested] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!resetRequested) {
      try {
        const response = await fetch(
          "http://localhost:5000/api/users/forgot-password",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formData.email }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          setResetRequested(true);
          alert("If an account exists with this email, you will receive a reset code.");
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert("Error connecting to the server");
        console.error(error);
      }
    } else {
      try {
        const response = await fetch(
          "http://localhost:5000/api/users/reset-password",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: formData.email,
              resetCode: formData.resetCode,
              newPassword: formData.newPassword,
            }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          alert("Password reset successful!");
          setMode("login");
          setResetRequested(false);
          setFormData({ ...formData, resetCode: "", newPassword: "" });
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert("Error connecting to the server");
        console.error(error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint =
      mode === "register"
        ? "http://localhost:5000/api/users/register"
        : "http://localhost:5000/api/users/login";

    const payload =
      mode === "register"
        ? {
            name: formData.username,
            email: formData.email,
            password: formData.password,
          }
        : {
            email: formData.email,
            password: formData.password,
          };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        if (mode === "login") {
          localStorage.setItem("token", data.token);
          localStorage.setItem("name", data.data.name);
          localStorage.setItem("email", data.data.email);
          localStorage.setItem("userId", data.data._id);
          localStorage.setItem("user", JSON.stringify(data.data));

          if (data.data.isAssessmentComplete) {
            navigate("/quiz");
          } else {
            navigate("/survey");
          }
        } else {
          alert("Registration successful! Please login.");
          setMode("login");
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error connecting to the server");
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-header">
          <img src="/logo2.jpg" alt="logo" className="auth-logo" />
          <h2>Welcome back!</h2>
          <p>Make learning easy, effective and engaging.</p>
        </div>

        <form onSubmit={mode === "forgot" ? handleForgotPassword : handleSubmit}>
          {mode === "register" && (
            <div className="form-group">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {(mode !== "forgot") && (
            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {mode === "forgot" && (
            <>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              {resetRequested && (
                <>
                  <div className="form-group">
                    <input
                      type="text"
                      name="resetCode"
                      placeholder="Reset Code"
                      value={formData.resetCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="New Password"
                      value={formData.newPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}
            </>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {mode === "register"
                ? "Register"
                : mode === "forgot"
                ? resetRequested
                  ? "Reset Password"
                  : "Request Reset Code"
                : "Log in"}
            </button>
          </div>

          {mode !== "forgot" && (
            <div className="form-links">
              <span onClick={() => setMode("forgot")}>Forgot your password?</span>
            </div>
          )}

          <div className="form-links bottom-link">
            {mode === "register" ? (
              <span onClick={() => setMode("login")}>Already have an account? Log in</span>
            ) : (
              <span onClick={() => setMode("register")}>Don't have an account? Register here</span>
            )}
          </div>
        </form>
      </div>

      <div className="auth-right">
        <div className="auth-art"></div>
      </div>
    </div>
  );
};

export default Auth;
