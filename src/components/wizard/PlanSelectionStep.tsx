import { useWizard } from '../../context/WizardContext';
import { useToast } from '../../context/ToastContext';
import { Check, Info, Leaf, ShieldCheck, DollarSign, Loader, Search, Sliders, Filter, Eye, Star, Clock, AlertCircle, ArrowUpDown, BarChart2, ChevronDown, HelpCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';
import Spinner from '../shared/Spinner';
import SkeletonLoader, { TextSkeleton } from '../shared/SkeletonLoader';
import PlanComparisonModal from '../shared/PlanComparisonModal';
import PlanComparisonCard from '../shared/PlanComparisonCard';
import FeatureTestimonial from '../shared/FeatureTestimonial';
import PlanDetailAccordion from '../shared/PlanDetailAccordion';

// Mock electricity plans with more detailed data
const mockPlans = [
  {
    id: 'plan1',
    name: 'Texas Saver 12',
    provider: 'Energy Texas',
    logo: 'energy-texas',
    term: '12 months',
    rate: 10.9,
    rateUnit: '¢/kWh',
    features: ['renewable', 'guarantee'],
    estimatedBill: {
      '500': 54.5,
      '1000': 109,
      '2000': 218,
    },
    bestMatch: true,
    cancellationFee: 150,
    satisfaction: 4.8,
    reviewCount: 245,
    details: [
      { name: "Base Energy Charge", value: "10.9¢/kWh" },
      { name: "Oncor Delivery", value: "Included" },
      { name: "Base Monthly Fee", value: "$0.00" },
      { name: "Early Termination Fee", value: "$150.00" }
    ],
    incentives: "Free nights 8pm-6am",
    popularity: "Most popular"
  },
  {
    id: 'plan2',
    name: 'Lone Star Value 6',
    provider: 'TXU Energy',
    logo: 'txu',
    term: '6 months',
    rate: 11.5,
    rateUnit: '¢/kWh',
    features: ['guarantee', 'no-deposit'],
    estimatedBill: {
      '500': 57.5,
      '1000': 115,
      '2000': 230,
    },
    bestMatch: false,
    cancellationFee: 75,
    satisfaction: 4.2,
    reviewCount: 312,
    details: [
      { name: "Base Energy Charge", value: "11.5¢/kWh" },
      { name: "Oncor Delivery", value: "Included" },
      { name: "Base Monthly Fee", value: "$0.00" },
      { name: "Early Termination Fee", value: "$75.00" }
    ],
    incentives: "$50 bill credit at signup",
    popularity: "Great value"
  },
  {
    id: 'plan3',
    name: 'Green Texas 12',
    provider: 'Green Mountain Energy',
    logo: 'green-mountain',
    term: '12 months',
    rate: 12.2,
    rateUnit: '¢/kWh',
    features: ['renewable', 'no-deposit'],
    estimatedBill: {
      '500': 61,
      '1000': 122,
      '2000': 244,
    },
    bestMatch: false,
    cancellationFee: 150,
    satisfaction: 4.5,
    reviewCount: 187,
    details: [
      { name: "Base Energy Charge", value: "12.2¢/kWh" },
      { name: "Oncor Delivery", value: "Included" },
      { name: "Base Monthly Fee", value: "$0.00" },
      { name: "Early Termination Fee", value: "$150.00" }
    ],
    incentives: "100% renewable energy",
    popularity: "Most eco-friendly"
  },
  {
    id: 'plan4',
    name: 'Freedom Plan',
    provider: 'Reliant Energy',
    logo: 'reliant',
    term: '1 month',
    rate: 13.8,
    rateUnit: '¢/kWh',
    features: ['no-deposit'],
    estimatedBill: {
      '500': 69,
      '1000': 138,
      '2000': 276,
    },
    bestMatch: false,
    cancellationFee: 0,
    satisfaction: 4.0,
    reviewCount: 203,
    details: [
      { name: "Base Energy Charge", value: "13.8¢/kWh" },
      { name: "Oncor Delivery", value: "Included" },
      { name: "Base Monthly Fee", value: "$9.95" },
      { name: "Early Termination Fee", value: "None" }
    ],
    incentives: "No long-term contract",
    popularity: "Most flexible"
  },
  {
    id: 'plan5',
    name: 'Power Saver 24',
    provider: 'Constellation',
    logo: 'constellation',
    term: '24 months',
    rate: 10.5,
    rateUnit: '¢/kWh',
    features: ['guarantee'],
    estimatedBill: {
      '500': 52.5,
      '1000': 105,
      '2000': 210,
    },
    bestMatch: false,
    cancellationFee: 200,
    satisfaction: 4.3,
    reviewCount: 178,
    details: [
      { name: "Base Energy Charge", value: "10.5¢/kWh" },
      { name: "Oncor Delivery", value: "Included" },
      { name: "Base Monthly Fee", value: "$0.00" },
      { name: "Early Termination Fee", value: "$200.00" }
    ],
    incentives: "Price protected for 2 years",
    popularity: "Best long-term rate"
  },
  {
    id: 'plan6',
    name: 'Texas Fixed 12',
    provider: 'Cirro Energy',
    logo: 'cirro',
    term: '12 months',
    rate: 11.2,
    rateUnit: '¢/kWh',
    features: ['guarantee'],
    estimatedBill: {
      '500': 56.0,
      '1000': 112,
      '2000': 224,
    },
    bestMatch: false,
    cancellationFee: 150,
    satisfaction: 4.1,
    reviewCount: 142,
    details: [
      { name: "Base Energy Charge", value: "11.2¢/kWh" },
      { name: "Oncor Delivery", value: "Included" },
      { name: "Base Monthly Fee", value: "$0.00" },
      { name: "Early Termination Fee", value: "$150.00" }
    ],
    incentives: "$100 bill credit at 12 months",
    popularity: "Good balanced option"
  },
  {
    id: 'plan7',
    name: 'Eco Green 24',
    provider: 'Gexa Energy',
    logo: 'gexa',
    term: '24 months',
    rate: 11.8,
    rateUnit: '¢/kWh',
    features: ['renewable', 'guarantee'],
    estimatedBill: {
      '500': 59.0,
      '1000': 118,
      '2000': 236,
    },
    bestMatch: false,
    cancellationFee: 200,
    satisfaction: 4.4,
    reviewCount: 156,
    details: [
      { name: "Base Energy Charge", value: "11.8¢/kWh" },
      { name: "Oncor Delivery", value: "Included" },
      { name: "Base Monthly Fee", value: "$0.00" },
      { name: "Early Termination Fee", value: "$200.00" }
    ],
    incentives: "100% Texas wind power",
    popularity: "Great green value"
  },
  {
    id: 'plan8',
    name: 'Basic Power 6',
    provider: '4Change Energy',
    logo: '4change',
    term: '6 months',
    rate: 11.0,
    rateUnit: '¢/kWh',
    features: ['no-deposit'],
    estimatedBill: {
      '500': 55.0,
      '1000': 110,
      '2000': 220,
    },
    bestMatch: false,
    cancellationFee: 75,
    satisfaction: 3.9,
    reviewCount: 124,
    details: [
      { name: "Base Energy Charge", value: "11.0¢/kWh" },
      { name: "Oncor Delivery", value: "Included" },
      { name: "Base Monthly Fee", value: "$0.00" },
      { name: "Early Termination Fee", value: "$75.00" }
    ],
    incentives: "$25 for each referral",
    popularity: "Budget friendly"
  }
];

interface Plan {
  id: string;
  name: string;
  provider: string;
  logo: string;
  term: string;
  rate: number;
  rateUnit: string;
  features: string[];
  estimatedBill: {
    [key: string]: number;
  };
  bestMatch: boolean;
  cancellationFee: number;
  satisfaction: number;
  reviewCount: number;
  details: Array<{name: string; value: string}>;
  incentives: string;
  popularity: string;
}

// Component for a single plan card
const PlanCard = ({ 
  plan, 
  estimatedUsage,
  isSelected,
  onSelect,
  isSelecting,
  expanded,
  onToggleExpand,
  onCompare
}: { 
  plan: Plan;
  estimatedUsage: number;
  isSelected: boolean;
  onSelect: (plan: Plan) => void;
  isSelecting: boolean;
  expanded: boolean;
  onToggleExpand: (planId: string) => void;
  onCompare: (plan: Plan) => void;
}) => {
  // Find the closest usage tier for estimation
  const getClosestUsageTier = (usage: number): string => {
    const tiers = Object.keys(plan.estimatedBill).map(Number);
    const closest = tiers.reduce((prev, curr) => 
      Math.abs(curr - usage) < Math.abs(prev - usage) ? curr : prev
    );
    return closest.toString();
  };

  const usageTier = getClosestUsageTier(estimatedUsage);
  const estimatedMonthlyBill = plan.estimatedBill[usageTier];
  
  // Animation delay for staggered entrance
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Render star rating
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center text-yellow-400">
        {Array(5).fill(0).map((_, i) => (
          <Star 
            key={i} 
            className={`h-3.5 w-3.5 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div 
      className={cn(
        "border rounded-xl transition-all relative flex flex-col h-full",
        isSelected 
          ? "border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/30 shadow-md" 
          : plan.bestMatch 
            ? "border-success-300 dark:border-success-700 bg-success-50 dark:bg-success-900/20 hover:border-success-400 dark:hover:border-success-600 hover:shadow-md" 
            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md",
        isSelecting && !isSelected ? "opacity-60 pointer-events-none" : "cursor-pointer",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        expanded && "shadow-lg"
      )}
      onClick={(e) => {
        // If clicking on the expand button or compare button, don't select the plan
        if ((e.target as HTMLElement).closest('.expand-btn') || 
            (e.target as HTMLElement).closest('.compare-btn')) {
          return;
        }
        
        if (!isSelecting) {
          onSelect(plan);
        }
      }}
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          !isSelecting && onSelect(plan);
        }
      }}
      style={{ transition: "all 0.3s ease" }}
    >
      {/* Popular tag */}
      {plan.popularity && (
        <div className="absolute -top-3 right-4 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300 text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
          {plan.popularity}
        </div>
      )}
      
      <div className="p-5 flex-grow flex flex-col">
        {/* Header section */}
        <div className="flex justify-between items-start mb-4">
          <div>
            {plan.bestMatch && (
              <div className="bg-success-100 dark:bg-success-900/50 text-success-800 dark:text-success-300 text-xs font-bold px-2 py-0.5 rounded-full inline-flex items-center mb-2">
                <Check className="h-3 w-3 mr-1" />
                Perfect Match for You
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
            <div className="flex items-center mt-1">
              <p className="text-gray-600 dark:text-gray-400">{plan.provider}</p>
              <div className="ml-2">
                {renderStarRating(plan.satisfaction)}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg shadow-sm flex flex-col items-center border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">Contract</p>
            <p className="font-medium text-gray-900 dark:text-gray-200">{plan.term}</p>
          </div>
        </div>
        
        {/* Rate section */}
        <div className="flex items-baseline mb-4">
          <span className="text-3xl font-bold text-primary-700 dark:text-primary-400">{plan.rate}</span>
          <span className="ml-1 text-gray-600 dark:text-gray-400">¢/kWh</span>
          {plan.incentives && (
            <div className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded truncate max-w-[200px]">
              {plan.incentives}
            </div>
          )}
        </div>
        
        {/* Monthly bill estimate */}
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Your Monthly Bill:</span>
            <span className="text-lg font-bold text-primary-700 dark:text-primary-400">${estimatedMonthlyBill}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Based on your estimated usage of {estimatedUsage} kWh/month
          </p>
        </div>
        
        {/* Features section */}
        <div className="flex flex-wrap gap-2 mb-4">
          {plan.features.includes('renewable') && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
              <Leaf className="h-3 w-3 mr-1" />
              100% Renewable
            </span>
          )}
          {plan.features.includes('guarantee') && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
              <ShieldCheck className="h-3 w-3 mr-1" />
              Satisfaction Guarantee
            </span>
          )}
          {plan.features.includes('no-deposit') && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
              <DollarSign className="h-3 w-3 mr-1" />
              No Security Deposit
            </span>
          )}
        </div>
      </div>

      {/* Footer section with actions */}
      <div className="px-5 pb-5 pt-2 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {plan.cancellationFee > 0 ? 
              `Cancel fee: $${plan.cancellationFee}` : 
              "No cancellation fee"}
          </span>
          
          <div className="flex space-x-3">
            <button 
              className="compare-btn text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-xs flex items-center focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                onCompare(plan);
              }}
            >
              <ArrowUpDown className="h-3 w-3 mr-1" />
              Compare
            </button>
            
            <button 
              className="expand-btn text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-xs flex items-center focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(plan.id);
              }}
            >
              {expanded ? "Hide details" : "Show details"}
              <ChevronDown 
                className={cn(
                  "h-4 w-4 ml-1 transition-transform", 
                  expanded && "rotate-180"
                )} 
              />
            </button>
          </div>
        </div>
      </div>
      
      {/* Expanded details section */}
      {expanded && (
        <PlanDetailAccordion plan={plan} />
      )}
      
      {/* Selected state */}
      {isSelected && (
        <div className="border-t border-primary-200 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/30 py-3 px-5 rounded-b-lg">
          <span className="inline-flex items-center text-primary-700 dark:text-primary-400 font-medium">
            <Check className="h-5 w-5 mr-2" />
            Plan Selected
          </span>
        </div>
      )}
      
      {/* Loading overlay */}
      {isSelecting && isSelected && (
        <div className="absolute inset-0 bg-white/70 dark:bg-gray-800/70 flex items-center justify-center rounded-lg">
          <Spinner size="md" color="primary" />
        </div>
      )}
    </div>
  );
};

// Component for plan skeleton loader when data is being fetched
const PlanCardSkeleton = () => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <SkeletonLoader width="150px" height="28px" className="mb-2" />
          <SkeletonLoader width="120px" height="20px" />
        </div>
        <SkeletonLoader width="60px" height="60px" rounded="md" />
      </div>
      
      <SkeletonLoader width="120px" height="36px" className="mb-4" />
      
      <SkeletonLoader width="100%" height="80px" className="mb-4" rounded="md" />
      
      <div className="flex gap-2 mb-4">
        <SkeletonLoader width="80px" height="24px" rounded="full" />
        <SkeletonLoader width="140px" height="24px" rounded="full" />
      </div>
      
      <SkeletonLoader width="100%" height="1px" className="mb-4" />
      
      <div className="flex justify-between">
        <SkeletonLoader width="120px" height="16px" />
        <SkeletonLoader width="80px" height="16px" />
      </div>
    </div>
  );
};

const PlanSelectionStep = () => {
  const { wizardState, updateWizardState } = useWizard();
  const { addToast } = useToast();
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
  const [sortOption, setSortOption] = useState<string>('bestMatch');
  const [isLoading, setIsLoading] = useState(true);
  const [isSelecting, setIsSelecting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllPlans, setShowAllPlans] = useState(false);
  const [expandedPlans, setExpandedPlans] = useState<string[]>([]);
  const [maxRateFilter, setMaxRateFilter] = useState<number | null>(wizardState.planPreferences.maxRate || 15);
  const [showMaxRateFilter, setShowMaxRateFilter] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [plansToCompare, setPlansToCompare] = useState<Plan[]>([]);
  const [relevantTestimonial, setRelevantTestimonial] = useState<any>(null);
  const [topThreePlans, setTopThreePlans] = useState<Plan[]>([]);
  const [showProviderFilter, setShowProviderFilter] = useState(false);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  
  // Ref to scroll back to the top when plans change
  const plansContainerRef = useRef<HTMLDivElement>(null);
  
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
    
    // Adjust based on property type
    if (wizardState.propertyType === 'apartment' || wizardState.propertyType === 'condo' || wizardState.propertyType === 'townhome') {
      // Shared walls mean better insulation and lower heating/cooling costs
      baseUsage = baseUsage * 0.85;
    }
    
    return Math.max(Math.round(baseUsage), 500);
  };

  const estimatedUsage = calculateEstimatedUsage();

  // Extract unique providers from plans
  const uniqueProviders = [...new Set(mockPlans.map(plan => plan.provider))];

  // Toggle expanded state for a plan
  const togglePlanExpanded = (planId: string) => {
    setExpandedPlans(current => 
      current.includes(planId) 
        ? current.filter(id => id !== planId) 
        : [...current, planId]
    );
  };

  // Pre-select the best match plan on initial load
  useEffect(() => {
    if (!isLoading && filteredPlans.length > 0 && !wizardState.selectedPlan.id) {
      // Find the best match plan or the first plan
      const bestMatchPlan = filteredPlans.find(plan => plan.bestMatch) || filteredPlans[0];
      
      // Auto-select this plan
      handleSelectPlan(bestMatchPlan);
      
      // Show toast to indicate pre-selection
      addToast('info', `We've pre-selected the ${bestMatchPlan.name} plan for you, which best matches your needs.`);
    }
  }, [isLoading, filteredPlans]);

  // Filter and sort plans based on user preferences
  useEffect(() => {
    setIsLoading(true);
    
    // Scroll back to top when filtering/sorting changes
    if (plansContainerRef.current) {
      plansContainerRef.current.scrollTop = 0;
    }
    
    // Simulate API call
    const fetchPlans = setTimeout(() => {
      let plans = [...mockPlans];
      
      if (!showAllPlans) {
        // Apply filters based on preferences
        if (wizardState.planPreferences.contractTerm) {
          const termMapping: Record<string, string> = {
            '1-month': '1 month',
            '3-month': '3 months',
            '6-month': '6 months',
            '12-month': '12 months',
            '24-month': '24 months',
          };
          
          const selectedTerm = termMapping[wizardState.planPreferences.contractTerm];
          plans = plans.filter(plan => plan.term === selectedTerm);
        }
        
        if (wizardState.planPreferences.isRenewable) {
          plans = plans.filter(plan => plan.features.includes('renewable'));
        }
        
        if (wizardState.planPreferences.hasSatisfactionGuarantee) {
          plans = plans.filter(plan => plan.features.includes('guarantee'));
        }
        
        if (wizardState.planPreferences.requiresNoDeposit) {
          plans = plans.filter(plan => plan.features.includes('no-deposit'));
        }
        
        // Apply max rate filter if set
        if (maxRateFilter !== null) {
          plans = plans.filter(plan => plan.rate <= maxRateFilter);
        }
        
        // Apply provider filter if any are selected
        if (selectedProviders.length > 0) {
          plans = plans.filter(plan => selectedProviders.includes(plan.provider));
        }
      }
      
      // Filter by search query if present
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        plans = plans.filter(plan => 
          plan.name.toLowerCase().includes(query) || 
          plan.provider.toLowerCase().includes(query) ||
          (plan.incentives && plan.incentives.toLowerCase().includes(query))
        );
      }
      
      // Sort plans
      if (sortOption === 'bestMatch') {
        plans.sort((a, b) => (a.bestMatch === b.bestMatch) ? 0 : a.bestMatch ? -1 : 1);
      } else if (sortOption === 'price') {
        plans.sort((a, b) => a.rate - b.rate);
      } else if (sortOption === 'rating') {
        plans.sort((a, b) => b.satisfaction - a.satisfaction);
      } else if (sortOption === 'bill') {
        // Sort by estimated bill (lowest first)
        plans.sort((a, b) => {
          const tierA = getClosestUsageTier(a, estimatedUsage);
          const tierB = getClosestUsageTier(b, estimatedUsage);
          return a.estimatedBill[tierA] - b.estimatedBill[tierB];
        });
      }
      
      setFilteredPlans(plans);
      
      // Select top 3 plans for the comparison card
      const topPlans = [...plans].slice(0, 3);
      
      // Make sure the bestMatch plan is in the top 3
      const bestMatchIndex = plans.findIndex(p => p.bestMatch);
      if (bestMatchIndex >= 0 && bestMatchIndex >= 3) {
        // Replace the middle plan with the best match
        topPlans[1] = plans[bestMatchIndex];
      }
      
      setTopThreePlans(topPlans);
      setIsLoading(false);
      
      // Notify user if no plans match
      if (plans.length === 0) {
        addToast('info', 'We couldn\'t find any plans that match all your filters. Let\'s try a different approach to find you a great plan.');
      }
      
      // Set a relevant testimonial based on filters
      setRelevantTestimonial(findRelevantTestimonial(plans));
      
    }, 800);
    
    return () => clearTimeout(fetchPlans);
  }, [wizardState.planPreferences, sortOption, searchQuery, addToast, showAllPlans, maxRateFilter, estimatedUsage, selectedProviders]);

  // Find the closest usage tier for a plan
  const getClosestUsageTier = (plan: Plan, usage: number): string => {
    const tiers = Object.keys(plan.estimatedBill).map(Number);
    const closest = tiers.reduce((prev, curr) => 
      Math.abs(curr - usage) < Math.abs(prev - usage) ? curr : prev
    );
    return closest.toString();
  };

  // Find a relevant testimonial based on current filters and plans
  const findRelevantTestimonial = (plans: Plan[]): any => {
    // If filtering by contract term
    if (wizardState.planPreferences.contractTerm) {
      const matchingTermTestimonial = planTestimonials.find(t => 
        t.showForTerms?.includes(wizardState.planPreferences.contractTerm || '')
      );
      if (matchingTermTestimonial) return matchingTermTestimonial;
    }
    
    // If filtering by features
    if (wizardState.planPreferences.isRenewable) {
      const renewableTestimonial = planTestimonials.find(t => 
        t.showForFeatures?.includes('renewable')
      );
      if (renewableTestimonial) return renewableTestimonial;
    }
    
    if (wizardState.planPreferences.requiresNoDeposit) {
      const noDepositTestimonial = planTestimonials.find(t => 
        t.showForFeatures?.includes('no-deposit')
      );
      if (noDepositTestimonial) return noDepositTestimonial;
    }
    
    // If selected plan has specific features
    if (wizardState.selectedPlan.id) {
      const selectedPlan = plans.find(p => p.id === wizardState.selectedPlan.id);
      if (selectedPlan) {
        if (selectedPlan.features.includes('renewable')) {
          const renewableTestimonial = planTestimonials.find(t => 
            t.showForFeatures?.includes('renewable')
          );
          if (renewableTestimonial) return renewableTestimonial;
        }
        
        // Check for term match in selected plan
        const termMap: Record<string, string> = {
          '1 month': '1-month',
          '3 months': '3-month',
          '6 months': '6-month',
          '12 months': '12-month',
          '24 months': '24-month'
        };
        
        if (selectedPlan.term && termMap[selectedPlan.term]) {
          const matchingTermTestimonial = planTestimonials.find(t => 
            t.showForTerms?.includes(termMap[selectedPlan.term])
          );
          if (matchingTermTestimonial) return matchingTermTestimonial;
        }
      }
    }
    
    // Return a random testimonial if no specific one matches
    return planTestimonials[Math.floor(Math.random() * planTestimonials.length)];
  };

  // Handle plan selection
  const handleSelectPlan = (plan: Plan) => {
    setIsSelecting(true);
    
    // Find the closest usage tier for estimation
    const usageTier = getClosestUsageTier(plan, estimatedUsage);
    const estimatedMonthlyBill = plan.estimatedBill[usageTier];

    // Simulate API call to get additional plan details
    setTimeout(() => {
      updateWizardState({
        selectedPlan: {
          id: plan.id,
          name: plan.name,
          provider: plan.provider,
          term: plan.term,
          rate: plan.rate,
          estimatedMonthlyBill,
        },
      });
      
      addToast('success', `You've selected the ${plan.name} plan by ${plan.provider}!`);
      setIsSelecting(false);
    }, 500);
  };

  // Toggle between showing filtered plans or all plans
  const toggleShowAllPlans = () => {
    setShowAllPlans(prev => !prev);
    if (!showAllPlans) {
      addToast('info', 'Showing all available plans');
    } else {
      addToast('info', 'Showing plans that match your preferences');
    }
  };
  
  // Update the maximum rate filter
  const handleMaxRateChange = (value: number) => {
    setMaxRateFilter(value);
    
    // Update wizard state with the new max rate preference
    updateWizardState({
      planPreferences: {
        ...wizardState.planPreferences,
        maxRate: value,
      },
    });
  };
  
  // Handle adding a plan to comparison
  const handleComparePlan = (plan: Plan) => {
    // Check if already in comparison
    if (!plansToCompare.find(p => p.id === plan.id)) {
      // If selected plan is not in comparison, make sure it gets added
      if (wizardState.selectedPlan.id && 
          !plansToCompare.find(p => p.id === wizardState.selectedPlan.id)) {
        const selectedPlan = mockPlans.find(p => p.id === wizardState.selectedPlan.id);
        if (selectedPlan) {
          setPlansToCompare([...plansToCompare, selectedPlan, plan].slice(0, 3));
        } else {
          setPlansToCompare([...plansToCompare, plan].slice(0, 3));
        }
      } else {
        setPlansToCompare([...plansToCompare, plan].slice(0, 3));
      }
    }
    
    setIsComparisonModalOpen(true);
  };
  
  // Toggle provider selection in the filter
  const toggleProviderSelection = (provider: string) => {
    setSelectedProviders(current => 
      current.includes(provider)
        ? current.filter(p => p !== provider)
        : [...current, provider]
    );
  };

  return (
    <div className="wizard-step max-w-none" ref={plansContainerRef}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Choose Your Perfect Plan</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {showAllPlans
            ? `Showing all ${isLoading ? "..." : filteredPlans.length} available plans`
            : `We found ${isLoading ? "..." : filteredPlans.length} plans that match your preferences`}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
          {/* Search */}
          <div className="w-full md:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                className="form-input block w-full md:w-64 pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
                placeholder="Search plans by name or feature..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          
          {/* Filter toggles */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-1 flex items-center bg-white dark:bg-gray-800">
              <button
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded transition-colors",
                  showProviderFilter ? "bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-300" : "text-gray-700 dark:text-gray-300"
                )}
                onClick={() => setShowProviderFilter(!showProviderFilter)}
              >
                Provider
              </button>
              <button
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded transition-colors",
                  showMaxRateFilter ? "bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-300" : "text-gray-700 dark:text-gray-300"
                )}
                onClick={() => setShowMaxRateFilter(!showMaxRateFilter)}
              >
                Rate
              </button>
              <button
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded transition-colors",
                  !showAllPlans ? "bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-300" : "text-gray-700 dark:text-gray-300"
                )}
                onClick={toggleShowAllPlans}
              >
                {showAllPlans ? "My Filters" : "Filtered"}
              </button>
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Sort dropdown */}
              <div className="flex items-center">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="form-select text-sm py-1.5 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
                  disabled={isLoading}
                >
                  <option value="bestMatch">Best Match</option>
                  <option value="price">Lowest Price</option>
                  <option value="rating">Highest Rating</option>
                  <option value="bill">Lowest Bill</option>
                </select>
              </div>

              {/* View mode toggle */}
              <button
                onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                className="inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                disabled={isLoading}
                aria-label={`Switch to ${viewMode === 'list' ? 'grid' : 'list'} view`}
                title={`Switch to ${viewMode === 'list' ? 'grid' : 'list'} view`}
              >
                {viewMode === 'list' ? (
                  <BarChart2 className="h-4 w-4" />
                ) : (
                  <Sliders className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Provider filter */}
      {showProviderFilter && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 flex items-center">
              <ShieldCheck className="h-4 w-4 mr-2" /> Filter by Provider
            </h3>
            <button
              onClick={() => setSelectedProviders([])}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              disabled={selectedProviders.length === 0}
            >
              Clear All
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {uniqueProviders.map(provider => (
              <button
                key={provider}
                onClick={() => toggleProviderSelection(provider)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-full transition-colors",
                  selectedProviders.includes(provider)
                    ? "bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200"
                    : "bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                )}
              >
                {provider}
              </button>
            ))}
          </div>
          
          <div className="mt-3 text-xs text-blue-700 dark:text-blue-400 flex items-center">
            <Info className="h-3.5 w-3.5 mr-1.5" />
            <span>Filter by your preferred providers or those you've had a good experience with in the past</span>
          </div>
        </div>
      )}

      {/* Max rate filter slider */}
      {showMaxRateFilter && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800 mb-6 animate-fade-in shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="maxRate" className="block text-sm font-medium text-green-800 dark:text-green-300">
              What's your maximum budget per kWh?
            </label>
            <span className="text-sm font-bold text-green-700 dark:text-green-400">
              {maxRateFilter}¢/kWh
            </span>
          </div>
          
          <input
            id="maxRate"
            type="range"
            min="9"
            max="15"
            step="0.1"
            value={maxRateFilter || 15}
            onChange={(e) => handleMaxRateChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-green-200 dark:bg-green-700 rounded-full appearance-none cursor-pointer"
          />
          
          <div className="flex justify-between text-xs text-green-700 dark:text-green-400 mt-1">
            <span>9¢</span>
            <span>12¢</span>
            <span>15¢</span>
          </div>
          
          <div className="mt-3 bg-white dark:bg-gray-800 p-3 rounded border border-green-200 dark:border-green-800">
            <div className="flex items-start">
              <Info className="h-4 w-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">Finding Your Sweet Spot</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  The average Texas rate is currently 11.4¢/kWh. Moving this slider filters plans based on price per kWh - slide left for more savings or right to see more options.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plans loading state */}
      {isLoading ? (
        <>
          {/* Top three plans skeleton */}
          <div className="mb-12">
            <SkeletonLoader width="200px" height="24px" className="mx-auto mb-6" />
            <div className="flex flex-col md:flex-row gap-8">
              <SkeletonLoader className="flex-1 h-96 rounded-xl" />
              <SkeletonLoader className="flex-1 h-96 rounded-xl" />
              <SkeletonLoader className="flex-1 h-96 rounded-xl" />
            </div>
          </div>
          
          {/* Regular plan list skeleton */}
          <div className="grid gap-8" style={{ gridTemplateColumns: viewMode === 'list' ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {Array(3).fill(0).map((_, i) => (
              <PlanCardSkeleton key={i} />
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Top Three Plans Comparison Card */}
          {filteredPlans.length >= 3 && !wizardState.selectedPlan.id && (
            <PlanComparisonCard 
              plans={topThreePlans}
              estimatedUsage={estimatedUsage}
              onSelectPlan={handleSelectPlan}
              selectedPlanId={wizardState.selectedPlan.id || undefined}
            />
          )}
          
          {/* Plans display section */}
          {filteredPlans.length > 0 ? (
            <>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {wizardState.selectedPlan.id ? 'Your Selection and Other Available Plans' : 'Available Electricity Plans'}
              </h3>
              
              <div className="grid gap-8" style={{ gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : '1fr' }}>
                {filteredPlans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    estimatedUsage={estimatedUsage}
                    isSelected={wizardState.selectedPlan.id === plan.id}
                    onSelect={handleSelectPlan}
                    isSelecting={isSelecting}
                    expanded={expandedPlans.includes(plan.id)}
                    onToggleExpand={togglePlanExpanded}
                    onCompare={handleComparePlan}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <AlertCircle className="h-8 w-8 text-amber-500 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No matching plans found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                We couldn't find any plans that match all your filters. Let's try a different approach to find you a great plan.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    // Reset some filters
                    updateWizardState({
                      planPreferences: {
                        ...wizardState.planPreferences,
                        isRenewable: false,
                        hasSatisfactionGuarantee: false,
                        requiresNoDeposit: false,
                        maxRate: 15
                      }
                    });
                    setMaxRateFilter(15);
                    setSelectedProviders([]);
                    addToast('info', 'We\'ve adjusted your filters to show you more options');
                  }}
                  className="btn btn-secondary"
                >
                  Reset Filters
                </button>
                
                <button
                  type="button"
                  onClick={toggleShowAllPlans}
                  className="btn btn-primary"
                >
                  Show All Available Plans
                </button>
              </div>
            </div>
          )}
          
          {/* Compare plans button */}
          {filteredPlans.length >= 2 && (
            <div className="mt-6 flex justify-center">
              <button
                className="btn btn-secondary inline-flex items-center"
                onClick={() => setIsComparisonModalOpen(true)}
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Compare Plans Side-by-Side
              </button>
            </div>
          )}
        </>
      )}
      
      {/* Selected plan confirmation */}
      {filteredPlans.length > 0 && !isLoading && wizardState.selectedPlan.id && (
        <div className="mt-6 bg-success-50 dark:bg-success-900/20 p-4 rounded-lg border border-success-200 dark:border-success-800 animate-fade-in shadow-sm">
          <div className="flex items-start">
            <div className="h-10 w-10 rounded-full bg-success-100 dark:bg-success-900 flex items-center justify-center flex-shrink-0 mr-4">
              <Check className="h-6 w-6 text-success-600 dark:text-success-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-success-800 dark:text-success-200">Great choice!</h3>
              <p className="mt-1 text-success-700 dark:text-success-300">
                The {wizardState.selectedPlan.name} plan from {wizardState.selectedPlan.provider} is all set to go.
                Click "Continue with Selected Plan" below to move forward.
              </p>
              <div className="mt-3 bg-white dark:bg-success-900/40 rounded-lg p-3 border border-success-200 dark:border-success-800">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <div className="text-xs text-success-600 dark:text-success-400">Rate</div>
                    <div className="text-lg font-bold text-success-700 dark:text-success-300">{wizardState.selectedPlan.rate}¢</div>
                  </div>
                  <div>
                    <div className="text-xs text-success-600 dark:text-success-400">Term</div>
                    <div className="font-medium text-success-700 dark:text-success-300">{wizardState.selectedPlan.term}</div>
                  </div>
                  <div>
                    <div className="text-xs text-success-600 dark:text-success-400">Your Bill</div>
                    <div className="text-lg font-bold text-success-700 dark:text-success-300">${wizardState.selectedPlan.estimatedMonthlyBill}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help callout when no plan is selected */}
      {!isLoading && filteredPlans.length >= 3 && !wizardState.selectedPlan.id && !topThreePlans.some(p => p.bestMatch) && (
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 shadow-sm">
          <div className="flex items-start">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 mr-4 flex-shrink-0">
              <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">Need some help deciding?</h3>
              <p className="mt-2 text-blue-700 dark:text-blue-300">
                Based on your profile, the {filteredPlans[0].name} plan looks perfect for you.
                This plan would save you about ${((filteredPlans[1].rate - filteredPlans[0].rate) * estimatedUsage / 100).toFixed(2)} per month compared to the next best option.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Plan comparison modal */}
      <PlanComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        plans={plansToCompare.length > 0 ? plansToCompare : filteredPlans.slice(0, 3)}
        selectedPlanId={wizardState.selectedPlan.id}
        onSelectPlan={handleSelectPlan}
        estimatedUsage={estimatedUsage}
      />
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

// Custom townhouse icon to replace duplicate Warehouse component
function TownhouseIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z" />
      <path d="M6 18h12" />
      <path d="M6 14h12" />
      <rect x="6" y="10" width="12" height="12" />
    </svg>
  );
}

// Mock testimonials for different plan types
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

export default PlanSelectionStep;