import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Info, HelpCircle, Home, Building, MapPin, DollarSign, Clock, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../utils/cn';
import SEO from '../components/shared/SEO';
import { useWizard } from '../context/WizardContext';
import { useNavigate } from 'react-router-dom';

// FAQ Item component
const FAQItem = ({ question, answer }: { question: string; answer: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-0">
      <button
        className="flex justify-between items-center w-full py-4 text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-base font-medium text-gray-900 dark:text-white">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        )}
      </button>
      
      {isOpen && (
        <div className="pb-4 prose prose-sm dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-300">{answer}</p>
        </div>
      )}
    </div>
  );
};

const TransferServicePage = () => {
  const navigate = useNavigate();
  const { updateWizardState } = useWizard();
  const [moveType, setMoveType] = useState<'apartment-to-house' | 'house-to-apartment' | 'similar-size' | null>(null);
  const [showRecommendation, setShowRecommendation] = useState(false);
  
  // Handle option selection
  const handleOptionSelect = (option: 'apartment-to-house' | 'house-to-apartment' | 'similar-size') => {
    setMoveType(option);
    setShowRecommendation(true);
  };
  
  // Start the comparison flow
  const handleStartComparison = () => {
    // Set initial data in wizard context
    updateWizardState({
      // Set that this is a transfer flow
      funnel: {
        entryPoint: 'transfer',
        completedSteps: [],
        timeOnSteps: {},
        revisitedSteps: []
      },
      // Initialize with transfer-specific data
      transferFlow: true,
      startTime: new Date().toISOString()
    });
    
    // Navigate to the wizard
    navigate('/wizard/welcome');
  };
  
  return (
    <div className="bg-white dark:bg-gray-900">
      <SEO 
        title="Transfer Your Electricity Service - ComparePower"
        description="Find out whether transferring your current electricity plan or selecting a new one is best for your move within Texas."
      />
      
      {/* Hero section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-800 dark:to-secondary-800"></div>
        
        {/* Background patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 rounded-full bg-white dark:bg-gray-700"></div>
          <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-96 h-96 rounded-full bg-white dark:bg-gray-700"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              When You Move in Texas
            </h1>
            <p className="mt-6 text-xl text-white max-w-3xl mx-auto">
              Let's figure out what's best for your electricity when moving
            </p>
          </div>
        </div>
      </section>
      
      {/* Main content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Understanding Your Options</h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                When you move within Texas, you have two choices for electricity service:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 10V3L4 14H11V21L20 10H13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="ml-4 text-xl font-bold text-gray-900 dark:text-white">Transfer your existing plan</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Keep your current rate, provider, and contract terms at your new address.
                </p>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 flex-shrink-0" />
                    <span>Simple process with your current provider</span>
                  </div>
                  <div className="flex items-start mt-2">
                    <Check className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 flex-shrink-0" />
                    <span>No need to shop for a new plan</span>
                  </div>
                  <div className="flex items-start mt-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500 dark:text-amber-400 mr-2 flex-shrink-0" />
                    <span>May not be optimal for different-sized homes</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="ml-4 text-xl font-bold text-gray-900 dark:text-white">Select a new electricity plan</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Find a plan better matched to your new home's energy needs.
                </p>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                    <span>Potential savings of $100-$250 annually</span>
                  </div>
                  <div className="flex items-start mt-2">
                    <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                    <span>Plans optimized for your new home's usage</span>
                  </div>
                  <div className="flex items-start mt-2">
                    <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                    <span>No cancellation fees when moving (Texas law)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-100 dark:border-blue-800 mb-12">
              <div className="flex items-start">
                <Info className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">Why This Matters</h3>
                  <p className="mt-2 text-blue-700 dark:text-blue-300">
                    Many Texans automatically transfer their current service without realizing their energy needs may have changed. Different-sized homes, new appliances, and lifestyle changes all affect electricity usage and costs.
                  </p>
                  <p className="mt-2 text-blue-700 dark:text-blue-300">
                    Taking a few minutes to compare options could save you $100 to $250 annually.
                  </p>
                  <p className="mt-2 text-blue-700 dark:text-blue-300">
                    <strong>Quick check:</strong> If your home size is changing by more than 200 sq ft, you likely need a different plan.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center mb-12">
              <Link
                to="/wizard/welcome"
                className="btn btn-primary inline-flex items-center px-8 py-3 text-base font-medium"
                onClick={handleStartComparison}
              >
                Explore My Options <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
          
          {/* Why This Matters section */}
          <div className="max-w-5xl mx-auto mt-20">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">Why This Matters</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center mb-4">
                  <Home className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-2" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Different Home, Different Needs</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  A plan priced for a 750 kWh apartment can hit penalty rates at 1,500 kWh house usage. Moving from a house to an apartment? You'll overpay for capacity you don't need.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center mb-4">
                  <DollarSign className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-2" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Market Rates Change</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Your current rate may be outdated compared to today's market. Texas electricity rates change quarterly, and better deals may be available now.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center mb-4">
                  <Check className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-2" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Cancellation Fees</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Texas law allows you to cancel your current electricity contract without penalty when moving, giving you freedom to choose the best option for your new home.
                </p>
              </div>
            </div>
          </div>
          
          {/* What's your situation section */}
          <div className="max-w-3xl mx-auto mt-20">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">What's Your Situation?</h2>
            
            <div className="space-y-4">
              <button
                className={cn(
                  "w-full text-left p-6 rounded-lg border transition-all",
                  moveType === 'apartment-to-house'
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-400"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-600"
                )}
                onClick={() => handleOptionSelect('apartment-to-house')}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center">
                      <Building className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                      <ArrowRight className="h-4 w-4 mx-2 text-gray-400 dark:text-gray-500" />
                      <Home className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Moving from an apartment to a house</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your electricity usage will likely increase significantly</p>
                  </div>
                </div>
              </button>
              
              <button
                className={cn(
                  "w-full text-left p-6 rounded-lg border transition-all",
                  moveType === 'house-to-apartment'
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-400"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-600"
                )}
                onClick={() => handleOptionSelect('house-to-apartment')}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center">
                      <Home className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                      <ArrowRight className="h-4 w-4 mx-2 text-gray-400 dark:text-gray-500" />
                      <Building className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Moving from a house to an apartment</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your electricity usage will likely decrease significantly</p>
                  </div>
                </div>
              </button>
              
              <button
                className={cn(
                  "w-full text-left p-6 rounded-lg border transition-all",
                  moveType === 'similar-size'
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-400"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-600"
                )}
                onClick={() => handleOptionSelect('similar-size')}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center">
                      <Home className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                      <ArrowRight className="h-4 w-4 mx-2 text-gray-400 dark:text-gray-500" />
                      <Home className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Moving to a similar-sized home</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your electricity usage may remain similar</p>
                  </div>
                </div>
              </button>
            </div>
            
            {/* Recommendation based on selection */}
            {showRecommendation && (
              <div className="mt-8 animate-fade-in">
                <div className={cn(
                  "rounded-lg p-6 border",
                  moveType === 'apartment-to-house' || moveType === 'house-to-apartment'
                    ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                    : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                )}>
                  <div className="flex items-start">
                    {moveType === 'apartment-to-house' || moveType === 'house-to-apartment' ? (
                      <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 mr-3 flex-shrink-0" />
                    ) : (
                      <Info className="h-6 w-6 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" />
                    )}
                    <div>
                      <h3 className={cn(
                        "text-lg font-medium",
                        moveType === 'apartment-to-house' || moveType === 'house-to-apartment'
                          ? "text-amber-800 dark:text-amber-200"
                          : "text-green-800 dark:text-green-200"
                      )}>
                        {moveType === 'apartment-to-house' && "We recommend comparing new plans"}
                        {moveType === 'house-to-apartment' && "We recommend comparing new plans"}
                        {moveType === 'similar-size' && "Either option may work for you"}
                      </h3>
                      <p className={cn(
                        "mt-2",
                        moveType === 'apartment-to-house' || moveType === 'house-to-apartment'
                          ? "text-amber-700 dark:text-amber-300"
                          : "text-green-700 dark:text-green-300"
                      )}>
                        {moveType === 'apartment-to-house' && (
                          "Your electricity usage will likely increase significantly in a house. Most apartment plans are optimized for lower usage (500-1000 kWh) and become expensive at higher usage levels typical of houses (1500+ kWh)."
                        )}
                        {moveType === 'house-to-apartment' && (
                          "Your electricity usage will likely decrease significantly in an apartment. Most house plans are optimized for higher usage (1500+ kWh) and may have minimum usage fees that make them expensive for the lower usage typical of apartments (500-1000 kWh)."
                        )}
                        {moveType === 'similar-size' && (
                          "Since you're moving to a similar-sized home, your usage patterns may remain similar. However, it's still worth comparing current market rates to your existing plan, as you might find better options."
                        )}
                      </p>
                      <div className="mt-4">
                        <button
                          onClick={handleStartComparison}
                          className={cn(
                            "btn",
                            moveType === 'apartment-to-house' || moveType === 'house-to-apartment'
                              ? "bg-amber-600 hover:bg-amber-700 text-white"
                              : "bg-green-600 hover:bg-green-700 text-white"
                          )}
                        >
                          Compare My Options
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Real Example */}
          <div className="max-w-4xl mx-auto mt-20">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">Real Example:</h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Moving from an Apartment to a House</h3>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Current apartment plan</h4>
                    <p className="mt-2 text-2xl font-bold text-primary-600 dark:text-primary-400">11¢/kWh</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">at 750 kWh usage</p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Same plan at house usage</h4>
                    <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">15¢/kWh</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">at 1,500 kWh usage</p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">New optimized house plan</h4>
                    <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">10.8¢/kWh</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">flat rate</p>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-success-50 dark:bg-success-900/20 rounded-lg p-4 border border-success-200 dark:border-success-800">
                    <h4 className="text-sm font-medium text-success-800 dark:text-success-200 uppercase">Monthly savings</h4>
                    <p className="mt-2 text-3xl font-bold text-success-600 dark:text-success-400">$63</p>
                  </div>
                  
                  <div className="bg-success-50 dark:bg-success-900/20 rounded-lg p-4 border border-success-200 dark:border-success-800">
                    <h4 className="text-sm font-medium text-success-800 dark:text-success-200 uppercase">Annual savings</h4>
                    <p className="mt-2 text-3xl font-bold text-success-600 dark:text-success-400">$756</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mt-20">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">Common Questions About Transferring</h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
              <FAQItem 
                question="Do I have to pay an early termination fee when moving?"
                answer={
                  <>
                    No. Under Texas law (Public Utility Commission §25.475), you can terminate your current electricity contract without penalty when moving to a new location, even if you're in the middle of your contract term.
                  </>
                }
              />
              
              <FAQItem 
                question="What happens to my current electricity plan if I don't transfer it?"
                answer={
                  <>
                    If you don't transfer your current plan, it will be terminated on your move-out date. Your provider will send a final bill for your old address. You\'ll need to set up new service for your new address, either with your current provider or a different one.
                  </>
                }
              />
              
              <FAQItem 
                question="How do I decide whether to transfer or choose a new plan?"
                answer={
                  <>
                    Consider how your new home compares to your current one. Different-sized homes have different usage patterns, which affect which plan is most cost-effective. Also, compare your current rate to today's market rates. If rates have gone down since you signed up, a new plan could save you money.
                  </>
                }
              />
              
              <FAQItem 
                question="How far in advance should I set up electricity for my move?"
                answer={
                  <>
                    We recommend setting up your electricity 1-2 weeks before your move. This gives enough time for processing while still allowing you to take advantage of current rates. For same-day service, complete your order before 5PM (Monday-Saturday).
                  </>
                }
              />
            </div>
          </div>
          
          {/* Final CTA */}
          <div className="max-w-3xl mx-auto mt-20 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ready to explore your options?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Take 2 minutes to compare both options and find what's best for your new home.
            </p>
            <button
              onClick={handleStartComparison}
              className="btn btn-primary inline-flex items-center px-8 py-3 text-base font-medium"
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TransferServicePage;