import "bootstrap/dist/css/bootstrap.min.css";

function Error({ message }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center w-100 mt-5">
      {/* Error Title */}
      <h1 className="fs-3 fw-bold text-dark">There was an error ‼️</h1>

      {/* Error Message */}
      <p className="text-secondary">{message || "Try to search again"}</p>

      {/* Retry Button */}
      <button
        className="btn btn-dark px-4 py-2 fw-bold mt-3"
        onClick={() => window.location.reload()}
      >
        Try Again
      </button>

      {/* Console Info */}
      <p className="text-secondary mt-3">
        For more information, open the console. (⌘ + ⌥ + I)
      </p>
    </div>
  );
}

export default Error;
