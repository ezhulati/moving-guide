import { useState } from 'react';
import { cn } from '../../utils/cn';
import { useWizard } from '../../context/WizardContext';
import { useToast } from '../../context/ToastContext';
import { Phone, Shield, Info, ArrowRight, HelpCircle, Check, FileText } from 'lucide-react';

// Texas electricity providers data with contact information
const PROVIDER_DATA = [
  {
    name: 'TXU Energy',
    phone: '1-800-242-9113',
    hours: 'Mon-Fri: 7am-10pm, Sat: 9am-6pm',
    website: 'https://www.txu.com',
    notes: 'Ask for "Address Transfer" department. TXU often offers customer retention discounts when transferring.',
    waitTime: '8-12 minutes',
    transferFee: 'No fee',
    earlyTerminationNote: 'If transferring before contract end, early termination fee may be waived.'
  },
  {
    name: 'Reliant',
    phone: '1-866-222-7100',
    hours: 'Mon-Fri: 7am-8pm, Sat: 9am-5pm',
    website: 'https://www.reliant.com',
    notes: 'Request to speak with the "Moves Department" for fastest service.',
    waitTime: '10-15 minutes',
    transferFee: 'No fee',
    earlyTerminationNote: 'Reliant typically requires 48 hours notice for service transfers.'
  },
  {
    name: 'Direct Energy',
    phone: '1-888-305-3828',
    hours: 'Mon-Fri: 8am-8pm, Sat: 8am-5pm',
    website: 'https://www.directenergy.com',
    notes: 'Have your account number ready. Direct Energy may try to upsell you to a new plan.',
    waitTime: '5-10 minutes',
    transferFee: 'No fee',
    earlyTerminationNote: 'Can transfer service online through your account dashboard.'
  },
  {
    name: 'Green Mountain Energy',
    phone: '1-866-785-4668',
    hours: 'Mon-Fri: 7am-8pm, Sat: 9am-5pm',
    website: 'https://www.greenmountainenergy.com',
    notes: 'Mention you want to keep your current green energy plan rate.',
    waitTime: '7-12 minutes',
    transferFee: 'No fee',
    earlyTerminationNote: 'Green Mountain honors your current contract terms when transferring.'
  },
  {
    name: 'Gexa Energy',
    phone: '1-855-639-8211',
    hours: 'Mon-Fri: 7am-8pm, Sat: 8am-5pm',
    website: 'https://www.gexaenergy.com',
    notes: 'Ask to speak with a "Transfer Specialist" to ensure you keep your current rate.',
    waitTime: '10-15 minutes',
    transferFee: 'No fee',
    earlyTerminationNote: 'Have your most recent bill on hand for verification.'
  },
  {
    name: 'Pulse Power',
    phone: '1-833-785-7797',
    hours: 'Mon-Fri: 8am-7pm, Sat: 9am-6pm',
    website: 'https://www.pulsepowertexas.com',
    notes: 'Request "rate protection" when transferring to ensure your current rate.',
    waitTime: '5-10 minutes',
    transferFee: 'No fee',
    earlyTerminationNote: 'Pulse Power typically requires 3 business days for service transfers.'
  },
  {
    name: '4Change Energy',
    phone: '1-855-784-2426',
    hours: 'Mon-Fri: 8am-5:30pm, Sat: 10am-2pm',
    website: 'https://www.4changeenergy.com',
    notes: 'Have your account number and current address ready when you call.',
    waitTime: '3-8 minutes',
    transferFee: 'No fee',
    earlyTerminationNote: 'Can initiate transfer through online customer portal as well.'
  },
  {
    name: 'Constellation',
    phone: '1-888-921-5834',
    hours: 'Mon-Fri: 8am-8pm, Sat: 9am-4pm',
    website: 'https://www.constellation.com',
    notes: 'Ask for the "Texas Moves Team" for fastest service.',
    waitTime: '10-15 minutes',
    transferFee: 'No fee',
    earlyTerminationNote: 'May require proof of new address (lease or closing documents).'
  },
  {
    name: 'Other',
    phone: 'See your bill',
    hours: 'Varies by provider',
    website: 'Check your bill',
    notes: 'Look for customer service number on your most recent bill.',
    waitTime: 'Varies',
    transferFee: 'Varies',
    earlyTerminationNote: 'Terms may vary. Have your bill ready when you call.'
  }
];

interface TransferProviderProps {
  onClose: () => void;
  onContinueWithNewPlans: () => void;
}

