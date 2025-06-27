import React, { useEffect, useState } from "react";
import { Card, Button, ProgressBar, Modal, Row, Col } from "react-bootstrap";
import { StatsCard } from "./StatsCard";
import {
  BarChart3,
  Users,
  Package,
  MoreVertical,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Dash() {
  const [userCount, setUserCount] = useState(0);
  const [quizResults, setQuizResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [allQuizzes, setAllQuizzes] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:5000/api/quiz/user-quiz/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setAllQuizzes(data.quizzes))
        .catch((error) =>
          console.error("Failed to fetch quiz results:", error)
        );
    }
  }, [userId]);

  let navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/users/user-count")
      .then((response) => response.json())
      .then((data) => setUserCount(data.data))
      .catch((error) => console.error("Failed to fetch user count:", error));

    if (userId) {
      fetch(`http://localhost:5000/api/quiz/quiz-results/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setQuizResults(data.quizResults))
        .catch((error) =>
          console.error("Failed to fetch quiz results:", error)
        );
    }
  }, [userId]);

  const [attemptedQuizzes, setAttemptedQuizzes] = useState(0);
  const [highestScore, setHighestScore] = useState("N/A");
  const [averageScore, setAverageScore] = useState("N/A");

  useEffect(() => {
    let allAttempts = [];
    quizResults.forEach((result) => {
      allAttempts.push(...result);
    });

    setHighestScore(
      allAttempts.length > 0
        ? Math.max(...allAttempts.map((q) => q.score))
        : "N/A"
    );

    setAttemptedQuizzes(quizResults.length);

    setAverageScore(
      allAttempts.length > 0
        ? (
            allAttempts.reduce((sum, q) => sum + q.score, 0) /
            allAttempts.length
          ).toFixed(2)
        : "N/A"
    );
  }, [quizResults]);

  const progressPercentage =
    quizResults.length > 0 && highestScore !== "N/A"
      ? Math.min((averageScore / highestScore) * 100, 100)
      : 0;

  const handleViewQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedQuiz(null);
  };

  const highestScoreCardStyle = {
    borderRadius: "1rem",
    background: "linear-gradient(135deg, #d7f9ff, #ffffff)",
    color: "#004d40",
    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
    padding: "1rem",
    height: "130px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div
      className="container-fluid ps-3"
      style={{ backgroundColor: "#f9fbfc", minHeight: "100vh" }}
    >
      <main className="p-5">
        {/* Stats Section */}
        <div
          className="row g-4 mb-4"
          style={{
            background: "linear-gradient(145deg, #e0f7fa, #ffffff)",
            padding: "1rem",
            borderRadius: "1rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          {/* Users Card */}
          <div className="col-md-6 col-xl-3">
            <Card style={highestScoreCardStyle} className="shadow-sm border-0">
              <div className="d-flex justify-content-between align-items-center w-100 px-3">
                <div>
                  <h5 className="text-uppercase fw-bold">Users</h5>
                  <h2 className="fw-bold">{userCount}</h2>
                </div>
                <Users size={45} color="#004d40" />
              </div>
            </Card>
          </div>

          {/* Attempted Quiz Card */}
          <div className="col-md-6 col-xl-3">
            <Card style={highestScoreCardStyle} className="shadow-sm border-0">
              <div className="d-flex justify-content-between align-items-center w-100 px-3">
                <div>
                  <h5 className="text-uppercase fw-bold">Attempted Quiz</h5>
                  <h2 className="fw-bold">{attemptedQuizzes}</h2>
                </div>
                <Package size={45} color="#004d40" />
              </div>
            </Card>
          </div>

          {/* Highest Score Card */}
          <div className="col-md-6 col-xl-3">
            <Card
              className="shadow-sm border-0"
              style={highestScoreCardStyle}
            >
              <div className="d-flex justify-content-between align-items-center position-relative px-3">
                <div>
                  <h5 className="text-uppercase fw-bold">🏅Highest Score </h5>
                  <h2 className="fw-bold">{highestScore}/10</h2>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                 
                <Star size={42} color="#004d40" strokeWidth={2.5} />

                </div>

                {highestScore >= 9 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -12,
                      right: -12,
                      background: "#fff3cd",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "50%",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      color: "#856404",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    ⭐
                  </span>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Trophy Section */}
        <Card
          className="mb-4 shadow-sm border-0"
          style={{
            background: "linear-gradient(135deg, #e3f2fd, #ffffff)",
            borderRadius: "1rem",
          }}
        >
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div style={{ flex: 1, minWidth: 280 }}>
                <h1 className="h4 mb-2 text-primary">
                  Congratulations {localStorage.getItem("name")} 🎉
                </h1>
                <p className="text-muted mb-4">Best scholar of the month</p>

                {/* Progress Box */}
                <Card
                  style={{
                    background: "linear-gradient(135deg, #d7f9ff, #ffffff)",
                    borderRadius: "1rem",
                    padding: "1rem",
                    maxWidth: 300,
                    boxShadow: "0 4px 12px rgba(0, 77, 64, 0.15)",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <BarChart3 size={30} color="#004d40" />
                    <div>
                      <h5 className="mb-1 fw-bold text-uppercase" style={{color: '#004d40'}}>
                        Progress
                      </h5>
                      <p className="mb-0 fw-semibold" style={{ fontSize: '1.25rem', color: '#004d40' }}>
                        {averageScore} / 10
                      </p>
                    </div>
                  </div>
                </Card>

<Button
  onClick={() => navigate("/reports")}
  style={{
    background: "linear-gradient(90deg, #007BFF, #00C6FF)",
    border: "none",
    width: "197px", // 👈 fixed width
    padding: "6px 0",
    borderRadius: "50px",
    boxShadow: "0 3px 10px rgba(0, 123, 255, 0.2)",
    color: "#fff",
    fontWeight: "500",
    fontSize: "0.9rem",
    textAlign: "center",
    transition: "all 0.3s ease",
  }}
  onMouseEnter={(e) => {
    e.target.style.transform = "scale(1.03)";
  }}
  onMouseLeave={(e) => {
    e.target.style.transform = "scale(1)";
  }}
>
  View Report
</Button>



              </div>
              <div className="col-3 d-none d-md-block">
                <img src="/trophy.png" alt="Trophy" className="img-fluid" />
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Statistics Section */}
        <Card
          className="mb-4 border-0 shadow-sm"
          style={{
            background: "linear-gradient(135deg, #f0faff, #ffffff)",
            borderRadius: "1rem",
          }}
        >
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="h5 text-primary mb-0">📈 Statistics Overview</h1>
              <Button variant="light" className="rounded-circle shadow-sm">
                <MoreVertical className="w-4 h-4 text-muted" />
              </Button>
            </div>
            <div className="d-flex align-items-center gap-2 mb-3">
              <p className="text-muted small mb-0">Total 69.5% growth</p>
              <span className="text-success small">⬆ this month</span>
            </div>
            <div className="row g-4 mt-3">
              <div className="col-md-6 col-xl-3">
                <p className="text-muted small mb-1">Average Score</p>
                <h4 className="h5 mb-2">{averageScore}</h4>
                <div
                  style={{
                    backgroundColor: "#d7f9ff",
                    borderRadius: "20px",
                    padding: "8px",
                  }}
                >
                  <ProgressBar
                    now={progressPercentage}
                    variant="info"
                    style={{
                      height: "14px",
                      borderRadius: "20px",
                      backgroundColor: "#d7f9ff",
                      transition: "width 1s ease-in-out",
                    }}
                    animated
                    striped
                    label={`${progressPercentage.toFixed(0)}%`}
                  />
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Attempted Quizzes Section */}
        {allQuizzes.length > 0 && (
          <Card
            className="mb-4 border-0 shadow-sm"
            style={{
              background: "linear-gradient(135deg, #fce4ec, #ffffff)",
              borderRadius: "1rem",
            }}
          >
            <Card.Body>
              <h2 className="h5 mb-4">Attempted Quiz</h2>
              <Row>
                {allQuizzes.map((result, index) => (
                  <Col key={index} md={3} className="mb-4">
                    <Card className="shadow-sm">
                      <Card.Body>
                        <p className="text-muted small mb-1">
                          Topic: {result.topic || "N/A"}
                        </p>
                        <p className="text-muted small mb-1">
                          Score: {result.attempts[0].score}
                        </p>
                        <p className="text-muted small mb-1">
                          Date Taken:{" "}
                          {new Date(
                            result.attempts[0].dateAttempted
                          ).toLocaleDateString()}
                        </p>
                        <Button
                          variant="btn btn-dark"
                          onClick={() => handleViewQuiz(result)}
                        >
                          View
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        )}

        {/* Quiz Detail Modal */}
        <Modal
          show={showModal}
          onHide={handleCloseModal}
          centered
          contentClassName="border-0 rounded-4 shadow-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Quiz Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedQuiz && (
              <>
                <p>
                  <strong>Topic:</strong> {selectedQuiz.topic || "N/A"}
                </p>
                <p>
                  <strong>Score:</strong> {selectedQuiz.attempts[0].score}
                </p>
                <p>
                  <strong>Date Taken:</strong>{" "}
                  {new Date(
                    selectedQuiz.attempts[0].dateAttempted
                  ).toLocaleDateString()}
                </p>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </main>
    </div>
  );
}

export default Dash;