import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, X, HelpCircle, Home, Building, Clock, Info, AlertCircle, DollarSign, ShieldCheck, User } from 'lucide-react';
import { cn } from '../utils/cn';
import SEO from '../components/shared/SEO';
import TransferIntentDialog from '../components/shared/TransferIntentDialog';
import BillUploadAnalysis from '../components/shared/BillUploadAnalysis';
import TransferProvider from '../components/shared/TransferProvider';
import TransferEducationModal from '../components/shared/TransferEducationModal';
import AbortTransferDialog from '../components/shared/AbortTransferDialog';
import { useWizard } from '../context/WizardContext';
import TransferServiceFlow from '../components/shared/TransferServiceFlow';

// Define the possible steps in the transfer flow
type StepType = 
  | 'initial' 
  | 'intent' 
  | 'bill-analysis' 
  | 'transfer-details' 
  | 'transfer-education'
  | 'transfer-service-flow'
  | 'abort-transfer';

const TransferPage = () => {
  const { wizardState, updateWizardState } = useWizard();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<StepType>('initial');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  
  // Auto-open intent dialog when page first loads
  useEffect(() => {
    // Small delay to let the page load first
    const timer = setTimeout(() => {
      setIsDialogOpen(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle intent dialog choices
  const handleIntentYes = () => {
    setIsDialogOpen(false);
    setCurrentStep('transfer-education');
  };
  
  const handleIntentNo = () => {
    setIsDialogOpen(false);
    setCurrentStep('bill-analysis');
  };
  
  const handleIntentNotSure = () => {
    setIsDialogOpen(false);
    setCurrentStep('bill-analysis');
  };
  
  const handleIntentNoExistingService = () => {
    setIsDialogOpen(false);
    
    // If user doesn't have existing service, send them to the wizard flow
    updateWizardState({
      transferFlow: {
        hasExistingService: false,
        wantsNewPlan: true
      },
      funnel: {
        entryPoint: 'transfer',
        completedSteps: [],
        timeOnSteps: {},
        revisitedSteps: []
      },
      startTime: new Date().toISOString()
    });
    
    navigate('/wizard/welcome');
  };
  
  // Handle bill analysis results
  const handleContinueWithNewPlans = () => {
    // Update wizard state
    updateWizardState({
      transferFlow: {
        ...wizardState.transferFlow,
        wantsNewPlan: true
      },
      funnel: {
        entryPoint: 'transfer',
        completedSteps: [],
        timeOnSteps: {},
        revisitedSteps: []
      },
      startTime: new Date().toISOString()
    });
    
    // Navigate to wizard flow
    navigate('/wizard/welcome');
  };
  
  const handleContinueWithTransfer = () => {
    setCurrentStep('transfer-details');
  };

  // Toggle FAQ item
  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO 
        title="Transfer Your Electricity When Moving - ComparePower"
        description="Find out whether transferring your current electricity plan or selecting a new one is best for your move within Texas."
      />
      
      {/* Hero section */}
      <section className="relative bg-gradient-to-r from-primary-700 to-primary-800 dark:from-primary-900 dark:to-primary-800 py-16 md:py-20">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">Moving Your Electricity Service</h1>
          <p className="mt-4 text-xl text-white/90 max-w-2xl mx-auto">
            Let's find the best option for your move - transferring your current plan or choosing a new one
          </p>
        </div>
      </section>
      
      {/* Main content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {currentStep === 'initial' && (
          <div className="space-y-10">
            {/* Options section - Redesigned for better visual hierarchy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="bg-primary-50 dark:bg-primary-900/30 py-4 px-6 border-b border-primary-100 dark:border-primary-800">
                  <h2 className="text-xl font-bold text-primary-800 dark:text-primary-200">Your Options</h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center">
                          <ArrowRight className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Transfer your existing plan</h3>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">
                          Keep your current rate, provider, and contract terms
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                          <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Select a new electricity plan</h3>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">
                          Find a plan better matched to your new home
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-amber-700 dark:text-amber-400">
                          <span className="font-medium">Did you know?</span> 83% of Texans who transfer their current plan end up paying more than necessary at their new address.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="bg-green-50 dark:bg-green-900/30 py-4 px-6 border-b border-green-100 dark:border-green-800">
                  <h2 className="text-xl font-bold text-green-800 dark:text-green-200">Real Example: Potential Savings</h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4 mb-4">
                    <div className="flex items-start">
                      <User className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">Moving from apartment to house</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Usage increase from 750kWh to 1,500kWh/month</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3 mb-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Current Rate</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">11¢/kWh</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">New Home Cost</div>
                        <div className="text-lg font-bold text-red-600 dark:text-red-400">$165/month</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                      <div>
                        <div className="text-sm text-green-600 dark:text-green-400">New Optimized Plan</div>
                        <div className="text-lg font-bold text-green-700 dark:text-green-400">10.5¢/kWh</div>
                      </div>
                      <div>
                        <div className="text-sm text-green-600 dark:text-green-400">Annual Savings</div>
                        <div className="text-lg font-bold text-green-700 dark:text-green-400">$756</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Texas law allows you to cancel your current contract without penalty when moving.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Primary CTA */}
            <div className="text-center">
              <button
                type="button"
                className="btn btn-primary py-3 px-8 text-base font-medium"
                onClick={() => setIsDialogOpen(true)}
              >
                Find My Best Option
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                Quick 2-minute process to determine the best choice for your move
              </p>
            </div>
            
            {/* Why This Matters section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-800/50 py-4 px-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Why This Matters</h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-3">
                      <Home className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">Different Home, Different Needs</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Plans that work for apartments often have higher rates at house-level usage, and vice versa.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-3">
                      <Clock className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">Market Rates Change</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Today's market rates might be better than when you originally signed your contract.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-3">
                      <ShieldCheck className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">No Cancellation Fees</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Texas law waives early termination fees when moving to a new location.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* FAQ Section - Redesigned for clarity */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">Common Questions</h2>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  <FaqItem 
                    id="termination-fee"
                    question="Do I have to pay an early termination fee when moving?"
                    answer="No. Under Texas law (Public Utility Commission §25.475), you can terminate your current electricity contract without penalty when moving to a new location, even if you're in the middle of your contract term."
                    isExpanded={expandedFaq === 'termination-fee'}
                    onToggle={toggleFaq}
                  />
                  
                  <FaqItem 
                    id="what-happens"
                    question="What happens to my current electricity plan if I don't transfer it?"
                    answer="If you don't transfer your current plan, it will be terminated on your move-out date. Your provider will send a final bill for your old address. You'll need to set up new service for your new address, either with your current provider or a different one."
                    isExpanded={expandedFaq === 'what-happens'}
                    onToggle={toggleFaq}
                  />
                  
                  <FaqItem 
                    id="how-decide"
                    question="How do I decide whether to transfer or choose a new plan?"
                    answer="Consider how your new home compares to your current one. Different-sized homes have different usage patterns, which affect which plan is most cost-effective. Also, compare your current rate to today's market rates. If rates have gone down since you signed up, a new plan could save you money."
                    isExpanded={expandedFaq === 'how-decide'}
                    onToggle={toggleFaq}
                  />
                  
                  <FaqItem 
                    id="how-far-advance"
                    question="How far in advance should I set up electricity for my move?"
                    answer="We recommend setting up your electricity 1-2 weeks before your move. This gives enough time for processing while still allowing you to take advantage of current rates. For same-day service, complete your order before 5PM (Monday-Saturday)."
                    isExpanded={expandedFaq === 'how-far-advance'}
                    onToggle={toggleFaq}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {currentStep === 'transfer-service-flow' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <TransferServiceFlow />
          </div>
        )}
      </section>
      
      {/* Modals */}
      {isDialogOpen && currentStep === 'initial' && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            <TransferIntentDialog 
              onYes={handleIntentYes} 
              onNo={handleIntentNo} 
              onNotSure={handleIntentNotSure} 
              onNoExistingService={handleIntentNoExistingService} 
              onClose={() => setIsDialogOpen(false)} 
            />
          </div>
        </div>
      )}
      
      {currentStep === 'transfer-education' && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            <TransferEducationModal 
              onClose={() => {
                setCurrentStep('initial');
                setIsDialogOpen(false);
              }} 
              onCompareOptions={handleContinueWithNewPlans}
              onContinueTransfer={handleContinueWithTransfer}
            />
          </div>
        </div>
      )}
      
      {currentStep === 'bill-analysis' && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            <BillUploadAnalysis 
              onClose={() => {
                setCurrentStep('initial');
                setIsDialogOpen(false);
              }} 
              onContinueWithNewPlans={handleContinueWithNewPlans}
              onContinueWithTransfer={handleContinueWithTransfer}
            />
          </div>
        </div>
      )}
      
      {currentStep === 'transfer-details' && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            <TransferProvider
              onClose={() => {
                setCurrentStep('initial');
                setIsDialogOpen(false);
              }}
              onContinueWithNewPlans={handleContinueWithNewPlans}
            />
          </div>
        </div>
      )}
      
      {currentStep === 'abort-transfer' && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            <AbortTransferDialog
              onClose={() => {
                setCurrentStep('transfer-details');
              }}
              onNewPlan={() => {
                handleContinueWithNewPlans();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// FAQ Item component
const FaqItem: React.FC<{
  id: string;
  question: string;
  answer: string;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}> = ({ id, question, answer, isExpanded, onToggle }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <button
        className="w-full text-left py-4 px-6 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
        onClick={() => onToggle(id)}
        aria-expanded={isExpanded}
      >
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{question}</h3>
        <div className={`ml-2 flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
          <ChevronDownIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </div>
      </button>
      
      {isExpanded && (
        <div className="pb-4 px-6 animate-fadeDown">
          <div className="text-sm text-gray-600 dark:text-gray-300">{answer}</div>
        </div>
      )}
    </div>
  );
};

// Custom icons
function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
}

export default TransferPage;