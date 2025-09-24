import { useWizard } from '../../context/WizardContext';
import { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { Info, AlertCircle, Check, Lock, Phone, Mail, User, CreditCard, HelpCircle, Shield } from 'lucide-react';
import FeatureTestimonial from '../shared/FeatureTestimonial';
import SmartFormField from '../shared/SmartFormField';
import ContextualHelp from '../shared/ContextualHelp';

const PersonalDetailsStep = () => {
  const { wizardState, updateWizardState } = useWizard();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showSSNField, setShowSSNField] = useState(false);
  const [isAutofilling, setIsAutofilling] = useState(false);
  const [section, setSection] = useState<'personal' | 'verification' | 'contact'>('personal');
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);
  const [formProgress, setFormProgress] = useState(0);

  // Track form progress
  useEffect(() => {
    const calculateProgress = () => {
      const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
      let completedRequiredFields = 0;
      
      requiredFields.forEach(field => {
        if (wizardState.personalInfo[field as keyof typeof wizardState.personalInfo]) {
          completedRequiredFields++;
        }
      });
      
      const progress = (completedRequiredFields / requiredFields.length) * 100;
      setFormProgress(progress);
    };
    
    calculateProgress();
  }, [wizardState.personalInfo]);

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    updateWizardState({
      personalInfo: {
        ...wizardState.personalInfo,
        [field]: value,
      },
    });

    // Mark field as touched
    setTouched({
      ...touched,
      [field]: true
    });

    // Clear error when field is modified
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };

  // Validate email format
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Validate phone format
  const isValidPhone = (phone: string) => {
    return /^\d{10}$/.test(phone.replace(/\D/g, ''));
  };

  // Format phone number as user types
  const formatPhoneNumber = (phoneNumberString: string) => {
    const cleaned = phoneNumberString.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    
    if (match) {
      return [
        match[1] && `(${match[1]}`,
        match[2] && `) ${match[2]}`,
        match[3] && `-${match[3]}`,
      ].filter(Boolean).join('');
    }
    
    return phoneNumberString;
  };

  // Format SSN to only show last 4 digits
  const formatSSN = (ssn: string) => {
    const cleaned = ssn.replace(/\D/g, '');
    return cleaned.slice(0, 4);
  };

  // Handle phone input with formatting
  const handlePhoneChange = (phone: string) => {
    const formattedPhone = formatPhoneNumber(phone);
    handleInputChange('phone', formattedPhone);
  };

  // Handle SSN input with formatting
  const handleSSNChange = (ssn: string) => {
    const formattedSSN = formatSSN(ssn);
    handleInputChange('lastFourSSN', formattedSSN);
  };

  // Email validation
  const validateEmail = (email: string) => {
    if (!email.trim()) return 'Please enter your email address';
    if (!isValidEmail(email)) return 'Please enter a valid email address';
    return null;
  };
  
  // Phone validation
  const validatePhone = (phone: string) => {
    if (!phone.trim()) return 'Please enter your phone number';
    if (!isValidPhone(phone)) return 'Please enter a complete 10-digit phone number';
    return null;
  };
  
  // Name validation
  const validateName = (name: string, fieldName: string) => {
    if (!name.trim()) return `Please enter your ${fieldName.toLowerCase()}`;
    return null;
  };
  
  // SSN validation
  const validateSSN = (ssn: string) => {
    if (!ssn) return null; // Optional unless checkbox is checked
    if (showSSNField && ssn.length < 4) return 'Please enter all 4 digits';
    return null;
  };

  // Autofill for demonstration
  const handleAutofill = () => {
    setIsAutofilling(true);
    
    // Simulate network delay
    setTimeout(() => {
      updateWizardState({
        personalInfo: {
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@example.com',
          phone: '(512) 555-1234',
          dateOfBirth: '1985-06-15',
          lastFourSSN: showSSNField ? '4321' : null,
        },
      });
      
      setTouched({
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        dateOfBirth: true,
        lastFourSSN: showSSNField,
      });
      
      setIsAutofilling(false);
    }, 800);
  };

  // Show SSN field if it already has data
  useEffect(() => {
    if (wizardState.personalInfo.lastFourSSN) {
      setShowSSNField(true);
    }
  }, [wizardState.personalInfo.lastFourSSN]);

  // Validate all fields when submitting
  const validateForm = () => {
    const allFields = ['firstName', 'lastName', 'email', 'phone'];
    if (showSSNField) allFields.push('lastFourSSN');
    if (wizardState.personalInfo.dateOfBirth) allFields.push('dateOfBirth');
    
    let isValid = true;
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {...touched};
    
    allFields.forEach(field => {
      newTouched[field] = true;
      const value = wizardState.personalInfo[field as keyof typeof wizardState.personalInfo] as string;
      if (!validateField(field, value || '')) {
        isValid = false;
        newErrors[field] = errors[field] || `${field} is invalid`;
      }
    });
    
    setTouched(newTouched);
    setErrors(newErrors);
    
    return isValid;
  };
  
  // Validate field
  const validateField = (field: string, value: string) => {
    let errorMessage = '';
    
    switch (field) {
      case 'firstName':
        errorMessage = validateName(value, 'First name') || '';
        break;
      case 'lastName':
        errorMessage = validateName(value, 'Last name') || '';
        break;
      case 'email':
        errorMessage = validateEmail(value) || '';
        break;
      case 'phone':
        errorMessage = validatePhone(value) || '';
        break;
      case 'dateOfBirth':
        if (value && new Date(value) > new Date()) {
          errorMessage = 'Date of birth cannot be in the future';
        }
        break;
      case 'lastFourSSN':
        errorMessage = validateSSN(value) || '';
        break;
    }

    setErrors({
      ...errors,
      [field]: errorMessage,
    });

    return !errorMessage;
  };

  // Add form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    return validateForm();
  };

  // Change section
  const navigateToSection = (newSection: 'personal' | 'verification' | 'contact') => {
    setSection(newSection);
  };

  return (
    <div className="wizard-step">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Almost There!</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Just a few quick details to get your power connected.
        </p>
        
        <div className="mt-4 max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Form completion</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{Math.round(formProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                formProgress < 25 ? "bg-red-500" :
                formProgress < 75 ? "bg-yellow-500" :
                "bg-success-500"
              )}
              style={{ width: `${formProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="dashboard-card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Let's Get to Know You</h3>
              
              <button
                type="button"
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-500 flex items-center"
                onClick={handleAutofill}
                disabled={isAutofilling}
              >
                {isAutofilling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-600 dark:border-primary-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Filling...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-1.5" />
                    Fill with example data
                  </>
                )}
              </button>
            </div>
            
            {/* Section navigation tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
              <button
                type="button"
                className={cn(
                  "flex items-center px-4 py-2 border-b-2 text-sm font-medium",
                  section === 'personal'
                    ? "border-primary-500 dark:border-primary-400 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                )}
                onClick={() => navigateToSection('personal')}
              >
                <User className="h-4 w-4 mr-2" />
                Your Name
              </button>
              <button
                type="button"
                className={cn(
                  "flex items-center px-4 py-2 border-b-2 text-sm font-medium",
                  section === 'contact'
                    ? "border-primary-500 dark:border-primary-400 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                )}
                onClick={() => navigateToSection('contact')}
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Info
              </button>
              <button
                type="button"
                className={cn(
                  "flex items-center px-4 py-2 border-b-2 text-sm font-medium",
                  section === 'verification'
                    ? "border-primary-500 dark:border-primary-400 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                )}
                onClick={() => navigateToSection('verification')}
              >
                <Shield className="h-4 w-4 mr-2" />
                Identity Check
              </button>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {section === 'personal' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <SmartFormField
                      id="firstName"
                      label="First Name"
                      value={wizardState.personalInfo.firstName}
                      onChange={(value) => handleInputChange('firstName', value)}
                      required
                      icon={<User className="h-5 w-5 text-gray-400 dark:text-gray-600" />}
                      validation={(val) => validateName(val, 'First name')}
                    />

                    <SmartFormField
                      id="lastName"
                      label="Last Name"
                      value={wizardState.personalInfo.lastName}
                      onChange={(value) => handleInputChange('lastName', value)}
                      required
                      icon={<User className="h-5 w-5 text-gray-400 dark:text-gray-600" />}
                      validation={(val) => validateName(val, 'Last name')}
                    />
                  </div>

                  <SmartFormField
                    id="dateOfBirth"
                    label="Date of Birth"
                    value={wizardState.personalInfo.dateOfBirth || ''}
                    onChange={(value) => handleInputChange('dateOfBirth', value)}
                    type="date"
                    icon={<CreditCard className="h-5 w-5 text-gray-400 dark:text-gray-600" />}
                    helpText="Needed to verify your identity (must be 18+ for service)"
                    max={new Date().toISOString().split('T')[0]}
                    validation={(val) => val && new Date(val) > new Date() ? 'Date of birth cannot be in the future' : null}
                  />
                  
                  <div className="flex justify-end">
                    <button 
                      type="button" 
                      onClick={() => navigateToSection('contact')}
                      className="btn btn-primary"
                    >
                      Continue to Contact Info
                    </button>
                  </div>
                </div>
              )}

              {section === 'contact' && (
                <div className="space-y-6">
                  <SmartFormField
                    id="email"
                    label="Email Address"
                    value={wizardState.personalInfo.email}
                    onChange={(value) => handleInputChange('email', value)}
                    required
                    type="email"
                    icon={<Mail className="h-5 w-5 text-gray-400 dark:text-gray-600" />}
                    helpText="We'll email your confirmation and service details here"
                    validation={validateEmail}
                  />

                  <SmartFormField
                    id="phone"
                    label="Phone Number"
                    value={wizardState.personalInfo.phone}
                    onChange={handlePhoneChange}
                    required
                    type="tel"
                    placeholder="(555) 123-4567"
                    icon={<Phone className="h-5 w-5 text-gray-400 dark:text-gray-600" />}
                    helpText="For service updates and connection confirmation"
                    validation={validatePhone}
                  />
                  
                  <ContextualHelp
                    title="How We'll Use Your Contact Info"
                    theme="info"
                  >
                    <p>
                      We'll only use your contact information to:
                      <ul className="mt-1 list-disc pl-5 space-y-1">
                        <li>Send your confirmation documents</li>
                        <li>Notify you about your service connection</li>
                        <li>Share important updates about your electricity</li>
                      </ul>
                      We respect your privacy and never sell your information to third parties.
                    </p>
                  </ContextualHelp>
                  
                  <div className="flex justify-between">
                    <button 
                      type="button" 
                      onClick={() => navigateToSection('personal')}
                      className="btn btn-secondary"
                    >
                      Back
                    </button>
                    <button 
                      type="button" 
                      onClick={() => navigateToSection('verification')}
                      className="btn btn-primary"
                    >
                      Continue to Identity Check
                    </button>
                  </div>
                </div>
              )}

              {section === 'verification' && (
                <div className="space-y-6">
                  <ContextualHelp
                    title="Quick Security Check"
                    theme="success"
                    icon={<Shield className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />}
                  >
                    <p>
                      This information is only used for identity verification and to check if you qualify for no-deposit service. Your data is encrypted and handled securely.
                    </p>
                  </ContextualHelp>
                
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                    <div className="flex items-start">
                      <div className="flex items-center h-5 mt-1">
                        <input
                          id="showSSN"
                          type="checkbox"
                          checked={showSSNField}
                          onChange={() => setShowSSNField(!showSSNField)}
                          className="h-4 w-4 text-primary-600 dark:text-primary-500 focus:ring-primary-500 dark:focus:ring-primary-400 border-gray-300 dark:border-gray-600 rounded"
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="showSSN" className="text-sm font-medium text-blue-700 dark:text-blue-300">
                          I'd rather not pay a security deposit
                        </label>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          Most providers will waive the deposit (typically $100-$200) if you have good credit. This requires just the last 4 digits of your SSN for a soft credit check that won't affect your score.
                        </p>
                      </div>
                    </div>

                    {showSSNField && (
                      <div className="mt-4">
                        <SmartFormField
                          id="lastFourSSN"
                          label="Last 4 digits of SSN"
                          value={wizardState.personalInfo.lastFourSSN || ''}
                          onChange={handleSSNChange}
                          type={showSensitiveInfo ? "text" : "password"}
                          placeholder="1234"
                          icon={<Lock className="h-5 w-5 text-gray-400 dark:text-gray-600" />}
                          maxLength={4}
                          validation={validateSSN}
                          helpText="We only need the last 4 digits for a soft credit check"
                        />
                        <div className="mt-1 flex justify-end">
                          <button 
                            type="button"
                            onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
                            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center"
                          >
                            {showSensitiveInfo ? (
                              <>
                                <EyeOff className="h-3 w-3 mr-1" />
                                Hide
                              </>
                            ) : (
                              <>
                                <Eye className="h-3 w-3 mr-1" />
                                Show
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Testimonial about deposit waiver */}
                    {showSSNField && (
                      <div className="mt-4 animate-fade-in">
                        <FeatureTestimonial
                          feature="Deposit Savings"
                          quote="I was worried about the $150 deposit, but providing my SSN got it waived completely. Took 2 seconds and saved me money right away. Such a relief when you're already paying for movers!"
                          author={{ name: "James K.", location: "San Antonio, TX" }}
                          theme="light"
                        />
                      </div>
                    )}
                  </div>
                  
                  <ContextualHelp
                    title="Why We Need This Information"
                    icon={<HelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2 mt-0.5 flex-shrink-0" />}
                  >
                    <p>
                      Your electricity provider needs this information to:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm list-disc pl-5">
                      <li>Verify your identity (preventing fraud)</li>
                      <li>Set up your official customer account</li>
                      <li>Check if you qualify for deposit waivers</li>
                      <li>Send service notifications and billing</li>
                    </ul>
                    <p className="mt-2">
                      <span className="font-medium">Your data is protected:</span> All information is encrypted using industry-standard security.
                    </p>
                  </ContextualHelp>
                  
                  <div className="flex justify-between">
                    <button 
                      type="button" 
                      onClick={() => navigateToSection('contact')}
                      className="btn btn-secondary"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
              
              {/* Hidden submit button to enable form validation */}
              <button type="submit" className="hidden"></button>
            </form>
          </div>
          
          {formProgress === 100 && (
            <div className="mt-4 bg-success-50 dark:bg-success-900/20 p-4 rounded-lg border border-success-200 dark:border-success-800 animate-fade-in">
              <div className="flex items-start">
                <Check className="h-5 w-5 text-success-600 dark:text-success-400 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-success-800 dark:text-success-200">Looking good! All set.</h4>
                  <p className="mt-1 text-sm text-success-700 dark:text-success-300">
                    You've completed all required fields. Click "Continue" to finalize your service options.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          {/* Information sidebar */}
          <div className="dashboard-card">
            <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">How We Keep Your Information Safe</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-1.5 mr-3 flex-shrink-0">
                  <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Bank-Level Encryption</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    Your information is protected with the same security standards used by major financial institutions.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-1.5 mr-3 flex-shrink-0">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">No Unnecessary Data</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    We only collect what's needed to set up your service - nothing more.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-1.5 mr-3 flex-shrink-0">
                  <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Soft Credit Check Option</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    The optional SSN check doesn't affect your credit score - it just helps determine if you qualify for no-deposit service.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Customer testimonial */}
          <FeatureTestimonial
            feature="Quick & Painless Setup"
            quote="I was worried this would be complicated, but it took less than 3 minutes to enter my info. Got my confirmation email right away and text updates about my connection status. So much easier than I expected!"
            author={{ name: "Rebecca M.", location: "Dallas, TX" }}
            theme="subtle"
          />
        </div>
      </div>
    </div>
  );
};

function Eye(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

export default PersonalDetailsStep;