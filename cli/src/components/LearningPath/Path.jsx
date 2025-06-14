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
    <main className="container-fluid mt-5">
      <div className="d-flex flex-column align-items-center justify-content-center">
        <h1 className="text-center text-dark fw-bold mb-4">
          Tell us what you know
        </h1>

        <div className="col-md-6">
          {/* Language Input */}
          <label className="form-label fw-semibold">What languages do you know?</label>
          <input
            ref={languageInputRef}
            type="text"
            className="form-control"
            placeholder="Separated by comma (e.g. Python, JavaScript, C++)"
          />

          {/* Framework Input */}
          <label className="form-label fw-semibold mt-4">
            What frameworks/libraries do you know? <i className="fw-normal">(if any)</i>
          </label>
          <input
            ref={frameworkInputRef}
            type="text"
            className="form-control"
            placeholder="Separated by comma (e.g. React, Django, Node.js)"
          />
        </div>

        {/* Buttons */}
        <div className="mt-4">
          <button
            onClick={handleClick}
            className="btn btn-dark px-4 py-2 fw-bold me-2"
          >
            Get Project Idea
          </button>
        </div>
      </div>
    </main>
  );
}
