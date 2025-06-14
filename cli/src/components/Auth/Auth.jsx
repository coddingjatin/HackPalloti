import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Auth.css";

const Auth = () => {
  const [mode, setMode] = useState("login"); // "login", "register", or "forgot"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    api: "",
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
      // Request reset code
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
          alert(
            "If an account exists with this email, you will receive a reset code."
          );
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert("Error connecting to the server");
        console.error(error);
      }
    } else {
      // Reset password with code
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
          localStorage.setItem('email', data.data.email);
          localStorage.setItem("userId", data.data._id);
          localStorage.setItem("user", JSON.stringify(data.data));

          if(data.data.isAssessmentComplete) {
            navigate('/quiz');
          }else {
            navigate('/survey');
          }
        } else {
          setMode("login");
          alert("Registration successful! Please login.");
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error connecting to the server");
      console.error(error);
    }
  };

  const renderForgotPasswordForm = () => (
    <form onSubmit={handleForgotPassword}>
      <div className="mb-3">
        <label className="form-label">Email address</label>
        <input
          type="email"
          className="form-control"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      {resetRequested && (
        <>
          <div className="mb-3">
            <label className="form-label">Reset Code</label>
            <input
              type="text"
              className="form-control"
              name="resetCode"
              value={formData.resetCode}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </div>
        </>
      )}

      <button type="submit" className="btn btn-primary w-100">
        {resetRequested ? "Reset Password" : "Request Reset Code"}
      </button>

      <p className="text-center mt-3">
        <span
          className="toggle-text"
          onClick={() => {
            setMode("login");
            setResetRequested(false);
          }}
        >
          Back to Login
        </span>
      </p>
    </form>
  );

  const renderAuthForm = () => (
    <form onSubmit={handleSubmit}>
      {mode === "register" && (
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Email address</label>
        <input
          type="email"
          className="form-control"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-control"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      {mode === "register"}

      <button type="submit" className="btn btn-primary w-100">
        {mode === "register" ? "Register" : "Login"}
      </button>

      <p className="text-center mt-3">
        {mode === "register"
          ? "Already have an account?"
          : "Don't have an account?"}{" "}
        <span
          className="toggle-text"
          onClick={() => setMode(mode === "register" ? "login" : "register")}
        >
          {mode === "register" ? "Login" : "Register"}
        </span>
      </p>

      {mode === "login" && (
        <p className="text-center">
          <span className="toggle-text" onClick={() => setMode("forgot")}>
            Forgot Password?
          </span>
        </p>
      )}
    </form>
  );

  return (
    <div className="container d-flex justify-content-center align-items-center vw-100 vh-100">
      <div className="card auth-card shadow-lg p-4">
        <div className="row g-0">
          <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              alt="Auth"
              className="img-fluid auth-image"
            />
          </div>

          <div className="col-md-6 d-flex flex-column justify-content-center right">
            <h2 className="text-center mb-4">
              {mode === "forgot"
                ? "Reset Password"
                : mode === "register"
                ? "Register"
                : "Login"}
            </h2>

            {mode === "forgot" ? renderForgotPasswordForm() : renderAuthForm()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
