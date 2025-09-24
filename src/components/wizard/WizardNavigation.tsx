import { WizardStepType, useWizard } from '../../context/WizardContext';
import { ArrowLeft, ArrowRight, Loader, Clock, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';

interface WizardNavigationProps {
  currentStep: WizardStepType;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const WizardNavigation: React.FC<WizardNavigationProps> = ({
  currentStep,
  onNext,
  onBack,
  canProceed,
  isFirstStep,
  isLastStep,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const { wizardState } = useWizard();
  const [showProgress, setShowProgress] = useState(false);
  const [animateProgress, setAnimateProgress] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  // Calculate progress percentage
  useEffect(() => {
    const steps = [
      'welcome',
      'address',
      'address-confirmation',
      'home-profile',
      'plan-filters',
      'plan-selection',
      'personal-details',
      'service-details',
      'confirmation',
      'proof-document',
      'checklist'
    ];
    
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex === -1) return;
    
    const newPercent = Math.round((currentIndex / (steps.length - 1)) * 100);
    
    if (newPercent !== progressPercent) {
      setShowProgress(true);
      setProgressPercent(newPercent);
      
      setTimeout(() => {
        setAnimateProgress(true);
      }, 100);
      
      setTimeout(() => {
        setAnimateProgress(false);
        setShowProgress(false);
      }, 2000);
    }
  }, [currentStep, progressPercent]);

  // Calculate time remaining for same-day service
  useEffect(() => {
    // Check if today is the move-in date
    const isMoveInDateToday = () => {
      if (!wizardState.moveInDate) return false;
      
      const moveInDate = new Date(wizardState.moveInDate);
      const today = new Date();
      return moveInDate.toDateString() === today.toDateString();
    };

    const calculateTimeRemaining = () => {
      if (!isMoveInDateToday()) return null;
      
      const now = new Date();
      const cutoffTime = new Date();
      cutoffTime.setHours(17, 0, 0, 0); // 5:00 PM
      
      if (now >= cutoffTime || now.getDay() === 0) return null; // Past 5 PM or Sunday
      
      const remainingMs = cutoffTime.getTime() - now.getTime();
      return Math.floor(remainingMs / 60000); // Convert to minutes
    };

    const updateTimeRemaining = () => {
      setTimeRemaining(calculateTimeRemaining());
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [wizardState.moveInDate]);

  const handleNext = () => {
    if (canProceed) {
      setIsLoading(true);
      onNext();
      // Reset loading state after transition completes
      setTimeout(() => setIsLoading(false), 400);
    }
  };

  // Custom text for the next button based on current step
  const getNextButtonText = (): string => {
    switch (currentStep) {
      case 'welcome':
        return 'Let\'s Get Started';
      case 'address':
        return 'Continue to Address Confirmation';
      case 'address-confirmation':
        return 'My Address is Correct';
      case 'home-profile':
        return 'Continue to Plan Options';
      case 'plan-filters':
        return 'View Available Plans';
      case 'plan-selection':
        return wizardState.selectedPlan.id ? 'Continue with Selected Plan' : 'Select a Plan First';
      case 'personal-details':
        return 'Continue to Service Details';
      case 'service-details':
        return 'Complete My Order';
      case 'confirmation':
        return 'View My Documents';
      case 'proof-document':
        return 'Continue to Checklist';
      case 'checklist':
        return 'Finish Setup';
      default:
        return 'Continue';
    }
  };

  return (
    <div className="mt-8">
      <div className="flex flex-col space-y-4">
        {/* Progress indicator (appears briefly when changing steps) */}
        {showProgress && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-2 flex items-center animate-fade-in">
            <div className="mr-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              {progressPercent}% Complete
            </div>
            <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full bg-primary-600 dark:bg-primary-500 transition-all duration-1000",
                  animateProgress ? "ease-out" : "ease-in"
                )}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between">
          {!isFirstStep ? (
            <button
              type="button"
              onClick={onBack}
              disabled={isLoading}
              className={cn(
                "btn btn-secondary",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
              aria-label="Go back to previous step"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </button>
          ) : (
            <div></div> // Empty div to maintain spacing with flex justify-between
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed || isLoading}
            className={cn(
              "btn btn-primary min-w-[170px]",
              !canProceed && "opacity-50 cursor-not-allowed",
              isLoading && "animate-pulse",
              currentStep === 'service-details' && "bg-success-600 hover:bg-success-700 dark:bg-success-600 dark:hover:bg-success-700"
            )}
            aria-label={`${getNextButtonText()} to next step`}
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Working on it...
              </>
            ) : (
              <>
                {getNextButtonText()}
                {!isLastStep && <ArrowRight className="ml-2 h-4 w-4" />}
              </>
            )}
          </button>
        </div>
        
        {/* Same-day service notification */}
        {timeRemaining !== null && timeRemaining > 0 && (
          <div className="mt-3 flex items-start bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-500 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                {timeRemaining < 60 
                  ? `Quick! Only ${timeRemaining} minutes left` 
                  : `${Math.floor(timeRemaining / 60)} hrs ${timeRemaining % 60} mins left`
                } for same-day power
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                Complete your order before 5PM to get connected today
              </p>
            </div>
          </div>
        )}
        
        {/* Step completion indicator */}
        {canProceed && !isLastStep && (
          <div className="flex items-center justify-center mt-2 text-success-600 dark:text-success-400 text-sm animate-fade-in">
            <Check className="h-4 w-4 mr-1" />
            <span>Ready to continue</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WizardNavigation;