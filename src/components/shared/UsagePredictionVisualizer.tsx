import { useEffect, useState, useRef } from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign, Info, Clock, LineChart } from 'lucide-react';
import { useWizard } from '../../context/WizardContext';
import { cn } from '../../utils/cn';

interface UsagePredictionVisualizerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

const UsagePredictionVisualizer: React.FC<UsagePredictionVisualizerProps> = ({
  className,
  size = 'md',
  showDetails = false
}) => {
  const { wizardState } = useWizard();
  const [usageData, setUsageData] = useState<{
    monthly: number[];
    annual: number;
    peakMonth: { month: string; usage: number };
    lowestMonth: { month: string; usage: number };
  }>({
    monthly: Array(12).fill(0),
    annual: 0,
    peakMonth: { month: 'August', usage: 0 },
    lowestMonth: { month: 'April', usage: 0 }
  });
  const [animateChart, setAnimateChart] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Calculate predicted usage based on home profile
    const calculateUsage = () => {
      // Base monthly usage
      let baseUsage = 0;
      
      // Square footage contribution (avg 0.5 kWh per sq ft per month)
      baseUsage += (wizardState.homeProfile.squareFootage || 1500) * 0.5;
      
      // Occupants contribution (avg 300 kWh per person per month)
      baseUsage += (wizardState.homeProfile.occupants || 2) * 300;
      
      // Special features
      if (wizardState.homeProfile.hasEV) baseUsage += 300; // EV charging
      if (wizardState.homeProfile.hasPool) baseUsage += 500; // Pool equipment
      if (wizardState.homeProfile.hasSolar) baseUsage -= 400; // Solar panels offset
      
      // Adjust based on property type
      if (wizardState.propertyType === 'apartment' || wizardState.propertyType === 'condo' || wizardState.propertyType === 'townhome') {
        // Shared walls mean better insulation and lower heating/cooling costs
        baseUsage = baseUsage * 0.85;
      }
      
      // Ensure minimum usage
      baseUsage = Math.max(Math.round(baseUsage), 500);
      
      // Create seasonal variation (Texas climate)
      // Summer months (June-September) have higher usage due to A/C
      // Winter months (December-February) have moderate usage for heating
      // Spring/Fall have lower usage
      const seasonalFactors = [
        0.9,  // January
        0.85, // February
        0.8,  // March
        0.7,  // April
        0.9,  // May
        1.3,  // June
        1.5,  // July
        1.6,  // August
        1.2,  // September
        0.85, // October
        0.8,  // November
        0.95  // December
      ];
      
      const monthlyUsage = seasonalFactors.map(factor => Math.round(baseUsage * factor));
      
      // Find peak and lowest months
      let peakUsage = 0;
      let peakMonth = '';
      let lowestUsage = Infinity;
      let lowestMonth = '';
      
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      
      monthlyUsage.forEach((usage, index) => {
        if (usage > peakUsage) {
          peakUsage = usage;
          peakMonth = months[index];
        }
        if (usage < lowestUsage) {
          lowestUsage = usage;
          lowestMonth = months[index];
        }
      });
      
      const annualUsage = monthlyUsage.reduce((sum, usage) => sum + usage, 0);
      
      setUsageData({
        monthly: monthlyUsage,
        annual: annualUsage,
        peakMonth: { month: peakMonth, usage: peakUsage },
        lowestMonth: { month: lowestMonth, usage: lowestUsage }
      });
    };
    
    calculateUsage();
    
    // Trigger animation when component mounts
    setTimeout(() => {
      setAnimateChart(true);
    }, 300);
  }, [
    wizardState.homeProfile.squareFootage,
    wizardState.homeProfile.occupants,
    wizardState.homeProfile.hasEV,
    wizardState.homeProfile.hasPool,
    wizardState.homeProfile.hasSolar,
    wizardState.propertyType
  ]);
  
  // Calculate estimated costs if plan is selected
  const calculateCosts = () => {
    if (!wizardState.selectedPlan.rate) return null;
    
    const rate = wizardState.selectedPlan.rate / 100; // Convert to dollars per kWh
    const monthlyCosts = usageData.monthly.map(usage => Math.round(usage * rate));
    const annualCost = Math.round(usageData.annual * rate);
    const peakCost = Math.round(usageData.peakMonth.usage * rate);
    const lowestCost = Math.round(usageData.lowestMonth.usage * rate);
    
    return {
      monthly: monthlyCosts,
      annual: annualCost,
      peak: peakCost,
      lowest: lowestCost
    };
  };
  
  const costs = calculateCosts();
  
  // Find the average monthly usage
  const avgMonthlyUsage = Math.round(usageData.annual / 12);
  
  // Calculate the maximum usage for proper graph scaling
  const maxUsage = Math.max(...usageData.monthly, 1500); // At least 1500 for scale

  // Size classes based on prop
  const sizeClasses = {
    sm: 'h-32',
    md: 'h-40',
    lg: 'h-52'
  };

  return (
    <div className={cn("dashboard-card", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium text-gray-900 dark:text-white flex items-center">
          <LineChart className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
          Predicted Electricity Usage
        </h3>
        {costs && (
          <div className="text-sm text-primary-700 dark:text-primary-400 font-medium">
            Est. avg. bill: ${Math.round(avgMonthlyUsage * (wizardState.selectedPlan.rate || 0) / 100)}/mo
          </div>
        )}
      </div>
      
      <div className={cn("relative mt-2 overflow-hidden rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30", sizeClasses[size])}>
        {/* Y-axis labels */}
        <div className="absolute inset-y-0 left-0 w-12 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 py-2">
          <span className="text-right w-full pr-2">{Math.round(maxUsage)} kWh</span>
          <span className="text-right w-full pr-2">{Math.round(maxUsage * 0.66)} kWh</span>
          <span className="text-right w-full pr-2">{Math.round(maxUsage * 0.33)} kWh</span>
          <span className="text-right w-full pr-2">0 kWh</span>
        </div>
        
        {/* Chart */}
        <div className="absolute left-12 right-2 top-0 bottom-0 border-l border-gray-200 dark:border-gray-700" ref={chartRef}>
          {/* Horizontal grid lines */}
          <div className="absolute inset-0">
            <div className="h-1/3 border-b border-gray-200 dark:border-gray-700"></div>
            <div className="h-1/3 border-b border-gray-200 dark:border-gray-700"></div>
            <div className="h-1/3"></div>
          </div>
          
          {/* Month bars */}
          <div className="absolute inset-0 flex">
            {usageData.monthly.map((usage, index) => {
              // Calculate bar height percentage based on max usage
              const barHeightPercent = (usage / maxUsage) * 100;
              
              // Determine bar color based on usage intensity
              let barColor = '#2563eb'; // Default blue
              if (usage > maxUsage * 0.75) {
                barColor = '#ef4444'; // Red for high usage
              } else if (usage > maxUsage * 0.5) {
                barColor = '#f59e0b'; // Amber for medium-high usage
              }
              
              return (
                <div key={index} className="flex-1 flex flex-col justify-end px-0.5 group">
                  {/* Usage value tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10">
                    <div className="font-medium">{usage.toLocaleString()} kWh</div>
                    {costs && <div className="text-green-300">${costs.monthly[index]}</div>}
                  </div>
                  
                  {/* Bar */}
                  <div 
                    style={{ 
                      height: animateChart ? `${barHeightPercent}%` : '0%',
                      backgroundColor: barColor,
                      transition: `height 1s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s`
                    }}
                    className="rounded-t w-full"
                  ></div>
                  
                  {/* Month label */}
                  <div className="text-xxs text-gray-500 dark:text-gray-400 text-center mt-1">
                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Summer highlight */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute h-full w-1/3 left-1/3 bg-red-500/5 dark:bg-red-500/10 border-l border-r border-red-200/30 dark:border-red-900/30">
              <div className="text-xxs text-red-500/70 dark:text-red-400/70 text-center pt-1">Summer Peak</div>
            </div>
          </div>
        </div>
      </div>
      
      {showDetails && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <HomeIcon className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
              <span className="font-medium">Home Profile</span>
            </div>
            <div className="mt-2 space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
              <div className="flex justify-between">
                <span>Property Type:</span>
                <span className="font-medium capitalize">{wizardState.propertyType || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span>Size:</span>
                <span className="font-medium">{wizardState.homeProfile.squareFootage || 1500} sq ft</span>
              </div>
              <div className="flex justify-between">
                <span>Occupants:</span>
                <span className="font-medium">{wizardState.homeProfile.occupants || 2}</span>
              </div>
              <div className="flex justify-between">
                <span>Special Features:</span>
                <span className="font-medium">
                  {[
                    wizardState.homeProfile.hasEV && 'EV Charger',
                    wizardState.homeProfile.hasPool && 'Pool',
                    wizardState.homeProfile.hasSolar && 'Solar'
                  ].filter(Boolean).join(', ') || 'None'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
              <span className="font-medium">Seasonal Usage</span>
            </div>
            <div className="mt-2 space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
              <div className="flex justify-between items-center">
                <span>Peak Month:</span>
                <span className="font-medium flex items-center text-red-600 dark:text-red-400">
                  {usageData.peakMonth.month} ({usageData.peakMonth.usage.toLocaleString()} kWh)
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Lowest Month:</span>
                <span className="font-medium flex items-center text-green-600 dark:text-green-400">
                  {usageData.lowestMonth.month} ({usageData.lowestMonth.usage.toLocaleString()} kWh)
                  <ArrowDownRight className="h-3 w-3 ml-1" />
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-100 dark:border-gray-700 pt-1.5 mt-1.5">
                <span>Annual Usage:</span>
                <span className="font-medium">{usageData.annual.toLocaleString()} kWh</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {costs && showDetails && (
        <div className="mt-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3 border border-primary-100 dark:border-primary-800">
          <div className="flex items-center text-primary-700 dark:text-primary-300">
            <CustomBoltIcon className="h-4 w-4 mr-2" />
            <span className="font-medium">Estimated Annual Cost: ${costs.annual.toLocaleString()}</span>
          </div>
          <p className="mt-1 text-xs text-primary-600 dark:text-primary-400">
            With {wizardState.selectedPlan.name} plan at {wizardState.selectedPlan.rate}¢/kWh
          </p>
          
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="bg-white dark:bg-primary-900/40 rounded p-2 text-xs">
              <div className="text-primary-600 dark:text-primary-400">Summer Peak (Aug)</div>
              <div className="font-medium text-primary-700 dark:text-primary-300">${costs.peak}/month</div>
            </div>
            <div className="bg-white dark:bg-primary-900/40 rounded p-2 text-xs">
              <div className="text-primary-600 dark:text-primary-400">Winter Low (Apr)</div>
              <div className="font-medium text-primary-700 dark:text-primary-300">${costs.lowest}/month</div>
            </div>
          </div>
          
          <div className="mt-2 flex items-center text-xs text-primary-600 dark:text-primary-400">
            <Info className="h-3.5 w-3.5 mr-1.5" />
            <span>Predictions based on average Texas weather patterns and your home profile</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Custom component to avoid direct imports from Lucide that might cause issues
function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  );
}

// Custom Bolt icon component
function CustomBoltIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

export default UsagePredictionVisualizer;