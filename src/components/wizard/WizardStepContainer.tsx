import { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { useWizard } from '../../context/WizardContext';

interface WizardStepContainerProps {
  children: ReactNode;
  className?: string;
  currentStep: string;
}

const WizardStepContainer: React.FC<WizardStepContainerProps> = ({
  children,
  className,
  currentStep
}) => {
  const { canProceed } = useWizard();
  
  const getStepCompletionClass = () => {
    if (canProceed()) {
      return 'border-l-green-500';
    }
    return 'border-l-gray-300';
  };
  
  // Determine if the current step is one that collects sensitive information
  const isSensitiveStep = ['personal-details', 'service-details'].includes(currentStep);
  
  return (
    <div 
      className={cn(
        "bg-white rounded-lg shadow-md transition-all duration-300 w-full",
        "border-l-4",
        getStepCompletionClass(),
        className
      )}
    >
      <div className="p-6 md:p-8 w-full">
        {isSensitiveStep && (
          <div className="absolute top-3 right-3 flex items-center">
            <div className="p-1 rounded-full bg-gray-100">
              <svg className="h-4 w-4 text-gray-500\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24\" stroke="currentColor">
                <path strokeLinecap="round\" strokeLinejoin="round\" strokeWidth={2} d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <span className="ml-1 text-xs text-gray-500">Secure</span>
          </div>
        )}
        
        {children}
      </div>
    </div>
  );
};

export default WizardStepContainer;