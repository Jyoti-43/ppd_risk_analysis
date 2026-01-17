import React from "react";
import { Progress } from "./progress";

interface StepperProps {
  steps?: number;
  currentStep: number; // 1-based index
  onStepClick?: (step: number) => void;
  label?: string[];
}


export const Stepper: React.FC<StepperProps> = ({
  steps = 5,
  currentStep,
  onStepClick,
  label,
}) => {
  // Prevent division by zero and negative steps
  const safeSteps = Math.max(steps, 1);
  const progressValue =
    safeSteps > 1 ? ((currentStep - 1) / (safeSteps - 1)) * 100 : 100;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Stepper Bar with Bubbles */}
      <div
        className="relative w-full flex items-center"
        style={{ height: "48px" }}
      >
        {/* Progress Bar - behind bubbles, centered vertically */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 w-full z-0">
          <Progress value={progressValue} />
        </div>
        {/* Bubbles */}
        <div className="w-full flex justify-between items-center z-10 min-w-0">
          {Array.from({ length: safeSteps }).map((_, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isActive = stepNum === currentStep;
            const canGoBack = stepNum < currentStep;
            // const stepLabel = stepNum === currentStep ? label : undefined;
            return (
              <div key={stepNum} className="flex flex-col items-center justify-center">
                <button
                  type="button"
                  onClick={canGoBack ? () => onStepClick?.(stepNum) : undefined}
                  disabled={!canGoBack}
                  className={`flex flex-col items-center justify-center p-1 rounded-full text-xs border-2 transition-colors duration-200 shrink-0
                    ${
                      isCompleted || isActive
                        ? "bg-primary border-primary text-white"
                        : "bg-white border-primary text-primary"
                    }
                    ${isActive ? "ring-2 ring-primary/50" : ""}
                    w-4 h-4 md:w-5 md:h-5 focus:outline-none
                    ${
                      !canGoBack
                        ? "opacity-50 pointer-events-none cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  style={{ zIndex: 2 }}
                  aria-label={`Step ${stepNum}`}
                >
                  {stepNum}

                  {/* Optionally show step number or icon */}
                </button>
                {label ? <div className="z-12 text-primary">{label[stepNum - 1]}</div> : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
