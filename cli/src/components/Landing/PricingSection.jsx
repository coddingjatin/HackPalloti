import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState("annual");

  const plans = [
    {
      title: "Basic",
      price: billingCycle === "annual" ? "₹3000" : "₹299",
      features: ["3 Projects", "250 objects per project", "One Active User", "No Collaboration", "Basic Support"],
      highlighted: false,
    },
    {
      title: "Professional",
      price: billingCycle === "annual" ? "₹4000" : "₹399",
      features: [
        "20 Projects",
        "800 objects per project",
        "10 Active Users",
        "Team Collaboration",
        "Priority Support",
      ],
      highlighted: true,
    },
    {
      title: "Enterprise",
      price: billingCycle === "annual" ? "₹5500" : "₹450",
      features: [
        "Unlimited Projects",
        "No object limit",
        "Unlimited Users",
        "Team Collaboration",
        "Top Priority Support",
      ],
      highlighted: false,
    },
  ];

  return (
    <section className="py-5 bg-light">
      {/* Top Banner */}
      <div
        className="text-center py-5 text-white"
        style={{
          background: "linear-gradient(90deg, rgb(111, 52, 173) 0%, rgba(37, 116, 252, 0.86) 100%)",
          borderRadius: "20px",
          marginBottom: "2rem",
          maxWidth: "900px",
          marginInline: "auto",
        }}
      >
        <h2 className="fw-bold mb-2">Choose Your Plan</h2>
        <p className="mb-0">Unlock premium features to boost productivity and streamline your workflow.</p>
        <p className="mb-3">Choose the plan that suits you best!</p>

        {/* Toggle Switch */}
        <div className="d-flex justify-content-center align-items-center gap-3">
          <span className="text-white">Monthly billing</span>
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "30px",
              padding: "5px 8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              onClick={() => setBillingCycle("monthly")}
              style={{
                backgroundColor: billingCycle === "monthly" ? "#6a11cb" : "transparent",
                color: billingCycle === "monthly" ? "#fff" : "#6a11cb",
                padding: "5px 10px",
                borderRadius: "20px",
                fontWeight: "600",
              }}
            >
              Monthly
            </span>
            <span
              onClick={() => setBillingCycle("annual")}
              style={{
                backgroundColor: billingCycle === "annual" ? "#6a11cb" : "transparent",
                color: billingCycle === "annual" ? "#fff" : "#6a11cb",
                padding: "5px 10px",
                borderRadius: "20px",
                fontWeight: "600",
              }}
            >
              Annual
            </span>
          </div>
          <span className="badge text-bg-warning" style={{ borderRadius: "20px", fontSize: "0.8rem" }}>
            Save up to 20%!
          </span>
        </div>
      </div>

      {/* Cards */}
      <Container>
        <Row className="justify-content-center">
          {plans.map((plan, index) => (
            <Col key={index} md={4} className="mb-4">
              <Card
                className={`h-100 text-center shadow-sm ${
                  plan.highlighted ? "border border-warning" : ""
                }`}
                style={{
                  borderRadius: "20px",
                  transform: plan.highlighted ? "scale(1.05)" : "scale(1)",
                  zIndex: plan.highlighted ? 1 : 0,
                  border: "1px solid rgba(0, 0, 0, 0.1)", // Light black border
                }}
              >
                <Card.Body className="px-4 py-5">
                  <Card.Title className="fw-bold text-uppercase mb-2">{plan.title}</Card.Title>
                  <h2 className="fw-bold mb-4">{plan.price}</h2>
                  {plan.features.map((feature, i) => (
                    <p key={i} className="text-muted mb-2">
                      {feature}
                    </p>
                  ))}
                  <Button
                    variant={plan.highlighted ? "warning" : "outline-dark"}
                    className="mt-4 fw-semibold rounded-pill px-4"
                  >
                    Choose this plan
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default PricingSection;
