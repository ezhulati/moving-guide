import { useState, useEffect } from 'react';
import { X, Check, AlertCircle, DollarSign, Calendar, Leaf, ShieldCheck, HelpCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface Plan {
  id: string;
  name: string;
  provider: string;
  rate: number;
  term: string;
  estimatedBill: Record<string, number>;
  features: string[];
  cancellationFee: number;
  details: Array<{name: string, value: string}>;
  incentives?: string;
}

interface PlanComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: Plan[];
  selectedPlanId: string | null;
  onSelectPlan: (plan: Plan) => void;
  estimatedUsage: number;
}

const PlanComparisonModal: React.FC<PlanComparisonModalProps> = ({
  isOpen,
  onClose,
  plans,
  selectedPlanId,
  onSelectPlan,
  estimatedUsage
}) => {
  const [visiblePlans, setVisiblePlans] = useState<Plan[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'fine-print'>('overview');

  useEffect(() => {
    if (isOpen) {
      // Set initial visible plans (selected plan + up to 2 more)
      let initialPlans = [];
      const selectedPlan = plans.find(p => p.id === selectedPlanId);
      
      if (selectedPlan) {
        initialPlans.push(selectedPlan);
        
        // Add up to 2 more plans different from the selected one
        const otherPlans = plans
          .filter(p => p.id !== selectedPlanId)
          .sort((a, b) => a.rate - b.rate)
          .slice(0, 2);
        
        initialPlans = [...initialPlans, ...otherPlans];
      } else {
        // If no plan is selected, show the first 3 plans
        initialPlans = plans.slice(0, 3);
      }
      
      setVisiblePlans(initialPlans);
      
      // Animate in
      setTimeout(() => {
        setIsVisible(true);
      }, 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, plans, selectedPlanId]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };
  
  // Find the closest usage tier for estimation
  const getEstimatedBill = (plan: Plan): number => {
    const tiers = Object.keys(plan.estimatedBill).map(Number);
    const closest = tiers.reduce((prev, curr) => 
      Math.abs(curr - estimatedUsage) < Math.abs(prev - estimatedUsage) ? curr : prev
    );
    return plan.estimatedBill[closest.toString()];
  };
  
  // Add or remove a plan from comparison
  const togglePlanComparison = (plan: Plan) => {
    if (visiblePlans.find(p => p.id === plan.id)) {
      // Don't remove if it's the last plan or the selected plan
      if (visiblePlans.length <= 1 || plan.id === selectedPlanId) return;
      setVisiblePlans(visiblePlans.filter(p => p.id !== plan.id));
    } else {
      // Don't add more than 3 plans
      if (visiblePlans.length >= 3) return;
      setVisiblePlans([...visiblePlans, plan]);
    }
  };
  
  // Check if a feature is included in a plan
  const hasFeature = (plan: Plan, feature: string): boolean => {
    return plan.features.includes(feature);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="plan-comparison-modal"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-gray-500 dark:bg-gray-900 transition-opacity duration-300",
          isVisible ? "bg-opacity-75 dark:bg-opacity-75" : "bg-opacity-0 dark:bg-opacity-0"
        )} 
        aria-hidden="true"
        onClick={handleClose}
      />

      {/* Modal content */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div 
          className={cn(
            "bg-white dark:bg-gray-800 rounded-lg shadow-xl transform transition-all max-w-6xl w-full mx-auto",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          )}
        >
          {/* Header */}
          <div className="bg-primary-600 dark:bg-primary-700 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
            <h3 className="text-xl font-semibold">Compare Plans Side-by-Side</h3>
            <button 
              type="button"
              className="text-white hover:text-primary-100 dark:hover:text-primary-200"
              onClick={handleClose}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Plan selection dropdown */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">Currently comparing {visiblePlans.length} plans</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Based on estimated usage of {estimatedUsage} kWh/month</p>
              </div>
              
              {plans.length > visiblePlans.length && (
                <div className="w-full sm:w-auto">
                  <select
                    className="select text-sm w-full sm:w-auto dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    onChange={(e) => {
                      const plan = plans.find(p => p.id === e.target.value);
                      if (plan && !visiblePlans.find(p => p.id === plan.id)) {
                        togglePlanComparison(plan);
                      }
                      e.target.value = ''; // Reset the select
                    }}
                    value=""
                  >
                    <option value="" disabled>Add plan to compare...</option>
                    {plans
                      .filter(p => !visiblePlans.find(vp => vp.id === p.id))
                      .map(plan => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name} - {plan.provider}
                        </option>
                      ))
                    }
                  </select>
                </div>
              )}
            </div>
          </div>
          
          {/* Tab navigation */}
          <div className="px-6 pt-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md",
                  activeTab === 'overview'
                    ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md",
                  activeTab === 'details'
                    ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                Plan Details
              </button>
              <button
                onClick={() => setActiveTab('fine-print')}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md",
                  activeTab === 'fine-print'
                    ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                Fine Print
              </button>
            </nav>
          </div>
          
          {/* Comparison table */}
          <div className="px-6 py-6 overflow-x-auto">
            {activeTab === 'overview' && (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-3 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300 w-1/4">Plan Details</th>
                    {visiblePlans.map(plan => (
                      <th 
                        key={plan.id} 
                        className={cn(
                          "px-3 py-2 text-center",
                          plan.id === selectedPlanId ? 
                            "bg-primary-50 dark:bg-primary-900/30 border-primary-200 dark:border-primary-700 border-b-0 border rounded-t-lg" : ""
                        )}
                      >
                        <div className="relative">
                          {visiblePlans.length > 1 && plan.id !== selectedPlanId && (
                            <button
                              onClick={() => togglePlanComparison(plan)}
                              className="absolute -top-1 -right-1 h-5 w-5 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500"
                              aria-label="Remove plan from comparison"
                            >
                              <X className="h-3 w-3 text-gray-600 dark:text-gray-300" />
                            </button>
                          )}
                          
                          <div className="text-sm font-bold text-primary-600 dark:text-primary-400">{plan.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{plan.provider}</div>
                          
                          {plan.id === selectedPlanId && (
                            <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-300">
                              <Check className="h-3 w-3 mr-1" />
                              Selected
                            </div>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {/* Rate */}
                  <tr>
                    <td className="px-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                      <DollarSign className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-1" />
                      Rate
                    </td>
                    {visiblePlans.map(plan => (
                      <td 
                        key={plan.id} 
                        className={cn(
                          "px-3 py-3 text-center",
                          plan.id === selectedPlanId ? 
                            "bg-primary-50 dark:bg-primary-900/30 border-x border-primary-200 dark:border-primary-700" : ""
                        )}
                      >
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{plan.rate}¢</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">per kWh</div>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Term */}
                  <tr>
                    <td className="px-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-1" />
                      Term Length
                    </td>
                    {visiblePlans.map(plan => (
                      <td 
                        key={plan.id} 
                        className={cn(
                          "px-3 py-3 text-center",
                          plan.id === selectedPlanId ? 
                            "bg-primary-50 dark:bg-primary-900/30 border-x border-primary-200 dark:border-primary-700" : ""
                        )}
                      >
                        <span className="text-gray-900 dark:text-white">{plan.term}</span>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Estimated Bill */}
                  <tr>
                    <td className="px-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                      <DollarSign className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-1" />
                      Estimated Bill
                    </td>
                    {visiblePlans.map(plan => (
                      <td 
                        key={plan.id} 
                        className={cn(
                          "px-3 py-3 text-center",
                          plan.id === selectedPlanId ? 
                            "bg-primary-50 dark:bg-primary-900/30 border-x border-primary-200 dark:border-primary-700" : ""
                        )}
                      >
                        <div className="text-lg font-bold text-primary-700 dark:text-primary-400">${getEstimatedBill(plan)}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">per month</div>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Cancellation Fee */}
                  <tr>
                    <td className="px-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                      <AlertCircle className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-1" />
                      Cancellation Fee
                    </td>
                    {visiblePlans.map(plan => (
                      <td 
                        key={plan.id} 
                        className={cn(
                          "px-3 py-3 text-center",
                          plan.id === selectedPlanId ? 
                            "bg-primary-50 dark:bg-primary-900/30 border-x border-primary-200 dark:border-primary-700" : ""
                        )}
                      >
                        <span className="text-gray-900 dark:text-white">
                          {plan.cancellationFee > 0 ? `$${plan.cancellationFee}` : 'None'}
                        </span>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Incentives */}
                  <tr>
                    <td className="px-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                      <HelpCircle className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-1" />
                      Special Features
                    </td>
                    {visiblePlans.map(plan => (
                      <td 
                        key={plan.id} 
                        className={cn(
                          "px-3 py-3 text-center",
                          plan.id === selectedPlanId ? 
                            "bg-primary-50 dark:bg-primary-900/30 border-x border-primary-200 dark:border-primary-700" : ""
                        )}
                      >
                        <span className="text-gray-900 dark:text-white">{plan.incentives || 'None'}</span>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Renewable */}
                  <tr>
                    <td className="px-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                      <Leaf className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-1" />
                      Renewable Energy
                    </td>
                    {visiblePlans.map(plan => (
                      <td 
                        key={plan.id} 
                        className={cn(
                          "px-3 py-3 text-center",
                          plan.id === selectedPlanId ? 
                            "bg-primary-50 dark:bg-primary-900/30 border-x border-primary-200 dark:border-primary-700" : ""
                        )}
                      >
                        {hasFeature(plan, 'renewable') ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                            <Check className="h-3 w-3 mr-1" />
                            Yes
                          </span>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">No</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Satisfaction Guarantee */}
                  <tr>
                    <td className="px-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                      <ShieldCheck className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-1" />
                      Satisfaction Guarantee
                    </td>
                    {visiblePlans.map(plan => (
                      <td 
                        key={plan.id} 
                        className={cn(
                          "px-3 py-3 text-center",
                          plan.id === selectedPlanId ? 
                            "bg-primary-50 dark:bg-primary-900/30 border-x border-primary-200 dark:border-primary-700" : ""
                        )}
                      >
                        {hasFeature(plan, 'guarantee') ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                            <Check className="h-3 w-3 mr-1" />
                            Yes
                          </span>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">No</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Action Row */}
                  <tr>
                    <td className="px-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-300"></td>
                    {visiblePlans.map(plan => (
                      <td 
                        key={plan.id} 
                        className={cn(
                          "px-3 py-3 text-center",
                          plan.id === selectedPlanId ? 
                            "bg-primary-50 dark:bg-primary-900/30 border-x border-b border-primary-200 dark:border-primary-700 rounded-b-lg" : ""
                        )}
                      >
                        {plan.id === selectedPlanId ? (
                          <div className="text-sm text-primary-600 dark:text-primary-400 font-medium flex items-center justify-center">
                            <Check className="h-4 w-4 mr-1" />
                            Selected
                          </div>
                        ) : (
                          <button
                            onClick={() => onSelectPlan(plan)}
                            className="btn btn-primary text-sm py-1 px-4"
                          >
                            Select This Plan
                          </button>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            )}

            {activeTab === 'details' && (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-3 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300 w-1/4">Detail</th>
                    {visiblePlans.map(plan => (
                      <th 
                        key={plan.id} 
                        className={cn(
                          "px-3 py-2 text-center",
                          plan.id === selectedPlanId ? 
                            "bg-primary-50 dark:bg-primary-900/30 border-primary-200 dark:border-primary-700 border-b-0 border rounded-t-lg" : ""
                        )}
                      >
                        <div className="relative">
                          <div className="text-sm font-bold text-primary-600 dark:text-primary-400">{plan.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{plan.provider}</div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {/* Loop through all possible detail fields */}
                  {visiblePlans[0].details.map((detail, index) => (
                    <tr key={index}>
                      <td className="px-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {detail.name}
                      </td>
                      {visiblePlans.map(plan => {
                        const planDetail = plan.details.find(d => d.name === detail.name);
                        return (
                          <td 
                            key={plan.id} 
                            className={cn(
                              "px-3 py-3 text-center",
                              plan.id === selectedPlanId ? 
                                "bg-primary-50 dark:bg-primary-900/30 border-x border-primary-200 dark:border-primary-700" : ""
                            )}
                          >
                            <span className="text-gray-900 dark:text-white">
                              {planDetail?.value || 'N/A'}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'fine-print' && (
              <div className="space-y-6">
                {visiblePlans.map(plan => (
                  <div 
                    key={plan.id}
                    className={cn(
                      "bg-white dark:bg-gray-800 rounded-lg p-4 border",
                      plan.id === selectedPlanId ? 
                        "border-primary-200 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/10" : 
                        "border-gray-200 dark:border-gray-700"
                    )}
                  >
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{plan.name} - {plan.provider}</h4>
                    <div className="text-sm text-gray-600 dark:text-gray-300 space-y-4">
                      <p>
                        <span className="font-medium">Contract Term:</span> {plan.term}
                      </p>
                      <p>
                        <span className="font-medium">Early Termination Fee:</span> {plan.cancellationFee > 0 ? `$${plan.cancellationFee}` : 'None'}
                      </p>
                      <p>
                        <span className="font-medium">Automatic Renewal:</span> This plan will automatically renew to a month-to-month variable rate plan at the end of the term unless you select a new plan.
                      </p>
                      <p>
                        <span className="font-medium">Usage Fees:</span> Some plans may have minimum usage fees or credits at specific usage tiers (typically 500, 1000, or 2000 kWh). The estimated bill shown is based on your projected usage pattern.
                      </p>
                      <p>
                        <span className="font-medium">Additional Information:</span> Your actual bill will include taxes and fees which vary by location. Changes in law or regulatory charges may affect your rate.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 rounded-b-lg flex justify-end">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanComparisonModal;