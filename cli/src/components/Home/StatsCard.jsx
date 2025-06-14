import React from 'react';
import { Card } from 'react-bootstrap';

export const StatsCard = ({ title, value, icon: Icon, color }) => {
  const colors = {
    purple: 'bg-purple-100 text-purple-800',
    green: 'bg-success-100 text-success-800',
    yellow: 'bg-warning-100 text-warning-800',
    blue: 'bg-primary-100 text-primary-800'
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <Card.Title as="h6" className="text-uppercase text-muted mb-2">{title}</Card.Title>
            <h3 className="mb-0">{value}</h3>
          </div>
          <div className={`icon-shape icon-lg ${colors[color]} rounded-circle d-flex align-items-center justify-content-center`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};