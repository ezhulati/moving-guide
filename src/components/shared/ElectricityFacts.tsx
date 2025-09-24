import { useState } from 'react';
import { Info, ChevronRight, Bolt, LightbulbOff, Leaf, Clock, DollarSign } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ElectricityFactsProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  inline?: boolean;
  showAllByDefault?: boolean;
  facts?: ElectricityFact[];
  title?: string;
}

interface ElectricityFact {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  category?: string;
}

// Default array of electricity facts
const defaultFacts: ElectricityFact[] = [
  {
    id: 'texas-market',
    title: 'Texas Deregulated Market',
    description: 'Texas has the largest deregulated electricity market in the United States, allowing consumers to choose from over 100 retail electricity providers.',
    icon: <Bolt className="text-primary-500" />,
    category: 'market'
  },
  {
    id: 'energy-waste',
    title: 'Phantom Energy',
    description: 'Standby power, or "phantom energy," can account for up to 10% of a home\'s electricity use. Simply unplugging devices when not in use can save up to $100 annually.',
    icon: <LightbulbOff className="text-amber-500" />,
    category: 'savings'
  },
  {
    id: 'green-energy',
    title: 'Renewable Energy Growth',
    description: 'Texas leads the nation in wind power generation and is rapidly expanding solar capacity, with renewable energy now accounting for over 25% of the state\'s electricity production.',
    icon: <Leaf className="text-green-500" />,
    category: 'environment'
  },
  {
    id: 'peak-hours',
    title: 'Peak Usage Hours',
    description: 'In Texas, electricity demand typically peaks between 3-7 PM during summer months. Some plans offer lower rates during off-peak hours to encourage shifting usage.',
    icon: <Clock className="text-blue-500" />,
    category: 'usage'
  },
  {
    id: 'bill-credits',
    title: 'Bill Credit Plans',
    description: 'Many Texas electricity plans offer bill credits at specific usage levels (typically 1000 kWh). These can significantly reduce your effective rate if your usage matches these tiers.',
    icon: <DollarSign className="text-green-500" />,
    category: 'savings'
  }
];

const ElectricityFact = ({ 
  fact,
  isOpen,
  toggleFact
}: { 
  fact: ElectricityFact,
  isOpen: boolean,
  toggleFact: (id: string) => void
}) => {
  return (
    <div className={cn(
      "border-b border-gray-200 dark:border-gray-700 last:border-0 transition-colors",
      isOpen ? "bg-primary-50 dark:bg-primary-900/10" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
    )}>
      <button
        type="button"
        className="w-full flex items-center justify-between py-3 px-4 text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md"
        onClick={() => toggleFact(fact.id)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
          <div className="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            {fact.icon || <Info className="text-primary-500" />}
          </div>
          <span className="ml-3 font-medium text-gray-900 dark:text-white">{fact.title}</span>
        </div>
        <ChevronRight 
          className={cn(
            "h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform",
            isOpen ? "transform rotate-90" : ""
          )} 
        />
      </button>
      
      {isOpen && (
        <div className="pb-4 px-4 pl-15 pr-4 text-sm text-gray-600 dark:text-gray-300 animate-fade-in">
          <div className="pl-11 bg-gray-50/50 dark:bg-gray-800/30 p-3 rounded-md border border-gray-100 dark:border-gray-700">
            {fact.description}
          </div>
        </div>
      )}
    </div>
  );
};

const ElectricityFacts: React.FC<ElectricityFactsProps> = ({
  className,
  size = 'md',
  inline = false,
  showAllByDefault = false,
  facts = defaultFacts,
  title = "Texas Electricity Facts"
}) => {
  const [openFacts, setOpenFacts] = useState<string[]>(
    showAllByDefault ? facts.map(f => f.id) : []
  );
  
  const toggleFact = (id: string) => {
    setOpenFacts(current => 
      current.includes(id) 
        ? current.filter(factId => factId !== id)
        : [...current, id]
    );
  };
  
  const toggleAllFacts = () => {
    if (openFacts.length === facts.length) {
      setOpenFacts([]);
    } else {
      setOpenFacts(facts.map(f => f.id));
    }
  };
  
  // Adjust container size
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg"
  };
  
  // If inline, render as a compact inline element
  if (inline) {
    return (
      <div className={cn("inline-block", className)}>
        <button
          type="button"
          className="inline-flex items-center text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
          onClick={toggleAllFacts}
        >
          <Info className="h-4 w-4 mr-1" />
          <span>Electricity Facts</span>
        </button>
        
        {openFacts.length > 0 && (
          <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-xs absolute z-10">
            <div className="space-y-2">
              {facts.map(fact => (
                <div key={fact.id} className="text-xs">
                  <div className="font-medium text-gray-900 dark:text-white">{fact.title}</div>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">{fact.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm", 
      sizeClasses[size],
      className
    )}>
      <div className="bg-primary-50 dark:bg-primary-900/20 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center">
          <Info className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
          <h3 className="text-sm font-medium text-primary-800 dark:text-primary-200">{title}</h3>
        </div>
        <button
          type="button"
          onClick={toggleAllFacts}
          className="text-xs text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
        >
          {openFacts.length === facts.length ? 'Collapse All' : 'Expand All'}
        </button>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {facts.map(fact => (
          <ElectricityFact
            key={fact.id}
            fact={fact}
            isOpen={openFacts.includes(fact.id)}
            toggleFact={toggleFact}
          />
        ))}
      </div>
    </div>
  );
};

export default ElectricityFacts;