import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import {
  Laptop2,
  Brain,
  Globe2,
  Gamepad2,
  Compass,
  BadgeCheck,
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Laptop2 size={28} color="#ff9800" />,
      title: "Learn Anywhere",
      description:
        "Access your personalized learning path from any device, anytime. Seamless experience, mobile-ready.",
      bg: "#fff3e0",
    },
    {
      icon: <Brain size={28} color="#673ab7" />,
      title: "AI-Powered Insights",
      description:
        "Adaptive learning paths using AI based on your strengths, weaknesses, and goals.",
      bg: "#ede7f6",
    },
    {
      icon: <Gamepad2 size={28} color="#e91e63" />,
      title: "Gamified Progress",
      description:
        "Earn XP, streaks, and badges as you complete learning quests in a fun, rewarding way.",
      bg: "#fce4ec",
    },
    {
      icon: <Compass size={28} color="#3f51b5" />,
      title: "Personalized Path",
      description:
        "Your journey, your way. Get custom paths based on role, level, and learning speed.",
      bg: "#e8eaf6",
    },
    {
      icon: <BadgeCheck size={28} color="#4caf50" />,
      title: "Track Achievements",
      description:
        "Stay motivated by unlocking badges, tracking progress, and building learning streaks.",
      bg: "#e8f5e9",
    },
    {
      icon: <Globe2 size={28} color="#03a9f4" />,
      title: "Global Learners Hub",
      description:
        "Join a community of peers, share achievements, and grow with a global learning tribe.",
      bg: "#e1f5fe",
    },
  ];

  return (
    <section className="py-5 bg-white">
      <div className="text-center mb-5 px-3">
      <h2
        className="fw-bold mb-3"
        style={{ fontSize: "1.8rem" }}
      >
        Why Choose Our <span className="text-primary">SmartPath Buddy?</span>
      </h2>
        <p className="text-muted mb-0">
          Personalized, gamified, and AI-driven – everything you need to thrive and enjoy learning.
        </p>
      </div>

      <Row className="gx-4 gy-4 justify-content-center mx-0 px-2">
        {features.map((feature, index) => (
          <Col
            key={index}
            xs={12}
            sm={6}
            lg={4}
            className="d-flex justify-content-center"
          >
            <Card
              className="rounded-4 px-4 py-4 h-100"
              style={{
                maxWidth: "420px",
                minHeight: "200px",
                border: "1px solid #e0e0e0",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="d-flex align-items-start gap-3">
                <div
                  className="rounded-4 d-flex align-items-center justify-content-center"
                  style={{
                    width: "52px",
                    height: "52px",
                    backgroundColor: feature.bg,
                    flexShrink: 0,
                  }}
                >
                  {feature.icon}
                </div>
                <div>
                  <h5 className="fw-bold mb-2">{feature.title}</h5>
                  <p className="text-muted mb-0" style={{ fontSize: "0.96rem" }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default FeaturesSection;
