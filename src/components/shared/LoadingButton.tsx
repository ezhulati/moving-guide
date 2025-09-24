import { ReactNode, useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { cn } from '../../utils/cn';

interface LoadingButtonProps {
  children: ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  spinnerPosition?: 'left' | 'right';
  loadingText?: string;
  icon?: ReactNode;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  type = 'button',
  fullWidth = false,
  spinnerPosition = 'left',
  loadingText,
  icon
}) => {
  const [showSpinner, setShowSpinner] = useState(isLoading);
  
  // Handle loading state changes with a slight delay for better UX
  useEffect(() => {
    if (isLoading) {
      setShowSpinner(true);
    } else {
      const timer = setTimeout(() => setShowSpinner(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
  };
  
  // Size styles
  const sizeStyles = {
    sm: 'py-1 px-3 text-xs',
    md: 'py-2 px-4 text-sm',
    lg: 'py-3 px-6 text-base'
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-md',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'transition-all duration-200',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'w-full' : '',
        (disabled || isLoading) ? 'opacity-70 cursor-not-allowed' : '',
        className
      )}
    >
      {showSpinner && spinnerPosition === 'left' && (
        <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
      )}
      
      {!isLoading && icon && <span className="mr-2">{icon}</span>}
      
      <span className={cn(isLoading ? 'opacity-0 absolute' : 'opacity-100', 'transition-opacity')}>
        {children}
      </span>
      
      {isLoading && (
        <span className="absolute">{loadingText || children}</span>
      )}
      
      {showSpinner && spinnerPosition === 'right' && (
        <Loader className="animate-spin ml-2 -mr-1 h-4 w-4" />
      )}
    </button>
  );
};

export default LoadingButton;