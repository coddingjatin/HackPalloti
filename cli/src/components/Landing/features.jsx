import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Laptop2, Brain, Globe2 } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Laptop2 size={40} />,
      title: "Learn Anywhere",
      description:
        "Access your personalized learning path from any device, anytime. Enjoy a seamless experience with our responsive platform.",
    },
    {
      icon: <Brain size={40} />,
      title: "AI-Powered Learning",
      description:
        "Advanced AI algorithms tailor learning paths based on your progress and style, ensuring efficient and effective learning.",
    },
    {
      icon: <Globe2 size={40} />,
      title: "Global Community",
      description:
        "Join a worldwide community of learners. Share experiences, exchange ideas, and grow together.",
    },
  ];

  return (
    <section className="bg-none mb-2">
      <div className="text-center mb-4">
        <h2 className="fw-bold d-inline-block mb-2">
          Why Choose Our <span className="text-primary">AI Platform?</span>
        </h2>
        <br />
        <p
          className="text-muted d-inline-block mb-0"
          style={{ marginLeft: "10px" }}
        >
          Experience the power of AI-driven learning and connect with a global
          network of learners.
        </p>
      </div>
      <br />
      <>
        <Row className=" justify-content-center">
          {features.map((feature, index) => (
            <Col key={index} md={4} className="d-flex justify-content-center">
              <Card className="h-100 border-0 shadow-sm p-3 rounded-3">
                <Card.Body className="text-center p-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 p-3 rounded-circle mb-3"
                    style={{ width: "80px", height: "80px" }}
                  >
                    {feature.icon}
                  </div>
                  <h4 className="fw-bold mb-3">{feature.title}</h4>
                  <p className="text-muted">{feature.description}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </>
    </section>
  );
};

export default FeaturesSection;
