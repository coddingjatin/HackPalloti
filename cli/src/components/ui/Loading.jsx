import "bootstrap/dist/css/bootstrap.min.css";

function Loading() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center w-100 mt-5">
      {/* Title */}
      <h1 className="fs-3 fw-bold text-center text-dark">Getting Resources</h1>

      {/* Animated Loading Bar */}
      <div className="progress w-75 mt-3">
        <div
          className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
          role="progressbar"
          style={{ width: "100%" }}
        ></div>
      </div>

      {/* Additional Information */}
      <div className="text-center mt-3">
        <p className="text-secondary">Do not refresh the page</p>
        <p className="text-secondary">
          This usually takes a while (around 30 seconds), but may take up to 2 minutes.
        </p>
      </div>
    </div>
  );
}

export default Loading;
