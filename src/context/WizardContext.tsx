import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from './ToastContext';
import { saveWizardState, loadWizardState, clearWizardState } from '../utils/storage';

// Define wizard step types
export type WizardStepType = 
  | 'welcome'
  | 'address'
  | 'address-confirmation'
  | 'home-profile'
  | 'plan-filters'
  | 'plan-selection'
  | 'personal-details'
  | 'service-details'
  | 'confirmation'
  | 'proof-document'
  | 'checklist';

// Define property type
export type PropertyType = 'apartment' | 'house' | 'condo' | 'townhome';

// Define the Wizard state interface
interface WizardState {
  currentStep: WizardStepType;
  propertyType: PropertyType | null;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    isValidated: boolean;
  };
  moveInDate: string | null;
  isTexasResident: boolean | null;
  homeProfile: {
    squareFootage: number | null;
    occupants: number | null;
    hasEV: boolean;
    hasPool: boolean;
    hasSolar: boolean;
  };
  planPreferences: {
    contractTerm: '1-month' | '3-month' | '6-month' | '12-month' | '24-month' | null;
    isRenewable: boolean | null;
    hasSatisfactionGuarantee: boolean | null;
    requiresNoDeposit: boolean | null;
    maxRate: number | null;
  };
  selectedPlan: {
    id: string | null;
    name: string | null;
    provider: string | null;
    term: string | null;
    rate: number | null;
    estimatedMonthlyBill: number | null;
  };
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string | null;
    lastFourSSN: string | null;
  };
  serviceDetails: {
    connectionSpeed: 'standard' | 'same-day' | null;
    depositRequired: boolean;
    paymentMethod: string | null;
  };
  orderConfirmation: {
    confirmationNumber: string | null;
    accountNumber: string | null;
    orderDate: string | null;
  };
  lastActive: string | null;
  startTime: string | null;
  completionTime: string | null;
  funnel: {
    entryPoint: 'homepage' | 'city-guide' | 'direct' | 'transfer' | null;
    completedSteps: string[];
    timeOnSteps: Record<string, number>;
    revisitedSteps: string[];
  };
  transferFlow?: boolean;
  currentPlan?: {
    provider: string | null;
    rate: number | null;
    term: string | null;
    expirationDate: string | null;
  };
}

// Define context interface
interface WizardContextType {
  wizardState: WizardState;
  updateWizardState: (updates: Partial<WizardState>) => void;
  goToStep: (step: WizardStepType) => void;
  resetWizard: () => void;
  canProceed: () => boolean;
  hasInProgressSession: boolean;
  resumeSession: () => void;
  discardSession: () => void;
  trackStepCompletion: (step: WizardStepType) => void;
  getStepCompletionTime: (step: WizardStepType) => number | null;
}

// Create initial state
const initialWizardState: WizardState = {
  currentStep: 'welcome',
  propertyType: null,
  address: {
    street: '',
    city: '',
    state: 'TX', // Default to Texas
    zip: '',
    isValidated: false,
  },
  moveInDate: null,
  isTexasResident: null,
  homeProfile: {
    squareFootage: null,
    occupants: null,
    hasEV: false,
    hasPool: false,
    hasSolar: false,
  },
  planPreferences: {
    contractTerm: null,
    isRenewable: null,
    hasSatisfactionGuarantee: null,
    requiresNoDeposit: null,
    maxRate: 15,
  },
  selectedPlan: {
    id: null,
    name: null,
    provider: null,
    term: null,
    rate: null,
    estimatedMonthlyBill: null,
  },
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: null,
    lastFourSSN: null,
  },
  serviceDetails: {
    connectionSpeed: null,
    depositRequired: false,
    paymentMethod: null,
  },
  orderConfirmation: {
    confirmationNumber: null,
    accountNumber: null,
    orderDate: null,
  },
  lastActive: null,
  startTime: null,
  completionTime: null,
  funnel: {
    entryPoint: null,
    completedSteps: [],
    timeOnSteps: {},
    revisitedSteps: [],
  },
  transferFlow: false,
  currentPlan: {
    provider: null,
    rate: null,
    term: null,
    expirationDate: null,
  }
};

// Create the context
const WizardContext = createContext<WizardContextType | undefined>(undefined);

