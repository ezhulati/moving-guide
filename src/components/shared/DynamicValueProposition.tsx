import { useState, useEffect } from 'react';
import { CheckCircle, DollarSign, Clock, ShieldCheck, Menu, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface DynamicValuePropositionProps {
  className?: string;
  variant?: 'normal' | 'compact' | 'detailed';
  autoRotate?: boolean;
  rotationInterval?: number; // in milliseconds
}

interface ValueProp {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  highlight?: boolean;
}

const DynamicValueProposition: React.FC<DynamicValuePropositionProps> = ({
  className,
  variant = 'normal',
  autoRotate = true,
  rotationInterval = 5000
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);

  // Define value propositions
  const valueProps: ValueProp[] = [
    {
      id: 'same-day',
      title: 'Same-Day Power',
      description: 'Get your electricity connected today if you order by 5PM.',
      icon: <ElectricityIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />,
      highlight: true
    },
    {
      id: 'savings',
      title: 'Save $350/year',
      description: 'Our customers save an average of $350 annually on electricity.',
      icon: <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
    },
    {
      id: 'instant-proof',
      title: 'Instant Proof',
      description: 'Get immediate proof of service documents for your leasing office.',
      icon: <CheckCircle className="h-6 w-6 text-primary-600 dark:text-primary-400" />
    },
    {
      id: 'quick-setup',
      title: '5-Minute Setup',
      description: 'Complete your electricity setup in just five minutes.',
      icon: <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
    },
    {
      id: 'no-deposit',
      title: 'No-Deposit Options',
      description: 'Many plans available with no security deposit required.',
      icon: <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
    },
    {
      id: 'online-signup',
      title: '100% Online Signup',
      description: 'Compare, choose, and enroll without ever leaving our site.',
      icon: <DeviceIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
    }
  ];

  // Auto-rotate through value props
  useEffect(() => {
    if (!autoRotate || isHovering) return;
    
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % valueProps.length);
        setFadeIn(true);
      }, 300);
    }, rotationInterval);
    
    return () => clearInterval(interval);
  }, [autoRotate, valueProps.length, rotationInterval, isHovering]);

  // Different rendering based on variant
  if (variant === 'compact') {
    return (
      <div 
        className={cn("bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm", className)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-3">
            {valueProps[activeIndex].icon}
          </div>
          <div className={cn("transition-opacity duration-300", fadeIn ? "opacity-100" : "opacity-0")}>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">{valueProps[activeIndex].title}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">{valueProps[activeIndex].description}</p>
          </div>
        </div>
        
        <div className="mt-2 flex justify-center space-x-1">
          {valueProps.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                index === activeIndex 
                  ? "bg-primary-600 dark:bg-primary-500" 
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              )}
              onClick={() => {
                setFadeIn(false);
                setTimeout(() => {
                  setActiveIndex(index);
                  setFadeIn(true);
                }, 300);
              }}
              aria-label={`View value proposition ${index + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }
  
  if (variant === 'detailed') {
    return (
      <div 
        className={cn("bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md p-8", className)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">Why Texans Choose ComparePower</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {valueProps.map((prop) => (
            <div 
              key={prop.id}
              className={cn(
                "p-5 rounded-lg transition-all h-full flex flex-col",
                prop.highlight 
                  ? "bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800 shadow-sm" 
                  : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm hover:shadow"
              )}
            >
              <div className="flex items-center mb-4">
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center mr-3",
                  prop.highlight
                    ? "bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                )}>
                  {prop.icon}
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">{prop.title}</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300 flex-1">{prop.description}</p>
              
              {prop.highlight && (
                <div className="mt-4 flex justify-end">
                  <span className="inline-flex items-center text-xs font-medium bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 px-2 py-1 rounded">
                    Most Popular Feature
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Default 'normal' variant - redesigned for better balance
  return (
    <div 
      className={cn("p-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">Why Texans Choose ComparePower</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 mb-8">
        {valueProps.map((prop, index) => (
          <button
            key={prop.id}
            className={cn(
              "flex flex-col items-center p-4 rounded-lg text-sm transition-all",
              index === activeIndex
                ? "bg-primary-50 dark:bg-primary-900/50 text-primary-800 dark:text-primary-200 border border-primary-200 dark:border-primary-800 shadow-sm"
                : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
            onClick={() => {
              setFadeIn(false);
              setTimeout(() => {
                setActiveIndex(index);
                setFadeIn(true);
              }, 300);
            }}
          >
            <div className="mb-3">
              {prop.icon}
            </div>
            <span className="font-medium text-center line-clamp-2">{prop.title}</span>
          </button>
        ))}
      </div>
      
      <div 
        className={cn(
          "mt-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg p-6 border border-primary-100 dark:border-primary-800 transition-opacity duration-300 shadow-sm",
          fadeIn ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-4 p-4 bg-white dark:bg-gray-800 rounded-full shadow-sm">
            {valueProps[activeIndex].icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-primary-800 dark:text-primary-200">{valueProps[activeIndex].title}</h3>
            <p className="mt-1 text-primary-700 dark:text-primary-300">{valueProps[activeIndex].description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom electricity icon
function ElectricityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13 10V3L4 14H11V21L20 10H13Z" />
    </svg>
  );
}

// Custom device/computer icon for online enrollment
function DeviceIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <line x1="8" y1="21" x2="16" y2="21"></line>
      <line x1="12" y1="17" x2="12" y2="21"></line>
    </svg>
  );
}

export default DynamicValueProposition;