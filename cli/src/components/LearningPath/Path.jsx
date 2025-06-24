import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Path() {
  const navigate = useNavigate();
  const languageInputRef = useRef(null);
  const frameworkInputRef = useRef(null);

  function handleClick() {
    sessionStorage.setItem(
      "userKnowledge",
      JSON.stringify({
        lang: languageInputRef.current?.value,
        framework: frameworkInputRef.current?.value,
      })
    );

    navigate("/projects");
  }

  return (
    <main className="container-fluid d-flex align-items-center justify-content-center vh-100" style={{ background: "linear-gradient(135deg, #f7fbff, #eaf6ff)" }}>
      <div style={{
        backgroundColor: "#fff",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "500px"
      }}>
        <h1 className="text-center text-dark fw-bold mb-4">
          Tell us what you know
        </h1>

        {/* Language Input */}
        <label className="form-label fw-semibold">What languages do you know?</label>
        <input
          ref={languageInputRef}
          type="text"
          className="form-control mb-3"
          placeholder="Separated by comma (e.g. Python, JavaScript, C++)"
          style={{
            borderRadius: "6px",
            border: "1px solid #b3d9f7",
            padding: "10px"
          }}
        />

        {/* Framework Input */}
        <label className="form-label fw-semibold mt-3">
          What frameworks/libraries do you know? <i className="fw-normal">(if any)</i>
        </label>
        <input
          ref={frameworkInputRef}
          type="text"
          className="form-control"
          placeholder="Separated by comma (e.g. React, Django, Node.js)"
          style={{
            borderRadius: "6px",
            border: "1px solid #b3d9f7",
            padding: "10px"
          }}
        />

        {/* Buttons */}
        <div className="text-center mt-4">
          <button
            onClick={handleClick}
            className="btn"
            style={{
              backgroundColor: "#007acc",
              color: "#fff",
              padding: "10px 30px",
              borderRadius: "6px",
              fontWeight: "bold",
              transition: "background-color 0.3s",
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = "#3399ff"}
            onMouseOut={e => e.currentTarget.style.backgroundColor = "#007acc"}
          >
            Get Project Idea
          </button>
        </div>
      </div>
    </main>
  );
}
