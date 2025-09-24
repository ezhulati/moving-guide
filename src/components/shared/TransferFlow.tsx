import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { useWizard } from '../../context/WizardContext';
import { ArrowRight, Zap } from 'lucide-react';
import { cn } from '../../utils/cn';

interface TransferFlowProps {
  onComplete?: (data: {
    isTexasResident: boolean;
    needsNewPlan: boolean;
  }) => void;
  className?: string;
}

const TransferFlow: React.FC<TransferFlowProps> = ({ 
  onComplete,
  className 
}) => {
  const navigate = useNavigate();
  const { updateWizardState } = useWizard();
  const { addToast } = useToast();
  const [isTexasResident, setIsTexasResident] = useState<boolean | null>(null);
  
  const handleContinue = () => {
    if (isTexasResident !== null) {
      if (onComplete) {
        onComplete({
          isTexasResident: isTexasResident,
          needsNewPlan: !isTexasResident // If not a Texas resident, always needs a new plan
        });
      }
      
      // Update wizard state
      updateWizardState({
        isTexasResident,
        isTransferringService: isTexasResident ? null : false, // Only null if they're a Texas resident, otherwise false
        transferFlow: {
          hasExistingService: isTexasResident,
          wantsTransfer: null, // Will be set in the wizard flow
          wantsNewPlan: !isTexasResident
        }
      });
      
      // Navigate based on selection
      if (!isTexasResident) {
        // New to Texas - start fresh
        addToast('info', 'Welcome to Texas! Let\'s find you the perfect electricity plan.');
        navigate('/wizard/welcome');
      } else {
        // Current resident - will determine transfer vs new plan in the wizard flow
        addToast('info', 'Let\'s find the best option for your move within Texas.');
        navigate('/wizard/address');
      }
    }
  };
  
  return (
    <div className={cn("bg-white dark:bg-gray-800 rounded-lg shadow-md p-6", className)}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Question Before We Start</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          This helps us tailor the right electricity setup for your needs
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Currently live in Texas?</h3>
        
        <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto">
          <button
            className={cn(
              "p-4 border rounded-lg transition-all text-left",
              isTexasResident === true
                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-400"
                : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
            onClick={() => setIsTexasResident(true)}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-4">
                <Zap className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h4 className="text-base font-medium text-gray-900 dark:text-white">Yes, I live in Texas</h4>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  I currently have electricity service in Texas
                </p>
              </div>
            </div>
          </button>
          
          <button
            className={cn(
              "p-4 border rounded-lg transition-all text-left",
              isTexasResident === false
                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-400"
                : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
            onClick={() => setIsTexasResident(false)}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-4">
                <Zap className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h4 className="text-base font-medium text-gray-900 dark:text-white">No, I'm new here</h4>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  I'm moving to Texas from another state
                </p>
              </div>
            </div>
          </button>
        </div>
        
        {/* Continue Button */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            className={cn(
              "btn btn-primary inline-flex items-center",
              isTexasResident === null ? "opacity-50 cursor-not-allowed" : ""
            )}
            onClick={handleContinue}
            disabled={isTexasResident === null}
          >
            Continue
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferFlow;