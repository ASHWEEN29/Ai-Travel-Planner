import React from 'react';

const PlanDisplay = ({ tripPlan }) => {
  return (
    <div>
      <h2>Your Trip Plan</h2>
      <p>{tripPlan}</p>
    </div>
  );
};

export default PlanDisplay;