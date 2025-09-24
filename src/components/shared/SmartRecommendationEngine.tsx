import { useState, useEffect } from 'react';
import { useWizard } from '../../context/WizardContext';
import { usePersonalization } from './PersonalizationEngine';
import { ShieldCheck, Calendar, Leaf, Home, Users, Car, Droplets, Sun, DollarSign, Clock, Info, Check, Zap } from 'lucide-react';
import { cn } from '../../utils/cn';
import FeatureTestimonial from './FeatureTestimonial';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  icon: JSX.Element;
  actionText: string;
  actionHandler: () => void;
}

interface SmartRecommendationEngineProps {
  currentStep: string;
  className?: string;
}

const SmartRecommendationEngine: React.FC<SmartRecommendationEngineProps> = ({ 
  currentStep,
  className 
}) => {
  const { wizardState, updateWizardState } = useWizard();
  const { personalizationState, getPriceConsciousnessLevel } = usePersonalization();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    propertyType: string;
    homeSize: string;
    occupants: number;
    specialFeatures: string[];
    estimatedUsage: number;
    pricePreference: string;
    contractPreference: string;
  }>({
    propertyType: '',
    homeSize: '',
    occupants: 0,
    specialFeatures: [],
    estimatedUsage: 0,
    pricePreference: '',
    contractPreference: ''
  });
  const [relevantTestimonial, setRelevantTestimonial] = useState<any>(null);

  useEffect(() => {
    // Wait a moment before showing recommendations
    const timer = setTimeout(() => {
      setShowRecommendations(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Calculate estimated usage based on home profile
  const calculateEstimatedUsage = (): number => {
    let baseUsage = 0;
    
    // Square footage contribution
    baseUsage += (wizardState.homeProfile.squareFootage || 0) * 0.5;
    
    // Occupants contribution
    baseUsage += (wizardState.homeProfile.occupants || 0) * 300;
    
    // Special features
    if (wizardState.homeProfile.hasEV) baseUsage += 300;
    if (wizardState.homeProfile.hasPool) baseUsage += 500;
    if (wizardState.homeProfile.hasSolar) baseUsage -= 400;
    
    return Math.max(Math.round(baseUsage), 500);
  };

  // Build user profile for recommendations
  useEffect(() => {
    // Determine home size category
    let homeSize = 'medium';
    const sqft = wizardState.homeProfile.squareFootage || 0;
    if (sqft < 800) homeSize = 'small';
    else if (sqft > 2000) homeSize = 'large';

    // Collect special features
    const features = [];
    if (wizardState.homeProfile.hasEV) features.push('EV Charger');
    if (wizardState.homeProfile.hasPool) features.push('Swimming Pool');
    if (wizardState.homeProfile.hasSolar) features.push('Solar Panels');

    // Determine price preference
    const priceLevel = getPriceConsciousnessLevel();
    let pricePreference = 'balanced';
    if (priceLevel === 'high') pricePreference = 'budget-focused';
    else if (priceLevel === 'low') pricePreference = 'premium features';

    // Determine contract preference
    let contractPreference = '12-month';
    if (wizardState.planPreferences.contractTerm) {
      contractPreference = wizardState.planPreferences.contractTerm;
    }

    setUserProfile({
      propertyType: wizardState.propertyType || 'house',
      homeSize,
      occupants: wizardState.homeProfile.occupants || 0,
      specialFeatures: features,
      estimatedUsage: calculateEstimatedUsage(),
      pricePreference,
      contractPreference
    });
  }, [
    wizardState.propertyType,
    wizardState.homeProfile,
    wizardState.planPreferences,
    getPriceConsciousnessLevel
  ]);

  useEffect(() => {
    // Generate contextual recommendations based on current step and user behavior
    const newRecommendations: Recommendation[] = [];
    
    // Price conscious recommendations
    const isPriceConscious = getPriceConsciousnessLevel() === 'high';
    
    switch(currentStep) {
      case 'plan-filters':
        if (isPriceConscious) {
          newRecommendations.push({
            id: 'long-term-savings',
            title: 'Save with a 12-month plan',
            description: '12-month fixed-rate plans typically offer the best balance of rate and term length for most customers.',
            priority: 'high',
            icon: <Calendar className="h-5 w-5 text-primary-600 dark:text-primary-400" />,
            actionText: 'Select 12-month term',
            actionHandler: () => {
              updateWizardState({
                planPreferences: {
                  ...wizardState.planPreferences,
                  contractTerm: '12-month'
                }
              });
            }
          });
        }
        
        // Check if user might want renewable energy
        if (!wizardState.planPreferences.isRenewable && personalizationState.userPreferences.greenEnergy) {
          newRecommendations.push({
            id: 'green-energy',
            title: 'Green energy plans',
            description: 'Renewable energy plans are now competitively priced and better for the environment.',
            priority: 'medium',
            icon: <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />,
            actionText: 'See renewable plans',
            actionHandler: () => {
              updateWizardState({
                planPreferences: {
                  ...wizardState.planPreferences,
                  isRenewable: true
                }
              });
            }
          });
        }
        break;
        
      case 'service-details':
        // If deposit required but no SSN provided (which could waive deposit)
        if (wizardState.serviceDetails.depositRequired && !wizardState.personalInfo.lastFourSSN) {
          newRecommendations.push({
            id: 'deposit-waiver',
            title: 'Avoid the security deposit',
            description: 'You may qualify for a deposit waiver with a quick credit check.',
            priority: 'high',
            icon: <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />,
            actionText: 'See if you qualify',
            actionHandler: () => {
              // Go back to personal details and suggest adding SSN
              updateWizardState({
                currentStep: 'personal-details'
              });
            }
          });
        }
        break;
    }
    
    setRecommendations(newRecommendations);

    // Set a relevant testimonial for plan-selection step
    if (currentStep === 'plan-selection') {
      // Find a relevant testimonial based on filters
      if (wizardState.planPreferences.contractTerm) {
        const matchingTermTestimonial = planTestimonials.find(t => 
          t.showForTerms?.includes(wizardState.planPreferences.contractTerm || '')
        );
        if (matchingTermTestimonial) setRelevantTestimonial(matchingTermTestimonial);
      } else if (wizardState.planPreferences.isRenewable) {
        const renewableTestimonial = planTestimonials.find(t => 
          t.showForFeatures?.includes('renewable')
        );
        if (renewableTestimonial) setRelevantTestimonial(renewableTestimonial);
      } else if (wizardState.planPreferences.requiresNoDeposit) {
        const noDepositTestimonial = planTestimonials.find(t => 
          t.showForFeatures?.includes('no-deposit')
        );
        if (noDepositTestimonial) setRelevantTestimonial(noDepositTestimonial);
      } else {
        // Default to a random testimonial
        setRelevantTestimonial(planTestimonials[Math.floor(Math.random() * planTestimonials.length)]);
      }
    }
  }, [currentStep, wizardState, updateWizardState, personalizationState, getPriceConsciousnessLevel]);

  if (!showRecommendations && recommendations.length === 0 && currentStep !== 'plan-selection') {
    return null;
  }

  // Special case for plan selection page - show more detailed info
  if (currentStep === 'plan-selection') {
    return (
      <div className={cn("dashboard-card space-y-3 animate-fade-in", className)}>
        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">Your Personalized Recommendations</h3>

        {/* Pricing Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 shadow-sm mb-4">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">All-In Pricing Displayed</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                All plans show "all-in" pricing that includes energy charges, transmission fees, and monthly service fees. No surprises on your bill!
              </p>
              <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
                <div className="flex items-center text-xs text-blue-700 dark:text-blue-300">
                  <Check className="h-3 w-3 text-blue-600 dark:text-blue-400 mr-1" />
                  Energy charges
                </div>
                <div className="flex items-center text-xs text-blue-700 dark:text-blue-300">
                  <Check className="h-3 w-3 text-blue-600 dark:text-blue-400 mr-1" />
                  Transmission fees
                </div>
                <div className="flex items-center text-xs text-blue-700 dark:text-blue-300">
                  <Check className="h-3 w-3 text-blue-600 dark:text-blue-400 mr-1" />
                  Monthly service fees
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage indicator */}
        <div className="mb-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 shadow-sm">
          <div className="flex items-center">
            <ElectricityIcon className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
            <div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Estimated Monthly Usage
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {userProfile.estimatedUsage.toLocaleString()} kWh
              </div>
            </div>
          </div>
        </div>
        
        {/* Customer testimonial */}
        {relevantTestimonial && (
          <div className="mb-4">
            <FeatureTestimonial
              quote={relevantTestimonial.quote}
              author={relevantTestimonial.author}
              feature={relevantTestimonial.feature}
              rating={relevantTestimonial.rating}
              theme="primary"
            />
          </div>
        )}
        
        <div className="bg-primary-50 dark:bg-primary-900/30 rounded-lg p-4 border border-primary-100 dark:border-primary-800">
          <h4 className="text-sm font-medium text-primary-800 dark:text-primary-200 mb-3">Based on Your Profile</h4>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <Home className="h-4 w-4 text-primary-600 dark:text-primary-400 mt-0.5 mr-2 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-medium text-primary-700 dark:text-primary-300">
                  {userProfile.propertyType === 'apartment' ? 'Apartment' : userProfile.propertyType === 'condo' ? 'Condo' : userProfile.propertyType === 'townhome' ? 'Townhome' : 'House'}
                  {userProfile.homeSize && ` (${userProfile.homeSize}, ${wizardState.homeProfile.squareFootage} sq ft)`}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Users className="h-4 w-4 text-primary-600 dark:text-primary-400 mt-0.5 mr-2 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-medium text-primary-700 dark:text-primary-300">
                  {userProfile.occupants} {userProfile.occupants === 1 ? 'person' : 'people'} in household
                </p>
              </div>
            </div>
            
            {userProfile.specialFeatures.length > 0 && (
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-2">
                  {userProfile.specialFeatures.includes('EV Charger') ? (
                    <Car className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  ) : userProfile.specialFeatures.includes('Swimming Pool') ? (
                    <Droplets className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  ) : (
                    <Sun className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-primary-700 dark:text-primary-300">
                    Special features: {userProfile.specialFeatures.join(', ')}
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex items-start">
              <Calendar className="h-4 w-4 text-primary-600 dark:text-primary-400 mt-0.5 mr-2 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-medium text-primary-700 dark:text-primary-300">
                  Preferred term: {userProfile.contractPreference}
                </p>
              </div>
            </div>
            
            {wizardState.planPreferences.isRenewable && (
              <div className="flex items-start">
                <Leaf className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-green-700 dark:text-green-300">
                    Preference for renewable energy
                  </p>
                </div>
              </div>
            )}
            
            {wizardState.planPreferences.requiresNoDeposit && (
              <div className="flex items-start">
                <DollarSign className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                    Preference for no-deposit plans
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {recommendations.length > 0 && (
          <div className="space-y-3 mt-4">
            {recommendations.map(rec => (
              <div 
                key={rec.id}
                className={cn(
                  "border rounded-lg p-3 transition-all",
                  rec.priority === 'high' ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/30' :
                  rec.priority === 'medium' ? 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30' :
                  'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                )}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5 mr-3">
                    {rec.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{rec.title}</h4>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                      {rec.description}
                    </p>
                    <button
                      type="button"
                      onClick={rec.actionHandler}
                      className={cn(
                        "mt-2 text-xs font-medium px-2 py-1 rounded",
                        rec.priority === 'high' ? 'bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-700' :
                        rec.priority === 'medium' ? 'bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-700' :
                        'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      )}
                    >
                      {rec.actionText}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // For other steps, show regular recommendations
  if (!showRecommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className={cn("dashboard-card space-y-3 animate-fade-in", className)}>
      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">Recommendations</h3>
      
      {recommendations.map(rec => (
        <div 
          key={rec.id}
          className={cn(
            "border rounded-lg p-3 transition-all",
            rec.priority === 'high' ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/30' :
            rec.priority === 'medium' ? 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30' :
            'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
          )}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5 mr-3">
              {rec.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">{rec.title}</h4>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                {rec.description}
              </p>
              <button
                type="button"
                onClick={rec.actionHandler}
                className={cn(
                  "mt-2 text-xs font-medium px-2 py-1 rounded",
                  rec.priority === 'high' ? 'bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-700' :
                  rec.priority === 'medium' ? 'bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-700' :
                  'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                {rec.actionText}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Custom electricity icon
function ElectricityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13 10V3L4 14H11V21L20 10H13Z" />
    </svg>
  );
}

// Mock testimonials for plan types
const planTestimonials = [
  {
    feature: "12-month plans",
    quote: "I locked in a 12-month fixed rate and saved over $400 compared to my variable rate plan. Perfect balance of savings and flexibility!",
    author: { name: "Michael T.", location: "Dallas, TX" },
    rating: 5,
    showForTerms: ['12-month']
  },
  {
    feature: "Green energy",
    quote: "Switching to a renewable plan was easier than I thought and only cost 0.2¢ more per kWh. Love knowing my electricity comes from Texas wind farms!",
    author: { name: "Sarah K.", location: "Austin, TX" },
    rating: 5,
    showForFeatures: ['renewable']
  },
  {
    feature: "No deposit plans",
    quote: "As a first-time renter, I was worried about paying a huge deposit. The no-deposit plan saved me $200 upfront when I really needed it.",
    author: { name: "Jason R.", location: "Houston, TX" },
    rating: 5,
    showForFeatures: ['no-deposit']
  },
  {
    feature: "Long-term plans",
    quote: "Locked in a 24-month plan right before rates increased by 15%. My neighbors are all paying more now while my rate is guaranteed.",
    author: { name: "Melissa P.", location: "San Antonio, TX" },
    rating: 5,
    showForTerms: ['24-month']
  },
  {
    feature: "Flexible plans",
    quote: "The month-to-month plan was perfect while I decided if I was staying in Texas. No cancellation fees when I got a job offer in another state!",
    author: { name: "David W.", location: "Fort Worth, TX" },
    rating: 4,
    showForTerms: ['1-month', '3-month']
  },
];

export default SmartRecommendationEngine;