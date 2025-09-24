import { X, HelpCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface TransferIntentDialogProps {
  onYes: () => void;
  onNo: () => void;
  onNotSure: () => void;
  onNoExistingService: () => void;
  onClose: () => void;
}

const TransferIntentDialog: React.FC<TransferIntentDialogProps> = ({
  onYes,
  onNo,
  onNotSure,
  onNoExistingService,
  onClose
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
              Quick Question About Your Move
            </h3>
          </div>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Currently have electricity service in Texas?
        </p>
        
        <div className="space-y-3">
          <button
            type="button"
            className="w-full text-left px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            onClick={onYes}
          >
            <span className="font-medium text-gray-900 dark:text-white">Yes, I want to transfer my current plan</span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">I have an existing electricity account I want to move</p>
          </button>
          
          <button
            type="button"
            className="w-full text-left px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            onClick={onNo}
          >
            <span className="font-medium text-gray-900 dark:text-white">Yes, but I want a new plan instead</span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">I have service now but want to shop for something better</p>
          </button>
          
          <button
            type="button"
            className="w-full text-left px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            onClick={onNoExistingService}
          >
            <span className="font-medium text-gray-900 dark:text-white">No, I don't have my own service</span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">I'm moving from my parents' home or a roommate situation</p>
          </button>
          
          <button
            type="button"
            className="w-full text-left px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            onClick={onNotSure}
          >
            <span className="font-medium text-gray-900 dark:text-white">I'm not sure what's best for me</span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Help me understand my options</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferIntentDialog;