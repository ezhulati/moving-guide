import { useEffect, useState, useRef } from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import { cn } from '../../utils/cn';

interface UsageVisualizerProps {
  className?: string;
  baseUsage: number;
  rate: number;
  title?: string;
  comparison?: {
    label: string;
    usage: number;
    rate: number;
  };
}

const UsageVisualizer: React.FC<UsageVisualizerProps> = ({
  className,
  baseUsage,
  rate,
  title = 'Estimated Usage',
  comparison
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [barHeight, setBarHeight] = useState(0);
  const [comparisonBarHeight, setComparisonBarHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate base cost
  const baseCost = (baseUsage * rate) / 100;
  
  // Calculate comparison cost if provided
  const comparisonCost = comparison ? (comparison.usage * comparison.rate) / 100 : null;
  
  // Calculate savings or additional cost
  const difference = comparisonCost !== null ? baseCost - comparisonCost : null;
  const percentDifference = comparisonCost !== null 
    ? Math.round((baseCost - comparisonCost) / comparisonCost * 100) 
    : null;
  
  // Animate the bars when component mounts
  useEffect(() => {
    setIsVisible(true);
    
    // Max value for scaling (3000 kWh or the larger of the two usages)
    const maxValue = Math.max(3000, baseUsage, comparison?.usage || 0);
    
    // Calculate heights as percentages
    const baseHeightPercent = Math.min(100, (baseUsage / maxValue) * 100);
    const comparisonHeightPercent = comparison 
      ? Math.min(100, (comparison.usage / maxValue) * 100)
      : 0;
    
    // Animate bars growing
    const timer = setTimeout(() => {
      setBarHeight(baseHeightPercent);
      setComparisonBarHeight(comparisonHeightPercent);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [baseUsage, comparison]);
  
  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "bg-white rounded-lg border border-gray-200 p-4 shadow-sm",
        isVisible ? "opacity-100" : "opacity-0",
        "transition-opacity duration-500",
        className
      )}
    >
      <h3 className="text-sm font-medium text-gray-900 mb-3">{title}</h3>
      
      <div className="flex items-end justify-around h-48">
        {/* Base usage bar */}
        <div className="flex flex-col items-center w-24">
          <div className="text-sm font-medium mb-2 text-center">Your Usage</div>
          <div className="relative w-full h-36">
            <div className="absolute bottom-0 left-0 right-0 bg-gray-200 h-full rounded-t-lg"></div>
            <div 
              className="absolute bottom-0 left-0 right-0 bg-primary-500 rounded-t-lg transition-all duration-1000 ease-out"
              style={{ height: `${barHeight}%` }}
            ></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <span className="text-lg font-bold">{baseUsage} kWh</span>
              <span className="text-xs">{formatCurrency(baseCost)}/mo</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">{rate}¢/kWh</div>
        </div>
        
        {/* Comparison bar if provided */}
        {comparison && (
          <>
            <div className="h-36 flex items-center">
              {difference !== null && (
                <div 
                  className={cn(
                    "flex items-center text-sm font-bold px-2 py-1 rounded",
                    difference > 0 
                      ? "text-green-700 bg-green-100" 
                      : "text-red-700 bg-red-100"
                  )}
                >
                  {difference > 0 ? (
                    <>
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                      Save {formatCurrency(difference)}/mo
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      {formatCurrency(Math.abs(difference))}/mo more
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-center w-24">
              <div className="text-sm font-medium mb-2 text-center">{comparison.label}</div>
              <div className="relative w-full h-36">
                <div className="absolute bottom-0 left-0 right-0 bg-gray-200 h-full rounded-t-lg"></div>
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-gray-500 rounded-t-lg transition-all duration-1000 ease-out"
                  style={{ height: `${comparisonBarHeight}%` }}
                ></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <span className="text-lg font-bold">{comparison.usage} kWh</span>
                  <span className="text-xs">{formatCurrency(comparisonCost || 0)}/mo</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">{comparison.rate}¢/kWh</div>
            </div>
          </>
        )}
      </div>
      
      {/* Additional info */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-start">
          <DollarSign className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
          <p className="text-xs text-gray-600">
            {comparison ? (
              <>
                {percentDifference !== null && percentDifference > 0 ? (
                  <span>You could save approximately {percentDifference}% with the proposed plan compared to {comparison.label}.</span>
                ) : (
                  <span>The proposed plan would cost approximately {Math.abs(percentDifference || 0)}% more than {comparison.label}.</span>
                )}
              </>
            ) : (
              <span>Average annual cost at this usage level is {formatCurrency(baseCost * 12)}. Consider how seasonal usage may affect your bill.</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UsageVisualizer;