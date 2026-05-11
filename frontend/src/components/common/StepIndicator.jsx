import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils/cn';
import { Check } from 'lucide-react';

const stepData = [
  { id: 1, label: 'Welcome', icon: '👋' },
  { id: 2, label: 'Profile', icon: '👤' },
  { id: 3, label: 'Documents', icon: '📄' },
  { id: 4, label: 'Option Form', icon: '📋' },
  { id: 5, label: 'Allotment', icon: '🎯' },
  { id: 6, label: 'Decision', icon: '⚖️' },
  { id: 7, label: 'Round Loop', icon: '🔄' },
  { id: 8, label: 'Confirmed', icon: '🎓' },
];

export const StepIndicator = () => {
  const currentStep = useAppStore(state => state.currentStep);
  const setCurrentStep = useAppStore(state => state.setCurrentStep);

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="relative w-full h-1.5 bg-brand-base/10 rounded-full mb-6 overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-brand-base to-cyan-400 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${((currentStep - 1) / (stepData.length - 1)) * 100}%` }}
        />
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-brand-base/40 to-cyan-400/40 rounded-full transition-all duration-700 ease-out blur-sm"
          style={{ width: `${((currentStep - 1) / (stepData.length - 1)) * 100}%` }}
        />
      </div>

      {/* Steps */}
      <div className="flex items-start overflow-x-auto pb-2 gap-0 scrollbar-none">
        {stepData.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isUpcoming = step.id > currentStep;

          return (
            <React.Fragment key={step.id}>
              <div
                className={cn(
                  'flex flex-col items-center gap-2 min-w-[80px] relative group',
                  isCompleted ? 'cursor-pointer' : 'cursor-default'
                )}
                onClick={() => isCompleted && setCurrentStep(step.id)}
              >
                {/* Circle */}
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-base font-bold transition-all duration-300 border-2 relative z-10',
                    isCompleted
                      ? 'bg-brand-base border-brand-base text-white shadow-lg shadow-brand-base/40'
                      : isCurrent
                      ? 'border-brand-base text-brand-base bg-brand-base/10 shadow-lg shadow-brand-base/30'
                      : 'border-border text-muted-foreground bg-muted/30'
                  )}
                >
                  {isCurrent && (
                    <span className="absolute inset-0 rounded-full bg-brand-base/20 animate-ping" />
                  )}
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-sm">{step.id}</span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    'text-xs whitespace-nowrap font-medium transition-colors',
                    isCurrent
                      ? 'text-brand-base'
                      : isCompleted
                      ? 'text-muted-foreground group-hover:text-brand-base'
                      : 'text-muted-foreground/50'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < stepData.length - 1 && (
                <div className="flex-1 h-[2px] mt-5 mx-1 min-w-[16px]">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      isCompleted ? 'bg-brand-base' : 'bg-border/50'
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
