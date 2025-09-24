import { X, AlertTriangle, ArrowRight, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

interface TransferEducationModalProps {
  onClose: () => void;
  onCompareOptions: () => void;
  onContinueTransfer: () => void;
}

const TransferEducationModal: React.FC<TransferEducationModalProps> = ({ 
  onClose,
  onCompareOptions,
  onContinueTransfer
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-amber-800 dark:text-amber-300">
              Is Transferring Your Plan Really the Best Option?
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
        
        <div className="mt-2 text-gray-600 dark:text-gray-300 space-y-4">
          <p>
            Your current plan was designed for your old home's specific usage patterns. In your new home, everything changes—size, 
            appliances, and your daily routine—which can make your old rate structure a poor fit.
          </p>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-700 mt-4">
            <p className="font-medium text-amber-800 dark:text-amber-300">
              Most people who transfer end up paying more than if they'd chosen a new plan optimized for their new home. It takes just 
              5 minutes to compare and know for sure which option will save you the most money.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600 text-center">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">83%</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">of transfers cost more</p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600 text-center">
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">$175</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">avg. yearly overpayment</p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600 text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">5 min</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">to compare options</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            type="button"
            className="btn btn-primary sm:order-2 flex items-center justify-center"
            onClick={onCompareOptions}
          >
            <Check className="mr-2 h-4 w-4" />
            Compare My Options
          </button>
          <button
            type="button"
            className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium sm:order-1"
            onClick={onContinueTransfer}
          >
            I Still Want to Transfer
            <ArrowRight className="ml-1 h-4 w-4 inline" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferEducationModal;