import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { ArrowLeft, ArrowRight, Loader, Check } from 'lucide-react';
import { cn } from '../../utils/cn';
import { WizardStepType, useWizard } from '../../context/WizardContext';

interface MobileWizardNavigationProps {
  currentStep: WizardStepType;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  progressPercentage: number;
}

const MobileWizardNavigation: React.FC<MobileWizardNavigationProps> = ({
  currentStep,
  onNext,
  onBack,
  canProceed,
  isFirstStep,
  isLastStep,
  progressPercentage
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const [hasShownSwipeHint, setHasShownSwipeHint] = useState(false);
  const [swipeConfidence, setSwipeConfidence] = useState(0);
  const { wizardState } = useWizard();

  // Show swipe hint after 2 seconds if user hasn't swiped yet and hasn't seen the hint
  useEffect(() => {
    if (!hasShownSwipeHint && !isFirstStep && !isLastStep) {
      const timer = setTimeout(() => {
        setShowSwipeHint(true);
        setHasShownSwipeHint(true);
        
        // Hide the hint after 4 seconds
        setTimeout(() => {
          setShowSwipeHint(false);
        }, 4000);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [currentStep, hasShownSwipeHint, isFirstStep, isLastStep]);

  // Set up swipe handlers for mobile navigation
  const swipeHandlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      // Only proceed on confident swipes
      if (eventData.velocity > 0.5 && canProceed && !isLastStep) {
        setSwipeConfidence(eventData.velocity);
        handleNext();
      }
    },
    onSwipedRight: (eventData) => {
      // Only go back on confident swipes
      if (eventData.velocity > 0.5 && !isFirstStep) {
        setSwipeConfidence(eventData.velocity);
        handleBack();
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: false,
    trackTouch: true,
    delta: 30, // Min distance required for a swipe
    swipeDuration: 500 // Max duration of a swipe to be detected
  });

  // Custom text for the next button based on current step
  const getNextButtonText = (): string => {
    switch (currentStep) {
      case 'welcome':
        return 'Start';
      case 'address':
        return 'Continue';
      case 'address-confirmation':
        return 'Confirm Address';
      case 'home-profile':
        return 'Continue to Options';
      case 'plan-filters':
        return 'See Available Plans';
      case 'plan-selection':
        return wizardState.selectedPlan?.id ? 'Continue' : 'Select Plan';
      case 'personal-details':
        return 'Next';
      case 'service-details':
        return 'Complete Order';
      case 'confirmation':
        return 'View Docs';
      case 'proof-document':
        return 'Next';
      case 'checklist':
        return 'Finish';
      default:
        return 'Continue';
    }
  };

  // Handle next button with animation
  const handleNext = () => {
    if (canProceed) {
      setIsLoading(true);
      onNext();
      // Reset loading state after transition completes
      setTimeout(() => setIsLoading(false), 400);
    } else {
      // Show hint about what's needed to proceed
      setShowHint(true);
      setTimeout(() => setShowHint(false), 3000);
    }
  };

  // Handle back button
  const handleBack = () => {
    onBack();
  };

  return (
    <div className="relative" {...swipeHandlers}>
      {/* Progress indicator */}
      <div className="mb-4 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary-600 dark:bg-primary-500 transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center">
        {!isFirstStep ? (
          <button
            type="button"
            onClick={handleBack}
            disabled={isLoading}
            aria-label="Go back to previous step"
            className="btn btn-secondary py-3 px-4 text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back
          </button>
        ) : (
          <div></div> // Empty div to maintain spacing with flex justify-between
        )}

        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed || isLoading}
          aria-label={`Proceed to next step`}
          className={cn(
            "btn btn-primary py-3 px-6 text-sm",
            !canProceed && "opacity-50 cursor-not-allowed",
            isLoading && "animate-pulse"
          )}
        >
          {isLoading ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              {getNextButtonText()}
              {!isLastStep && <ArrowRight className="ml-1.5 h-4 w-4" />}
            </>
          )}
        </button>
      </div>

      {/* Swipe hint - appears briefly to teach users they can swipe */}
      {showSwipeHint && (
        <div className="fixed inset-x-0 bottom-20 flex justify-center pointer-events-none z-50">
          <div className="bg-gray-800/90 text-white text-sm px-4 py-2 rounded-full animate-fade-in flex items-center">
            <span className="animate-pulse">←</span>
            <span className="mx-2">Swipe to navigate</span>
            <span className="animate-pulse">→</span>
          </div>
        </div>
      )}

      {/* Hint to complete required fields */}
      {showHint && (
        <div className="absolute left-0 right-0 -top-12 flex justify-center animate-fade-in">
          <div className="bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 text-sm px-4 py-2 rounded-lg border border-amber-200 dark:border-amber-800 shadow-sm">
            Please complete all required fields to continue
          </div>
        </div>
      )}
      
      {/* Feedback when successful swipe is detected */}
      {swipeConfidence > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="bg-primary-600/20 dark:bg-primary-800/30 rounded-full p-8 animate-ping">
            {swipeConfidence > 0.8 && <Check className="h-10 w-10 text-primary-600 dark:text-primary-400" />}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileWizardNavigation;