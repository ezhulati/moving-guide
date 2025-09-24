import { useState, ReactNode } from 'react';
import { HelpCircle, X, AlertTriangle, Info } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ContextualHelpProps {
  title: string;
  children: ReactNode;
  className?: string;
  theme?: 'info' | 'success' | 'warning';
  dismissable?: boolean;
  icon?: ReactNode;
}

const ContextualHelp: React.FC<ContextualHelpProps> = ({
  title,
  children,
  className,
  theme = 'info',
  dismissable = true,
  icon
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const themeStyles = {
    info: {
      container: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
      title: 'text-blue-800 dark:text-blue-200',
      content: 'text-blue-700 dark:text-blue-300',
      icon: icon || <Info className="h-5 w-5 text-blue-500 dark:text-blue-400" />
    },
    success: {
      container: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
      title: 'text-green-800 dark:text-green-200',
      content: 'text-green-700 dark:text-green-300',
      icon: icon || <HelpCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800',
      title: 'text-amber-800 dark:text-amber-200',
      content: 'text-amber-700 dark:text-amber-300',
      icon: icon || <AlertTriangle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
    }
  };

  const styles = themeStyles[theme];

  return (
    <div className={cn(
      'rounded-lg border p-4 animate-fade-in',
      styles.container,
      className
    )}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-1">
          {styles.icon}
        </div>
        <div className="ml-3 flex-grow">
          <div className="flex justify-between items-start">
            <h3 className={cn('text-sm font-medium mb-1', styles.title)}>{title}</h3>
            {dismissable && (
              <button
                type="button"
                className="ml-2 -mr-1 -mt-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                onClick={() => setIsDismissed(true)}
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className={cn('text-sm', styles.content)}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextualHelp;