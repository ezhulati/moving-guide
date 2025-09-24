import React, { useState, useEffect, ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface SmartFormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  helpText?: string;
  tooltip?: string;
  validation?: (value: string) => string | null;
  className?: string;
  icon?: ReactNode;
  autoValidate?: boolean;
  showSuccessIndicator?: boolean;
  maxLength?: number;
  min?: string;
  max?: string;
}

const SmartFormField: React.FC<SmartFormFieldProps> = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  required = false,
  helpText,
  tooltip,
  validation,
  className,
  icon,
  autoValidate = true,
  showSuccessIndicator = true,
  maxLength,
  min,
  max
}) => {
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);

  // Validate input when value changes or on blur
  useEffect(() => {
    if (!autoValidate || !touched) return;
    
    if (validation) {
      const validationResult = validation(value);
      setError(validationResult);
      setIsValid(!validationResult && value.length > 0);
    } else if (required && !value) {
      setError(`${label} is required`);
      setIsValid(false);
    } else {
      setError(null);
      setIsValid(value.length > 0);
    }
  }, [value, validation, required, touched, autoValidate, label]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // Handle maxLength
    if (maxLength && newValue.length > maxLength) {
      newValue = newValue.slice(0, maxLength);
    }
    
    onChange(newValue);
  };

  const handleBlur = () => {
    setTouched(true);
    setHasFocus(false);
    
    if (onBlur) onBlur();
    
    // Validate on blur even if autoValidate is false
    if (validation) {
      const validationResult = validation(value);
      setError(validationResult);
      setIsValid(!validationResult && value.length > 0);
    } else if (required && !value) {
      setError(`${label} is required`);
      setIsValid(false);
    } else {
      setError(null);
      setIsValid(value.length > 0);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="flex justify-between items-center mb-1">
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
        >
          {label} 
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {tooltip && (
          <div className="relative">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
              aria-label="Show help information"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
            
            {showTooltip && (
              <div className="absolute right-0 z-10 mt-1 w-64 p-2 bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-100 text-xs rounded shadow-lg">
                {tooltip}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          id={id}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={() => setHasFocus(true)}
          className={cn(
            "input w-full",
            icon ? "pl-10" : "",
            (isValid && showSuccessIndicator) ? "pr-10" : "",
            error ? "border-red-500 dark:border-red-700 focus:border-red-500 dark:focus:border-red-700 focus:ring-red-500 dark:focus:ring-red-700" : "",
            isValid && showSuccessIndicator ? "border-success-500 dark:border-success-700 focus:border-success-500 dark:focus:border-success-700 focus:ring-success-500 dark:focus:ring-success-700" : "",
            hasFocus ? "border-primary-500 dark:border-primary-700 focus:border-primary-500 dark:focus:border-primary-700 focus:ring-primary-500 dark:focus:ring-primary-700" : ""
          )}
          placeholder={placeholder}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
          maxLength={maxLength}
          min={min}
          max={max}
        />
        
        {isValid && showSuccessIndicator && !error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <CheckCircle2 className="h-5 w-5 text-success-500 dark:text-success-400" />
          </div>
        )}
      </div>
      
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center" role="alert">
          <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
          {error}
        </p>
      ) : helpText ? (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helpText}</p>
      ) : null}
    </div>
  );
};

export default SmartFormField;