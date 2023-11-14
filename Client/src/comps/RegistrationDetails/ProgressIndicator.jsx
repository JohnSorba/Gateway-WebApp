/* eslint-disable react/prop-types */
import React from "react";
import "./ProgressIndicator.css";

function ProgressIndicator({ currentStep }) {
  // Define the title for each step
  const stepTitles = [
    "Account Details",
    "Personal Information",
    "Review & Submit",
    "Final Step - CAF",
  ];

  return (
    <div className="progress-indicator">
      {stepTitles.map((title, index) => {
        // Convert step index to step number (1-based)
        {
          /* const stepNumber = index + 1; */
        }

        // New code for lines
        {
          /* const isActive = index < currentStep; */
        }
        const isComplete = index < currentStep;
        const isCurrent = index + 1 === currentStep;

        return (
          <React.Fragment key={title}>
            {index !== 0 && (
              <div className={`line ${isComplete ? "complete" : ""}`}></div>
            )}
            <div
              className={`circle ${isCurrent ? "current" : ""} ${
                isComplete ? "complete" : ""
              }`}
            >
              {index + 1}
              {isCurrent && <div className="step-title">{title}</div>}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default ProgressIndicator;
