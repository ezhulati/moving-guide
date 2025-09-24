import React from 'react';
import { Check, Info, Leaf, ShieldCheck, DollarSign, Star, HelpCircle, ArrowUpDown } from 'lucide-react';
import { cn } from '../../utils/cn';

interface Plan {
  id: string;
  name: string;
  provider: string;
  logo?: string;
  term: string;
  rate: number;
  rateUnit?: string;
  features: string[];
  estimatedBill: Record<string, number>;
  bestMatch?: boolean;
  cancellationFee: number;
  satisfaction?: number;
  reviewCount?: number;
  details?: Array<{name: string; value: string}>;
  incentives?: string;
  popularity?: string;
}

interface PlanComparisonCardProps {
  plans: Plan[];
  estimatedUsage: number;
  onSelectPlan: (plan: Plan) => void;
  selectedPlanId?: string;
  className?: string;
}

const PlanComparisonCard: React.FC<PlanComparisonCardProps> = ({
  plans,
  estimatedUsage,
  onSelectPlan,
  selectedPlanId,
  className
}) => {
  // Make sure we have exactly 3 plans
  const displayPlans = plans.slice(0, 3);
  
  // If we don't have 3 plans, don't render
  if (displayPlans.length < 3) {
    return null;
  }
  
  // Find the recommended plan (either the bestMatch or the middle plan)
  const recommendedPlan = displayPlans.find(plan => plan.bestMatch) || displayPlans[1];
  
  // Get estimated bill for the given usage
  const getEstimatedBill = (plan: Plan): number => {
    const usageTiers = Object.keys(plan.estimatedBill).map(Number);
    const closestTier = usageTiers.reduce((prev, curr) => 
      Math.abs(curr - estimatedUsage) < Math.abs(prev - estimatedUsage) ? curr : prev
    );
    
    return plan.estimatedBill[closestTier.toString()];
  };
  
  // Render star rating
  const renderStarRating = (rating?: number): React.ReactNode => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center text-yellow-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i} 
            className={`h-3.5 w-3.5 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`} 
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className={cn("mt-8 mb-10", className)}>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-5 text-center">
        Compare Top Plans
      </h3>
      
      <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-2">
        {displayPlans.map((plan, index) => {
          const isRecommended = plan.id === recommendedPlan.id;
          const isSelected = plan.id === selectedPlanId;
          
          return (
            <div 
              key={plan.id}
              className={cn(
                "flex-1 rounded-xl border transition-all flex flex-col",
                isRecommended ? "border-primary-500 dark:border-primary-400 shadow-md" : "border-gray-200 dark:border-gray-700",
                isSelected ? "ring-2 ring-primary-500 dark:ring-primary-400" : "",
                index === 1 ? "md:-mt-4 md:mb-4" : ""
              )}
            >
              {/* Header with popularity tag */}
              <div 
                className={cn(
                  "relative pt-6 px-4 rounded-t-xl border-b",
                  isRecommended 
                    ? "bg-primary-50 dark:bg-primary-900/30 border-primary-100 dark:border-primary-800" 
                    : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                )}
              >
                {(plan.popularity || isRecommended) && (
                  <div 
                    className={cn(
                      "absolute top-0 left-0 right-0 transform -translate-y-1/2 flex justify-center"
                    )}
                  >
                    <div 
                      className={cn(
                        "px-4 py-1 rounded-full text-xs font-bold",
                        isRecommended
                          ? "bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                      )}
                    >
                      {isRecommended ? "Perfect Match for You" : plan.popularity || "Good Option"}
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-3">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                    {plan.name}
                  </h4>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">
                    {plan.provider}
                  </div>
                  {plan.reviewCount && (
                    <div className="mt-1 flex justify-center">
                      {renderStarRating(plan.satisfaction)}
                      <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({plan.reviewCount})</span>
                    </div>
                  )}
                </div>
                
                <div className={cn(
                  "bg-white dark:bg-gray-900/50 text-center py-2 rounded-t-lg border",
                  isRecommended
                    ? "border-primary-100 dark:border-primary-800"
                    : "border-gray-200 dark:border-gray-700"
                )}>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Contract</div>
                  <div className="font-medium text-gray-900 dark:text-white">{plan.term}</div>
                </div>
              </div>
              
              {/* Rate */}
              <div className="flex-grow p-4 bg-white dark:bg-gray-900">
                <div className="flex justify-center items-baseline mb-3">
                  <span className="text-3xl font-bold text-primary-700 dark:text-primary-400">{plan.rate}</span>
                  <span className="ml-1 text-gray-600 dark:text-gray-400">¢/kWh</span>
                </div>
                
                {plan.incentives && (
                  <div className="text-center mb-4">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded">
                      {plan.incentives}
                    </span>
                  </div>
                )}
                
                {/* Monthly bill estimate */}
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Your Monthly Bill:</div>
                    <div className="text-xl font-bold text-primary-700 dark:text-primary-400">
                      ${getEstimatedBill(plan)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Based on your estimated usage of {estimatedUsage} kWh/month
                    </div>
                  </div>
                </div>
                
                {/* Features */}
                <div className="space-y-2 mb-4">
                  {plan.features.includes('renewable') && (
                    <div className="flex items-center text-xs text-gray-700 dark:text-gray-300">
                      <Check className="h-3.5 w-3.5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                      <span>100% Renewable</span>
                    </div>
                  )}
                  {plan.features.includes('guarantee') && (
                    <div className="flex items-center text-xs text-gray-700 dark:text-gray-300">
                      <Check className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400 mr-2 flex-shrink-0" />
                      <span>Satisfaction Guarantee</span>
                    </div>
                  )}
                  {plan.features.includes('no-deposit') && (
                    <div className="flex items-center text-xs text-gray-700 dark:text-gray-300">
                      <Check className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400 mr-2 flex-shrink-0" />
                      <span>No Security Deposit</span>
                    </div>
                  )}
                  <div className="flex items-center text-xs text-gray-700 dark:text-gray-300">
                    <Check className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400 mr-2 flex-shrink-0" />
                    <span>Cancel fee: ${plan.cancellationFee}</span>
                  </div>
                </div>
              </div>
              
              {/* Button */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <button
                  type="button"
                  onClick={() => onSelectPlan(plan)}
                  className={cn(
                    "w-full py-2 rounded-md text-sm font-medium transition-colors",
                    isSelected
                      ? "bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700"
                      : isRecommended
                        ? "bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700"
                        : "bg-white text-primary-700 border border-primary-500 hover:bg-primary-50 dark:bg-gray-800 dark:text-primary-400 dark:border-primary-500 dark:hover:bg-gray-700"
                  )}
                >
                  {isSelected ? (
                    <div className="flex items-center justify-center">
                      <Check className="mr-1.5 h-4 w-4" />
                      Selected
                    </div>
                  ) : (
                    "Select This Plan"
                  )}
                </button>
                
                <div className="mt-2 text-center">
                  <button 
                    className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center justify-center mx-auto"
                    onClick={(e) => {
                      e.preventDefault();
                      // In a real app, you would implement a detailed comparison view
                      // or open the comparison modal with this plan pre-selected
                    }}
                  >
                    <ArrowUpDown className="h-3 w-3 mr-1" />
                    Compare Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p>
              <span className="font-medium">All-In Pricing:</span> The rates shown include energy charges, transmission fees, and monthly service fees. What you see is what you'll pay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanComparisonCard;