import React from 'react';

export const DEFAULT_STEPS = [
  'Route',
  'Date & Time',
  'Seat',
  'Confirm',
];

interface StepIndicatorProps {
  currentStep?: number;
  steps?: string[];
  className?: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep = 1,
  steps = DEFAULT_STEPS,
  className = '',
}) => {
  const activeStep = Math.max(1, Math.min(steps.length, Number(currentStep) || 1));
  const stepsRemaining = steps.length - activeStep;
  const progressPercent = Math.round((activeStep / steps.length) * 100);

  return (
    <nav
      aria-label="Booking Progress"
      className={`glass-card p-3 sm:p-4 w-full border border-yellow-500/20 bg-[#0c121e]/95 rounded-2xl shadow-md ${className}`}
    >
      {/* Cognitive Status Line: Clear Step Identification & Remaining Steps */}
      <div className="flex items-center justify-between mb-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-yellow-400 font-mono tracking-wide uppercase">
            Step {activeStep} of {steps.length}
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-white font-bold truncate">
            {steps[activeStep - 1]}
          </span>
        </div>
        <div className="text-[11px] font-medium text-slate-400">
          {stepsRemaining === 0 ? (
            <span className="text-emerald-400 font-bold">Booking Confirmed!</span>
          ) : stepsRemaining === 1 ? (
            <span className="text-yellow-400 font-semibold">1 step remaining</span>
          ) : (
            <span>{stepsRemaining} steps remaining</span>
          )}
        </div>
      </div>

      {/* Visual Progress Bar Fill Line */}
      <div
        className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3 relative"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step nodes with arrows / connectors */}
      <div className="flex items-center justify-between w-full max-w-xl mx-auto">
        {steps.map((stepLabel, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < activeStep;
          const isActive = stepNumber === activeStep;
          const isUpcoming = stepNumber > activeStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={stepLabel || index}>
              {/* Step item: circle + label */}
              <div className="flex flex-col items-center text-center relative z-10">
                {/* Step Circle */}
                <div
                  aria-current={isActive ? 'step' : undefined}
                  className={`
                    flex items-center justify-center rounded-full transition-all duration-300 select-none
                    w-7 h-7 sm:w-8 sm:h-8 text-xs font-black
                    ${
                      isCompleted
                        ? 'bg-yellow-400 border-2 border-yellow-400 text-slate-950 shadow-md shadow-yellow-500/20'
                        : ''
                    }
                    ${
                      isActive
                        ? 'bg-yellow-400/20 border-2 border-yellow-400 text-yellow-300 ring-4 ring-yellow-400/25 shadow-lg shadow-yellow-500/20 scale-105'
                        : ''
                    }
                    ${
                      isUpcoming
                        ? 'border-2 border-slate-700 bg-slate-900 text-slate-500'
                        : ''
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg
                      className="w-3.5 h-3.5 text-slate-950 font-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3.5}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span>{stepNumber}</span>
                  )}
                </div>

                {/* Step Label */}
                <span
                  className={`
                    mt-1 hidden sm:block text-[11px] transition-colors duration-300 whitespace-nowrap
                    ${isCompleted ? 'text-yellow-400 font-semibold' : ''}
                    ${isActive ? 'text-white font-bold' : ''}
                    ${isUpcoming ? 'text-slate-500 font-normal' : ''}
                  `}
                >
                  {stepLabel}
                </span>
              </div>

              {/* Connector line between steps */}
              {!isLast && (
                <div
                  className={`flex-1 mx-1 sm:mx-2 h-0.5 transition-colors duration-300 ${
                    isCompleted ? 'bg-yellow-400' : 'bg-slate-800'
                  }`}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};

export default StepIndicator;