// Create provider component
export function WizardProvider({ children }: { children: ReactNode }) {
  const { addToast } = useToast();
  const [wizardState, setWizardState] = useState<WizardState>(initialWizardState);
  const [hasInProgressSession, setHasInProgressSession] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [stepStartTime, setStepStartTime] = useState<number | null>(null);

  // Load previous session if available
  useEffect(() => {
    const savedState = loadWizardState();
    
    if (savedState) {
      // Initialize funnel tracking if it doesn't exist in saved state
      if (!savedState.funnel) {
        savedState.funnel = {
          entryPoint: null,
          completedSteps: [],
          timeOnSteps: {},
          revisitedSteps: [],
        };
      }
      
      // Check if there's an in-progress session (less than 24 hours old)
      if (savedState.lastActive) {
        const lastActive = new Date(savedState.lastActive).getTime();
        const now = new Date().getTime();
        const hoursSinceLastActive = (now - lastActive) / (1000 * 60 * 60);
        
        // Session is valid if less than 24 hours old
        if (hoursSinceLastActive < 24) {
          setHasInProgressSession(true);
          // Don't automatically load it, let the user decide
        }
      }
      
      // If this is a new session, set the start time
      if (!savedState.startTime) {
        savedState.startTime = new Date().toISOString();
      }
    }
    
    setIsInitialized(true);
  }, []);

  // Track time spent on current step
  useEffect(() => {
    // Set the start time when the current step changes
    setStepStartTime(Date.now());
    
    // Clean up function will track time spent when leaving the step
    return () => {
      if (stepStartTime) {
        const timeSpent = Date.now() - stepStartTime;
        setWizardState(prevState => {
          const stepKey = prevState.currentStep;
          const existingTime = prevState.funnel.timeOnSteps[stepKey] || 0;
          
          return {
            ...prevState,
            funnel: {
              ...prevState.funnel,
              timeOnSteps: {
                ...prevState.funnel.timeOnSteps,
                [stepKey]: existingTime + timeSpent
              }
            }
          };
        });
      }
    };
  }, [wizardState.currentStep]);

  const updateWizardState = (updates: Partial<WizardState>) => {
    setWizardState(prevState => {
      const newState = { 
        ...prevState, 
        ...updates,
        lastActive: new Date().toISOString() // Update last active timestamp
      };
      
      // Save state to localStorage
      saveWizardState(newState);
      
      return newState;
    });
  };

  const goToStep = (step: WizardStepType) => {
    // Record time spent on current step before changing
    if (stepStartTime) {
      const timeSpent = Date.now() - stepStartTime;
      const currentStep = wizardState.currentStep;
      const existingTime = wizardState.funnel.timeOnSteps[currentStep] || 0;
      
      // Check if this is a revisit to a step
      if (wizardState.funnel.completedSteps.includes(step) && !wizardState.funnel.revisitedSteps.includes(step)) {
        updateWizardState({ 
          funnel: {
            ...wizardState.funnel,
            revisitedSteps: [...wizardState.funnel.revisitedSteps, step],
            timeOnSteps: {
              ...wizardState.funnel.timeOnSteps,
              [currentStep]: existingTime + timeSpent
            }
          }
        });
      } else {
        // Just update the time
        updateWizardState({
          funnel: {
            ...wizardState.funnel,
            timeOnSteps: {
              ...wizardState.funnel.timeOnSteps,
              [currentStep]: existingTime + timeSpent
            }
          }
        });
      }
    }
    
    // Update current step
    updateWizardState({ currentStep: step });
    
    // Reset step start time
    setStepStartTime(Date.now());
  };

  // Track completion of a step
  const trackStepCompletion = (step: WizardStepType) => {
    if (!wizardState.funnel.completedSteps.includes(step)) {
      updateWizardState({
        funnel: {
          ...wizardState.funnel,
          completedSteps: [...wizardState.funnel.completedSteps, step]
        }
      });
    }
  };

  // Get time spent on a specific step
  const getStepCompletionTime = (step: WizardStepType): number | null => {
    return wizardState.funnel.timeOnSteps[step] || null;
  };

  const resetWizard = () => {
    // When resetting, mark completion time if this was a completed flow
    let newState = { ...initialWizardState };
    
    if (wizardState.orderConfirmation.confirmationNumber) {
      // This was a completed flow, record the completion time
      newState.completionTime = new Date().toISOString();
    }
    
    // Always start with a fresh start time
    newState.startTime = new Date().toISOString();
    
    // Set the new state
    setWizardState(newState);
    clearWizardState();
    setHasInProgressSession(false);
    
    // Save this new initial state
    saveWizardState(newState);
  };

  // Resume saved session
  const resumeSession = () => {
    const savedState = loadWizardState();
    if (savedState) {
      setWizardState(savedState);
      // Set entry point if not already set
      if (!savedState.funnel?.entryPoint) {
        updateWizardState({
          funnel: {
            ...savedState.funnel,
            entryPoint: 'direct'
          }
        });
      }
      addToast('info', 'Your previous session has been restored', 5000, {
        text: 'View Progress',
        onClick: () => {
          // Implement progress visualization or go to appropriate step
        }
      });
    }
    setHasInProgressSession(false);
  };

  // Discard saved session
  const discardSession = () => {
    resetWizard();
    addToast('info', 'Previous session discarded. Starting new setup.', 5000);
    setHasInProgressSession(false);
  };

  // Logic to determine if user can proceed to next step
  const canProceed = (): boolean => {
    const { currentStep } = wizardState;
    
    switch (currentStep) {
      case 'welcome':
        return wizardState.propertyType !== null;
      case 'address':
        return (
          wizardState.address.street.trim() !== '' &&
          wizardState.address.city.trim() !== '' &&
          wizardState.address.zip.trim() !== '' &&
          wizardState.moveInDate !== null &&
          wizardState.isTexasResident !== null
        );
      case 'address-confirmation':
        return wizardState.address.isValidated;
      case 'home-profile':
        return (
          wizardState.homeProfile.squareFootage !== null &&
          wizardState.homeProfile.occupants !== null
        );
      case 'plan-filters':
        return wizardState.planPreferences.contractTerm !== null;
      case 'plan-selection':
        return wizardState.selectedPlan.id !== null;
      case 'personal-details':
        return (
          wizardState.personalInfo.firstName.trim() !== '' &&
          wizardState.personalInfo.lastName.trim() !== '' &&
          wizardState.personalInfo.email.trim() !== '' &&
          wizardState.personalInfo.phone.trim() !== ''
        );
      case 'service-details':
        return (
          wizardState.serviceDetails.connectionSpeed !== null && 
          (!wizardState.serviceDetails.depositRequired || wizardState.serviceDetails.paymentMethod !== null)
        );
      default:
        return true;
    }
  };

  return (
    <WizardContext.Provider
      value={{
        wizardState,
        updateWizardState,
        goToStep,
        resetWizard,
        canProceed,
        hasInProgressSession,
        resumeSession,
        discardSession,
        trackStepCompletion,
        getStepCompletionTime,
      }}
    >
      {isInitialized && children}
    </WizardContext.Provider>
  );
}

// Create custom hook for using the context
export function useWizard() {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}