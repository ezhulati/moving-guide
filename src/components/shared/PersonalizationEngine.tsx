import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useWizard } from '../../context/WizardContext';

// Enhanced PersonalizationState interface with more detailed preference and behavior tracking
interface PersonalizationState {
  userPreferences: {
    priceConsciousness: number; // 1-10 scale
    valuedFeatures: string[];
    greenEnergy: boolean;
    riskTolerance: number; // 1-10 scale
    depositsAversion: boolean;
    billCredit: boolean; // Preference for plans with bill credits
    preferredProviders: string[]; // List of preferred electricity providers
    serviceSpeed: 'standard' | 'priority' | null; // Connection speed preference
    usageHabits: 'low' | 'medium' | 'high' | 'erratic' | null; // Usage pattern
    paymentPreferences: 'autopay' | 'manual' | null; // Payment method preference
  };
  userBehaviors: {
    pageViews: number;
    timeSpent: number; // in seconds
    interactionCount: number;
    abandonmentPoints: string[];
    hasComparedPlans: boolean;
    clickedFeatures: string[]; // Which features the user has clicked on
    mostViewedProviders: string[]; // Providers the user has shown interest in
    planFilters: string[]; // Which filters they've applied
    searchTerms: string[]; // What they've searched for
    deviceType: 'mobile' | 'tablet' | 'desktop';
    timeOfDay: string; // When they're using the app
  };
  uiPreferences: {
    detailLevel: 'minimal' | 'standard' | 'detailed';
    visualization: 'chart' | 'table' | 'card';
    colorTheme: 'light' | 'dark' | 'system';
    fontSizePreference: 'small' | 'medium' | 'large';
  };
}

interface PersonalizationContextType {
  personalizationState: PersonalizationState;
  updatePreferences: (updates: Partial<PersonalizationState['userPreferences']>) => void;
  updateBehaviors: (updates: Partial<PersonalizationState['userBehaviors']>) => void;
  updateUiPreferences: (updates: Partial<PersonalizationState['uiPreferences']>) => void;
  getPriceConsciousnessLevel: () => 'low' | 'medium' | 'high';
  getRiskToleranceLevel: () => 'low' | 'medium' | 'high';
  getPersonalizedPlanRecommendation: () => string;
  getPersonalizedMessage: () => string;
  trackFeatureClick: (feature: string) => void;
  trackProviderView: (provider: string) => void;
  trackSearch: (term: string) => void;
  resetPersonalization: () => void;
  injectPersonalization: (component: ReactNode) => ReactNode;
}

// Enhanced default personalization state
const initialState: PersonalizationState = {
  userPreferences: {
    priceConsciousness: 5, // default to middle
    valuedFeatures: [],
    greenEnergy: false,
    riskTolerance: 5, // default to middle
    depositsAversion: false,
    billCredit: false,
    preferredProviders: [],
    serviceSpeed: null,
    usageHabits: null,
    paymentPreferences: null
  },
  userBehaviors: {
    pageViews: 0,
    timeSpent: 0,
    interactionCount: 0,
    abandonmentPoints: [],
    hasComparedPlans: false,
    clickedFeatures: [],
    mostViewedProviders: [],
    planFilters: [],
    searchTerms: [],
    deviceType: 'desktop',
    timeOfDay: ''
  },
  uiPreferences: {
    detailLevel: 'standard',
    visualization: 'card',
    colorTheme: 'system',
    fontSizePreference: 'medium'
  }
};

// Create the context
const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

// Storage key
const STORAGE_KEY = 'powerMoverPersonalization';

