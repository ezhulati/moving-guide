import { useEffect, useState } from 'react';
import { SettingsIcon as ConfettiIcon, ThumbsUp, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ProgressCelebrationProps {
  step: string;
  title: string;
  message: string;
  type?: 'milestone' | 'completion' | 'progress';
  onDismiss?: () => void;
}

const ProgressCelebration: React.FC<ProgressCelebrationProps> = ({
  step,
  title,
  message,
  type = 'progress',
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show the celebration after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    // Auto-dismiss after a certain time if it's just a progress update
    let dismissTimer: NodeJS.Timeout;
    if (type === 'progress') {
      dismissTimer = setTimeout(() => {
        handleDismiss();
      }, 5000);
    }

    return () => {
      clearTimeout(timer);
      if (type === 'progress') {
        clearTimeout(dismissTimer);
      }
    };
  }, [type]);

  const handleDismiss = () => {
    setIsVisible(false);
    // Wait for animation to complete before removing from DOM
    setTimeout(() => {
      setIsDismissed(true);
      if (onDismiss) onDismiss();
    }, 300);
  };

  if (isDismissed) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40" onClick={handleDismiss}></div>
      
      <div className={cn(
        "relative bg-white rounded-lg shadow-xl transform transition-all duration-300 max-w-md w-full",
        isVisible ? "translate-y-0 scale-100" : "translate-y-4 scale-95",
        type === 'completion' ? "border-4 border-success-500" : ""
      )}>
        <div className={cn(
          "p-6",
          type === 'milestone' ? "bg-primary-50" : 
          type === 'completion' ? "bg-success-50" : "bg-white"
        )}>
          <div className="flex justify-between items-start">
            <div className={cn(
              "flex items-center justify-center h-12 w-12 rounded-full",
              type === 'milestone' ? "bg-primary-100 text-primary-600" :
              type === 'completion' ? "bg-success-100 text-success-600" : "bg-blue-100 text-blue-600"
            )}>
              {type === 'milestone' ? (
                <Award className="h-6 w-6" />
              ) : type === 'completion' ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <ThumbsUp className="h-6 w-6" />
              )}
            </div>
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={handleDismiss}
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mt-4">
            <h3 className={cn(
              "text-lg font-bold",
              type === 'milestone' ? "text-primary-800" :
              type === 'completion' ? "text-success-800" : "text-gray-900"
            )}>
              {title}
            </h3>
            <p className={cn(
              "mt-2",
              type === 'milestone' ? "text-primary-700" :
              type === 'completion' ? "text-success-700" : "text-gray-600"
            )}>
              {message}
            </p>
          </div>
          
          <div className="mt-5">
            <button
              type="button"
              className={cn(
                "w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm",
                type === 'milestone' ? "bg-primary-600 hover:bg-primary-700 text-white" :
                type === 'completion' ? "bg-success-600 hover:bg-success-700 text-white" : 
                "bg-blue-600 hover:bg-blue-700 text-white"
              )}
              onClick={handleDismiss}
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCelebration;