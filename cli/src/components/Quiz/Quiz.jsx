import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./quiz.css";

const Quiz = () => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [learningStyle, setLearningStyle] = useState("");
  const [timeCommitment, setTimeCommitment] = useState("");
  const [domainInterest, setDomainInterest] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [quizId, setQuizId] = useState(null);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();

  const handleFetchQuestions = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic before fetching questions.");
      return;
    }
    if (!difficulty) {
      alert("Please select a difficulty level.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/quiz/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `Quiz on ${topic}`,
          topic,
          domain: domainInterest,
          difficulty,
          tags: [learningStyle, timeCommitment],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate quiz");
      }

      const data = await response.json();
      const processedQuestions = data.quiz.questions.map((q) => ({
        ...q,
        options: q.options.map((opt, index) => ({
          id: String.fromCharCode(65 + index),
          text: opt,
        })),
      }));

      setQuizId(data.quiz._id);
      setQuestions(processedQuestions);
      setCurrentQuestion(0);
      setScore(null);
      setSubmitted(false);
      setSelectedAnswers({});
    } catch (error) {
      alert("Error fetching quiz. Try again.");
      console.error(error);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    const unanswered = questions.some((q, index) => !selectedAnswers[index]);
    if (unanswered) {
      alert("Please answer all questions before submitting.");
      return;
    }

    try {
      let answers = [];
      for (let i = 0; i < questions.length; i++) {
        answers.push(
          questions[i].options
            .find((opt) => opt.id === selectedAnswers[i])
            .text.split(")")[0]
            .trim()
        );
      }

      const response = await fetch("http://localhost:5000/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          quizId: quizId,
          answers,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit quiz");
      }

      const data = await response.json();
      setScore(data.attempt.score);
      setAnswers(data.attempt.answers);
      setSubmitted(true);
    } catch (error) {
      alert("Error submitting quiz. Try again.");
      console.error(error);
    }
  };

  const handleSelect = (optionId) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestion]: optionId }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleReattempt = () => {
    setTopic("");
    setDifficulty("");
    setLearningStyle("");
    setTimeCommitment("");
    setDomainInterest("");
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setScore(null);
    setSubmitted(false);
  };

  const handleContinue = () => {
    navigate("/home");
  };

  return (
    <div className="quiz-container">
      {!submitted ? (
        <>
          {!questions.length && (
            <div className="setup-section">
              <h1>Tell About Yourself?</h1>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a topic's which you know ..."
                className="input-fields"
                required
              />
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="input-fields"
                required
              >
                <option value="">Select Difficulty</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <select
                value={learningStyle}
                onChange={(e) => setLearningStyle(e.target.value)}
                className="input-fields"
                required
              >
                <option value="">Select Learning Style</option>
                <option value="Visual">Visual</option>
                <option value="Auditory">Auditory</option>
                <option value="Kinesthetic">Kinesthetic</option>
              </select>
              <select
                value={timeCommitment}
                onChange={(e) => setTimeCommitment(e.target.value)}
                className="input-fields"
                required
              >
                <option value="">
                  How many hours per week can you dedicate?
                </option>
                <option value="1">Less than 2 hours</option>
                <option value="3">2-5 hours</option>
                <option value="7">5-10 hours</option>
                <option value="10">More than 10 hours</option>
              </select>
              <select
                value={domainInterest}
                onChange={(e) => setDomainInterest(e.target.value)}
                className="input-fields"
                required
              >
                <option value="">What is your primary goal?</option>
                <option value="job_interview">Career advancement</option>
                <option value="learning">Personal projects and hobbies</option>
                <option value="academic">Academic requirements</option>
                <option value="startup">Entrepreneurship</option>
              </select>
              <button
                onClick={handleFetchQuestions}
                disabled={loading}
                className="btns"
              >
                {loading ? "Generating ..." : "Submit"}
              </button>
              <p onClick={() => navigate("/home")} className="skip-link">
                Want to skip?
              </p>
            </div>
          )}
          {questions.length > 0 && (
            <div className="question-card">
              <div className="question-header">
                <h3>
                  {currentQuestion + 1}) {questions[currentQuestion]?.question}
                </h3>
                <p>
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>
              <div className="options-list">
                {questions[currentQuestion]?.options.map((option) => (
                  <label key={option.id} className="option-label">
                    <input
                      type="radio"
                      name={`question-${currentQuestion}`}
                      value={option.id}
                      checked={selectedAnswers[currentQuestion] === option.id}
                      onChange={() => handleSelect(option.id)}
                      required
                    />
                    <span className="option-text">{option.text}</span>
                  </label>
                ))}
              </div>
              <div className="nav-buttons">
                <button
                  onClick={handlePrev}
                  disabled={currentQuestion === 0}
                  className="btns"
                >
                  Previous
                </button>
                {currentQuestion < questions.length - 1 && (
                  <button onClick={handleNext} className="btns">
                    Next
                  </button>
                )}
                {currentQuestion === questions.length - 1 && (
                  <button onClick={handleSubmit} className="btns submit-btns">
                    Submit Answers
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="results-section">
          <h2>
            Your Score: <span className="score">{score}</span> /{" "}
            {questions.length}
          </h2>
          <h3>Review Your Answers:</h3>
          <div className="reviews">
            {answers.map((answer, index) => {
              const isCorrect = answer.answer === answer.question.correctOption;
              return (
                <div
                  key={index}
                  className={`review-card ${
                    isCorrect ? "correct" : "incorrect"
                  }`}
                >
                  <h4>{`${index + 1}) ${answer.question.question}`}</h4>
                  <p>
                    <strong>Correct Answer:</strong>{" "}
                    {answer.question.correctOption}
                  </p>
                  <p>
                    <strong>Your Answer:</strong> {answer.answer}
                  </p>
                  <p className="explanation">
                    <strong>Explanation:</strong> {answer.question.explanation}
                  </p>
                  {isCorrect ? (
                    <p className="status correct-status">✅ Correct</p>
                  ) : (
                    <p className="status incorrect-status">❌ Incorrect</p>
                  )}
                </div>
              );
            })}
          </div>
          <div className="result-buttons">
            <button onClick={handleReattempt} className="btns reattempt-btn">
              Reattempt
            </button>
            <button onClick={handleContinue} className="btns continue-btn">
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
