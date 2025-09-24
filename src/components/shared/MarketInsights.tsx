import { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { Zap, TrendingUp, TrendingDown, Calendar, Info, HelpCircle, Clock, AlertTriangle, BarChart4, DollarSign, Flame, Leaf } from 'lucide-react';

interface MarketInsightsProps {
  className?: string;
}

const MarketInsights: React.FC<MarketInsightsProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState<'current' | 'forecast' | 'tips'>('current');
  const [isLive, setIsLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Mock data for the Texas electricity market
  const marketData = {
    currentAvgRate: 11.4,
    forecastedRate: 12.1,
    nationalAverage: 14.3,
    seasonalTrend: 'rising', // 'rising', 'falling', or 'stable'
    peakMonth: 'August',
    lowestMonth: 'April',
    percentRenewable: 25,
    priceChangeYoY: 3.5,
    urgency: {
      days: 14,
      reason: 'before summer rates increase'
    }
  };

  useEffect(() => {
    // Simulate real-time updates with small rate fluctuations
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000); // Update every minute for effect

    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className={cn("border rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm", className)}>
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex divide-x divide-gray-200 dark:divide-gray-700">
          <button
            className={cn(
              "flex-1 py-4 px-4 text-sm font-medium text-center focus:outline-none transition-colors",
              activeTab === 'current' 
                ? "text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            )}
            onClick={() => setActiveTab('current')}
          >
            Current Market
          </button>
          <button
            className={cn(
              "flex-1 py-4 px-4 text-sm font-medium text-center focus:outline-none transition-colors",
              activeTab === 'forecast' 
                ? "text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            )}
            onClick={() => setActiveTab('forecast')}
          >
            Forecast
          </button>
          <button
            className={cn(
              "flex-1 py-4 px-4 text-sm font-medium text-center focus:outline-none transition-colors",
              activeTab === 'tips' 
                ? "text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            )}
            onClick={() => setActiveTab('tips')}
          >
            Insider Tips
          </button>
        </div>
      </div>
      
      <div className="p-5">
        {isLive && (
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Live market data</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Updated: {lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>
        )}

        {activeTab === 'current' && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
              <BarChart4 className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
              Texas Electricity Market: June 2025
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">Average Rate</div>
                <div className="text-2xl font-bold text-primary-700 dark:text-primary-300">{marketData.currentAvgRate}¢</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                  <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
                  {Math.abs(marketData.currentAvgRate - marketData.nationalAverage).toFixed(1)}¢ below national average
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">Seasonal Trend</div>
                <div className="flex items-center">
                  {marketData.seasonalTrend === 'rising' ? (
                    <>
                      <TrendingUp className="h-5 w-5 text-amber-500 mr-1" />
                      <span className="text-lg font-bold text-amber-600 dark:text-amber-400">Rising</span>
                    </>
                  ) : marketData.seasonalTrend === 'falling' ? (
                    <>
                      <TrendingDown className="h-5 w-5 text-green-500 mr-1" />
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">Falling</span>
                    </>
                  ) : (
                    <>
                      <span className="h-5 w-5 text-blue-500 mr-1">—</span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">Stable</span>
                    </>
                  )}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Heading into peak summer demand
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              {/* Visual rate comparison chart - Simplified */}
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rate Comparison</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 text-primary-600 dark:text-primary-400 mr-1" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Texas Avg Rate</span>
                    </div>
                    <span className="text-xs font-medium text-primary-700 dark:text-primary-300">{marketData.currentAvgRate}¢/kWh</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 dark:bg-primary-500 h-2 rounded-full"
                      style={{ width: `${(marketData.currentAvgRate / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <Flame className="h-4 w-4 text-red-500 dark:text-red-400 mr-1" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Summer Peak Rate</span>
                    </div>
                    <span className="text-xs font-medium text-red-600 dark:text-red-400">14.2¢/kWh</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-red-500 dark:bg-red-600 h-2 rounded-full"
                      style={{ width: `${(14.2 / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">National Avg Rate</span>
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{marketData.nationalAverage}¢/kWh</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gray-500 dark:bg-gray-600 h-2 rounded-full"
                      style={{ width: `${(marketData.nationalAverage / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg mb-4 border border-amber-100 dark:border-amber-800">
              <div className="flex">
                <Clock className="h-5 w-5 text-amber-500 dark:text-amber-400 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200">Limited-Time Opportunity</h4>
                  <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                    <strong>{marketData.urgency.days} days left</strong> to lock in current rates {marketData.urgency.reason}. 
                    Providers typically raise rates by 7-10% during summer months.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
              <div className="flex">
                <Info className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">Current Market Analysis</h4>
                  <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                    Texas electricity rates are currently in a {marketData.seasonalTrend} pattern with peak prices expected in {marketData.peakMonth}.
                    The current average rate is {marketData.priceChangeYoY > 0 ? 'up' : 'down'} {Math.abs(marketData.priceChangeYoY)}% year-over-year.
                    {marketData.percentRenewable}% of Texas electricity now comes from renewable sources.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'forecast' && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
              <Calendar className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
              12-Month Market Outlook
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">Forecasted Avg. Rate</div>
                <div className="text-2xl font-bold text-primary-700 dark:text-primary-300">{marketData.forecastedRate}¢</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-amber-500 dark:text-amber-400 mr-1" />
                  {(marketData.forecastedRate - marketData.currentAvgRate).toFixed(1)}¢ increase expected
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">Best Time to Lock In</div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-green-500 dark:text-green-400 mr-1" />
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">Now</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Before summer price increases
                </div>
              </div>
            </div>
            
            {/* Simplified forecast visualization */}
            <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">12-Month Rate Forecast</h4>
              <div className="h-40 relative">
                <div className="absolute inset-0">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>15¢</span>
                    <span>13¢</span>
                    <span>11¢</span>
                    <span>9¢</span>
                  </div>
                  
                  {/* Grid lines */}
                  <div className="absolute left-8 right-0 top-0 bottom-0">
                    <div className="h-full flex flex-col justify-between">
                      <div className="border-b border-gray-200 dark:border-gray-700 h-0"></div>
                      <div className="border-b border-gray-200 dark:border-gray-700 h-0"></div>
                      <div className="border-b border-gray-200 dark:border-gray-700 h-0"></div>
                      <div className="border-b border-gray-200 dark:border-gray-700 h-0"></div>
                    </div>
                  </div>
                  
                  {/* Chart line */}
                  <div className="absolute left-10 right-2 top-1 bottom-6 flex items-end">
                    <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                      {/* Current rate line */}
                      <line x1="0" y1="40" x2="300" y2="40" stroke="#ddd" className="dark:stroke-gray-600" strokeWidth="1" strokeDasharray="5,5" />
                      <text x="305" y="40" fontSize="10" fill="#666" className="dark:fill-gray-400">Current</text>
                      
                      {/* Forecast line */}
                      <path 
                        d="M0,40 C20,40 40,38 60,42 C80,46 100,55 120,60 C140,65 160,68 180,70 C200,72 220,75 240,78 C260,81 280,80 300,82"
                        fill="none"
                        stroke="#2563EB"
                        className="dark:stroke-blue-400"
                        strokeWidth="2"
                      />
                      
                      {/* Month indicators */}
                      <g fill="#666" className="dark:fill-gray-400" fontSize="8">
                        <text x="0" y="95">Jun</text>
                        <text x="50" y="95">Aug</text>
                        <text x="100" y="95">Oct</text>
                        <text x="150" y="95">Dec</text>
                        <text x="200" y="95">Feb</text>
                        <text x="250" y="95">Apr</text>
                      </g>
                      
                      {/* Summer peak indicator */}
                      <rect x="40" y="10" width="60" height="15" fill="rgba(239, 68, 68, 0.1)" className="dark:fill-red-900/30" rx="2" />
                      <text x="70" y="20" fontSize="8" fill="#ef4444" className="dark:fill-red-400" textAnchor="middle">Summer Peak</text>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <span className="text-xs text-gray-500 dark:text-gray-400">Projected {((marketData.forecastedRate - marketData.currentAvgRate) / marketData.currentAvgRate * 100).toFixed(1)}% increase over 12 months</span>
              </div>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg border border-amber-100 dark:border-amber-800">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-amber-500 dark:text-amber-400 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200">Price Forecast Alert</h4>
                  <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                    Market analysts expect Texas electricity rates to increase by approximately 6-8% over the next 12 months 
                    due to growing demand, potential natural gas price increases, and grid infrastructure investments. 
                    Lock in a fixed-rate plan now to avoid these projected increases.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'tips' && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
              <HelpCircle className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
              Expert Insights & Tips
            </h3>
            
            <div className="bg-primary-50 dark:bg-primary-900/30 p-4 rounded-lg border border-primary-100 dark:border-primary-800 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary-800 dark:text-primary-200">Top Recommendation</span>
                <span className="text-xs text-primary-600 dark:text-primary-400 font-medium px-2 py-0.5 bg-primary-100 dark:bg-primary-800 rounded">Today's Pick</span>
              </div>
              <p className="mt-1 text-sm text-primary-700 dark:text-primary-300 font-medium">
                12-month fixed-rate plans under 11.5¢/kWh offer excellent value right now
              </p>
              
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="bg-white dark:bg-gray-800 rounded p-2 border border-primary-100 dark:border-primary-800 text-center">
                  <div className="font-medium text-primary-900 dark:text-primary-100 text-sm">Best Value</div>
                  <div className="text-xs text-primary-700 dark:text-primary-300">12-month fixed</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded p-2 border border-primary-100 dark:border-primary-800 text-center">
                  <div className="font-medium text-primary-900 dark:text-primary-100 text-sm">Best Green</div>
                  <div className="text-xs text-primary-700 dark:text-primary-300">Texas Green 12</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded p-2 border border-primary-100 dark:border-primary-800 text-center">
                  <div className="font-medium text-primary-900 dark:text-primary-100 text-sm">Best No Deposit</div>
                  <div className="text-xs text-primary-700 dark:text-primary-300">Freedom Plan</div>
                </div>
              </div>
            </div>
            
            <ul className="space-y-3">
              <li className="flex items-start bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-100 dark:border-gray-700">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 flex items-center justify-center mt-0.5 mr-3">
                  <Zap className="h-3 w-3" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Lock in before summer price spikes</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Texas electricity prices historically spike 15-20% during peak summer months (July-August). 
                    Securing a fixed-rate plan in spring can save you significantly.
                  </p>
                </div>
              </li>
              
              <li className="flex items-start bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-100 dark:border-gray-700">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 flex items-center justify-center mt-0.5 mr-3">
                  <Zap className="h-3 w-3" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Consider 12-month vs. 24-month plans</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    While 24-month plans offer slightly higher rates now (+0.3¢/kWh on average), they provide protection 
                    against projected increases. If you plan to stay in your home for 2+ years, the long-term savings can be substantial.
                  </p>
                </div>
              </li>
              
              <li className="flex items-start bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-100 dark:border-gray-700">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 flex items-center justify-center mt-0.5 mr-3">
                  <Zap className="h-3 w-3" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Watch for "bill credit" plans</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Plans with bill credits at specific usage levels (e.g., 1000 kWh) can offer great value, but only if your usage 
                    consistently hits those targets. Review your expected usage carefully before choosing these plans.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketInsights;