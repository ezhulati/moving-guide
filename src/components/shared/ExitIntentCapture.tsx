import { useState, useEffect } from 'react';
import { Clock, AlertTriangle, ArrowLeft, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ExitIntentCaptureProps {
  onStay: () => void;
  onLeave: () => void;
  progressPercentage: number;
  timeInvested?: number; // in minutes
}

const ExitIntentCapture: React.FC<ExitIntentCaptureProps> = ({
  onStay,
  onLeave,
  progressPercentage,
  timeInvested = 2
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [exitPoint, setExitPoint] = useState<{ x: number, y: number } | null>(null);
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse moves toward the top of the page
      if (e.clientY <= 5) {
        setExitPoint({ x: e.clientX, y: e.clientY });
        
        // Small delay to prevent accidental triggers
        timeout = setTimeout(() => {
          setIsVisible(true);
        }, 100);
      }
    };
    
    // We only want to add the event listener if:
    // 1. User has made some progress (above 10%)
    // 2. We haven't shown the exit intent modal already in this session
    if (progressPercentage > 10) {
      document.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timeout);
    };
  }, [progressPercentage]);
  
  const handleDismiss = () => {
    setIsVisible(false);
  };
  
  const handleStay = () => {
    setIsVisible(false);
    if (onStay) onStay();
  };
  
  const handleLeave = () => {
    setIsVisible(false);
    if (onLeave) onLeave();
  };
  
  if (!isVisible) return null;
  
  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 overflow-y-auto",
        "animate-fade-in"
      )}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          onClick={handleDismiss}
        ></div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div 
          className={cn(
            "inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full",
            "animate-slide-up"
          )}
          style={{
            transformOrigin: exitPoint ? `${exitPoint.x}px ${exitPoint.y}px` : undefined
          }}
        >
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/50 sm:mx-0 sm:h-10 sm:w-10">
                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-500" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                  Wait! You're so close!
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    You've already completed {Math.round(progressPercentage)}% of your power setup. Just a few more minutes and you'll be all set!
                  </p>
                  
                  <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md">
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-amber-500 dark:text-amber-400 mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                          You've invested {timeInvested} {timeInvested === 1 ? 'minute' : 'minutes'} already
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                          Your progress is saved, but finishing now is much faster than starting over later.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 mr-2" />
                      <p className="text-sm text-green-700 dark:text-green-300">
                        You're just {100 - Math.round(progressPercentage)}% away from having your electricity set up and ready to go!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 dark:bg-primary-500 text-base font-medium text-white hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleStay}
            >
              Finish Setup Now
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleLeave}
            >
              Save & Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitIntentCapture;