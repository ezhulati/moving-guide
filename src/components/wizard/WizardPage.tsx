import { useNavigate, useParams } from 'react-router-dom';
import { useWizard, WizardStepType } from '../../context/WizardContext';
import { useToast } from '../../context/ToastContext';
import { usePersonalization } from '../shared/PersonalizationEngine';
import WelcomeStep from '../wizard/WelcomeStep';
import AddressStep from '../wizard/AddressStep';
import AddressConfirmationStep from '../wizard/AddressConfirmationStep';
import HomeProfileStep from '../wizard/HomeProfileStep';
import PlanFiltersStep from '../wizard/PlanFiltersStep';
import PlanSelectionStep from '../wizard/PlanSelectionStep';
import PersonalDetailsStep from '../wizard/PersonalDetailsStep';
import ServiceDetailsStep from '../wizard/ServiceDetailsStep';
import ConfirmationStep from '../wizard/ConfirmationStep';
import ProofDocumentStep from '../wizard/ProofDocumentStep';
import ChecklistStep from '../wizard/ChecklistStep';
import WizardProgress from '../wizard/WizardProgress';
import WizardNavigation from '../wizard/WizardNavigation';
import MobileWizardNavigation from '../shared/MobileWizardNavigation';
import SessionRecoveryModal from '../shared/SessionRecoveryModal';
import ProgressCelebration from '../shared/ProgressCelebration';
import ExitIntentCapture from '../shared/ExitIntentCapture';
import SmartRecommendationEngine from '../shared/SmartRecommendationEngine';
import PersonalizedRecommendations from '../shared/PersonalizedRecommendations';
import WizardStepFeedback from '../shared/WizardStepFeedback';
import { useEffect, useState, useRef } from 'react';
import SEO from '../shared/SEO';
import { AlertCircle, Clipboard } from 'lucide-react';
import UsagePredictionVisualizer from '../shared/UsagePredictionVisualizer';
import { cn } from '../../utils/cn';

const WizardPage = () => {
  const { step } = useParams<{ step: string }>();
  const { wizardState, goToStep, canProceed, updateWizardState, trackStepCompletion, getStepCompletionTime } = useWizard();
  const { addToast } = useToast();
  const { personalizationState } = usePersonalization();
  const navigate = useNavigate();
  const [transition, setTransition] = useState<'entering' | 'entered'>('entered');
  const [showSessionTimeout, setShowSessionTimeout] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [celebrationType, setCelebrationType] = useState<'milestone' | 'completion' | 'progress'>('progress');
  const [celebrationMessage, setCelebrationMessage] = useState({ title: '', message: '' });
  const [formChanged, setFormChanged] = useState(false);
  const lastActiveTime = useRef(Date.now());
  
  // Check if mobile view
  const isMobile = personalizationState.userBehaviors.deviceType === 'mobile';
  
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
  
  // Should we show the checklist in the sidebar?
  const shouldShowChecklist = () => {
    return ['personal-details', 'service-details', 'confirmation'].includes(wizardState.currentStep);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-4 sm:py-8 px-0 sm:px-6 lg:px-8">
      <SEO 
        title={`${getStepTitle(wizardState.currentStep)} - ComparePower Setup`}
        description="Set up your electricity service for your Texas move in just 5 minutes."
      />
      
      <div className="max-w-7xl mx-auto">
        {/* Show progress only on non-mobile or if specifically needed */}
        {(!isMobile || wizardState.currentStep === 'plan-selection') && (
          <WizardProgress currentStep={wizardState.currentStep} />
        )}
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="lg:flex-1">
            <div 
              className={cn(
                "bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 md:p-8 transition-opacity duration-300",
                transition === 'entering' ? 'opacity-0' : 'opacity-100',
                isMobile ? "mx-4" : ""
              )}
            >
              {renderStep()}
            </div>
            
            {/* Use different navigation component for mobile vs desktop */}
            {isMobile ? (
              <div className="mt-6 px-4">
                <MobileWizardNavigation
                  currentStep={wizardState.currentStep}
                  onNext={handleNext}
                  onBack={handleBack}
                  canProceed={canProceed()}
                  isFirstStep={wizardState.currentStep === 'welcome'}
                  isLastStep={wizardState.currentStep === 'checklist'}
                  progressPercentage={calculateProgress()}
                />
              </div>
            ) : (
              <WizardNavigation
                currentStep={wizardState.currentStep}
                onNext={handleNext}
                onBack={handleBack}
                canProceed={canProceed()}
                isFirstStep={wizardState.currentStep === 'welcome'}
                isLastStep={wizardState.currentStep === 'checklist'}
              />
            )}
          </div>
          
          {/* Sidebar content - recommendations and usage prediction */}
          {!isMobile && ( // Only show sidebar on desktop
            <div className="lg:w-80 space-y-4">
              {/* Smart Recommendations */}
              <PersonalizedRecommendations 
                className="sticky top-24"
              />
              
              {/* Standard recommendations as fallback */}
              <SmartRecommendationEngine 
                currentStep={wizardState.currentStep}
              />
              
              {/* Usage prediction visualizer */}
              {shouldShowUsageVisualizer() && wizardState.homeProfile.squareFootage && (
                <div className="sticky top-96">
                  <UsagePredictionVisualizer showDetails={false} />
                </div>
              )}
              
              {/* Moving Checklist Preview */}
              {shouldShowChecklist() && (
                <div className={cn(
                  "sticky top-96",
                  shouldShowUsageVisualizer() ? "mt-8" : "mt-0"
                )}>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                        <Clipboard className="h-4 w-4 text-primary-600 dark:text-primary-400 mr-2" />
                        Moving Checklist
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {[
                        "Start your electricity setup early",
                        "Compare plans based on your usage",
                        "Understand contract terms",
                        "Set up online account access",
                        "Program your thermostat efficiently"
                      ].map((item, index) => (
                        <div key={index} className="flex items-start">
                          <div className="h-4 w-4 rounded-full border border-gray-300 dark:border-gray-600 mt-0.5 mr-2 flex-shrink-0"></div>
                          <span className="text-xs text-gray-600 dark:text-gray-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile-specific feedback widget */}
      {isMobile && (
        <WizardStepFeedback stepId={wizardState.currentStep} />
      )}
      
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
              <AlertCircle className="h-5 w-5 text-amber-400 dark:text-amber-300\" aria-hidden=\"true" />
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