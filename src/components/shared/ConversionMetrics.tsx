import { useState, useEffect } from 'react';
import { useWizard } from '../../context/WizardContext';
import { BarChart3, Clock, XCircle, ArrowUpCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ConversionMetricsProps {
  visible?: boolean;
  className?: string;
}

const ConversionMetrics: React.FC<ConversionMetricsProps> = ({
  visible = true,
  className
}) => {
  const { wizardState } = useWizard();
  const [funnelStats, setFunnelStats] = useState({
    totalSteps: 11,
    completedSteps: 0,
    completionRate: 0,
    averageTimePerStep: 0,
    abandonmentPoints: []
  });
  const [isVisible, setIsVisible] = useState(visible);
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed by default
  const [isHovering, setIsHovering] = useState(false);

  // Calculate funnel statistics
  useEffect(() => {
    if (!wizardState.funnel) return;
    
    // Calculate completed steps
    const completedSteps = wizardState.funnel.completedSteps.length;
    
    // Calculate average time per step (in seconds)
    let totalTime = 0;
    let stepCount = 0;
    
    Object.entries(wizardState.funnel.timeOnSteps || {}).forEach(([step, time]) => {
      totalTime += (time as number);
      stepCount++;
    });
    
    const averageTime = stepCount > 0 ? Math.round(totalTime / stepCount / 1000) : 0;
    
    // Calculate completion rate
    const completionRate = Math.round((completedSteps / funnelStats.totalSteps) * 100);
    
    setFunnelStats({
      totalSteps: 11, // Total number of steps in the wizard
      completedSteps,
      completionRate,
      averageTimePerStep: averageTime,
      abandonmentPoints: wizardState.funnel.revisitedSteps || []
    });
  }, [wizardState.funnel]);

  if (!isVisible) return null;

  // Render the floating button when collapsed
  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="fixed bottom-4 right-4 z-40 bg-primary-600 text-white rounded-full p-2 shadow-lg hover:bg-primary-700 transition-colors flex items-center"
        title="View conversion metrics"
      >
        <BarChart3 className="h-5 w-5" />
        <span className="sr-only">View Metrics</span>
      </button>
    );
  }
  
  return (
    <div 
      className={cn(
        "fixed bottom-0 right-0 z-40 transition-all duration-300 transform",
        "bg-white dark:bg-gray-800 rounded-t-lg shadow-lg border border-gray-200 dark:border-gray-700",
        "w-80",
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{ transform: 'translateY(0)' }}
    >
      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-t-lg cursor-pointer"
           onClick={() => setIsCollapsed(true)}>
        <div className="flex items-center">
          <BarChart3 className="h-4 w-4 text-gray-600 dark:text-gray-400 mr-2" />
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Dev Metrics</h3>
        </div>
        <div className="flex">
          <ArrowUpCircle className="h-4 w-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
            }}
            className="ml-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Close metrics panel"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="p-3 max-h-60 overflow-y-auto">
        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-1 text-xs">
            <span className="text-gray-500 dark:text-gray-400">Completion</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{funnelStats.completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                funnelStats.completionRate < 33 ? "bg-red-500" :
                funnelStats.completionRate < 66 ? "bg-amber-500" :
                "bg-green-500"
              )}
              style={{ width: `${funnelStats.completionRate}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {funnelStats.completedSteps} of {funnelStats.totalSteps} steps completed
          </div>
        </div>
        
        {/* Time metrics */}
        <div className="mt-3 flex items-center">
          <Clock className="h-3 w-3 text-gray-500 dark:text-gray-400 mr-1.5" />
          <div>
            <div className="text-xs text-gray-700 dark:text-gray-300">Time per step: 
              <span className="font-medium ml-1">
                {funnelStats.averageTimePerStep > 60 ? 
                  `${Math.floor(funnelStats.averageTimePerStep / 60)}m ${funnelStats.averageTimePerStep % 60}s` : 
                  `${funnelStats.averageTimePerStep}s`}
              </span>
            </div>
          </div>
        </div>
        
        {/* Steps breakdown */}
        <div className="mt-3 text-xs">
          <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">Steps progress:</div>
          <div className="grid grid-cols-11 gap-0.5">
            {Array.from({ length: funnelStats.totalSteps }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 rounded",
                  i < funnelStats.completedSteps ? "bg-primary-500" : "bg-gray-300 dark:bg-gray-600"
                )}
              ></div>
            ))}
          </div>
          <div className="mt-1 text-xxs text-gray-500 dark:text-gray-400 flex justify-between">
            <span>Start</span>
            <span>50%</span>
            <span>Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionMetrics;