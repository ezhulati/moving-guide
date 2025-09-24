import { useNavigate, useParams } from 'react-router-dom';
import { useWizard, WizardStepType } from '../context/WizardContext';
import { useToast } from '../context/ToastContext';
import WelcomeStep from '../components/wizard/WelcomeStep';
import AddressStep from '../components/wizard/AddressStep';
import AddressConfirmationStep from '../components/wizard/AddressConfirmationStep';
import HomeProfileStep from '../components/wizard/HomeProfileStep';
import PlanFiltersStep from '../components/wizard/PlanFiltersStep';
import PlanSelectionStep from '../components/wizard/PlanSelectionStep';
import PersonalDetailsStep from '../components/wizard/PersonalDetailsStep';
import ServiceDetailsStep from '../components/wizard/ServiceDetailsStep';
import ConfirmationStep from '../components/wizard/ConfirmationStep';
import ProofDocumentStep from '../components/wizard/ProofDocumentStep';
import ChecklistStep from '../components/wizard/ChecklistStep';
import WizardProgress from '../components/wizard/WizardProgress';
import WizardNavigation from '../components/wizard/WizardNavigation';
import SessionRecoveryModal from '../components/shared/SessionRecoveryModal';
import ProgressCelebration from '../components/shared/ProgressCelebration';
import ExitIntentCapture from '../components/shared/ExitIntentCapture';
import SmartRecommendationEngine from '../components/shared/SmartRecommendationEngine';
import { useEffect, useState, useRef } from 'react';
import SEO from '../components/shared/SEO';
import { AlertCircle } from 'lucide-react';
import UsagePredictionVisualizer from '../components/shared/UsagePredictionVisualizer';

