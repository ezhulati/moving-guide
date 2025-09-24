import { useWizard } from '../../context/WizardContext';
import { Clock, CreditCard, AlertCircle, Info, Shield, Check, HelpCircle, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import FeatureTestimonial from '../shared/FeatureTestimonial';

const ServiceDetailsStep = () => {
  const { wizardState, updateWizardState } = useWizard();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [sectionComplete, setSectionComplete] = useState({
    connection: false,
    payment: false
  });
  const [showDepositHelp, setShowDepositHelp] = useState(false);

  // Handle connection speed selection
  const handleConnectionSpeedChange = (speed: 'standard' | 'same-day') => {
    updateWizardState({
      serviceDetails: {
        ...wizardState.serviceDetails,
        connectionSpeed: speed,
      },
    });
    setSectionComplete(prev => ({ ...prev, connection: true }));
  };

  // Handle payment method selection
  const handlePaymentMethodChange = (method: string) => {
    updateWizardState({
      serviceDetails: {
        ...wizardState.serviceDetails,
        paymentMethod: method,
      },
    });
    setSectionComplete(prev => ({ ...prev, payment: true }));
    
    // Show confirmation when all sections are complete
    if (wizardState.serviceDetails.connectionSpeed) {
      setShowConfirmation(true);
    }
  };

  // Update section completion status when component mounts
  useEffect(() => {
    setSectionComplete({
      connection: !!wizardState.serviceDetails.connectionSpeed,
      payment: !!wizardState.serviceDetails.paymentMethod || !wizardState.serviceDetails.depositRequired
    });
    
    // Show confirmation if all sections complete
    if (wizardState.serviceDetails.connectionSpeed && 
        (wizardState.serviceDetails.paymentMethod || !wizardState.serviceDetails.depositRequired)) {
      setShowConfirmation(true);
    }
  }, [wizardState.serviceDetails]);

  // Check if same-day service is available
  const isSameDayAvailable = (): boolean => {
    if (!wizardState.moveInDate) return false;
    
    const moveInDate = new Date(wizardState.moveInDate);
    const today = new Date();
    
    // Same day if move-in date is today
    if (moveInDate.toDateString() === today.toDateString()) {
      // Same day service is available Monday-Saturday before 5PM
      const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const hour = today.getHours();
      
      return dayOfWeek !== 0 && hour < 17; // Not Sunday and before 5PM
    }
    
    return false;
  };

  // Format the move-in date in a readable format
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // Simulate deposit requirement
  // In a real app, this would be determined by credit check results
  const isDepositRequired = (): boolean => {
    // No SSN provided = deposit required
    return !wizardState.personalInfo.lastFourSSN;
  };

  // Update deposit required status when component mounts
  const depositRequired = isDepositRequired();
  if (wizardState.serviceDetails.depositRequired !== depositRequired) {
    updateWizardState({
      serviceDetails: {
        ...wizardState.serviceDetails,
        depositRequired,
      },
    });
  }

  const sameDayAvailable = isSameDayAvailable();
  
  // Calculate total charges
  const calculateTotalCharges = () => {
    let total = 0;
    
    // Selected plan monthly charge
    total += wizardState.selectedPlan.estimatedMonthlyBill || 0;
    
    // Same-day connection fee
    if (wizardState.serviceDetails.connectionSpeed === 'same-day') {
      total += 25;
    }
    
    return total;
  };

  return (
    <div className="wizard-step">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Let's Finalize Your Service</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Just a few more details before we get your power flowing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Connection speed selection */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Clock className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
              When Do You Need Power?
            </h3>
            
            {sectionComplete.connection && (
              <span className="flex items-center text-xs text-success-700 dark:text-success-400 bg-success-100 dark:bg-success-900/30 px-2 py-1 rounded-full">
                <Check className="h-3 w-3 mr-1" />
                Selected
              </span>
            )}
          </div>
          
          <div className="space-y-4">
            <div
              className={cn(
                "border rounded-lg p-4 cursor-pointer transition-all",
                wizardState.serviceDetails.connectionSpeed === 'standard'
                  ? 'border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/30 ring-1 ring-primary-500 dark:ring-primary-400'
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              )}
              onClick={() => handleConnectionSpeedChange('standard')}
            >
              <div className="flex items-center">
                <div
                  className={cn(
                    "h-5 w-5 mr-3 flex items-center justify-center rounded-full border",
                    wizardState.serviceDetails.connectionSpeed === 'standard'
                      ? "bg-primary-600 dark:bg-primary-500 border-primary-600 dark:border-primary-500"
                      : "border-gray-400 dark:border-gray-500"
                  )}
                >
                  {wizardState.serviceDetails.connectionSpeed === 'standard' && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Standard Connection</span>
                  <span className="ml-2 inline-block text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">No Fee</span>
                </div>
              </div>
              
              <div className="mt-3 ml-8">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Your power will be ready on {formatDate(wizardState.moveInDate)}.
                </p>
                <div className="mt-2 flex items-start text-xs text-gray-500 dark:text-gray-400">
                  <Info className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 mr-1 flex-shrink-0 mt-0.5" />
                  <p>Standard service is included at no extra charge</p>
                </div>
              </div>
            </div>
            
            <div
              className={cn(
                "border rounded-lg p-4 transition-all relative overflow-hidden",
                sameDayAvailable
                  ? "cursor-pointer hover:shadow-md"
                  : "opacity-50 cursor-not-allowed",
                wizardState.serviceDetails.connectionSpeed === 'same-day' && sameDayAvailable
                  ? 'border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/30 ring-1 ring-primary-500 dark:ring-primary-400'
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50',
                !sameDayAvailable && "bg-gray-50 dark:bg-gray-800/50"
              )}
              onClick={() => {
                if (sameDayAvailable) {
                  handleConnectionSpeedChange('same-day');
                }
              }}
            >
              {sameDayAvailable && (
                <div className="absolute -top-1 -right-1 bg-green-500 dark:bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-bl-md">
                  TODAY!
                </div>
              )}
              
              <div className="flex items-center mt-2">
                <div
                  className={cn(
                    "h-5 w-5 mr-3 flex items-center justify-center rounded-full border",
                    wizardState.serviceDetails.connectionSpeed === 'same-day' && sameDayAvailable
                      ? 'bg-primary-600 dark:bg-primary-500 border-primary-600 dark:border-primary-500'
                      : 'border-gray-400 dark:border-gray-500'
                  )}
                >
                  {wizardState.serviceDetails.connectionSpeed === 'same-day' && sameDayAvailable && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-900 dark:text-white">Priority Same-Day Connection</span>
                  <span className="ml-2 inline-block text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded">$25 fee</span>
                </div>
              </div>
              
              <div className="mt-3 ml-8">
                {sameDayAvailable ? (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Get your power connected TODAY! We'll expedite your order.
                    </p>
                    <div className="mt-2 flex items-start text-xs text-amber-600 dark:text-amber-400">
                      <Clock className="h-3.5 w-3.5 mr-1 flex-shrink-0 mt-0.5" />
                      <p>Must complete order by 5PM for same-day service</p>
                    </div>
                  </>
                ) : (
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Same-day service is only available when your move-in date is today and you order before 5PM (except Sundays).
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Testimonial for same-day service when available */}
          {sameDayAvailable && (
            <div className="mt-4 animate-fade-in">
              <FeatureTestimonial
                feature="Same-Day Lifesaver"
                quote="My apartment manager wouldn't give me the keys until I had proof of electricity. With the same-day service, I had my confirmation in minutes and got my keys right away. Worth every penny of the $25 fee!"
                author={{ name: "Jennifer L.", location: "Houston, TX" }}
                theme="subtle"
              />
            </div>
          )}
        </div>

        {/* Order summary section */}
        <div className="dashboard-card">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-5">Your Order Summary</h3>
          
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Selected Plan</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Plan:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{wizardState.selectedPlan.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Provider:</span>
                  <span className="text-gray-900 dark:text-gray-100">{wizardState.selectedPlan.provider}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Contract Length:</span>
                  <span className="text-gray-900 dark:text-gray-100">{wizardState.selectedPlan.term}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Rate:</span>
                  <span className="text-gray-900 dark:text-gray-100">{wizardState.selectedPlan.rate}¢/kWh</span>
                </div>
                
                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Monthly Bill (Est.):</span>
                  <span className="font-semibold text-primary-700 dark:text-primary-400">${wizardState.selectedPlan.estimatedMonthlyBill}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Service Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-gray-600 dark:text-gray-400">Address:</span>
                  <span className="text-right text-gray-900 dark:text-gray-100">
                    {wizardState.address.street}<br />
                    {wizardState.address.city}, {wizardState.address.state} {wizardState.address.zip}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Move-in Date:</span>
                  <span className="text-gray-900 dark:text-gray-100">{formatDate(wizardState.moveInDate)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Connection Type:</span>
                  <span className="flex items-center">
                    {wizardState.serviceDetails.connectionSpeed === 'same-day' ? (
                      <>
                        <Clock className="h-4 w-4 text-success-600 dark:text-success-500 mr-1" />
                        <span className="font-medium text-success-700 dark:text-success-400">Priority Same-Day</span>
                      </>
                    ) : (
                      'Standard'
                    )}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Payment Summary</h4>
              <div className="space-y-2">
                {wizardState.serviceDetails.connectionSpeed === 'same-day' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Priority connection:</span>
                    <span className="text-gray-900 dark:text-gray-100">$25.00</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">First Bill Amount (Est.):</span>
                  <span className="font-semibold text-primary-700 dark:text-primary-400">
                    ${calculateTotalCharges().toFixed(2)}
                  </span>
                </div>
                
                {wizardState.serviceDetails.depositRequired && (
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-amber-700 dark:text-amber-500 flex items-center font-medium">
                      Security Deposit: 
                    </span>
                    <span className="text-amber-700 dark:text-amber-400 font-medium">$150.00 (Refundable)</span>
                  </div>
                )}
                
                {wizardState.serviceDetails.paymentMethod && (
                  <div className="flex justify-between pt-2">
                    <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                    <span className="capitalize text-gray-900 dark:text-gray-100">
                      {wizardState.serviceDetails.paymentMethod === 'credit-card' 
                        ? 'Credit Card' 
                        : 'Bank Account'}
                    </span>
                  </div>
                )}
                
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center pt-1">
                  <Info className="h-3.5 w-3.5 mr-1" />
                  Your first bill will arrive approximately 30 days after service starts
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security deposit section */}
        {wizardState.serviceDetails.depositRequired && (
          <div className="dashboard-card lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                Security Deposit Required 
                <button
                  type="button" 
                  className="ml-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  onClick={() => setShowDepositHelp(!showDepositHelp)}
                  aria-label="Learn more about security deposits"
                >
                  <HelpCircle className="h-5 w-5" />
                </button>
              </h3>
              
              {sectionComplete.payment && (
                <span className="flex items-center text-xs text-success-700 dark:text-success-400 bg-success-100 dark:bg-success-900/30 px-2 py-1 rounded-full">
                  <Check className="h-3 w-3 mr-1" />
                  Payment Method Selected
                </span>
              )}
            </div>
            
            {showDepositHelp && (
              <div className="bg-gray-50 dark:bg-gray-800/50 border-l-4 border-gray-300 dark:border-gray-600 p-4 mb-4">
                <div className="flex">
                  <Info className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">About Security Deposits</h4>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      Security deposits help providers manage risk with new customers. The good news is it's fully refundable after 12 months of on-time payments or when you close your account.
                    </p>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Want to avoid the deposit?</span> Go back to the previous step and provide your 
                      SSN information for a credit check. Many customers with good credit can qualify for deposit waivers.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-700 p-4">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-amber-600 dark:text-amber-500 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-amber-700 dark:text-amber-500">
                        <span className="font-medium">$150 security deposit required</span> for your account. This will be added to your first bill and fully refunded after 12 months of on-time payments.
                      </p>
                      <div className="mt-2 text-xs text-amber-600 dark:text-amber-500 flex items-center">
                        <Shield className="h-3.5 w-3.5 mr-1" />
                        <span>Think of it like an apartment security deposit - same concept</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">How Would You Like to Pay?</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={cn(
                      "p-4 border rounded-lg cursor-pointer flex items-center transition-colors",
                      wizardState.serviceDetails.paymentMethod === 'credit-card'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-400 ring-1 ring-primary-300 dark:ring-primary-700'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    )}
                    onClick={() => handlePaymentMethodChange('credit-card')}
                  >
                    <div
                      className={cn(
                        "h-5 w-5 mr-3 flex items-center justify-center rounded-full border transition-colors",
                        wizardState.serviceDetails.paymentMethod === 'credit-card'
                          ? 'bg-primary-600 dark:bg-primary-500 border-primary-600 dark:border-primary-500'
                          : 'border-gray-400 dark:border-gray-500'
                      )}
                    >
                      {wizardState.serviceDetails.paymentMethod === 'credit-card' && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">Credit or Debit Card</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Visa, Mastercard, Discover, Amex accepted</p>
                      </div>
                    </div>
                  </div>
                  
                  <div
                    className={cn(
                      "p-4 border rounded-lg cursor-pointer flex items-center transition-colors",
                      wizardState.serviceDetails.paymentMethod === 'checking'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-400 ring-1 ring-primary-300 dark:ring-primary-700'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    )}
                    onClick={() => handlePaymentMethodChange('checking')}
                  >
                    <div
                      className={cn(
                        "h-5 w-5 mr-3 flex items-center justify-center rounded-full border transition-colors",
                        wizardState.serviceDetails.paymentMethod === 'checking'
                          ? 'bg-primary-600 dark:bg-primary-500 border-primary-600 dark:border-primary-500'
                          : 'border-gray-400 dark:border-gray-500'
                      )}
                    >
                      {wizardState.serviceDetails.paymentMethod === 'checking' && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">Bank Account</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Direct debit from checking account</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center mt-4 text-xs text-gray-500 dark:text-gray-400">
                  <Lock className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-1" />
                  <span>Your payment details are securely encrypted and processed by {wizardState.selectedPlan.provider}</span>
                </div>
              </div>
              
              {/* Testimonial about deposits */}
              <div className="lg:col-span-2 lg:col-start-2">
                <FeatureTestimonial
                  feature="Refunded Deposit"
                  quote="I was a bit hesitant about the deposit, but after a year of on-time payments, it was automatically refunded to my account. The whole process was completely hassle-free!"
                  author={{ name: "Thomas R.", location: "Austin, TX" }}
                  theme="subtle"
                />
              </div>
            </div>
          </div>
        )}

        {showConfirmation && (
          <div className="dashboard-card lg:col-span-2 bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800">
            <div className="flex items-start">
              <Check className="h-6 w-6 text-success-600 dark:text-success-400 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-success-800 dark:text-success-200 text-lg">You're All Set!</h3>
                <p className="mt-2 text-success-700 dark:text-success-300">
                  You've completed all the necessary details for your electricity service. 
                  Ready to finish up and get connected?
                </p>
                <div className="mt-4 text-success-800 dark:text-success-200 text-sm bg-white dark:bg-success-900/40 p-4 rounded-lg border border-success-200 dark:border-success-800">
                  <div className="flex items-center font-medium">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Secure Payment Processing
                  </div>
                  <p className="mt-1">
                    Your payment information will be securely encrypted and processed by {wizardState.selectedPlan.provider} when you complete your order.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function Lock(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default ServiceDetailsStep;