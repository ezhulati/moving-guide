import { useState, useEffect, ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface WizardStepTransitionProps {
  children: ReactNode;
  show: boolean;
  direction?: 'left-to-right' | 'right-to-left' | 'fade';
}

const WizardStepTransition: React.FC<WizardStepTransitionProps> = ({
  children,
  show,
  direction = 'fade'
}) => {
  const [shouldRender, setShouldRender] = useState(show);
  const [animationClass, setAnimationClass] = useState('');
  
  useEffect(() => {
    if (show) {
      setShouldRender(true);
      
      // Set initial animation state
      if (direction === 'left-to-right') {
        setAnimationClass('translate-x-full opacity-0');
      } else if (direction === 'right-to-left') {
        setAnimationClass('-translate-x-full opacity-0');
      } else {
        setAnimationClass('opacity-0');
      }
      
      // Move to visible state
      setTimeout(() => {
        setAnimationClass('translate-x-0 opacity-100');
      }, 50);
    } else {
      // Move to exit state
      if (direction === 'left-to-right') {
        setAnimationClass('-translate-x-full opacity-0');
      } else if (direction === 'right-to-left') {
        setAnimationClass('translate-x-full opacity-0');
      } else {
        setAnimationClass('opacity-0');
      }
      
      // Remove from DOM after animation completes
      setTimeout(() => {
        setShouldRender(false);
      }, 300);
    }
  }, [show, direction]);
  
  if (!shouldRender) return null;
  
  return (
    <div
      className={cn(
        "transition-all transform duration-300 ease-in-out w-full",
        animationClass
      )}
    >
      {children}
    </div>
  );
};

export default WizardStepTransition;