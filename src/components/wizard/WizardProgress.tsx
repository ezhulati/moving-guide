import { WizardStepType } from '../../context/WizardContext';
import { cn } from '../../utils/cn';

interface WizardProgressProps {
  currentStep: WizardStepType;
}

const WizardProgress: React.FC<WizardProgressProps> = ({ currentStep }) => {
  // Define the steps and their display names
  const steps: { id: WizardStepType; name: string }[] = [
    { id: 'welcome', name: 'Getting Started' },
    { id: 'address', name: 'Your Address' },
    { id: 'home-profile', name: 'Home Details' },
    { id: 'plan-selection', name: 'Choose Plan' },
    { id: 'personal-details', name: 'Your Info' },
    { id: 'confirmation', name: 'All Set!' },
  ];

  // Calculate the current step index
  const getCurrentStepIndex = (): number => {
    switch (currentStep) {
      case 'welcome':
        return 0;
      case 'address':
      case 'address-confirmation':
        return 1;
      case 'home-profile':
        return 2;
      case 'plan-filters':
      case 'plan-selection':
        return 3;
      case 'personal-details':
      case 'service-details':
        return 4;
      case 'confirmation':
      case 'proof-document':
      case 'checklist':
        return 5;
      default:
        return 0;
    }
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="py-4 px-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm mb-6 border border-gray-100 dark:border-gray-800">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between">
          {steps.map((step, index) => (
            <li
              key={step.id}
              className={cn(
                "relative flex items-center",
                index < steps.length - 1 ? "w-full" : ""
              )}
            >
              {/* Step indicator */}
              <div className="flex items-center">
                {index < currentStepIndex ? (
                  // Completed step
                  <span className="flex-shrink-0 h-9 w-9 rounded-full bg-primary-600 dark:bg-primary-500 flex items-center justify-center">
                    <svg className="h-5 w-5 text-white\" xmlns="http://www.w3.org/2000/svg\" viewBox="0 0 20 20\" fill="currentColor\" aria-hidden="true">
                      <path fillRule="evenodd\" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z\" clipRule="evenodd" />
                    </svg>
                  </span>
                ) : index === currentStepIndex ? (
                  // Current step
                  <span className="flex-shrink-0 h-9 w-9 rounded-full border-2 border-primary-600 dark:border-primary-400 bg-white dark:bg-gray-900 flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-400 font-medium">{index + 1}</span>
                  </span>
                ) : (
                  // Upcoming step
                  <span className="flex-shrink-0 h-9 w-9 rounded-full border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">{index + 1}</span>
                  </span>
                )}
              </div>
              
              {/* Step name */}
              <span className={cn(
                "ml-3 text-sm font-medium",
                index === currentStepIndex 
                  ? "text-primary-600 dark:text-primary-400" 
                  : index < currentStepIndex 
                    ? "text-gray-900 dark:text-gray-100" 
                    : "text-gray-500 dark:text-gray-400"
              )}>
                {step.name}
              </span>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div 
                  className={cn(
                    "flex-1 mx-5 h-0.5",
                    index < currentStepIndex ? "bg-primary-600 dark:bg-primary-500" : "bg-gray-200 dark:bg-gray-700"
                  )}
                ></div>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default WizardProgress;