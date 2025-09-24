import { useWizard } from '../../context/WizardContext';
import { useToast } from '../../context/ToastContext';
import { Download, Mail, Copy, Info, Check, Printer, MapPin, ShieldCheck, DownloadCloud, FileText, Building, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../utils/cn';

const ProofDocumentStep = () => {
  const { wizardState, updateWizardState } = useWizard();
  const { addToast } = useToast();
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showExtraInfo, setShowExtraInfo] = useState(false);
  const [showLeasingOfficeForm, setShowLeasingOfficeForm] = useState(false);
  const [leasingOfficeEmail, setLeasingOfficeEmail] = useState('');
  const [leasingOfficeName, setLeasingOfficeName] = useState('');
  const [sendingToLeasingOffice, setSendingToLeasingOffice] = useState(false);
  const [leasingOfficeSent, setLeasingOfficeSent] = useState(false);
  const [formErrors, setFormErrors] = useState<{email?: string}>({});

  // Format the date in a readable format
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // Generate today's date in readable format
  const today = formatDate(new Date().toISOString());

  // Handle mock download of document
  const handleDownloadDocument = () => {
    setDownloadStarted(true);
    addToast('info', 'Preparing your proof of service document...', 3000);
    
    setTimeout(() => {
      addToast('success', 'Document downloaded successfully!');
      setDownloadStarted(false);
    }, 1500);
  };

  // Handle mock email of document
  const handleEmailDocument = () => {
    setEmailSent(true);
    addToast('info', 'Sending proof of service to your email...', 3000);
    
    setTimeout(() => {
      addToast('success', `Proof of service sent to ${wizardState.personalInfo.email}`);
    }, 2000);
  };

  // Handle print document
  const handlePrintDocument = () => {
    addToast('info', 'Opening print dialog...');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  // Handle copy document text
  const handleCopyText = () => {
    const docText = `
COMPAREPOWER
PROOF OF ELECTRICITY SERVICE

Account Holder: ${wizardState.personalInfo.firstName} ${wizardState.personalInfo.lastName}
Account Number: ${wizardState.orderConfirmation.accountNumber}
Service Provider: ${wizardState.selectedPlan.provider}
Service Address: ${wizardState.address.street}, ${wizardState.address.city}, ${wizardState.address.state} ${wizardState.address.zip}
Service Start Date: ${formatDate(wizardState.moveInDate)}
Order Date: ${today}
Confirmation Number: ${wizardState.orderConfirmation.confirmationNumber}

This document confirms that electricity service has been established for the above address.
    `;
    
    navigator.clipboard.writeText(docText).then(() => {
      setCopySuccess(true);
      addToast('success', 'Text copied to clipboard!');
      
      setTimeout(() => {
        setCopySuccess(false);
      }, 3000);
    }, (err) => {
      addToast('error', 'Couldn\'t copy to clipboard');
    });
  };

  // Validate email format
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle email to leasing office
  const handleEmailToLeasingOffice = () => {
    // Reset previous state
    setFormErrors({});
    
    // Validate the email
    if (!leasingOfficeEmail) {
      setFormErrors({ email: 'Email address is required' });
      return;
    }
    
    if (!isValidEmail(leasingOfficeEmail)) {
      setFormErrors({ email: 'Please enter a valid email address' });
      return;
    }
    
    // Start sending
    setSendingToLeasingOffice(true);
    addToast('info', 'Sending proof of service to your leasing office...', 3000);
    
    // Simulate API call
    setTimeout(() => {
      // Store the leasing office email in the wizard state for potential marketing use
      updateWizardState({
        leasingOfficeEmail: leasingOfficeEmail,
        leasingOfficeName: leasingOfficeName || undefined,
      });
      
      setLeasingOfficeSent(true);
      setSendingToLeasingOffice(false);
      addToast('success', 'Proof of service sent to your leasing office!');
    }, 2000);
  };

  // Reset leasing office form
  const resetLeasingOfficeForm = () => {
    setLeasingOfficeSent(false);
    setShowLeasingOfficeForm(false);
  };

  return (
    <div className="wizard-step">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900/50">
          <FileText className="h-8 w-8 text-primary-600 dark:text-primary-400" />
        </div>
        <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">Your Proof of Service</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Here's your official proof of electricity service for your leasing office or property manager.
        </p>
      </div>

      <div className="mt-8 max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow-lg print-container">
          <div className="bg-primary-600 dark:bg-primary-700 text-white px-6 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="https://i.postimg.cc/JzB3hySM/CPLogo-4-C-H-wtag.png" 
                alt="ComparePower" 
                className="h-7 mr-2"
              />
            </div>
            <span className="text-sm">Date: {today}</span>
          </div>
          
          <div className="p-6 bg-white dark:bg-gray-800">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">PROOF OF ELECTRICITY SERVICE</h2>
              
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Document ID: CP-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}-{
                  wizardState.orderConfirmation.confirmationNumber?.substring(0, 6) || 'XXXXXX'
                }
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-900/50">
                  <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Account Holder</h4>
                  <p className="text-lg font-medium text-primary-900 dark:text-primary-300">
                    {wizardState.personalInfo.firstName} {wizardState.personalInfo.lastName}
                  </p>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-900/50">
                  <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Account Number</h4>
                  <p className="text-lg font-medium text-primary-900 dark:text-primary-300">{wizardState.orderConfirmation.accountNumber}</p>
                </div>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-900/50">
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Service Provider</h4>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-2">
                    <img 
                      src="https://i.postimg.cc/JzB3hySM/CPLogo-4-C-H-wtag.png" 
                      alt="ComparePower" 
                      className="h-4"
                    />
                  </div>
                  <p className="text-lg font-medium text-primary-900 dark:text-primary-300">{wizardState.selectedPlan.provider}</p>
                </div>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-900/50">
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-1" /> Service Address
                </h4>
                <p className="text-lg font-medium text-primary-900 dark:text-primary-300">
                  {wizardState.address.street}<br />
                  {wizardState.address.city}, {wizardState.address.state} {wizardState.address.zip}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-900/50">
                  <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-1" /> Service Start Date
                  </h4>
                  <p className="text-lg font-medium text-primary-900 dark:text-primary-300">{formatDate(wizardState.moveInDate)}</p>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-900/50">
                  <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Confirmation Number</h4>
                  <p className="text-lg font-medium text-primary-900 dark:text-primary-300">{wizardState.orderConfirmation.confirmationNumber}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <p className="text-gray-700 dark:text-gray-300">
                  This document confirms that electricity service has been established for the above address.
                </p>
              </div>
            </div>
            
            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-between items-end">
              <div>
                <div className="h-12 w-40 relative">
                  <svg viewBox="0 0 240 60">
                    <path d="M10,40 C20,10 40,30 60,30 C80,30 100,10 120,40 C140,70 160,30 180,20 C200,10 220,30 230,50" 
                          fill="none" 
                          stroke="#2563eb"
                          strokeWidth="2"
                          strokeLinecap="round" />
                  </svg>
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Authorized Digital Signature</p>
              </div>
              
              <div className="text-right">
                <div className="flex items-center justify-end mb-1">
                  <ShieldCheck className="h-4 w-4 text-primary-600 dark:text-primary-500 mr-1" />
                  <span className="text-sm font-medium text-primary-800 dark:text-primary-300">Verified & Secured</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Customer Service: 1-800-COMPARE</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">support@comparepower.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <button
            type="button"
            onClick={handleDownloadDocument}
            disabled={downloadStarted}
            className={cn(
              "btn",
              downloadStarted ? "btn-success" : "btn-primary",
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
            onClick={handleEmailDocument}
            disabled={emailSent}
            className={cn(
              "btn btn-secondary inline-flex items-center",
              emailSent && "bg-success-50 text-success-700 border-success-200 dark:bg-success-900/30 dark:text-success-300 dark:border-success-700"
            )}
          >
            {emailSent ? (
              <>
                <Check className="mr-1.5 h-4 w-4" />
                Sent!
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
            onClick={() => setShowLeasingOfficeForm(true)}
            disabled={leasingOfficeSent}
            className={cn(
              "btn btn-secondary inline-flex items-center",
              leasingOfficeSent && "bg-success-50 text-success-700 border-success-200 dark:bg-success-900/30 dark:text-success-300 dark:border-success-700"
            )}
          >
            {leasingOfficeSent ? (
              <>
                <Check className="mr-1.5 h-4 w-4" />
                Sent to Leasing Office
              </>
            ) : (
              <>
                <Building className="mr-1.5 h-4 w-4" />
                Email to Leasing Office
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={handlePrintDocument}
            className="btn btn-secondary inline-flex items-center"
          >
            <Printer className="mr-1.5 h-4 w-4" />
            Print
          </button>
          
          <button
            type="button"
            className={cn(
              "btn btn-secondary inline-flex items-center",
              copySuccess && "bg-success-50 text-success-700 border-success-200 dark:bg-success-900/30 dark:text-success-300 dark:border-success-700"
            )}
            onClick={handleCopyText}
          >
            {copySuccess ? (
              <>
                <Check className="mr-1.5 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-1.5 h-4 w-4" />
                Copy Text
              </>
            )}
          </button>
        </div>

        {/* Leasing Office Email Form */}
        {showLeasingOfficeForm && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-md animate-fade-in">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <Building className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                Send to Your Leasing Office
              </h3>
              <button
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={resetLeasingOfficeForm}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {leasingOfficeSent ? (
              <div className="mt-4 text-center p-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/50 mb-4">
                  <Check className="h-6 w-6 text-green-600 dark:text-green-500" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">Proof of Service Sent!</h4>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Your leasing office has been notified about your electricity service.
                </p>
                <div className="mt-4">
                  <button
                    className="btn btn-primary"
                    onClick={resetLeasingOfficeForm}
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Send your proof of electricity service directly to your leasing office or property manager.
                </p>
                
                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="leasingOfficeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Leasing Office/Property Name (Optional)
                    </label>
                    <input
                      type="text"
                      id="leasingOfficeName"
                      value={leasingOfficeName}
                      onChange={(e) => setLeasingOfficeName(e.target.value)}
                      className="input w-full"
                      placeholder="e.g., Oakwood Apartments"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="leasingOfficeEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Leasing Office Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="leasingOfficeEmail"
                      value={leasingOfficeEmail}
                      onChange={(e) => setLeasingOfficeEmail(e.target.value)}
                      className={cn(
                        "input w-full",
                        formErrors.email ? "border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-700 dark:focus:border-red-600 dark:focus:ring-red-600" : ""
                      )}
                      placeholder="e.g., leasing@oakwoodapts.com"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-start">
                      <Info className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                      <p>
                        We'll send your proof of service document with a personalized message to your leasing office.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleEmailToLeasingOffice}
                      disabled={sendingToLeasingOffice}
                    >
                      {sendingToLeasingOffice ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Send to Leasing Office
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowExtraInfo(!showExtraInfo)}
            className="flex w-full items-center justify-between p-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
          >
            <span className="flex items-center">
              <Info className="h-4 w-4 mr-2 text-primary-600 dark:text-primary-500" />
              For Leasing Offices & Property Managers
            </span>
            <svg
              className={`h-5 w-5 text-gray-500 dark:text-gray-400 transform transition-transform duration-200 ${showExtraInfo ? 'rotate-180' : ''}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          
          {showExtraInfo && (
            <div className="mt-2 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-md border border-blue-100 dark:border-blue-800 animate-fade-in">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Important Information for Property Management</h4>
              <p className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                This document serves as official proof that electricity service has been established
                at the address listed above. The resident is ready to take possession of their new home.
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start">
                  <Check className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-blue-700 dark:text-blue-400">
                    <span className="font-medium">Service Confirmed:</span> A valid account has been established with the provider.
                  </p>
                </div>
                <div className="flex items-start">
                  <Check className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-blue-700 dark:text-blue-400">
                    <span className="font-medium">Billing Active:</span> The resident is now financially responsible for this service.
                  </p>
                </div>
                <div className="flex items-start">
                  <Check className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-blue-700 dark:text-blue-400">
                    <span className="font-medium">Move-In Ready:</span> Power will be on for the scheduled move-in date.
                  </p>
                </div>
                <div className="flex items-start">
                  <Check className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-blue-700 dark:text-blue-400">
                    <span className="font-medium">Verification:</span> Call 1-800-COMPARE with the confirmation number to verify if needed.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 bg-green-50 dark:bg-green-900/30 p-4 rounded-md border border-green-200 dark:border-green-800">
          <div className="flex">
            <Check className="h-5 w-5 text-green-600 dark:text-green-500 mr-2 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-green-800 dark:text-green-300">All Set for Move-In Day!</h4>
              <p className="mt-1 text-sm text-green-700 dark:text-green-400">
                Your power will be connected on {formatDate(wizardState.moveInDate)}. 
                Show this document to your leasing office or property manager as proof that your electricity service has been established.
              </p>
              <p className="mt-2 text-sm text-green-700 dark:text-green-400">
                Click "Continue" to view your complete move-in checklist with helpful tips for your new home.
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps Section with Next Button */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Ready to continue to your complete moving checklist?
          </p>
          <button
            className="btn btn-primary inline-flex items-center"
            onClick={() => {
              // This would be handled by the wizard navigation in the actual flow
            }}
          >
            Continue to Checklist
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Calendar component
function Calendar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={props.className}
      {...props}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}

// ProofDocumentStepCopyIcon component (renamed from Copy)
function ProofDocumentStepCopyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={props.className}
      {...props}
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  );
}

// Custom ProofDocumentStepFileTextIcon - renamed to fix the duplicate declaration
function ProofDocumentStepFileTextIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
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

// Alert Circle icon
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

export default ProofDocumentStep;