import { Link, useLocation } from 'react-router-dom';
import { Home, Building, Check } from 'lucide-react';
import { useWizard, PropertyType } from '../../context/WizardContext';
import { useEffect } from 'react';
import { cn } from '../../utils/cn';

const WelcomeStep = () => {
  const { wizardState, updateWizardState } = useWizard();

  const handlePropertyTypeSelect = (type: PropertyType) => {
    updateWizardState({ propertyType: type });
  };

  // If we already have data from the homepage form, show it as selected
  useEffect(() => {
    // This is just to ensure the data is properly set
    if (wizardState.propertyType && wizardState.address.street && wizardState.moveInDate) {
      console.log('Already have initial data from homepage');
    }
  }, [wizardState.propertyType, wizardState.address.street, wizardState.moveInDate]);

  return (
    <div className="wizard-step max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Hi there! Let's get your electricity set up</h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          We'll make this quick and painless—just a few simple questions to find you the perfect plan.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-6">First, what type of place are you moving to?</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div
            className={cn(
              "relative rounded-xl border p-6 flex flex-col cursor-pointer transition-all hover:shadow-md",
              wizardState.propertyType === 'apartment'
                ? 'border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/30 ring-1 ring-primary-500 dark:ring-primary-400'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-600'
            )}
            onClick={() => handlePropertyTypeSelect('apartment')}
            role="radio"
            aria-checked={wizardState.propertyType === 'apartment'}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePropertyTypeSelect('apartment');
              }
            }}
          >
            {wizardState.propertyType === 'apartment' && (
              <div className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-700">
                <Check className="h-4 w-4 text-primary-600 dark:text-primary-300" />
              </div>
            )}
            <div className="flex flex-col items-center">
              <div className={`flex-shrink-0 h-16 w-16 rounded-full flex items-center justify-center mb-4 ${
                wizardState.propertyType === 'apartment'
                  ? 'bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                <Building className="h-8 w-8" />
              </div>
              <div className="text-center">
                <h4 className={`text-lg font-bold mb-4 ${
                  wizardState.propertyType === 'apartment'
                    ? 'text-primary-700 dark:text-primary-300'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  Apartment
                </h4>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                  <span>Instant proof for leasing office</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                  <span>Same-day connection available</span>
                </li>
              </ul>
            </div>
          </div>

          <div
            className={cn(
              "relative rounded-xl border p-6 flex flex-col cursor-pointer transition-all hover:shadow-md",
              wizardState.propertyType === 'condo'
                ? 'border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/30 ring-1 ring-primary-500 dark:ring-primary-400'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-600'
            )}
            onClick={() => handlePropertyTypeSelect('condo')}
            role="radio"
            aria-checked={wizardState.propertyType === 'condo'}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePropertyTypeSelect('condo');
              }
            }}
          >
            {wizardState.propertyType === 'condo' && (
              <div className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-700">
                <Check className="h-4 w-4 text-primary-600 dark:text-primary-300" />
              </div>
            )}
            <div className="flex flex-col items-center">
              <div className={`flex-shrink-0 h-16 w-16 rounded-full flex items-center justify-center mb-4 ${
                wizardState.propertyType === 'condo'
                  ? 'bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                <Building className="h-8 w-8" />
              </div>
              <div className="text-center">
                <h4 className={`text-lg font-bold mb-4 ${
                  wizardState.propertyType === 'condo'
                    ? 'text-primary-700 dark:text-primary-300'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  Condo
                </h4>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                  <span>Documentation for HOA</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                  <span>Multi-unit optimized plans</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div
            className={cn(
              "relative rounded-xl border p-6 flex flex-col cursor-pointer transition-all hover:shadow-md",
              wizardState.propertyType === 'townhome'
                ? 'border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/30 ring-1 ring-primary-500 dark:ring-primary-400'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-600'
            )}
            onClick={() => handlePropertyTypeSelect('townhome')}
            role="radio"
            aria-checked={wizardState.propertyType === 'townhome'}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePropertyTypeSelect('townhome');
              }
            }}
          >
            {wizardState.propertyType === 'townhome' && (
              <div className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-700">
                <Check className="h-4 w-4 text-primary-600 dark:text-primary-300" />
              </div>
            )}
            <div className="flex flex-col items-center">
              <div className={`flex-shrink-0 h-16 w-16 rounded-full flex items-center justify-center mb-4 ${
                wizardState.propertyType === 'townhome'
                  ? 'bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                <TownhouseIcon className="h-8 w-8" />
              </div>
              <div className="text-center">
                <h4 className={`text-lg font-bold mb-4 ${
                  wizardState.propertyType === 'townhome'
                    ? 'text-primary-700 dark:text-primary-300'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  Townhome
                </h4>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                  <span>Energy efficient plans</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                  <span>Shared wall savings</span>
                </li>
              </ul>
            </div>
          </div>

          <div
            className={cn(
              "relative rounded-xl border p-6 flex flex-col cursor-pointer transition-all hover:shadow-md",
              wizardState.propertyType === 'house'
                ? 'border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/30 ring-1 ring-primary-500 dark:ring-primary-400'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-600'
            )}
            onClick={() => handlePropertyTypeSelect('house')}
            role="radio"
            aria-checked={wizardState.propertyType === 'house'}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePropertyTypeSelect('house');
              }
            }}
          >
            {wizardState.propertyType === 'house' && (
              <div className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-700">
                <Check className="h-4 w-4 text-primary-600 dark:text-primary-300" />
              </div>
            )}
            <div className="flex flex-col items-center">
              <div className={`flex-shrink-0 h-16 w-16 rounded-full flex items-center justify-center mb-4 ${
                wizardState.propertyType === 'house'
                  ? 'bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                <Home className="h-8 w-8" />
              </div>
              <div className="text-center">
                <h4 className={`text-lg font-bold mb-4 ${
                  wizardState.propertyType === 'house'
                    ? 'text-primary-700 dark:text-primary-300'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  House
                </h4>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                  <span>Custom recommendations</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                  <span>Usage estimates for your home</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 max-w-4xl mx-auto mt-12">
        <h4 className="text-lg font-bold text-blue-800 dark:text-blue-200 mb-3">Why Use ComparePower?</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="space-y-2">
            <li className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-1 mr-2 flex-shrink-0 mt-0.5">
                <DollarIcon className="text-blue-600 dark:text-blue-300 h-4 w-4" />
              </div>
              <span className="text-sm text-blue-700 dark:text-blue-300">Save an average of $350/year on electricity costs</span>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-1 mr-2 flex-shrink-0 mt-0.5">
                <ClockIcon className="text-blue-600 dark:text-blue-300 h-4 w-4" />
              </div>
              <span className="text-sm text-blue-700 dark:text-blue-300">Set up your service in less than 5 minutes</span>
            </li>
          </ul>
          <ul className="space-y-2">
            <li className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-1 mr-2 flex-shrink-0 mt-0.5">
                <ZapIcon className="text-blue-600 dark:text-blue-300 h-4 w-4" />
              </div>
              <span className="text-sm text-blue-700 dark:text-blue-300">Get same-day service if ordered by 5PM (Mon-Sat)</span>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-1 mr-2 flex-shrink-0 mt-0.5">
                <DocumentIcon className="text-blue-600 dark:text-blue-300 h-4 w-4" />
              </div>
              <span className="text-sm text-blue-700 dark:text-blue-300">Receive instant confirmation and proof documents</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Custom icons using SVG to avoid Lucide import issues
function DollarIcon(props: React.SVGProps<SVGSVGElement>) {
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
      className="h-4 w-4"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
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
      className="h-4 w-4"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ZapIcon(props: React.SVGProps<SVGSVGElement>) {
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
      className="h-4 w-4"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function DocumentIcon(props: React.SVGProps<SVGSVGElement>) {
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
      className="h-4 w-4"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

// Townhouse icon
function TownhouseIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z" />
      <path d="M6 18h12" />
      <path d="M6 14h12" />
      <rect x="6" y="10" width="12" height="12" />
    </svg>
  );
}

export default WelcomeStep;