const WizardPage = () => {
  const { step } = useParams<{ step: string }>();
  const { wizardState, goToStep, canProceed, updateWizardState, trackStepCompletion, getStepCompletionTime } = useWizard();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [transition, setTransition] = useState<'entering' | 'entered'>('entered');
  const [showSessionTimeout, setShowSessionTimeout] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [celebrationType, setCelebrationType] = useState<'milestone' | 'completion' | 'progress'>('progress');
  const [celebrationMessage, setCelebrationMessage] = useState({ title: '', message: '' });
  const [formChanged, setFormChanged] = useState(false);
  const lastActiveTime = useRef(Date.now());
  
  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);
  
  // Get step title for SEO
  const getStepTitle = (step: WizardStepType): string => {
    switch(step) {
      case 'welcome': return 'Welcome';
      case 'address': return 'Your Address';
      case 'address-confirmation': return 'Confirm Address';
      case 'home-profile': return 'Home Profile';
      case 'plan-filters': return 'Plan Preferences';
      case 'plan-selection': return 'Select a Plan';
      case 'personal-details': return 'Your Details';
      case 'service-details': return 'Service Options';
      case 'confirmation': return 'Order Confirmation';
      case 'proof-document': return 'Proof of Service';
      case 'checklist': return 'Moving Checklist';
      default: return 'Power Setup';
    }
  };

  // Calculate current progress percentage in the wizard
  const calculateProgress = (): number => {
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
    
    const currentIndex = steps.indexOf(wizardState.currentStep);
    if (currentIndex === -1) return 0;
    
    return Math.round((currentIndex / (steps.length - 1)) * 100);
  };

  // Get total time invested in the wizard process
  const getTotalTimeInvested = (): number => {
    let totalTime = 0;
    if (!wizardState.funnel?.timeOnSteps) return 0;
    
    Object.values(wizardState.funnel.timeOnSteps).forEach(time => {
      totalTime += time as number;
    });
    
    // Convert from milliseconds to minutes
    return Math.round(totalTime / (1000 * 60));
  };

  // Periodically save state to localStorage and check for session timeout
  useEffect(() => {
    if (wizardState.lastActive) {
      const lastActive = new Date(wizardState.lastActive).getTime();
      const now = new Date().getTime();
      const minutesSinceLastActive = (now - lastActive) / (1000 * 60);
      
      // Show timeout warning if inactive for more than 30 minutes
      if (minutesSinceLastActive > 30) {
        setShowSessionTimeout(true);
      } else {
        setShowSessionTimeout(false);
      }
    }
    
    // Update lastActive timestamp every minute
    const interval = setInterval(() => {
      updateWizardState({ lastActive: new Date().toISOString() });
    }, 60000);
    
    return () => clearInterval(interval);
  }, [wizardState.lastActive, updateWizardState]);

  // Check if we can skip steps based on pre-filled data
  useEffect(() => {
    // Skip welcome step if we have data from homepage
    if (step === 'welcome' && wizardState.propertyType && wizardState.address.street && wizardState.moveInDate) {
      addToast('info', 'Using your previously entered information');
      navigate('/wizard/address-confirmation', { replace: true });
    }
    
    // Skip address step if we have address data from homepage
    if (step === 'address' && wizardState.address.street && wizardState.moveInDate) {
      addToast('info', 'Address information already provided');
      navigate('/wizard/address-confirmation', { replace: true });
    }
  }, [step, wizardState.propertyType, wizardState.address.street, wizardState.moveInDate, navigate, addToast]);

  // Track user activity to detect potential form abandonment
  useEffect(() => {
    const trackActivity = () => {
      lastActiveTime.current = Date.now();
    };
    
    // Update last active time when user interacts with the page
    document.addEventListener('mousemove', trackActivity);
    document.addEventListener('keydown', trackActivity);
    document.addEventListener('click', trackActivity);
    
    // Check for inactivity every minute
    const inactivityCheck = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActiveTime.current;
      
      // If inactive for more than 2 minutes and has unsaved changes, show reminder
      if (timeSinceLastActivity > 120000 && formChanged) {
        addToast('info', 'Don\'t forget to complete this step before leaving', 10000, {
          text: 'Continue',
          onClick: () => {
            lastActiveTime.current = Date.now();
            setFormChanged(false);
          }
        });
      }
    }, 60000);
    
    return () => {
      document.removeEventListener('mousemove', trackActivity);
      document.removeEventListener('keydown', trackActivity);
      document.removeEventListener('click', trackActivity);
      clearInterval(inactivityCheck);
    };
  }, [addToast, formChanged]);

  // Validate and set current step based on URL param
  useEffect(() => {
    if (step && isValidStep(step as WizardStepType)) {
      goToStep(step as WizardStepType);
    } else {
      // If invalid step, redirect to welcome step
      navigate('/wizard/welcome', { replace: true });
    }
  }, [step, goToStep, navigate]);

  // Reset session timeout warning when user interacts
  useEffect(() => {
    const resetTimeout = () => {
      if (showSessionTimeout) {
        setShowSessionTimeout(false);
        updateWizardState({ lastActive: new Date().toISOString() });
      }
    };

    window.addEventListener('click', resetTimeout);
    window.addEventListener('keydown', resetTimeout);
    window.addEventListener('mousemove', resetTimeout);
    window.addEventListener('scroll', resetTimeout);

    return () => {
      window.removeEventListener('click', resetTimeout);
      window.removeEventListener('keydown', resetTimeout);
      window.removeEventListener('mousemove', resetTimeout);
      window.removeEventListener('scroll', resetTimeout);
    };
  }, [showSessionTimeout, updateWizardState]);

  // Show celebration messages at key milestones
  useEffect(() => {
    // Don't show celebrations right away when the component first mounts
    const timer = setTimeout(() => {
      const progress = calculateProgress();
      
      // Set celebration messages based on current step
      if (wizardState.currentStep === 'plan-selection' && wizardState.selectedPlan.id) {
        setCelebrationMessage({
          title: 'Great Choice!',
          message: `You've selected a plan that could save you up to $350 per year compared to standard utility rates.`
        });
        setCelebrationType('milestone');
        setShowCelebration(true);
      }
      else if (wizardState.currentStep === 'confirmation') {
        setCelebrationMessage({
          title: 'Success! Your Power is Set Up',
          message: 'Your electricity service has been successfully set up. You\'ll receive your confirmation details shortly.'
        });
        setCelebrationType('completion');
        setShowCelebration(true);
      }
      else if (progress === 50 && !wizardState.funnel.completedSteps.includes('progress-50')) {
        setCelebrationMessage({
          title: 'Halfway There!',
          message: 'You\'re making great progress. Just a few more minutes to complete your electricity setup.'
        });
        setCelebrationType('progress');
        setShowCelebration(true);
        
        // Record this milestone as completed
        updateWizardState({
          funnel: {
            ...wizardState.funnel,
            completedSteps: [...wizardState.funnel.completedSteps, 'progress-50']
          }
        });
      }
      else if (progress >= 75 && !wizardState.funnel.completedSteps.includes('progress-75')) {
        setCelebrationMessage({
          title: 'Almost Done!',
          message: 'You\'re on the home stretch. Just a few final details to complete your setup.'
        });
        setCelebrationType('progress');
        setShowCelebration(true);
        
        // Record this milestone as completed
        updateWizardState({
          funnel: {
            ...wizardState.funnel,
            completedSteps: [...wizardState.funnel.completedSteps, 'progress-75']
          }
        });
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [wizardState.currentStep, wizardState.selectedPlan.id, wizardState.funnel.completedSteps, updateWizardState]);

  // Function to check if a step is valid
  const isValidStep = (step: string): step is WizardStepType => {
    const validSteps: WizardStepType[] = [
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
      'checklist',
    ];
    return validSteps.includes(step as WizardStepType);
  };

  // Function to render the appropriate step component
  const renderStep = () => {
    switch (wizardState.currentStep) {
      case 'welcome':
        return <WelcomeStep />;
      case 'address':
        return <AddressStep />;
      case 'address-confirmation':
        return <AddressConfirmationStep />;
      case 'home-profile':
        return <HomeProfileStep />;
      case 'plan-filters':
        return <PlanFiltersStep />;
      case 'plan-selection':
        return <PlanSelectionStep />;
      case 'personal-details':
        return <PersonalDetailsStep />;
      case 'service-details':
        return <ServiceDetailsStep />;
      case 'confirmation':
        return <ConfirmationStep />;
      case 'proof-document':
        return <ProofDocumentStep />;
      case 'checklist':
        return <ChecklistStep />;
      default:
        return <WelcomeStep />;
    }
  };

  // Define the next step based on current step
  const getNextStep = (): WizardStepType => {
    switch (wizardState.currentStep) {
      case 'welcome':
        return 'address';
      case 'address':
        return 'address-confirmation';
      case 'address-confirmation':
        return 'home-profile';
      case 'home-profile':
        return 'plan-filters';
      case 'plan-filters':
        return 'plan-selection';
      case 'plan-selection':
        return 'personal-details';
      case 'personal-details':
        return 'service-details';
      case 'service-details':
        return 'confirmation';
      case 'confirmation':
        return wizardState.propertyType === 'apartment' ? 'proof-document' : 'checklist';
      case 'proof-document':
        return 'checklist';
      case 'checklist':
      default:
        return 'checklist'; // Final step loops back to itself
    }
  };

  // Define the previous step based on current step
  const getPrevStep = (): WizardStepType => {
    switch (wizardState.currentStep) {
      case 'welcome':
        return 'welcome'; // Can't go back from first step
      case 'address':
        return 'welcome';
      case 'address-confirmation':
        return 'address';
      case 'home-profile':
        return 'address-confirmation';
      case 'plan-filters':
        return 'home-profile';
      case 'plan-selection':
        return 'plan-filters';
      case 'personal-details':
        return 'plan-selection';
      case 'service-details':
        return 'personal-details';
      case 'confirmation':
        return 'service-details';
      case 'proof-document':
        return 'confirmation';
      case 'checklist':
        return wizardState.propertyType === 'apartment' ? 'proof-document' : 'confirmation';
      default:
        return 'welcome';
    }
  };

  // Handler for next button with animation
  const handleNext = () => {
    if (canProceed()) {
      setTransition('entering');
      setTimeout(() => {
        const nextStep = getNextStep();
        
        // Track completion of current step
        trackStepCompletion(wizardState.currentStep);
        
        goToStep(nextStep);
        navigate(`/wizard/${nextStep}`);
        
        // Track progress milestone
        if (nextStep === 'confirmation') {
          addToast('success', 'Order completed successfully!');
        }
        
        // Allow DOM to update before starting exit animation
        setTimeout(() => {
          setTransition('entered');
        }, 50);
      }, 300); // Match this to the CSS transition duration
    }
  };

  // Handler for back button with animation
  const handleBack = () => {
    setTransition('entering');
    setTimeout(() => {
      const prevStep = getPrevStep();
      goToStep(prevStep);
      navigate(`/wizard/${prevStep}`);
      
      // Allow DOM to update before starting exit animation
      setTimeout(() => {
        setTransition('entered');
      }, 50);
    }, 300); // Match this to the CSS transition duration
  };

  // Handler for exit intent
  const handleExitIntentStay = () => {
    // Update timestamp to indicate active session
    updateWizardState({ lastActive: new Date().toISOString() });
    // Maybe show encouragement toast
    addToast('info', 'Great decision! You\'re just a few steps away from completing your power setup.');
  };

  // Handler for exit intent leave
  const handleExitIntentLeave = () => {
    // Save current progress
    updateWizardState({ lastActive: new Date().toISOString() });
    // Redirect to homepage
    navigate('/');
  };

  // Should we show usage visualization on this step?
  const shouldShowUsageVisualizer = () => {
    return ['plan-filters', 'plan-selection', 'service-details'].includes(wizardState.currentStep);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <SEO 
        title={`${getStepTitle(wizardState.currentStep)} - ComparePower Setup`}
        description="Set up your electricity service for your Texas move in just 5 minutes."
      />
      
      <div className="max-w-7xl mx-auto">
        <WizardProgress currentStep={wizardState.currentStep} />
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="lg:flex-1">
            <div 
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8 transition-opacity duration-300 ${
                transition === 'entering' ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {renderStep()}
            </div>
            
            <WizardNavigation
              currentStep={wizardState.currentStep}
              onNext={handleNext}
              onBack={handleBack}
              canProceed={canProceed()}
              isFirstStep={wizardState.currentStep === 'welcome'}
              isLastStep={wizardState.currentStep === 'checklist'}
            />
          </div>
          
          {/* Sidebar content - recommendations and usage prediction */}
          <div className="lg:w-80 space-y-4">
            {/* Smart Recommendations */}
            <SmartRecommendationEngine 
              currentStep={wizardState.currentStep}
              className="sticky top-24"
            />
            
            {/* Usage prediction visualizer */}
            {shouldShowUsageVisualizer() && wizardState.homeProfile.squareFootage && (
              <div className="sticky top-96">
                <UsagePredictionVisualizer showDetails={false} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress celebration modal */}
      {showCelebration && (
        <ProgressCelebration
          step={wizardState.currentStep}
          title={celebrationMessage.title}
          message={celebrationMessage.message}
          type={celebrationType}
          onDismiss={() => setShowCelebration(false)}
        />
      )}
      
      {/* Exit intent capture - only show after some progress has been made */}
      {calculateProgress() > 10 && (
        <ExitIntentCapture
          onStay={handleExitIntentStay}
          onLeave={handleExitIntentLeave}
          progressPercentage={calculateProgress()}
          timeInvested={getTotalTimeInvested()}
        />
      )}

      {/* Session recovery modal */}
      <SessionRecoveryModal />
      
      {/* Session timeout warning */}
      {showSessionTimeout && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-amber-50 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-lg shadow-lg p-4 max-w-md animate-slide-up z-50">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-amber-400 dark:text-amber-300\" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">Session timeout warning</h3>
              <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                <p>Your session has been inactive for a while. Please continue or your progress may be lost.</p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <button
                    type="button"
                    className="px-2 py-1.5 rounded-md text-sm font-medium text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600 dark:focus:ring-amber-500"
                    onClick={() => setShowSessionTimeout(false)}
                  >
                    Dismiss
                  </button>
                  <button
                    type="button"
                    className="ml-3 px-2 py-1.5 rounded-md text-sm font-medium text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600 dark:focus:ring-amber-500"
                    onClick={() => {
                      updateWizardState({ lastActive: new Date().toISOString() });
                      setShowSessionTimeout(false);
                    }}
                  >
                    Continue Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WizardPage;