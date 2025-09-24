import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Home, MapPin, User, Calendar, Zap, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

type Step = {
  id: string;
  name: string;
  icon: React.ReactNode;
  path: string;
};

interface MobileWizardStepperProps {
  currentStepId: string;
  steps: Step[];
  onBack?: () => void;
  onNext?: () => void;
  canProceed?: boolean;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  className?: string;
  progressPercentage: number;
}

const MobileWizardStepper: React.FC<MobileWizardStepperProps> = ({
  currentStepId,
  steps,
  onBack,
  onNext,
  canProceed = true,
  isFirstStep = false,
  isLastStep = false,
  className,
  progressPercentage
}) => {
  const [showFullStepper, setShowFullStepper] = useState(false);
  const [activeStep, setActiveStep] = useState<Step | null>(null);
  const [nextStep, setNextStep] = useState<Step | null>(null);
  const [prevStep, setPrevStep] = useState<Step | null>(null);
  
  // Find active step and adjacent steps when currentStepId changes
  useEffect(() => {
    const currentIndex = steps.findIndex(step => step.id === currentStepId);
    if (currentIndex !== -1) {
      setActiveStep(steps[currentIndex]);
      setNextStep(currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null);
      setPrevStep(currentIndex > 0 ? steps[currentIndex - 1] : null);
    }
  }, [currentStepId, steps]);
  
  if (!activeStep) return null;
  
  // Compact view - shows just current step and progress
  const CompactView = () => (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={() => setShowFullStepper(true)}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-primary-600 dark:text-primary-400"
          aria-label="Show all steps"
        >
          {activeStep.icon}
        </button>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{activeStep.name}</p>
          <div className="mt-1 w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div 
              className="bg-primary-600 dark:bg-primary-500 h-1.5 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        {!isFirstStep && (
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            aria-label="Previous step"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        {!isLastStep && (
          <button
            onClick={onNext}
            disabled={!canProceed}
            className={cn(
              "p-2 rounded-full", 
              canProceed ? "bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400" : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600"
            )}
            aria-label="Next step"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
  
  // Expanded view - shows all steps and allows direct navigation
  const ExpandedView = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg animate-slide-up">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Steps</h3>
        <button
          onClick={() => setShowFullStepper(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close steps view"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="p-4 max-h-80 overflow-y-auto">
        <div className="space-y-1">
          {steps.map((step, index) => {
            const isActive = step.id === currentStepId;
            const isCompleted = steps.findIndex(s => s.id === currentStepId) > index;
            
            return (
              <div
                key={step.id}
                className={cn(
                  "flex items-center p-2 rounded-md",
                  isActive ? "bg-primary-50 dark:bg-primary-900/30" : "hover:bg-gray-50 dark:hover:bg-gray-700"
                )}
              >
                <div 
                  className={cn(
                    "flex items-center justify-center h-8 w-8 rounded-full",
                    isActive ? "bg-primary-600 text-white" : 
                    isCompleted ? "bg-green-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  )}
                >
                  {isCompleted ? (
                    <svg className="h-5 w-5\" fill="none\" viewBox="0 0 24 24\" stroke="currentColor">
                      <path strokeLinecap="round\" strokeLinejoin="round\" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.icon
                  )}
                </div>
                <span 
                  className={cn(
                    "ml-3 text-sm font-medium",
                    isActive ? "text-primary-700 dark:text-primary-300" : 
                    isCompleted ? "text-gray-700 dark:text-gray-200" : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
        <button
          onClick={() => setShowFullStepper(false)}
          className="btn btn-secondary text-sm"
        >
          Close
        </button>
        
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          {progressPercentage}% complete
        </div>
      </div>
    </div>
  );
  
  return (
    <div className={className}>
      {showFullStepper ? <ExpandedView /> : <CompactView />}
    </div>
  );
};

export default MobileWizardStepper;