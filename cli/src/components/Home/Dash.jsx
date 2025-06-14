import React, { useEffect, useState } from "react";
import { Card, Button, ProgressBar, Modal, Row, Col } from "react-bootstrap";
import { StatsCard } from "./StatsCard";
import {
  BarChart3,
  Users,
  Package,
  DollarSign,
  MoreVertical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
function Dash() {
  const [userCount, setUserCount] = useState(0);
  const [quizResults, setQuizResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [allQuizzes, setAllQuizzes] = useState([]);
  // const [userId, setUserId] = useState(localStorage.getItem("userId"));
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
    // Fetch user count
    fetch("http://localhost:5000/api/users/user-count")
      .then((response) => response.json())
      .then((data) => setUserCount(data.data))
      .catch((error) => console.error("Failed to fetch user count:", error));

    // Fetch quiz results
    if (userId) {
      fetch(`http://localhost:5000/api/quiz/quiz-results/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setQuizResults(data.quizResults);
        })
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

    // Calculate attempted quizzes count
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

  // Determine progress percentage
  const progressPercentage =
    quizResults.length > 0
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

  return (
    <div className="container-fluid ps-3">
      <main className="p-5">
        <div className="row g-4 mb-4">
          <div className="col-md-6 col-xl-3">
            <StatsCard
              title="Users"
              value={userCount}
              icon={Users}
              color="green"
            />
          </div>
          <div className="col-md-6 col-xl-3">
            <StatsCard
              title="Attempted Quiz"
              value={attemptedQuizzes}
              icon={Package}
              color="yellow"
            />
          </div>
          <div className="col-md-6 col-xl-3">
            <StatsCard
              title="Highest Score"
              value={highestScore + `/10`}
              icon={DollarSign}
              color="blue"
            />
          </div>
        </div>

        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="h4 mb-2">
                  Congratulations {localStorage.getItem("name")} 🎉
                </h2>
                <p className="text-muted mb-3">Best scholar of the month</p>
                <div className="col-md-5 col-xl-6 p-1 mb-2">
                  <StatsCard
                    title="Progress"
                    value={averageScore}
                    icon={BarChart3}
                    color="purple"
                  />
                </div>
                <Button
                  onClick={() => navigate("/reports")}
                  variant="btn btn-dark m-1"
                >
                  View Report
                </Button>
              </div>
              <div className="col-3">
                <img src="/trophy.png" alt="Trophy" className="img-fluid" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h5 mb-0">Statistics Card</h2>
              <Button
                variant="outline-secondary"
                className="rounded-circle p-2"
              >
                <MoreVertical className="w-4 h-4" />
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
                <ProgressBar
                  now={progressPercentage}
                  variant="success"
                  className="rounded-pill"
                />
              </div>
            </div>
          </Card.Body>
        </Card>

        {allQuizzes.length > 0 && (
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h2 className="h5 mb-4">Attempted Quiz</h2>
              <Row>
                {allQuizzes.map((result, index) => (
                  <Col key={index} md={3} className="mb-4">
                    <Card>
                      <Card.Body>
                        <p className="text-muted small mb-1">
                          Topic: {result.topic || "N/A"}
                        </p>
                        <p className="text-muted small mb-1">
                          Score: {result.attempts[0].score}
                        </p>
                        <p className="text-muted small mb-1">
                          Date Taken:{" "}
                          {new Date(result.attempts[0].dateAttempted).toLocaleDateString()}
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

        {/* Modal for displaying quiz details */}
        <Modal show={showModal} onHide={handleCloseModal} centered>
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
                  {new Date(selectedQuiz.attempts[0].dateAttempted).toLocaleDateString()}
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
