import { useState, useEffect, ReactNode } from 'react';
import { X, Bell, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '../../utils/cn';

type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface NotificationProps {
  title: string;
  message: ReactNode;
  type?: NotificationType;
  duration?: number; // in ms, 0 for permanent
  onClose?: () => void;
  actions?: Array<{
    label: string;
    onClick: () => void;
    primary?: boolean;
  }>;
  showIcon?: boolean;
  className?: string;
  showCloseButton?: boolean;
}

const Notification: React.FC<NotificationProps> = ({
  title,
  message,
  type = 'info',
  duration = 5000,
  onClose,
  actions = [],
  showIcon = true,
  className,
  showCloseButton = true
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  
  // Apply appropriate icon and colors based on type
  const notificationStyles = {
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-500',
      icon: <Info />
    },
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-500',
      icon: <CheckCircle />
    },
    warning: {
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-800',
      iconColor: 'text-amber-500',
      icon: <AlertTriangle />
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-500',
      icon: <AlertTriangle />
    }
  };
  
  const styles = notificationStyles[type];
  
  // Handle auto-dismiss if duration is set
  useEffect(() => {
    if (duration === 0 || isPaused) return;
    
    const startTime = Date.now();
    const endTime = startTime + duration;
    
    const progressInterval = setInterval(() => {
      const now = Date.now();
      const remaining = endTime - now;
      const newProgress = (remaining / duration) * 100;
      
      if (newProgress <= 0) {
        clearInterval(progressInterval);
        setIsVisible(false);
        setTimeout(() => {
          if (onClose) onClose();
        }, 300); // Allow exit animation to complete
      } else {
        setProgress(newProgress);
      }
    }, 16);
    
    return () => clearInterval(progressInterval);
  }, [duration, isPaused, onClose]);
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300); // Allow exit animation to complete
  };
  
  return (
    <div
      className={cn(
        styles.bgColor,
        'border rounded-lg shadow-md',
        'transition-all duration-300',
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2',
        className
      )}
      role="alert"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="p-4">
        <div className="flex">
          {showIcon && (
            <div className={cn('flex-shrink-0', styles.iconColor)}>
              <div className="w-5 h-5">
                {styles.icon}
              </div>
            </div>
          )}
          
          <div className={cn('ml-3', showIcon ? '' : 'ml-0')}>
            <h3 className={cn('text-sm font-medium', styles.textColor)}>
              {title}
            </h3>
            <div className={cn('mt-2 text-sm', styles.textColor, typeof message === 'string' ? '' : 'space-y-1')}>
              {message}
            </div>
            
            {actions.length > 0 && (
              <div className="mt-3 flex space-x-3">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    type="button"
                    className={cn(
                      'text-sm font-medium rounded-md px-3 py-1.5',
                      action.primary
                        ? 'text-white bg-primary-600 hover:bg-primary-700'
                        : `${styles.textColor} bg-white hover:bg-gray-50 border border-gray-300`
                    )}
                    onClick={action.onClick}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {showCloseButton && (
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  className={cn(
                    'inline-flex rounded-md p-1.5',
                    styles.textColor,
                    'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                  )}
                  onClick={handleClose}
                >
                  <span className="sr-only">Dismiss</span>
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {duration > 0 && (
        <div 
          className="h-1 bg-current opacity-25 rounded-b-lg transition-all duration-100"
          style={{ width: `${progress}%` }}
        ></div>
      )}
    </div>
  );
};

export default Notification;