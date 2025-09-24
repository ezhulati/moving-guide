import { useWizard } from '../../context/WizardContext';
import { useState, useEffect } from 'react';
import { Clock, Leaf, ShieldCheck, DollarSign, Info, ChevronDown, Check, HelpCircle, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';
import ContextualHelp from '../shared/ContextualHelp';

const PlanFiltersStep = () => {
  const { wizardState, updateWizardState } = useWizard();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showRecommendation, setShowRecommendation] = useState(true);
  const [selectedTerms, setSelectedTerms] = useState<string[]>(
    wizardState.planPreferences.contractTerm ? [wizardState.planPreferences.contractTerm] : []
  );

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle contract term selection - now toggles selection instead of replacing
  const handleContractTermChange = (term: '1-month' | '3-month' | '6-month' | '12-month' | '24-month') => {
    const newSelectedTerms = [...selectedTerms];
    const termIndex = newSelectedTerms.indexOf(term);
    
    if (termIndex >= 0) {
      // Term is already selected, remove it
      newSelectedTerms.splice(termIndex, 1);
    } else {
      // Term is not selected, add it
      newSelectedTerms.push(term);
    }
    
    setSelectedTerms(newSelectedTerms);
    
    // Update wizard state with the first selected term for backward compatibility
    // In a real app, you'd update the model to support multiple terms
    updateWizardState({
      planPreferences: {
        ...wizardState.planPreferences,
        contractTerm: newSelectedTerms.length > 0 ? newSelectedTerms[0] as any : null,
        // You might store the full array in a different property like:
        // selectedTerms: newSelectedTerms,
      },
    });
  };

  // Toggle boolean preferences
  const togglePreference = (preference: 'isRenewable' | 'hasSatisfactionGuarantee' | 'requiresNoDeposit') => {
    updateWizardState({
      planPreferences: {
        ...wizardState.planPreferences,
        [preference]: !wizardState.planPreferences[preference],
      },
    });
  };

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="wizard-step max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What Matters Most in Your Electricity Plan?</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Choose the features that are important to you and we'll find the perfect match.
        </p>
      </div>

      <div className="space-y-6">
        {/* Contract Length Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <Clock className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
                How Long Do You Want to Lock In Your Rate?
              </h3>
              
              <button
                type="button"
                className="text-sm text-primary-600 dark:text-primary-400 flex items-center hover:text-primary-700"
                onClick={() => toggleSection('termAnalysis')}
              >
                {expandedSection === 'termAnalysis' ? 'Hide' : 'Show'} term details
                <ChevronDown 
                  className={`h-4 w-4 ml-1 transition-transform ${expandedSection === 'termAnalysis' ? 'rotate-180' : ''}`} 
                />
              </button>
            </div>
            
            <div className="grid grid-cols-5 gap-2">
              {[
                { value: '1-month', label: '1 Month' },
                { value: '3-month', label: '3 Months' },
                { value: '6-month', label: '6 Months' },
                { value: '12-month', label: '12 Months' },
                { value: '24-month', label: '24 Months' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => 
                    handleContractTermChange(option.value as '1-month' | '3-month' | '6-month' | '12-month' | '24-month')
                  }
                  className={cn(
                    "px-3 py-2 border rounded-md text-center transition-colors",
                    selectedTerms.includes(option.value)
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  )}
                >
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <Info className="h-4 w-4 mr-1.5 text-gray-400" />
              <span>Select multiple terms to see more plan options. Longer contracts usually offer better rates but come with early exit fees if you need to cancel.</span>
            </div>
          </div>
          
          {/* Plan Term Recommendation - Collapsible */}
          {showRecommendation && (
            <div className="px-5 pb-5 pt-0">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800 relative">
                <button 
                  onClick={() => setShowRecommendation(false)}
                  className="absolute top-2 right-2 text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
                  aria-label="Dismiss recommendation"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">Our Friendly Advice</h4>
                    <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                      Most of our customers find 12-month plans to be the sweet spot. They protect you from price spikes through all seasons while avoiding the premium rates of shorter-term plans. 
                      
                      If you're sure you'll stay put for a while, 24-month plans can lock in today's rates before expected increases.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Term Length Analysis - Expandable */}
          {expandedSection === 'termAnalysis' && (
            <div className="border-t border-gray-200 dark:border-gray-700 px-5 py-5 animate-fade-in">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Understanding Contract Lengths</h3>
              
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-1.5 mr-3">
                      <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">Short-Term Plans (1-6 Months)</h4>
                  </div>
                  <div className="ml-9 mt-1 space-y-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Perfect for flexibility</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300"><span className="font-medium">Best For:</span> Short-term rentals, temporary situations, or if you might move again soon</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300"><span className="font-medium">Rates:</span> Higher prices (16-19¢/kWh), but minimal commitments</p>
                  </div>
                </div>
                
                <div className="bg-primary-50 dark:bg-primary-900/20 p-4 border border-primary-100 dark:border-primary-800 rounded-lg">
                  <div className="flex items-center">
                    <div className="rounded-full bg-primary-100 dark:bg-primary-800 p-1.5 mr-3">
                      <Clock className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h4 className="text-base font-medium text-primary-900 dark:text-primary-100">12-Month Plans</h4>
                  </div>
                  <div className="ml-9 mt-1 space-y-1">
                    <p className="text-sm font-medium text-primary-800 dark:text-primary-200">The sweet spot for most homes</p>
                    <p className="text-sm text-primary-700 dark:text-primary-300"><span className="font-medium">Best For:</span> Most households - protection through all seasons with yearly flexibility</p>
                    <p className="text-sm text-primary-700 dark:text-primary-300"><span className="font-medium">Rates:</span> Very competitive (10.7-13¢/kWh) with bill credits at specific usage levels</p>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-1.5 mr-3">
                      <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">24-Month Plans</h4>
                  </div>
                  <div className="ml-9 mt-1 space-y-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Maximum price protection</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300"><span className="font-medium">Best For:</span> Homeowners who want to "set it and forget it" for a full two years</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300"><span className="font-medium">Rate Advantage:</span> Often just 0.4¢/kWh higher than 12-month plans, but protects you from expected future increases</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button 
                  type="button" 
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center" 
                  onClick={() => toggleSection('termAnalysis')}
                >
                  Hide details
                  <ChevronDown className="h-4 w-4 ml-1 rotate-180" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Plan Features Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="p-5">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                Any Special Features You're Looking For?
                <span 
                  className="ml-2 text-xs px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 rounded-full"
                >
                  Select all that apply
                </span>
              </h3>
            </div>
            
            <div className="space-y-3">
              {/* Renewable Energy */}
              <div
                className={cn(
                  "p-4 border rounded-lg cursor-pointer flex items-center transition-all",
                  wizardState.planPreferences.isRenewable
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-400'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-750'
                )}
                onClick={() => togglePreference('isRenewable')}
              >
                <div
                  className={cn(
                    "h-5 w-5 mr-3 flex items-center justify-center rounded-full border transition-colors",
                    wizardState.planPreferences.isRenewable
                      ? "bg-primary-600 border-primary-600 dark:bg-primary-500 dark:border-primary-500"
                      : "border-gray-400 dark:border-gray-500"
                  )}
                >
                  {wizardState.planPreferences.isRenewable && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
                <div className="flex items-center flex-grow">
                  <div className="mr-3 p-1.5 rounded-full bg-green-100 dark:bg-green-900/30">
                    <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Green Energy</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      100% renewable from Texas wind & solar
                    </p>
                  </div>
                </div>
                
                <div className="ml-2 relative group">
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <HelpCircle className="h-4 w-4" />
                  </button>
                  <div className="absolute right-0 z-10 w-64 p-2 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 mt-1">
                    <p>Green energy plans in Texas now cost only 0.1-0.3¢ more per kWh than standard plans. 100% of the energy you use is matched with renewable energy certificates.</p>
                  </div>
                </div>
              </div>
              
              {/* Satisfaction Guarantee */}
              <div
                className={cn(
                  "p-4 border rounded-lg cursor-pointer flex items-center transition-all",
                  wizardState.planPreferences.hasSatisfactionGuarantee
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-400'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-750'
                )}
                onClick={() => togglePreference('hasSatisfactionGuarantee')}
              >
                <div
                  className={cn(
                    "h-5 w-5 mr-3 flex items-center justify-center rounded-full border transition-colors",
                    wizardState.planPreferences.hasSatisfactionGuarantee
                      ? "bg-primary-600 border-primary-600 dark:bg-primary-500 dark:border-primary-500"
                      : "border-gray-400 dark:border-gray-500"
                  )}
                >
                  {wizardState.planPreferences.hasSatisfactionGuarantee && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
                <div className="flex items-center flex-grow">
                  <div className="mr-3 p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Satisfaction Guarantee</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      30-day trial with no penalty to switch
                    </p>
                  </div>
                </div>
                
                <div className="ml-2 relative group">
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <HelpCircle className="h-4 w-4" />
                  </button>
                  <div className="absolute right-0 z-10 w-64 p-2 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 mt-1">
                    <p>These plans offer a 30-day trial period where you can cancel without paying early termination fees if you're not satisfied with the service.</p>
                  </div>
                </div>
              </div>
              
              {/* No Deposit */}
              <div
                className={cn(
                  "p-4 border rounded-lg cursor-pointer flex items-center transition-all",
                  wizardState.planPreferences.requiresNoDeposit
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-400'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-750'
                )}
                onClick={() => togglePreference('requiresNoDeposit')}
              >
                <div
                  className={cn(
                    "h-5 w-5 mr-3 flex items-center justify-center rounded-full border transition-colors",
                    wizardState.planPreferences.requiresNoDeposit
                      ? "bg-primary-600 border-primary-600 dark:bg-primary-500 dark:border-primary-500"
                      : "border-gray-400 dark:border-gray-500"
                  )}
                >
                  {wizardState.planPreferences.requiresNoDeposit && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
                <div className="flex items-center flex-grow">
                  <div className="mr-3 p-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30">
                    <DollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">No Security Deposit</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Plans that don't require upfront money
                    </p>
                  </div>
                </div>
                
                <div className="ml-2 relative group">
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <HelpCircle className="h-4 w-4" />
                  </button>
                  <div className="absolute right-0 z-10 w-64 p-2 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 mt-1">
                    <p>These plans waive security deposits, which can typically range from $100-$400. You may still need to undergo a credit check or pay a deposit based on your credit history.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Market Insights Section with Accordions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Current Market Insights</h3>
            
            {/* Green Energy Options - Accordion */}
            <button
              onClick={() => toggleSection('greenEnergy')}
              className="w-full flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg mb-3 text-left"
            >
              <div className="flex items-center">
                <Leaf className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <h4 className="text-sm font-medium text-green-800 dark:text-green-200">Green Energy Plans</h4>
              </div>
              <ChevronDown className={`h-5 w-5 text-green-600 dark:text-green-400 transition-transform ${expandedSection === 'greenEnergy' ? 'rotate-180' : ''}`} />
            </button>
            
            {expandedSection === 'greenEnergy' && (
              <div className="p-4 border border-green-100 dark:border-green-800 rounded-lg mb-3 bg-green-50 dark:bg-green-900/10 animate-fade-in">
                <p className="text-sm text-green-700 dark:text-green-300">
                  Good news! Green energy isn't expensive anymore. Texas plans from 100% renewable sources now cost virtually the same as regular plans (often just 0.2-0.3¢ more per kWh). 
                </p>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 mr-2" />
                    <p className="text-xs text-green-700 dark:text-green-300">Texas is the #1 state for wind power, with solar growing rapidly</p>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 mr-2" />
                    <p className="text-xs text-green-700 dark:text-green-300">Same reliability, same billing - just cleaner energy sources</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Seasonal Shopping Tips - Accordion */}
            <button
              onClick={() => toggleSection('seasonalTips')}
              className="w-full flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-lg text-left"
            >
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
                <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200">Market Timing Tips</h4>
              </div>
              <ChevronDown className={`h-5 w-5 text-amber-600 dark:text-amber-400 transition-transform ${expandedSection === 'seasonalTips' ? 'rotate-180' : ''}`} />
            </button>
            
            {expandedSection === 'seasonalTips' && (
              <div className="p-4 border border-amber-100 dark:border-amber-800 rounded-lg mt-3 bg-amber-50 dark:bg-amber-900/10 animate-fade-in">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Right now is actually a great time to lock in a rate. Prices typically jump 7-10% during summer, so securing a fixed rate before that happens can save you hundreds over the next year.
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-800 dark:text-amber-200 font-medium">Current Market Trend:</span>
                    <span className="text-amber-700 dark:text-amber-300 font-bold">
                      Rates Rising Soon
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-800 dark:text-amber-200 font-medium">Best Lock-In Period:</span>
                    <span className="text-amber-700 dark:text-amber-300 font-bold">
                      Now (Before Summer Spike)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contextual Help for Selected Term */}
        {selectedTerms.length > 0 && (
          <div className="animate-fade-in">
            <ContextualHelp
              title={selectedTerms.length > 1 ? 
                `About your selected contract terms` : 
                `About ${selectedTerms[0]} plans`
              }
              theme="info"
            >
              {selectedTerms.length > 1 ? (
                <>
                  <p>You've selected multiple contract lengths to compare:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    {selectedTerms.includes('1-month') && (
                      <li>1-month plans offer maximum flexibility with higher rates (18-20¢/kWh)</li>
                    )}
                    {selectedTerms.includes('3-month') && (
                      <li>3-month plans provide short commitment with moderate rates (16-18¢/kWh)</li>
                    )}
                    {selectedTerms.includes('6-month') && (
                      <li>6-month plans balance flexibility and savings at around 14-16¢/kWh</li>
                    )}
                    {selectedTerms.includes('12-month') && (
                      <li>12-month plans offer great value (10.5-13¢/kWh) with protection through all seasons</li>
                    )}
                    {selectedTerms.includes('24-month') && (
                      <li>24-month plans provide long-term security from rate increases (11-12.5¢/kWh)</li>
                    )}
                  </ul>
                  <p className="mt-2">Viewing multiple term options will help you compare and find the best value for your situation.</p>
                </>
              ) : selectedTerms[0] === '1-month' ? (
                <p>Month-to-month plans are all about flexibility - perfect if you're in a temporary spot or unsure how long you'll be staying. They run around 18-20¢/kWh, which is higher than longer plans, but you can cancel anytime without penalties.</p>
              ) : selectedTerms[0] === '3-month' ? (
                <p>3-month plans give you a short commitment with moderate rates (around 16-18¢/kWh). They're ideal if you're in a seasonal rental or just need a little breathing room before deciding on a longer plan.</p>
              ) : selectedTerms[0] === '6-month' ? (
                <p>6-month plans strike a nice balance between flexibility and savings. At about 14-16¢/kWh, they're perfect for 6-month leases or if you prefer reviewing your options twice a year to catch market opportunities.</p>
              ) : selectedTerms[0] === '12-month' ? (
                <p>12-month plans are our most popular option for good reason. With rates between 10.5-13¢/kWh, you get protection through both summer and winter seasons while maintaining a competitive rate. Perfect for most homes and families.</p>
              ) : (
                <p>24-month plans are all about peace of mind. Lock in today's rate (around 11-12.5¢/kWh) for a full two years, protecting yourself from expected market increases. It's like insurance for your electricity budget!</p>
              )}
            </ContextualHelp>
          </div>
        )}

        {/* Feature Selections Info - Only shows when multiple features are selected */}
        {(wizardState.planPreferences.isRenewable && wizardState.planPreferences.hasSatisfactionGuarantee) || 
         (wizardState.planPreferences.isRenewable && wizardState.planPreferences.requiresNoDeposit) || 
         (wizardState.planPreferences.hasSatisfactionGuarantee && wizardState.planPreferences.requiresNoDeposit) ? (
          <div className="animate-fade-in">
            <ContextualHelp
              title="Quick note about your selections"
              theme="warning"
              icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
            >
              <p>
                Just a heads up - selecting multiple features narrows down the available plans. If you don't see enough options on the next screen, you can always come back and adjust these filters to see more choices.
              </p>
            </ContextualHelp>
          </div>
        ) : null}
        
        {/* Next Step Preview */}
        <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg border border-primary-100 dark:border-primary-800 animate-fade-in">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-primary-800 dark:text-primary-200">
                What's Next? Viewing Available Plans
              </h4>
              <p className="mt-1 text-sm text-primary-700 dark:text-primary-300">
                In the next step, you'll see a selection of electricity plans that match your preferences. You'll be able to compare rates, features, and estimated monthly costs based on your home profile.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function X(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default PlanFiltersStep;