const TransferProvider: React.FC<TransferProviderProps> = ({ onClose, onContinueWithNewPlans }) => {
  const { wizardState, updateWizardState } = useWizard();
  const { addToast } = useToast();
  const [currentProvider, setCurrentProvider] = useState(wizardState.transferFlow?.currentProvider || '');
  const [showProviderInfo, setShowProviderInfo] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [textSent, setTextSent] = useState(false);
  
  // Get provider data based on selected provider
  const getProviderData = () => {
    return PROVIDER_DATA.find(provider => provider.name === currentProvider) || PROVIDER_DATA[0];
  };
  
  const providerData = getProviderData();
  
  // Handle provider selection
  const handleContinue = () => {
    if (!currentProvider) {
      addToast('error', 'Please select your current provider');
      return;
    }
    
    setShowProviderInfo(true);
  };
  
  // Format the move-in date in a readable format
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };
  
  // Handle sending instructions via text
  const handleSendText = () => {
    if (!phoneNumber) {
      addToast('error', 'Please enter a valid phone number');
      return;
    }
    
    // Validate phone number
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    if (!phoneRegex.test(phoneNumber)) {
      addToast('error', 'Please enter a valid phone number in the format (555) 555-5555');
      return;
    }
    
    // Simulate sending text
    addToast('info', 'Sending transfer instructions...');
    
    setTimeout(() => {
      setTextSent(true);
      addToast('success', `Instructions sent to ${phoneNumber}`);
    }, 1500);
  };
  
  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    if (!value) return value;
    
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };
  
  // Handle phone number input change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setPhoneNumber(formattedPhoneNumber);
  };
  
  // Handle call now action
  const handleCallNow = () => {
    // In a real app, this might use tel: protocol to initiate a call
    // or provide click tracking
    addToast('info', `Calling ${currentProvider} customer service...`);
    
    // Update wizard state with transfer info
    updateWizardState({
      transferFlow: {
        ...wizardState.transferFlow,
        wantsTransfer: true,
        currentProvider,
        recommendedAction: 'transfer'
      }
    });
    
    // Close the modal after a delay
    setTimeout(() => {
      onClose();
    }, 1000);
  };
  
  // Handle "Save Instructions" action
  const handleSaveInstructions = () => {
    // Update wizard state with transfer info
    updateWizardState({
      transferFlow: {
        ...wizardState.transferFlow,
        wantsTransfer: true,
        currentProvider,
        recommendedAction: 'transfer'
      }
    });
    
    addToast('success', 'Transfer instructions saved');
    onClose();
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {!showProviderInfo ? (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Let's Get Your Transfer Started</h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mb-4">
            <label htmlFor="provider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Who's your current electricity provider?
            </label>
            <select
              id="provider"
              name="provider"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              value={currentProvider}
              onChange={(e) => setCurrentProvider(e.target.value)}
            >
              <option value="">Select your provider</option>
              {PROVIDER_DATA.map((provider) => (
                <option key={provider.name} value={provider.name}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800 mb-6">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">Before you transfer your plan</h4>
                <p className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                  Did you know? 83% of Texans who transfer their plan end up paying more than necessary. Most plans are optimized for specific usage patterns that change when you move.
                </p>
                <button
                  type="button"
                  onClick={onContinueWithNewPlans}
                  className="mt-3 text-sm text-amber-800 dark:text-amber-300 font-medium hover:underline flex items-center"
                >
                  See if a new plan would save you money
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleContinue}
              disabled={!currentProvider}
            >
              Continue
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Transfer Instructions for {currentProvider}
            </h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5 border border-gray-200 dark:border-gray-600 mb-6">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">To transfer your service to your new address:</h4>
            
            <div className="space-y-5">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
                <div className="ml-3">
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white">Call {currentProvider}</h5>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {providerData.phone}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Hours: {providerData.hours}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Typical wait time: {providerData.waitTime}
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
                <div className="ml-3">
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white">What you'll need:</h5>
                  <ul className="text-sm text-gray-500 dark:text-gray-400 mt-1 space-y-1">
                    <li>• Your account number</li>
                    <li>• Current service address</li>
                    <li>• New service address: {wizardState.address.street}, {wizardState.address.city}, {wizardState.address.state} {wizardState.address.zip}</li>
                    <li>• Desired transfer date: {formatDate(wizardState.moveInDate)}</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
                <div className="ml-3">
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white">What to say:</h5>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    "I'd like to transfer my current electricity service to a new address. I want to keep my current plan and rate."
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Provider-specific notes/warnings */}
          <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800 mb-6">
            <div className="flex">
              <Info className="h-5 w-5 text-amber-600 dark:text-amber-500 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">Notes for {currentProvider} customers:</h4>
                <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
                  {providerData.notes}
                </p>
                {providerData.earlyTerminationNote && (
                  <p className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                    {providerData.earlyTerminationNote}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Text instructions option */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Text these instructions to your phone?</h4>
            <div className="flex space-x-3">
              <input
                type="text"
                placeholder="(555) 555-5555"
                className="input flex-1"
                value={phoneNumber}
                onChange={handlePhoneChange}
              />
              <button
                type="button"
                className={`btn ${textSent ? 'btn-success' : 'btn-secondary'}`}
                onClick={handleSendText}
                disabled={textSent}
              >
                {textSent ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Sent
                  </>
                ) : (
                  'Send Text'
                )}
              </button>
            </div>
          </div>
          
          {/* "Still curious" section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Still curious what you might be missing?</p>
            <button
              type="button"
              onClick={onContinueWithNewPlans}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium hover:underline flex items-center justify-center mx-auto"
            >
              Quick Compare: See Today's Rates
              <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleSaveInstructions}
            >
              Save Instructions for Later
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleCallNow}
            >
              Call Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Users icon
function Users(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

// X icon
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

// Alert circle icon
function AlertCircle(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

export default TransferProvider;