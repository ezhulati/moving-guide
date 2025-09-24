import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWizard } from '../context/WizardContext';
import { useToast } from '../context/ToastContext';
import { Check, Download, Mail, Copy, ExternalLink, Clock, Home, Phone, Calendar, MapPin, Zap, ArrowRight, CheckCircle, PartyPopper as Party, Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';
import SEO from '../components/shared/SEO';

const SuccessPage = () => {
  const navigate = useNavigate();
  const { wizardState, resetWizard } = useWizard();
  const { addToast } = useToast();
  const [copySuccess, setCopySuccess] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Show confetti animation on load
    setShowConfetti(true);
    
    // Hide confetti after 8 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 8000);
    
    return () => clearTimeout(timer);
  }, []);

  // Format date function
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

  // Handle download confirmation
  const handleDownload = () => {
    setDownloadStarted(true);
    addToast('info', 'Preparing your documents for download...');
    
    setTimeout(() => {
      addToast('success', 'Documents downloaded successfully!');
    }, 1500);
  };

  // Handle email confirmation
  const handleEmail = () => {
    setEmailSent(true);
    addToast('info', 'Sending confirmation to your email...');
    
    setTimeout(() => {
      addToast('success', `Confirmation sent to ${wizardState.personalInfo.email}`);
    }, 1500);
  };

  // Handle copy details
  const handleCopy = () => {
    const text = `
ComparePower Confirmation
Account Number: ${wizardState.orderConfirmation.accountNumber}
Provider: ${wizardState.selectedPlan.provider}
Plan: ${wizardState.selectedPlan.name}
Rate: ${wizardState.selectedPlan.rate}¢/kWh
Service Address: ${wizardState.address.street}, ${wizardState.address.city}, ${wizardState.address.state} ${wizardState.address.zip}
Move-in Date: ${formatDate(wizardState.moveInDate)}
    `;
    
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      addToast('success', 'Details copied to clipboard!');
      
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    });
  };

  // Navigate to next steps
  const handleViewDocuments = () => {
    navigate('/wizard/proof-document');
  };

  // Start over
  const handleStartOver = () => {
    resetWizard();
    navigate('/');
    addToast('success', 'Ready for a new setup!');
  };

  return (
    <div className="bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <SEO 
        title="Success! Your Electricity Service is Ready"
        description="Your electricity service has been set up successfully. View your confirmation details and next steps."
      />
      
      {showConfetti && <Confetti />}
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-success-100 dark:bg-success-900/50 mb-4">
            <CheckCircle className="h-16 w-16 text-success-600 dark:text-success-500" />
          </div>
          
          <h1 className="text-4xl font-extrabold text-success-700 dark:text-success-400 mb-4">
            Success! Your Power is Ready
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your electricity service has been set up successfully. Your home will be energized on schedule!
          </p>
          
          <div className="mt-6 inline-flex items-center px-4 py-2 rounded-full bg-success-50 dark:bg-success-900/30 text-success-700 dark:text-success-300 text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            <span>Everything's all set for your move!</span>
          </div>
        </div>

        {/* Main content card */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-primary-600 dark:bg-primary-700 px-6 py-4 text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Order Confirmation</h2>
              <span className="text-sm opacity-90">{formatDate(wizardState.orderConfirmation.orderDate)}</span>
            </div>
          </div>

          {/* Account info */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Confirmation Number</h3>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{wizardState.orderConfirmation.confirmationNumber}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Account Number</h3>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{wizardState.orderConfirmation.accountNumber}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Save this number for future reference</p>
              </div>
            </div>

            {/* Plan details */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                Selected Plan
              </h3>
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 border border-primary-100 dark:border-primary-800">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Plan Name</h4>
                    <p className="font-medium text-primary-700 dark:text-primary-400">{wizardState.selectedPlan.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Provider</h4>
                    <p className="font-medium text-primary-700 dark:text-primary-400">{wizardState.selectedPlan.provider}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Term</h4>
                    <p className="font-medium text-primary-700 dark:text-primary-400">{wizardState.selectedPlan.term}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Rate</h4>
                    <p className="font-medium text-primary-700 dark:text-primary-400">{wizardState.selectedPlan.rate}¢/kWh</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service details */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                Service Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex">
                  <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Service Address</h4>
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {wizardState.address.street}<br />
                      {wizardState.address.city}, {wizardState.address.state} {wizardState.address.zip}
                    </p>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex">
                  <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Service Start Date</h4>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{formatDate(wizardState.moveInDate)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Connection status */}
            <div className="mb-8">
              <div className="bg-success-50 dark:bg-success-900/20 rounded-lg p-4 border border-success-200 dark:border-success-800 flex items-start">
                <Zap className="h-5 w-5 text-success-600 dark:text-success-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-base font-semibold text-success-800 dark:text-success-300">Your electricity is ready to go!</h4>
                  <p className="mt-1 text-success-700 dark:text-success-400">
                    {wizardState.serviceDetails.connectionSpeed === 'same-day' ? (
                      "Your service will be connected today by 8:00 PM."
                    ) : (
                      `Your service will be connected on ${formatDate(wizardState.moveInDate)}.`
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Next steps */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                Next Steps
              </h3>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
                <h4 className="flex items-center text-base font-semibold text-blue-800 dark:text-blue-300 mb-3">
                  <img 
                    src="https://i.postimg.cc/JzB3hySM/CPLogo-4-C-H-wtag.png" 
                    alt="ComparePower" 
                    className="h-5 mr-2" 
                  />
                  Create Your Online Account
                </h4>
                
                <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
                  Set up your online account with {wizardState.selectedPlan.provider} to manage your service and make payments easier.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <a 
                    href="#" 
                    className="flex items-center justify-center text-blue-700 dark:text-blue-300 bg-white dark:bg-blue-900/40 p-2 rounded border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/60 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Visit Provider Website</span>
                  </a>
                  
                  <div className="flex items-center justify-center text-blue-700 dark:text-blue-300 bg-white dark:bg-blue-900/40 p-2 rounded border border-blue-200 dark:border-blue-800">
                    <Phone className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">1-800-COMPARE</span>
                  </div>
                  
                  <div className="flex items-center justify-center text-blue-700 dark:text-blue-300 bg-white dark:bg-blue-900/40 p-2 rounded border border-blue-200 dark:border-blue-800">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">{wizardState.personalInfo.email.substring(0, 15)}...</span>
                  </div>
                </div>
                
                <div className="text-xs text-blue-700 dark:text-blue-400 flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>Tip: Save your account number for registration</span>
                </div>
              </div>
            </div>

            {/* Document actions */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={downloadStarted}
                  className={cn(
                    "btn",
                    downloadStarted ? "btn-success" : "btn-secondary",
                    "inline-flex items-center"
                  )}
                >
                  {downloadStarted ? (
                    <>
                      <Check className="mr-1.5 h-4 w-4" />
                      Downloaded!
                    </>
                  ) : (
                    <>
                      <Download className="mr-1.5 h-4 w-4" />
                      Download PDF
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleEmail}
                  disabled={emailSent}
                  className={cn(
                    "btn btn-secondary inline-flex items-center",
                    emailSent && "bg-success-50 text-success-700 border-success-200 dark:bg-success-900/30 dark:text-success-300 dark:border-success-700"
                  )}
                >
                  {emailSent ? (
                    <>
                      <Check className="mr-1.5 h-4 w-4" />
                      Email Sent!
                    </>
                  ) : (
                    <>
                      <Mail className="mr-1.5 h-4 w-4" />
                      Email to Me
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  className={cn(
                    "btn btn-secondary inline-flex items-center",
                    copySuccess && "bg-success-50 text-success-700 border-success-200 dark:bg-success-900/30 dark:text-success-300 dark:border-success-700"
                  )}
                  onClick={handleCopy}
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
              
              <div className="flex flex-wrap gap-3">
                {wizardState.propertyType === 'apartment' && (
                  <button
                    type="button"
                    className="btn btn-primary inline-flex items-center"
                    onClick={handleViewDocuments}
                  >
                    <Home className="mr-1.5 h-4 w-4" />
                    Apartment Proof Document
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-primary inline-flex items-center"
                  onClick={() => navigate('/wizard/checklist')}
                >
                  <CheckCircle className="mr-1.5 h-4 w-4" />
                  View Moving Checklist
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <button
            type="button"
            className="btn btn-secondary inline-flex items-center"
            onClick={handleStartOver}
          >
            <ArrowRight className="mr-1.5 h-4 w-4" />
            Set Up Another Service
          </button>
        </div>
      </div>
    </div>
  );
};

// Confetti animation component
const Confetti = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
      {Array.from({ length: 100 }).map((_, index) => {
        // Random properties for each confetti piece
        const left = Math.random() * 100;
        const animationDelay = Math.random() * 5;
        const size = Math.random() * 10 + 5;
        
        // Random colors
        const colors = [
          'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
          'bg-red-500', 'bg-purple-500', 'bg-pink-500'
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        return (
          <div
            key={index}
            className={`absolute ${color} rounded-md opacity-70`}
            style={{
              left: `${left}%`,
              top: '-20px',
              width: `${size}px`,
              height: `${size}px`,
              animation: `confetti-fall 5s linear ${animationDelay}s`,
            }}
          />
        );
      })}
    </div>
  );
};

// Custom party icon component - renamed to avoid conflict with imported Party
function ConfettiPartyIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M5.8 11.3 2 22l10.7-3.79" />
      <path d="M4 3h.01" />
      <path d="M22 8h.01" />
      <path d="M15 2h.01" />
      <path d="M22 20h.01" />
      <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" />
      <path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17" />
      <path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7" />
      <path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z" />
    </svg>
  );
}

// Custom sparkles icon component - renamed to avoid conflict with imported Sparkles
function CustomSparklesIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}

export default SuccessPage;