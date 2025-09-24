import { useState, useEffect } from 'react';
import { useWizard } from '../../context/WizardContext';
import { Home, Users, Car, Droplets, Sun, Check, ArrowRight } from 'lucide-react';
import UsagePredictionVisualizer from '../shared/UsagePredictionVisualizer';
import FeatureTestimonial from '../shared/FeatureTestimonial';
import { cn } from '../../utils/cn';
import ContextualHelp from '../shared/ContextualHelp';

const HomeProfileStep = () => {
  const { wizardState, updateWizardState } = useWizard();
  const [squareFootage, setSquareFootage] = useState<number>(
    wizardState.homeProfile.squareFootage || 1500
  );
  const [occupants, setOccupants] = useState<number>(
    wizardState.homeProfile.occupants || 2
  );
  const [showTransferInfo, setShowTransferInfo] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<'home-size' | 'household-size' | 'special-features'>('home-size');
  const [showSummary, setShowSummary] = useState(false);

  // Update wizard state when component mounts to ensure defaults are set
  useEffect(() => {
    // If squareFootage or occupants aren't set, set them with defaults
    if (!wizardState.homeProfile.squareFootage || !wizardState.homeProfile.occupants) {
      updateWizardState({
        homeProfile: {
          ...wizardState.homeProfile,
          squareFootage: squareFootage || 1500,
          occupants: occupants || 2,
        },
      });
    }
    
    // Show transfer info if user is transferring service
    if (wizardState.transferFlow?.wantsTransfer) {
      setShowTransferInfo(true);
    }
  }, []);

  // Update square footage and local state
  const handleSquareFootageChange = (value: number) => {
    setSquareFootage(value);
    updateWizardState({
      homeProfile: {
        ...wizardState.homeProfile,
        squareFootage: value,
      },
    });
  };

  // Update occupants and local state
  const handleOccupantsChange = (value: number) => {
    setOccupants(value);
    updateWizardState({
      homeProfile: {
        ...wizardState.homeProfile,
        occupants: value,
      },
    });
  };

  // Toggle special features
  const toggleFeature = (feature: 'hasEV' | 'hasPool' | 'hasSolar') => {
    updateWizardState({
      homeProfile: {
        ...wizardState.homeProfile,
        [feature]: !wizardState.homeProfile[feature],
      },
    });
  };

  // Get relevant testimonial based on home features
  const getRelevantTestimonial = () => {
    if (wizardState.homeProfile.hasSolar) {
      return {
        feature: "Solar Home",
        quote: "As a solar homeowner, I got a special plan that maximizes my energy credits. Texas Power Mover found me a plan that gives full credit for my excess generation!",
        author: { name: "Daniel W.", location: "Austin, TX" }
      };
    } 
    else if (wizardState.homeProfile.hasEV) {
      return {
        feature: "EV Charging",
        quote: "They helped me find a plan with discounted overnight rates so I can charge my Tesla for less. I'm saving about $40 a month compared to my old plan.",
        author: { name: "Rachel K.", location: "Dallas, TX" }
      };
    }
    else if (wizardState.homeProfile.hasPool) {
      return {
        feature: "Pool Ownership",
        quote: "With a pool pump running 8 hours daily, my summer bills were sky-high. The personalized plan Texas Power Mover found me cut my costs by 15% during peak months.",
        author: { name: "Steve B.", location: "Houston, TX" }
      };
    }
    else if (squareFootage > 2500) {
      return {
        feature: "Large Home",
        quote: "With over 3,000 sq ft, our home uses a lot of electricity. The tiered-rate plan recommendation saved us $85/month compared to our previous provider!",
        author: { name: "Jennifer M.", location: "San Antonio, TX" }
      };
    }
    return null;
  };

  // Preset options for square footage
  const squareFootagePresets = [
    { label: 'Small', value: 800, description: 'Apt/Condo' },
    { label: 'Medium', value: 1500, description: 'Average Home' },
    { label: 'Large', value: 2500, description: 'Large Home' },
    { label: 'Very Large', value: 4000, description: 'Mansion' },
  ];

  // Preset options for occupants
  const occupantPresets = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3-4', value: 4 },
    { label: '5+', value: 6 },
  ];

  // Handle current provider input for transfer
  const handleCurrentProviderChange = (provider: string) => {
    updateWizardState({
      currentProvider: provider
    });
  };

  // Handle current account number input for transfer
  const handleCurrentAccountNumberChange = (accountNumber: string) => {
    updateWizardState({
      currentAccountNumber: accountNumber
    });
  };

  // Move to next question
  const handleNextQuestion = () => {
    if (currentQuestion === 'home-size') {
      setCurrentQuestion('household-size');
    } else if (currentQuestion === 'household-size') {
      setCurrentQuestion('special-features');
    } else {
      setShowSummary(true);
    }
  };

  // Move to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestion === 'household-size') {
      setCurrentQuestion('home-size');
    } else if (currentQuestion === 'special-features') {
      setCurrentQuestion('household-size');
    } else if (showSummary) {
      setShowSummary(false);
      setCurrentQuestion('special-features');
    }
  };

  return (
    <div className="wizard-step max-w-none">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Home Profile</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Tell us about your home to get personalized plan recommendations.
        </p>
      </div>

      {/* Service Transfer Information - Only show if user is transferring service */}
      {wizardState.transferFlow?.wantsTransfer && (
        <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800 animate-fade-in">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5 mr-3">
              <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 15L13 19L9 15M13 19V5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">Service Transfer Information</h3>
              <p className="mt-2 text-blue-700 dark:text-blue-300">
                Please provide your current electricity provider and account number to help us transfer your service.
              </p>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="currentProvider" className="block text-sm font-medium text-blue-700 dark:text-blue-300">
                    Current Electricity Provider
                  </label>
                  <input
                    type="text"
                    id="currentProvider"
                    value={wizardState.currentProvider || ''}
                    onChange={(e) => handleCurrentProviderChange(e.target.value)}
                    placeholder="e.g., TXU Energy, Reliant, etc."
                    className="mt-1 block w-full rounded-md border-blue-300 dark:border-blue-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-blue-900/30 dark:text-blue-100"
                  />
                </div>
                <div>
                  <label htmlFor="currentAccountNumber" className="block text-sm font-medium text-blue-700 dark:text-blue-300">
                    Current Account Number
                  </label>
                  <input
                    type="text"
                    id="currentAccountNumber"
                    value={wizardState.currentAccountNumber || ''}
                    onChange={(e) => handleCurrentAccountNumberChange(e.target.value)}
                    placeholder="Found on your bill"
                    className="mt-1 block w-full rounded-md border-blue-300 dark:border-blue-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-blue-900/30 dark:text-blue-100"
                  />
                </div>
              </div>
              
              <div className="mt-4 text-sm text-blue-700 dark:text-blue-300 flex items-center">
                <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Having your current bill handy will make this process faster</span>
              </div>
              
              <div className="mt-4">
                <ContextualHelp
                  title="What happens during a transfer?"
                  theme="info"
                  dismissable={true}
                >
                  <p>
                    When you transfer service, your current provider will:
                  </p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Close service at your old address on your move-out date</li>
                    <li>Open service at your new address on your move-in date</li>
                    <li>Transfer your existing plan and contract terms</li>
                    <li>Send a final bill for your old address</li>
                  </ul>
                  <p className="mt-2">
                    <strong>Note:</strong> Some providers may require additional verification or have specific transfer policies. We'll guide you through any provider-specific requirements.
                  </p>
                </ContextualHelp>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex justify-between">
          {['home-size', 'household-size', 'special-features'].map((step, index) => (
            <div 
              key={step}
              className="flex flex-col items-center"
            >
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center", 
                  currentQuestion === step || 
                  (currentQuestion === 'household-size' && step === 'home-size') || 
                  (currentQuestion === 'special-features' && (step === 'home-size' || step === 'household-size')) ||
                  (showSummary)
                    ? "bg-primary-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                )}
              >
                <span className="text-lg font-medium">{index + 1}</span>
              </div>
              <span className={cn(
                "text-xs mt-1",
                currentQuestion === step ? "text-primary-600 font-medium" : "text-gray-500"
              )}>
                {step === 'home-size' ? 'Home Size' : 
                 step === 'household-size' ? 'Household' : 'Features'}
              </span>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute top-0 inset-x-0 h-1 bg-gray-200 dark:bg-gray-700"></div>
          <div 
            className="absolute top-0 left-0 h-1 bg-primary-600 transition-all duration-500"
            style={{
              width: currentQuestion === 'home-size' ? '33%' : 
                    currentQuestion === 'household-size' ? '66%' : '100%'
            }}
          ></div>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        {/* Question 1: Home Size */}
        {currentQuestion === 'home-size' && (
          <div className="p-6 animate-fade-in">
            <div className="flex items-center mb-4">
              <Home className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Home Size</h3>
            </div>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              How big is your home? This helps us estimate your energy usage and recommend the most cost-effective plans.
            </p>
            
            {/* Quick select buttons */}
            <div className="mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {squareFootagePresets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => handleSquareFootageChange(preset.value)}
                    className={cn(
                      "p-4 border rounded-md text-center transition-colors flex flex-col items-center",
                      squareFootage === preset.value 
                        ? "bg-primary-50 dark:bg-primary-900/30 border-primary-500 dark:border-primary-400 text-primary-700 dark:text-primary-300"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                  >
                    <div className="font-medium text-lg mb-1">{preset.label}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{preset.description}</div>
                    <div className="mt-2 text-sm font-medium">{preset.value} sq ft</div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Fine-tune slider (optional use) */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="squareFootage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Fine-tune size: {squareFootage} sq ft
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400">Optional</span>
              </div>
              <input
                type="range"
                id="squareFootage"
                min="500"
                max="5000"
                step="100"
                value={squareFootage || 1500}
                onChange={(e) => handleSquareFootageChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>500 sq ft</span>
                <span>5,000 sq ft</span>
              </div>
            </div>
            
            {/* Navigation buttons */}
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={handleNextQuestion}
                className="btn btn-primary flex items-center"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        
        {/* Question 2: Household Size */}
        {currentQuestion === 'household-size' && (
          <div className="p-6 animate-fade-in">
            <div className="flex items-center mb-4">
              <Users className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Household Size</h3>
            </div>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              How many people live in your home? More people typically means higher electricity usage, especially for hot water and appliances.
            </p>
            
            {/* Quick select buttons */}
            <div className="mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {occupantPresets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => handleOccupantsChange(preset.value)}
                    className={cn(
                      "p-4 border rounded-md text-center transition-colors flex flex-col items-center",
                      occupants === preset.value 
                        ? "bg-primary-50 dark:bg-primary-900/30 border-primary-500 dark:border-primary-400 text-primary-700 dark:text-primary-300"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                  >
                    <div className="font-medium text-lg mb-1">{preset.label}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {preset.value === 1 ? "Person" : "People"}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Fine-tune slider (optional use) */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="occupants" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Fine-tune people: {occupants}
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400">Optional</span>
              </div>
              <input
                type="range"
                id="occupants"
                min="1"
                max="10"
                value={occupants || 2}
                onChange={(e) => handleOccupantsChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>1 person</span>
                <span>10+ people</span>
              </div>
            </div>
            
            {/* Navigation buttons */}
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={handlePreviousQuestion}
                className="btn btn-secondary"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNextQuestion}
                className="btn btn-primary flex items-center"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        
        {/* Question 3: Special Features */}
        {currentQuestion === 'special-features' && (
          <div className="p-6 animate-fade-in">
            <div className="flex items-center mb-4">
              <Sun className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Special Features</h3>
            </div>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Does your home have any of these special features? These can significantly impact your electricity usage and help us find plans with special rates or incentives.
            </p>
            
            <div className="space-y-4">
              <div
                className={cn(
                  "p-4 border rounded-lg cursor-pointer flex items-center transition-all",
                  wizardState.homeProfile.hasEV
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-400'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                )}
                onClick={() => toggleFeature('hasEV')}
              >
                <div
                  className={cn(
                    "h-6 w-6 mr-4 flex items-center justify-center rounded-full border",
                    wizardState.homeProfile.hasEV
                      ? 'bg-primary-600 border-primary-600 dark:bg-primary-500 dark:border-primary-500'
                      : 'border-gray-400 dark:border-gray-500'
                  )}
                >
                  {wizardState.homeProfile.hasEV && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className="flex items-center flex-grow">
                  <Car className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-3" />
                  <span className="font-medium text-gray-900 dark:text-white">Electric Vehicle Charger</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">+300 kWh/mo</span>
              </div>
              
              <div
                className={cn(
                  "p-4 border rounded-lg cursor-pointer flex items-center transition-all",
                  wizardState.homeProfile.hasPool
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-400'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                )}
                onClick={() => toggleFeature('hasPool')}
              >
                <div
                  className={cn(
                    "h-6 w-6 mr-4 flex items-center justify-center rounded-full border",
                    wizardState.homeProfile.hasPool
                      ? 'bg-primary-600 border-primary-600 dark:bg-primary-500 dark:border-primary-500'
                      : 'border-gray-400 dark:border-gray-500'
                  )}
                >
                  {wizardState.homeProfile.hasPool && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className="flex items-center flex-grow">
                  <Droplets className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-3" />
                  <span className="font-medium text-gray-900 dark:text-white">Swimming Pool</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">+500 kWh/mo</span>
              </div>
              
              <div
                className={cn(
                  "p-4 border rounded-lg cursor-pointer flex items-center transition-all",
                  wizardState.homeProfile.hasSolar
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-400'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                )}
                onClick={() => toggleFeature('hasSolar')}
              >
                <div
                  className={cn(
                    "h-6 w-6 mr-4 flex items-center justify-center rounded-full border",
                    wizardState.homeProfile.hasSolar
                      ? 'bg-primary-600 border-primary-600 dark:bg-primary-500 dark:border-primary-500'
                      : 'border-gray-400 dark:border-gray-500'
                  )}
                >
                  {wizardState.homeProfile.hasSolar && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className="flex items-center flex-grow">
                  <Sun className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-3" />
                  <span className="font-medium text-gray-900 dark:text-white">Solar Panels</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">-400 kWh/mo</span>
              </div>
            </div>
            
            {/* Relevant Testimonial */}
            {getRelevantTestimonial() && (
              <div className="mt-6 animate-fade-in">
                <FeatureTestimonial
                  feature={getRelevantTestimonial()!.feature}
                  quote={getRelevantTestimonial()!.quote}
                  author={getRelevantTestimonial()!.author}
                  theme="primary"
                />
              </div>
            )}
            
            {/* Navigation buttons */}
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={handlePreviousQuestion}
                className="btn btn-secondary"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNextQuestion}
                className="btn btn-primary flex items-center"
              >
                See Your Profile Summary
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        
        {/* Summary Page */}
        {showSummary && (
          <div className="p-6 animate-fade-in">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 mb-4">
                <Check className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Your Profile Is Complete!</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Based on your answers, we've created a personalized profile to help find the best electricity plans for you.
              </p>
            </div>
            
            {/* Profile Summary Card */}
            <div className="bg-primary-50 dark:bg-primary-900/30 rounded-lg p-6 border border-primary-100 dark:border-primary-800 mb-8">
              <h4 className="text-lg font-medium text-primary-800 dark:text-primary-200 mb-6 text-center">Your Home Profile Summary</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-primary-100 dark:border-primary-800 text-center">
                  <Home className="h-8 w-8 mx-auto mb-2 text-primary-600 dark:text-primary-400" />
                  <h5 className="font-medium text-gray-900 dark:text-white">Home Size</h5>
                  <p className="text-2xl font-bold text-primary-700 dark:text-primary-300 mt-1">{squareFootage} sq ft</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {squareFootage < 1000 ? "Small home" :
                     squareFootage < 2000 ? "Medium home" :
                     squareFootage < 3000 ? "Large home" : "Very large home"}
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-primary-100 dark:border-primary-800 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-primary-600 dark:text-primary-400" />
                  <h5 className="font-medium text-gray-900 dark:text-white">Household Size</h5>
                  <p className="text-2xl font-bold text-primary-700 dark:text-primary-300 mt-1">{occupants}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {occupants === 1 ? "Person" : "People"}
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-primary-100 dark:border-primary-800 text-center">
                  <Sun className="h-8 w-8 mx-auto mb-2 text-primary-600 dark:text-primary-400" />
                  <h5 className="font-medium text-gray-900 dark:text-white">Special Features</h5>
                  {wizardState.homeProfile.hasEV || wizardState.homeProfile.hasPool || wizardState.homeProfile.hasSolar ? (
                    <ul className="mt-2">
                      {wizardState.homeProfile.hasEV && (
                        <li className="text-sm text-primary-700 dark:text-primary-300 flex items-center justify-center">
                          <Car className="h-4 w-4 mr-1 flex-shrink-0" /> EV Charger
                        </li>
                      )}
                      {wizardState.homeProfile.hasPool && (
                        <li className="text-sm text-primary-700 dark:text-primary-300 flex items-center justify-center">
                          <Droplets className="h-4 w-4 mr-1 flex-shrink-0" /> Swimming Pool
                        </li>
                      )}
                      {wizardState.homeProfile.hasSolar && (
                        <li className="text-sm text-primary-700 dark:text-primary-300 flex items-center justify-center">
                          <Sun className="h-4 w-4 mr-1 flex-shrink-0" /> Solar Panels
                        </li>
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">None selected</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Usage Prediction */}
            <div className="mb-8">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Your Predicted Energy Usage</h4>
              <UsagePredictionVisualizer showDetails={true} />
            </div>
            
            {/* Energy Saving Tips */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800 mb-8">
              <h4 className="text-lg font-medium text-green-800 dark:text-green-200 mb-4">Personalized Energy Saving Tips</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-green-700 dark:text-green-300">
                    Set your thermostat to 78°F in summer and 68°F in winter to save up to 15% on energy costs
                  </p>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-green-700 dark:text-green-300">
                    {occupants > 2 ? 
                      "Homes with more occupants typically use more hot water - consider low-flow fixtures to reduce usage" : 
                      "Consider using power strips to reduce phantom energy usage from electronics when not in use"}
                  </p>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-green-700 dark:text-green-300">
                    {squareFootage > 2000 ? 
                      "Larger homes can benefit significantly from zoned HVAC systems to cool only occupied areas" : 
                      "Consider smart plugs to reduce phantom energy usage from electronics and appliances"}
                  </p>
                </li>
              </ul>
            </div>
            
            {/* Optimized Profile Summary */}
            <div className="bg-primary-50 dark:bg-primary-900/30 rounded-lg p-6 border border-primary-100 dark:border-primary-800">
              <h4 className="text-lg font-medium text-primary-800 dark:text-primary-200 mb-4 text-center">Based On Your Profile, We'll Recommend:</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-primary-100 dark:border-primary-700">
                  <p className="text-base font-medium text-primary-800 dark:text-primary-200 mb-1">{squareFootage} sq ft home</p>
                  <p className="text-sm text-primary-600 dark:text-primary-400">
                    {squareFootage < 1000 ? "Small home efficiency plans" :
                     squareFootage < 2000 ? "Medium home balanced plans" :
                     "Large home capacity plans"}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-primary-100 dark:border-primary-700">
                  <p className="text-base font-medium text-primary-800 dark:text-primary-200 mb-1">{occupants} {occupants === 1 ? "person" : "people"}</p>
                  <p className="text-sm text-primary-600 dark:text-primary-400">
                    {occupants < 3 ? "Low to moderate usage plans" :
                     occupants < 5 ? "Family-sized usage plans" :
                     "High-occupancy usage plans"}
                  </p>
                </div>
                
                {(wizardState.homeProfile.hasEV || wizardState.homeProfile.hasPool || wizardState.homeProfile.hasSolar) && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-primary-100 dark:border-primary-700 col-span-2">
                    <p className="text-base font-medium text-primary-800 dark:text-primary-200 mb-1">Special Feature Benefits</p>
                    <div className="text-sm text-primary-600 dark:text-primary-400">
                      {wizardState.homeProfile.hasEV && (
                        <p>EV-friendly plans with time-of-use options for cheaper overnight charging</p>
                      )}
                      {wizardState.homeProfile.hasPool && (
                        <p>Plans with free weekend usage to run pool equipment cost-effectively</p>
                      )}
                      {wizardState.homeProfile.hasSolar && (
                        <p>Plans that offer full credit for excess solar production</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-primary-700 dark:text-primary-300">
                  You're ready to see plan options that match your unique home profile!
                </p>
              </div>
            </div>
            
            {/* Navigation buttons */}
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={handlePreviousQuestion}
                className="btn btn-secondary"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {}} // This will be handled by the wizard navigation
                className="btn btn-primary flex items-center"
              >
                Continue to Plan Options
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeProfileStep;