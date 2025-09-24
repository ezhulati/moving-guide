import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
  action?: {
    text: string;
    onClick: () => void;
  };
}

const toastIcons = {
  success: <CheckCircle className="h-5 w-5" />,
  error: <AlertCircle className="h-5 w-5" />,
  info: <Info className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
};

const toastStyles = {
  success: 'bg-success-50 border-success-500 text-success-800 dark:bg-success-900/30 dark:border-success-600 dark:text-success-300',
  error: 'bg-error-50 border-error-500 text-error-800 dark:bg-error-900/30 dark:border-error-600 dark:text-error-300',
  info: 'bg-primary-50 border-primary-500 text-primary-800 dark:bg-primary-900/30 dark:border-primary-600 dark:text-primary-300',
  warning: 'bg-warning-50 border-warning-500 text-warning-800 dark:bg-warning-900/30 dark:border-warning-600 dark:text-warning-300',
};

const iconStyles = {
  success: 'text-success-500 dark:text-success-400',
  error: 'text-error-500 dark:text-error-400',
  info: 'text-primary-500 dark:text-primary-400',
  warning: 'text-warning-500 dark:text-warning-400',
};

export const Toast: React.FC<ToastProps> = ({ 
  id, 
  type, 
  message, 
  duration = 5000, 
  onClose,
  action
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    // Set up the progress bar timer
    const startTime = Date.now();
    const endTime = startTime + duration;
    
    const progressInterval = setInterval(() => {
      const now = Date.now();
      const remaining = endTime - now;
      const newProgress = (remaining / duration) * 100;
      
      if (newProgress <= 0) {
        clearInterval(progressInterval);
        setIsVisible(false);
        setTimeout(() => onClose(id), 300); // Allow exit animation to complete
      } else {
        setProgress(newProgress);
      }
    }, 16);

    return () => clearInterval(progressInterval);
  }, [duration, id, onClose, isPaused]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 300); // Allow exit animation to complete
  };

  return (
    <div 
      className={cn(
        'fixed bottom-4 right-4 max-w-md border-l-4 rounded shadow-lg py-3 px-4 transition-all duration-300 flex items-start',
        toastStyles[type],
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      )}
      role="alert"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-live="assertive"
    >
      <div className={cn('flex-shrink-0 mr-3', iconStyles[type])}>
        {toastIcons[type]}
      </div>
      <div className="flex-1 mr-2">
        <p className="font-medium">{message}</p>
        {action && (
          <button 
            onClick={action.onClick}
            className="mt-1 text-sm font-medium underline hover:no-underline"
          >
            {action.text}
          </button>
        )}
      </div>
      <button 
        onClick={handleClose}
        className="flex-shrink-0 ml-auto -mr-1 -mt-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 rounded"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>
      <div 
        className="absolute bottom-0 left-0 h-1 bg-current opacity-40 transition-all duration-100" 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default Toast;