// Provider component
export const PersonalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { wizardState } = useWizard();
  const [personalizationState, setPersonalizationState] = useState<PersonalizationState>(initialState);
  const [isInitialized, setIsInitialized] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());

  // Load state from local storage on initial render
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        setPersonalizationState(JSON.parse(savedState));
      }
      
      // Detect device type
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      
      // Update device type in state
      setPersonalizationState(prev => ({
        ...prev,
        userBehaviors: {
          ...prev.userBehaviors,
          deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
          timeOfDay: getTimeOfDay()
        }
      }));
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Error loading personalization data:', error);
      setIsInitialized(true);
    }
  }, []);
  
  // Get time of day (morning, afternoon, evening, night)
  const getTimeOfDay = (): string => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  };

  // Update preferences
  const updatePreferences = (updates: Partial<PersonalizationState['userPreferences']>) => {
    setPersonalizationState(prev => {
      const newState = {
        ...prev,
        userPreferences: { ...prev.userPreferences, ...updates }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  };

  // Update behaviors
  const updateBehaviors = (updates: Partial<PersonalizationState['userBehaviors']>) => {
    setPersonalizationState(prev => {
      const newState = {
        ...prev,
        userBehaviors: { ...prev.userBehaviors, ...updates }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  };

  // Update UI preferences
  const updateUiPreferences = (updates: Partial<PersonalizationState['uiPreferences']>) => {
    setPersonalizationState(prev => {
      const newState = {
        ...prev,
        uiPreferences: { ...prev.uiPreferences, ...updates }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  };
  
  // Track feature clicks
  const trackFeatureClick = useCallback((feature: string) => {
    setPersonalizationState(prev => {
      const clickedFeatures = [...prev.userBehaviors.clickedFeatures];
      if (!clickedFeatures.includes(feature)) {
        clickedFeatures.push(feature);
      }
      
      const newState = {
        ...prev,
        userBehaviors: {
          ...prev.userBehaviors,
          clickedFeatures,
          interactionCount: prev.userBehaviors.interactionCount + 1
        }
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  }, []);
  
  // Track provider views
  const trackProviderView = useCallback((provider: string) => {
    setPersonalizationState(prev => {
      // Keep track of the 3 most viewed providers
      const viewedProviders = [...prev.userBehaviors.mostViewedProviders];
      
      // If provider is already in the list, move it to the front
      const existingIndex = viewedProviders.indexOf(provider);
      if (existingIndex !== -1) {
        viewedProviders.splice(existingIndex, 1);
      }
      
      // Add to the front of the list
      viewedProviders.unshift(provider);
      
      // Keep only the top 3
      const topProviders = viewedProviders.slice(0, 3);
      
      const newState = {
        ...prev,
        userBehaviors: {
          ...prev.userBehaviors,
          mostViewedProviders: topProviders
        }
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  }, []);
  
  // Track search terms
  const trackSearch = useCallback((term: string) => {
    setPersonalizationState(prev => {
      const searchTerms = [...prev.userBehaviors.searchTerms];
      if (!searchTerms.includes(term)) {
        searchTerms.push(term);
      }
      
      const newState = {
        ...prev,
        userBehaviors: {
          ...prev.userBehaviors,
          searchTerms,
          interactionCount: prev.userBehaviors.interactionCount + 1
        }
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  }, []);
  
  // Get price consciousness level
  const getPriceConsciousnessLevel = (): 'low' | 'medium' | 'high' => {
    if (personalizationState.userPreferences.priceConsciousness <= 3) return 'low';
    if (personalizationState.userPreferences.priceConsciousness >= 7) return 'high';
    return 'medium';
  };
  
  // Get risk tolerance level
  const getRiskToleranceLevel = (): 'low' | 'medium' | 'high' => {
    if (personalizationState.userPreferences.riskTolerance <= 3) return 'low';
    if (personalizationState.userPreferences.riskTolerance >= 7) return 'high';
    return 'medium';
  };
  
  // Get personalized plan recommendation based on user preferences and behaviors
  const getPersonalizedPlanRecommendation = (): string => {
    const { userPreferences, userBehaviors } = personalizationState;
    
    // Price-conscious user with high risk tolerance
    if (getPriceConsciousnessLevel() === 'high' && getRiskToleranceLevel() === 'high') {
      return 'variable-rate plans with low introductory rates';
    }
    
    // Price-conscious user with low risk tolerance
    if (getPriceConsciousnessLevel() === 'high' && getRiskToleranceLevel() === 'low') {
      return '12-month fixed-rate value plans';
    }
    
    // Green energy enthusiast
    if (userPreferences.greenEnergy) {
      return '100% renewable energy plans';
    }
    
    // User concerned about deposits
    if (userPreferences.depositsAversion) {
      return 'no-deposit plans with good rates';
    }
    
    // User with large home / high usage
    if (wizardState.homeProfile.squareFootage && wizardState.homeProfile.squareFootage > 2000) {
      return 'tiered-rate plans with bill credits at high usage levels';
    }
    
    // Default recommendation for most users
    return '12-month fixed-rate plans with competitive rates';
  };
  
  // Get a personalized message based on user's profile
  const getPersonalizedMessage = (): string => {
    const { userPreferences, userBehaviors } = personalizationState;
    
    // Time-based greeting
    let greeting = '';
    if (userBehaviors.timeOfDay === 'morning') greeting = 'Good morning! ';
    if (userBehaviors.timeOfDay === 'afternoon') greeting = 'Good afternoon! ';
    if (userBehaviors.timeOfDay === 'evening') greeting = 'Good evening! ';
    if (userBehaviors.timeOfDay === 'night') greeting = 'Hello night owl! ';
    
    // Price-conscious message
    if (getPriceConsciousnessLevel() === 'high') {
      return `${greeting}Based on your preferences, we've highlighted the most budget-friendly plans for you.`;
    }
    
    // Green energy message
    if (userPreferences.greenEnergy) {
      return `${greeting}Looking for eco-friendly options? We've found the best renewable energy plans for your home.`;
    }
    
    // Large house message
    if (wizardState.homeProfile.squareFootage && wizardState.homeProfile.squareFootage > 2000) {
      return `${greeting}For your larger home, we've found plans with excellent rates at higher usage levels.`;
    }
    
    // Default message
    return `${greeting}We've personalized these recommendations based on your preferences and home profile.`;
  };

  // Reset personalization
  const resetPersonalization = () => {
    setPersonalizationState(initialState);
    localStorage.removeItem(STORAGE_KEY);
  };
  
  // Track page views and time spent
  useEffect(() => {
    // Update page views
    updateBehaviors({
      pageViews: personalizationState.userBehaviors.pageViews + 1
    });
    
    // Set up interval to track time spent
    const interval = setInterval(() => {
      const timeSpentSoFar = Math.floor((Date.now() - sessionStartTime) / 1000);
      updateBehaviors({
        timeSpent: personalizationState.userBehaviors.timeSpent + 5 // Add 5 seconds every interval
      });
    }, 5000);
    
    // Track window resize for responsive design adjustments
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      
      updateBehaviors({
        deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [personalizationState.userBehaviors.pageViews, personalizationState.userBehaviors.timeSpent]);

  // Analyze wizard state to infer preferences
  useEffect(() => {
    if (!isInitialized) return;
    
    // Infer price consciousness
    if (wizardState.selectedPlan.id) {
      // Selected the lowest priced plan = price conscious
      if (wizardState.selectedPlan.rate && wizardState.selectedPlan.rate < 11) {
        updatePreferences({ priceConsciousness: 8 });
      }
      
      // Selected green energy plan = environmentally conscious
      if (wizardState.planPreferences.isRenewable) {
        updatePreferences({ greenEnergy: true });
      }
      
      // Selected no deposit plan = deposit averse
      if (wizardState.planPreferences.requiresNoDeposit) {
        updatePreferences({ depositsAversion: true });
      }
      
      // Contract term preference indicates risk tolerance
      if (wizardState.planPreferences.contractTerm === '1-month' || 
          wizardState.planPreferences.contractTerm === '3-month') {
        updatePreferences({ riskTolerance: 8 }); // High risk tolerance (values flexibility)
      } else if (wizardState.planPreferences.contractTerm === '24-month') {
        updatePreferences({ riskTolerance: 2 }); // Low risk tolerance (values certainty)
      }
      
      // Selected service speed indicates urgency preference
      if (wizardState.serviceDetails.connectionSpeed === 'same-day') {
        updatePreferences({ serviceSpeed: 'priority' });
      } else if (wizardState.serviceDetails.connectionSpeed === 'standard') {
        updatePreferences({ serviceSpeed: 'standard' });
      }
    }
    
    // Track valued features
    const valuedFeatures: string[] = [];
    if (wizardState.planPreferences.isRenewable) valuedFeatures.push('renewable');
    if (wizardState.planPreferences.hasSatisfactionGuarantee) valuedFeatures.push('satisfaction-guarantee');
    if (wizardState.planPreferences.requiresNoDeposit) valuedFeatures.push('no-deposit');
    
    if (valuedFeatures.length > 0) {
      updatePreferences({ valuedFeatures });
    }
    
    // Track behaviors
    updateBehaviors({
      pageViews: personalizationState.userBehaviors.pageViews + 1
    });
    
    // Track provider preference if a plan is selected
    if (wizardState.selectedPlan.provider) {
      trackProviderView(wizardState.selectedPlan.provider);
    }
    
  }, [wizardState.selectedPlan, wizardState.planPreferences, isInitialized]);

  // Inject personalization into components
  const injectPersonalization = (component: ReactNode): ReactNode => {
    // In a real implementation, this would dynamically modify components based on personalization
    return component;
  };

  return (
    <PersonalizationContext.Provider value={{
      personalizationState,
      updatePreferences,
      updateBehaviors,
      updateUiPreferences,
      getPriceConsciousnessLevel,
      getRiskToleranceLevel,
      getPersonalizedPlanRecommendation,
      getPersonalizedMessage,
      trackFeatureClick,
      trackProviderView,
      trackSearch,
      resetPersonalization,
      injectPersonalization
    }}>
      {children}
    </PersonalizationContext.Provider>
  );
};

// Custom hook for using personalization
export const usePersonalization = () => {
  const context = useContext(PersonalizationContext);
  if (context === undefined) {
    throw new Error('usePersonalization must be used within a PersonalizationProvider');
  }
  return context;
};