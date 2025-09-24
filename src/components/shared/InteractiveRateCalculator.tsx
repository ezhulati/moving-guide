import { useState, useEffect } from 'react';
import { Calculator, DollarSign, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';

interface InteractiveRateCalculatorProps {
  className?: string;
  ratePerKwh?: number;
  initialUsage?: number;
  onCalculate?: (monthlyCost: number, annualCost: number, usage: number) => void;
}

const InteractiveRateCalculator: React.FC<InteractiveRateCalculatorProps> = ({
  className,
  ratePerKwh = 10.9,
  initialUsage = 1000,
  onCalculate
}) => {
  const [usage, setUsage] = useState(initialUsage);
  const [monthlyCost, setMonthlyCost] = useState(0);
  const [annualCost, setAnnualCost] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [animateValue, setAnimateValue] = useState(false);

  // Common usage presets
  const usagePresets = [
    { label: 'Small Apt', value: 500 },
    { label: 'Average Home', value: 1000 },
    { label: 'Large Home', value: 2000 }
  ];

  // Calculate costs when usage changes
  useEffect(() => {
    const monthlyRate = (ratePerKwh / 100) * usage;
    setMonthlyCost(monthlyRate);
    setAnnualCost(monthlyRate * 12);
    
    if (onCalculate) {
      onCalculate(monthlyRate, monthlyRate * 12, usage);
    }

    // Subtle animation when values change
    setAnimateValue(true);
    const timeout = setTimeout(() => setAnimateValue(false), 300);
    return () => clearTimeout(timeout);
  }, [usage, ratePerKwh, onCalculate]);

  const handleUsageChange = (newUsage: number) => {
    setUsage(newUsage);
    setShowResults(true);
  };

  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm", 
      className
    )}>
      <div className="bg-primary-50 dark:bg-primary-900/30 p-4 border-b border-primary-100 dark:border-primary-800 flex items-center">
        <Calculator className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
        <h3 className="text-base font-medium text-primary-900 dark:text-primary-100">Electricity Cost Calculator</h3>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <label htmlFor="usage-slider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Monthly Usage: <span className="font-semibold">{usage} kWh</span>
          </label>
          <input
            type="range"
            id="usage-slider"
            min="300"
            max="3000"
            step="50"
            value={usage}
            onChange={(e) => handleUsageChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>300 kWh</span>
            <span>1500 kWh</span>
            <span>3,000 kWh</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {usagePresets.map(preset => (
            <button
              key={preset.value}
              type="button"
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors shadow-sm",
                usage === preset.value ? 
                  "bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-200 border border-primary-200 dark:border-primary-800" : 
                  "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-transparent"
              )}
              onClick={() => handleUsageChange(preset.value)}
            >
              {preset.label} ({preset.value} kWh)
            </button>
          ))}
        </div>
        
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <DollarSign className="h-4 w-4 text-primary-600 dark:text-primary-400 mr-1" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Monthly Cost</span>
              </div>
              <div className={cn(
                "text-2xl font-bold text-primary-700 dark:text-primary-300",
                animateValue && "scale-105 transition-transform"
              )}>
                ${monthlyCost.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                at {ratePerKwh}¢/kWh
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Clock className="h-4 w-4 text-primary-600 dark:text-primary-400 mr-1" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Annual Cost</span>
              </div>
              <div className={cn(
                "text-2xl font-bold text-primary-700 dark:text-primary-300",
                animateValue && "scale-105 transition-transform"
              )}>
                ${annualCost.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                for 12 months of service
              </div>
            </div>
          </div>
        </div>
        
        {showResults && (
          <div className="mt-4 text-xs text-gray-600 dark:text-gray-300 bg-primary-50 dark:bg-primary-900/30 p-2 rounded-lg border border-primary-100 dark:border-primary-800">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5 mr-2">
                <ElectricityIcon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              </div>
              <p>
                A typical {usage < 800 ? 'apartment' : 'home'} in Texas with {usage} kWh monthly usage 
                would cost about ${monthlyCost.toFixed(2)} per month with this plan.
              </p>
            </div>
          </div>
        )}
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

export default InteractiveRateCalculator;