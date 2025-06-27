import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { XOctagon, Slash, BarChart, Activity } from "react-feather";

const PricingSection = () => {
  const problems = [
    {
      title: "Static Content",
      description: "One-way passive learning. No emotional depth or interactive feedback.",
      icon: <XOctagon size={36} style={{ color: "#dc3545" }} />,
    },
    {
      title: "No Personalized Feedback",
      description: "Everyone sees the same content. No customization for your unique pace or style.",
      icon: <Slash size={36} style={{ color: "#0d6efd" }} />,
    },
    {
      title: "Low Engagement, High Dropout",
      description: "Boring delivery leads to low motivation, poor retention, and high dropout rates.",
      icon: <BarChart size={36} style={{ color: "#ffc107" }} />,
    },
    {
      title: "One-Size-Fits-All",
      description: "Doesn't adapt to mood, learning style, or user emotions. Just generic delivery.",
      icon: <Activity size={36} style={{ color: "#0dcaf0" }} />,
    },
  ];

  return (
    <section style={styles.problemSection}>
      {/* Embedded CSS Styles */}
      <style>{`
        .problem-card {
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(8px);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .problem-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }
      `}</style>

      <Container>
        <div className="text-center mb-5">
          <h6 className="fw-bold text-dark" style={{ fontSize: "1.8rem" }}>
  Why Traditional Learning Fails?
</h6>
          <p className="lead text-muted">
            Here’s why old-school platforms fail to keep learners motivated and connected.
          </p>
        </div>

        <Row className="g-4">
          {problems.map((item, index) => (
            <Col key={index} md={6} lg={6}>
              <Card className="problem-card h-100 shadow-sm border-0 p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  {item.icon}
                  <h5 className="fw-bold mb-0">{item.title}</h5>
                </div>
                <p className="text-muted mb-0">{item.description}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

const styles = {
  problemSection: {
    background: "linear-gradient(to right, #f0f4ff, #fefefe)",
    padding: "5rem 0",
  },
};

export default PricingSection;
