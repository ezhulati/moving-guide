import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Info, AlertTriangle, Upload, FileText, DollarSign, Home, Zap } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useWizard } from '../../context/WizardContext';
import { useToast } from '../../context/ToastContext';
import SmartFormField from './SmartFormField';

interface TransferOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  recommended?: boolean;
}

const TransferServiceFlow = () => {
  const { updateWizardState } = useWizard();
  const { addToast } = useToast();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'options' | 'details' | 'upload'>('options');
  const [accountNumber, setAccountNumber] = useState('');
  const [provider, setProvider] = useState('');
  const [hasUploadedBill, setHasUploadedBill] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Transfer options
  const transferOptions: TransferOption[] = [
    {
      id: 'transfer-current',
      title: 'Yes, I want to transfer my current plan',
      description: 'I have an existing electricity account I want to move',
      icon: <Home className="h-6 w-6 text-primary-600 dark:text-primary-400" />
    },
    {
      id: 'new-plan',
      title: 'Yes, but I want a new plan instead',
      description: 'I have service now but want to shop for something better',
      icon: <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />,
      recommended: true
    },
    {
      id: 'no-service',
      title: "No, I don't have my own service",
      description: "I'm moving from my parents' home or a roommate situation",
      icon: <Zap className="h-6 w-6 text-amber-600 dark:text-amber-400" />
    },
    {
      id: 'not-sure',
      title: "I'm not sure what's best for me",
      description: 'Help me understand my options',
      icon: <Info className="h-6 w-6 text-blue-600 dark:text-blue-400" />
    }
  ];

  // Handle option selection
  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    
    // If they want to transfer current plan, go to details step
    if (optionId === 'transfer-current') {
      setCurrentStep('details');
    } else if (optionId === 'new-plan') {
      // If they want a new plan, update the wizard state and redirect to the wizard flow
      updateWizardState({
        transferFlow: {
          wantsNewPlan: true,
          hasExistingService: true
        }
      });
      
      // Show toast and redirect to address step
      addToast('info', 'Great choice! Let\'s find you a better plan for your new home.');
      
      // In a real implementation, this would navigate to the address step
      // navigate('/wizard/address');
    } else if (optionId === 'no-service') {
      // Update wizard state for no existing service
      updateWizardState({
        transferFlow: {
          wantsNewPlan: true,
          hasExistingService: false
        }
      });
      
      // Show toast and redirect to address step
      addToast('info', 'Let\'s get you set up with your first electricity plan!');
      
      // In a real implementation, this would navigate to the address step
      // navigate('/wizard/address');
    } else if (optionId === 'not-sure') {
      // Show educational content
      addToast('info', 'We recommend comparing options to find the best plan for your new home.');
      
      // In a real implementation, this might show additional educational content
      // or navigate to a comparison page
    }
  };

  // Handle account details submission
  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accountNumber || !provider) {
      addToast('error', 'Please fill in all required fields');
      return;
    }
    
    // Move to bill upload step
    setCurrentStep('upload');
    
    // Update wizard state with account details
    updateWizardState({
      transferFlow: {
        accountNumber,
        provider,
        wantsTransfer: true
      }
    });
  };

  // Handle bill upload
  const handleBillUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // In a real implementation, this would upload the file to a server
      // For now, we'll just simulate a successful upload
      setHasUploadedBill(true);
      addToast('success', 'Bill uploaded successfully');
    }
  };

  // Handle final submission
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update wizard state with completed transfer request
      updateWizardState({
        transferFlow: {
          accountNumber,
          provider,
          wantsTransfer: true,
          billUploaded: hasUploadedBill,
          completed: true
        }
      });
      
      addToast('success', 'Transfer request submitted successfully');
      setIsSubmitting(false);
      
      // In a real implementation, this would navigate to a confirmation page
      // navigate('/transfer/confirmation');
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {currentStep === 'options' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Question About Your Move</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Select the option that best describes your current electricity situation
            </p>
          </div>
          
          <div className="space-y-4">
            {transferOptions.map((option) => (
              <div
                key={option.id}
                className={cn(
                  "border rounded-lg p-5 cursor-pointer transition-all",
                  selectedOption === option.id
                    ? "border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/30 shadow-md"
                    : "border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                )}
                onClick={() => handleOptionSelect(option.id)}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-4">
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{option.title}</h3>
                      {option.recommended && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">{option.description}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <div
                      className={cn(
                        "h-6 w-6 rounded-full border-2 flex items-center justify-center",
                        selectedOption === option.id
                          ? "border-primary-500 dark:border-primary-400 bg-primary-500 dark:bg-primary-400"
                          : "border-gray-300 dark:border-gray-600"
                      )}
                    >
                      {selectedOption === option.id && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {selectedOption === 'new-plan' && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 animate-fade-in">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Smart choice!</h3>
                  <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                    <p>
                      83% of Texans save between $100 to $250 per year by selecting a new plan when moving.
                      Let's find you the perfect plan for your new home.
                    </p>
                  </div>
                  <div className="mt-4">
                    <Link
                      to="/wizard/welcome"
                      className="btn btn-primary text-sm"
                    >
                      Find My Best Plan
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {selectedOption === 'not-sure' && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 animate-fade-in">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-blue-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Understanding Your Options</h3>
                  <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                    <p className="mb-2">
                      <strong>Transferring your current plan:</strong> Quick but often more expensive. Your existing plan was priced for your old home's usage patterns.
                    </p>
                    <p className="mb-2">
                      <strong>Choosing a new plan:</strong> Takes a few minutes but saves most people $100-$250 annually. Your new home likely has different energy needs.
                    </p>
                    <p>
                      <strong>Our recommendation:</strong> Compare options to find the best fit for your new home. Texas law allows you to switch without penalties when moving.
                    </p>
                  </div>
                  <div className="mt-4">
                    <Link
                      to="/wizard/welcome"
                      className="btn btn-primary text-sm"
                    >
                      Compare My Options
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {currentStep === 'details' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Current Electricity Account</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Please provide your current electricity account details
            </p>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-600 p-4 rounded-r-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">Important Note</h3>
                <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                  <p>
                    Our data shows 83% of Texans save $100-$250 per year by selecting a new plan rather than transferring their existing one. 
                    <Link to="/wizard/welcome" className="font-medium underline ml-1">
                      Compare options first?
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleDetailsSubmit} className="space-y-6">
            <SmartFormField
              id="accountNumber"
              label="Account Number"
              value={accountNumber}
              onChange={setAccountNumber}
              placeholder="Enter your account number"
              required
              helpText="Found on your electricity bill or online account"
            />
            
            <SmartFormField
              id="provider"
              label="Current Electricity Provider"
              value={provider}
              onChange={setProvider}
              placeholder="e.g., TXU Energy, Reliant, etc."
              required
              helpText="The company that currently supplies your electricity"
            />
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep('options')}
                className="btn btn-secondary"
              >
                Back
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      )}
      
      {currentStep === 'upload' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Your Current Bill</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              This helps us analyze your usage and ensure a smooth transfer
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 text-center">
            <div className="flex flex-col items-center justify-center">
              {hasUploadedBill ? (
                <>
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                    <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Bill Uploaded Successfully</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Your bill has been uploaded and will be analyzed
                  </p>
                </>
              ) : (
                <>
                  <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                    <Upload className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Upload Your Bill</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Drag and drop your bill here, or click to browse
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Accepted formats: PDF, JPG, PNG (max 10MB)
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    id="bill-upload"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleBillUpload}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('bill-upload')?.click()}
                    className="mt-4 btn btn-primary"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Select File
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Why Upload Your Bill?</h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                  <p>
                    Uploading your bill helps us:
                  </p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Analyze your usage patterns for a smoother transfer</li>
                    <li>Identify potential savings opportunities</li>
                    <li>Ensure all account details are accurate</li>
                  </ul>
                  <p className="mt-2">
                    <strong>Note:</strong> This step is optional but recommended for the best service.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep('details')}
              className="btn btn-secondary"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Processing...
                </>
              ) : (
                <>
                  Submit Transfer Request
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferServiceFlow;