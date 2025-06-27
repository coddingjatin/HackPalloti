import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { UserPlus, Smile, BookOpen } from "react-feather";

const steps = [
  {
    title: "Sign Up & Set Goals",
    description: "Create your profile and set your learning goals in just a few clicks.",
    icon: <UserPlus size={40} color="#0d6efd" />,
  },
  {
    title: "AI Understands You",
    description: "Our AI companion analyzes your learning patern and suggests roadmaps in real-time.",
    icon: <Smile size={40} color="#ffc107" />,
  },
  {
    title: "Start Adaptive Learning",
    description: "Get personalized, gamified content tailored just for you!",
    icon: <BookOpen size={40} color="#28a745" />,
  },
];

const HowItWorks = () => {
  return (
    <section style={styles.section}>
      {/* Embedded Style */}
      <style>{`
        .how-step-card {
          border-radius: 20px;
          background: white;
          border: none;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .how-step-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .step-icon {
          width: 60px;
          height: 60px;
          background: #f0f4ff;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          margin-bottom: 1rem;
        }
      `}</style>

      <Container>
        <div className="text-center mb-5">
          <h6 className="fw-bold text-dark" style={{ fontSize: "1.8rem" }}>
            How It Works
            </h6>
          <p className="lead text-muted">Just 3 steps to start your personalized learning journey</p>
        </div>

        <Row className="g-4">
          {steps.map((step, index) => (
            <Col key={index} md={4}>
              <Card className="text-center p-4 how-step-card h-100">
                <div className="step-icon mx-auto">{step.icon}</div>
                <h5 className="fw-semibold">{step.title}</h5>
                <p className="text-muted">{step.description}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

const styles = {
  section: {
    background: "linear-gradient(to right, #fefefe, #f0f4ff)",
    padding: "5rem 0",
  },
};

export default HowItWorks;
