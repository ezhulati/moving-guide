import React, { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { usePersonalization } from './PersonalizationEngine';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  className?: string;
  labelClassName?: string;
  required?: boolean;
  children: ReactNode;
  helpText?: string;
}

interface MobileOptimizedFormProps {
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
  children: ReactNode;
}

const MobileOptimizedForm: React.FC<MobileOptimizedFormProps> = ({ 
  onSubmit,
  className,
  children
}) => {
  const { personalizationState } = usePersonalization();
  const isMobile = personalizationState.userBehaviors.deviceType === 'mobile';
  
  // Adjust form styling for mobile
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        "space-y-6",
        isMobile ? "mobile-optimized-form" : "",
        className
      )}
      noValidate
    >
      {children}
      
      {/* Mobile-specific styles */}
      <style jsx>{`
        @media (max-width: 767px) {
          .mobile-optimized-form input, 
          .mobile-optimized-form select, 
          .mobile-optimized-form textarea {
            font-size: 16px !important; /* Prevent iOS zoom */
            padding-top: 0.75rem;
            padding-bottom: 0.75rem;
          }
          
          .mobile-optimized-form button[type="submit"] {
            padding-top: 0.875rem;
            padding-bottom: 0.875rem;
            width: 100%;
            position: sticky;
            bottom: 1rem;
            z-index: 10;
          }
        }
      `}</style>
    </form>
  );
};

export const FormField: React.FC<FormFieldProps> = ({ 
  id,
  label,
  error,
  className,
  labelClassName,
  required = false,
  children,
  helpText
}) => {
  const { personalizationState } = usePersonalization();
  const isMobile = personalizationState.userBehaviors.deviceType === 'mobile';
  
  return (
    <div className={cn(
      "relative", 
      isMobile ? "mb-6" : "", 
      className
    )}>
      <label 
        htmlFor={id} 
        className={cn(
          "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
          isMobile ? "text-base" : "",
          labelClassName
        )}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {children}
      
      {helpText && !error && (
        <p className={cn(
          "mt-1 text-xs text-gray-500 dark:text-gray-400",
          isMobile ? "text-sm" : ""
        )}>
          {helpText}
        </p>
      )}
      
      {error && (
        <p className={cn(
          "mt-1 text-sm text-red-600 dark:text-red-400",
          isMobile ? "text-base font-medium" : ""
        )}>
          {error}
        </p>
      )}
    </div>
  );
};

export default MobileOptimizedForm;