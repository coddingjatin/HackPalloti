import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const PricingSection = () => {
  const pricingPlans = [
    {
      title: "Basic Plan",
      price: "$19/month",
      features: ["1 User", "10GB Storage", "Email Support", "Basic Features"],
    },
    {
      title: "Premium Plan",
      price: "$49/month",
      features: [
        "5 Users",
        "50GB Storage",
        "Priority Support",
        "Advanced Features",
      ],
    },
    {
      title: "Enterprise Plan",
      price: "$99/month",
      features: [
        "Unlimited Users",
        "Unlimited Storage",
        "24/7 Support",
        "Custom Features",
      ],
    },
  ];

  return (
    <section className="bg-none p-5">
      <div>
        <h2 className="text-center fw-bold mb-4">Our Pricing Plans</h2>
      </div>
      <br />
      <di className="h-70vh">
        <Row className="g-4 justify-content-center">
          {pricingPlans.map((plan, index) => (
            <Col key={index} md={4} sm={6} xs={12}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="text-center p-4">
                  <h4 className="fw-bold mb-3">{plan.title}</h4>
                  <h5 className="text-primary mb-4">{plan.price}</h5>
                  <ul className="list-unstyled">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="text-muted mb-2">
                        <i className="bi bi-check-circle-fill text-success"></i>{" "}
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="primary" size="lg" className="w-100">
                    Choose Plan
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </di>
    </section>
  );
};

export default PricingSection;
