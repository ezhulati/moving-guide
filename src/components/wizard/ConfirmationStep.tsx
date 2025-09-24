import { useWizard } from '../../context/WizardContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Check, Clock, Download, Mail, Copy, AlertCircle, ExternalLink } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useToast } from '../../context/ToastContext';

const ConfirmationStep = () => {
  const { wizardState, updateWizardState } = useWizard();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [processingStep, setProcessingStep] = useState(1);
  const [showAccountCreation, setShowAccountCreation] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Generate a confirmation number and account number when the component mounts
  useEffect(() => {
    // Simulate account creation process with steps
    const processOrder = async () => {
      if (wizardState.orderConfirmation.confirmationNumber) {
        setIsProcessing(false);
        return;
      }
      
      setIsProcessing(true);
      
      // Step 1: Processing order
      await new Promise(resolve => setTimeout(resolve, 1200));
      setProcessingStep(2);
      
      // Step 2: Creating account with provider
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProcessingStep(3);
      
      // Step 3: Confirming service date
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate random confirmation number
      const confirmationNumber = 'CP' + Math.floor(1000000000 + Math.random() * 9000000000);
      
      // Generate random account number
      const accountNumber = '10' + Math.floor(1000000000 + Math.random() * 9000000000);
      
      // Set current date as order date
      const orderDate = new Date().toISOString();
      
      updateWizardState({
        orderConfirmation: {
          confirmationNumber,
          accountNumber,
          orderDate,
        },
      });
      
      setIsProcessing(false);
    };
    
    processOrder();
    
    // Show account creation tips after a delay
    const timer = setTimeout(() => {
      setShowAccountCreation(true);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  // Format the date in a readable format
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

  // Handle mock download of confirmation
  const handleDownloadConfirmation = () => {
    addToast('info', 'Your confirmation PDF is downloading now. Check your downloads folder in a moment.');
  };

  // Handle mock email of confirmation
  const handleEmailConfirmation = () => {
    addToast('success', `We've emailed a copy to ${wizardState.personalInfo.email}`);
  };

  // Handle copy confirmation details
  const handleCopyDetails = () => {
    const confirmationText = `
Order Confirmation: ${wizardState.orderConfirmation.confirmationNumber}
Account Number: ${wizardState.orderConfirmation.accountNumber}
Provider: ${wizardState.selectedPlan.provider}
Plan: ${wizardState.selectedPlan.name}
Service Address: ${wizardState.address.street}, ${wizardState.address.city}, ${wizardState.address.state} ${wizardState.address.zip}
Move-in Date: ${formatDate(wizardState.moveInDate)}
    `;
    
    navigator.clipboard.writeText(confirmationText).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      addToast('success', 'Details copied to clipboard!');
    }, (err) => {
      addToast('error', 'Couldn\'t copy to clipboard');
    });
  };

  // Proceed to success page
  const handleProceedToSuccess = () => {
    navigate('/success');
  };

  return (
    <div className="wizard-step">
      <div className="text-center">
        {isProcessing ? (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/40">
              <div className="h-8 w-8 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">Setting Up Your Power</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Hang tight while we connect everything for you.
            </p>
            
            <div className="mt-8 max-w-md mx-auto">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className={cn(
                    "flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mt-0.5 mr-3",
                    processingStep > 1 ? "bg-green-500 dark:bg-green-600" : "bg-blue-500 dark:bg-blue-600 animate-pulse"
                  )}>
                    {processingStep > 1 ? (
                      <Check className="h-3 w-3 text-white" />
                    ) : (
                      <span className="h-3 w-3"></span>
                    )}
                  </div>
                  <div>
                    <p className={cn(
                      "text-base font-medium",
                      processingStep === 1 ? "text-blue-700 dark:text-blue-300" : "text-gray-500 dark:text-gray-400"
                    )}>
                      Processing your order
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Checking your plan details and service address
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={cn(
                    "flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mt-0.5 mr-3",
                    processingStep > 2 ? "bg-green-500 dark:bg-green-600" : 
                    processingStep === 2 ? "bg-blue-500 dark:bg-blue-600 animate-pulse" : "bg-gray-300 dark:bg-gray-700"
                  )}>
                    {processingStep > 2 ? (
                      <Check className="h-3 w-3 text-white" />
                    ) : (
                      <span className="h-3 w-3"></span>
                    )}
                  </div>
                  <div>
                    <p className={cn(
                      "text-base font-medium",
                      processingStep === 2 ? "text-blue-700 dark:text-blue-300" : 
                      processingStep > 2 ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                    )}>
                      Creating your account
                    </p>
                    <p className={cn(
                      "text-sm",
                      processingStep >= 2 ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                    )}>
                      Setting up your account with {wizardState.selectedPlan.provider}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={cn(
                    "flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mt-0.5 mr-3",
                    processingStep === 3 ? "bg-blue-500 dark:bg-blue-600 animate-pulse" : "bg-gray-300 dark:bg-gray-700"
                  )}>
                    {processingStep > 3 ? (
                      <Check className="h-3 w-3 text-white" />
                    ) : (
                      <span className="h-3 w-3"></span>
                    )}
                  </div>
                  <div>
                    <p className={cn(
                      "text-base font-medium",
                      processingStep === 3 ? "text-blue-700 dark:text-blue-300" : "text-gray-400 dark:text-gray-500"
                    )}>
                      Scheduling your connection
                    </p>
                    <p className={cn(
                      "text-sm",
                      processingStep === 3 ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                    )}>
                      Setting up your power for {formatDate(wizardState.moveInDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-success-100 dark:bg-success-900/50">
              <Check className="h-8 w-8 text-success-600 dark:text-success-400" />
            </div>
            <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">Success! Your Power is Ready</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Your electricity service has been set up successfully.
            </p>
          </>
        )}
      </div>

      {!isProcessing && (
        <div className="mt-8 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
          <div className="bg-primary-50 dark:bg-primary-900/30 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-primary-800 dark:text-primary-300">Order Confirmation</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(wizardState.orderConfirmation.orderDate)}</span>
            </div>
          </div>
          
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Confirmation Number</h4>
                <div className="mt-1 flex items-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{wizardState.orderConfirmation.confirmationNumber}</p>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(wizardState.orderConfirmation.confirmationNumber || '');
                      addToast('success', 'Confirmation number copied');
                    }}
                    className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label="Copy confirmation number"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Account Number</h4>
                <div className="mt-1 flex items-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{wizardState.orderConfirmation.accountNumber}</p>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(wizardState.orderConfirmation.accountNumber || '');
                      addToast('success', 'Account number copied');
                    }}
                    className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label="Copy account number"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Save this number for future reference</p>
              </div>
            </div>
            
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selected Plan</h4>
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-3">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Plan:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{wizardState.selectedPlan.name}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Provider:</span>
                  <span className="text-gray-900 dark:text-white">{wizardState.selectedPlan.provider}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Contract Length:</span>
                  <span className="text-gray-900 dark:text-white">{wizardState.selectedPlan.term}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Rate:</span>
                  <span className="text-gray-900 dark:text-white">{wizardState.selectedPlan.rate}¢/kWh</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Service Details</h4>
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-3">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Address:</span>
                  <span className="text-right text-gray-900 dark:text-white">
                    {wizardState.address.street}<br />
                    {wizardState.address.city}, {wizardState.address.state} {wizardState.address.zip}
                  </span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Move-in Date:</span>
                  <span className="text-gray-900 dark:text-white">{formatDate(wizardState.moveInDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Connection Type:</span>
                  <span className="flex items-center">
                    {wizardState.serviceDetails.connectionSpeed === 'same-day' ? (
                      <>
                        <Clock className="h-4 w-4 text-success-600 dark:text-success-500 mr-1" />
                        <span className="font-medium text-success-700 dark:text-success-500">Priority Same-Day</span>
                      </>
                    ) : (
                      'Standard'
                    )}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Connection Status</h4>
              <div className="bg-success-50 dark:bg-success-900/30 border-l-4 border-success-500 dark:border-success-600 p-3">
                <div className="flex">
                  <Check className="h-5 w-5 text-success-600 dark:text-success-500 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-success-800 dark:text-success-300 font-medium">Your electricity is ready to go!</p>
                    <p className="text-success-700 dark:text-success-400 text-sm mt-1">
                      {wizardState.serviceDetails.connectionSpeed === 'same-day'
                        ? 'Your service will be connected today by 8:00 PM.'
                        : `Your service will be connected on ${formatDate(wizardState.moveInDate)}.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {showAccountCreation && (
              <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 animate-fade-in">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <img 
                    src="https://i.postimg.cc/JzB3hySM/CPLogo-4-C-H-wtag.png" 
                    alt="ComparePower" 
                    className="h-4 mr-2"
                  />
                  Next Steps: Create Your Online Account
                </h4>
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-md p-3 border border-blue-100 dark:border-blue-800">
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    <strong>Pro Tip:</strong> Set up your online account with {wizardState.selectedPlan.provider} to manage your service and make bill payments easy.
                  </p>
                  <div className="mt-3">
                    <a 
                      href="#" 
                      className="text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 inline-flex items-center text-sm font-medium"
                    >
                      Visit {wizardState.selectedPlan.provider} website
                      <ExternalLink className="ml-1 h-3.5 w-3.5" />
                    </a>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-blue-700 dark:text-blue-300">
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-200 dark:bg-blue-700 text-blue-600 dark:text-blue-300 mr-2 mt-0.5 flex-shrink-0">
                        1
                      </span>
                      <span>Use your <strong>account number</strong> to register</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-200 dark:bg-blue-700 text-blue-600 dark:text-blue-300 mr-2 mt-0.5 flex-shrink-0">
                        2
                      </span>
                      <span>Set up autopay to avoid late fees</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-200 dark:bg-blue-700 text-blue-600 dark:text-blue-300 mr-2 mt-0.5 flex-shrink-0">
                        3
                      </span>
                      <span>Sign up for paperless billing</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleDownloadConfirmation}
                className="btn btn-secondary inline-flex items-center"
              >
                <Download className="mr-1.5 h-4 w-4" />
                Download PDF
              </button>
              <button
                type="button"
                onClick={handleEmailConfirmation}
                className="btn btn-secondary inline-flex items-center"
              >
                <Mail className="mr-1.5 h-4 w-4" />
                Email to Me
              </button>
              <button
                type="button"
                className={cn(
                  "btn btn-secondary inline-flex items-center",
                  copySuccess && "bg-success-100 text-success-700 border-success-200 dark:bg-success-900/30 dark:text-success-300 dark:border-success-800"
                )}
                onClick={handleCopyDetails}
              >
                {copySuccess ? (
                  <>
                    <Check className="mr-1.5 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-1.5 h-4 w-4" />
                    Copy Details
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {!isProcessing && (
        <div className="mt-6 text-center">
          <button 
            onClick={handleProceedToSuccess}
            className="btn btn-primary inline-flex items-center"
          >
            Continue to Your Documents
            <Check className="ml-2 h-4 w-4" />
          </button>
        </div>
      )}
      
      {isProcessing && (
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-600 p-4 rounded-r-md">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-500 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                We're working on setting up your service. This should only take about a minute - please don't close this window.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmationStep;