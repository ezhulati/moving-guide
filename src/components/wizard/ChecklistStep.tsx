import { useWizard } from '../../context/WizardContext';
import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { clearWizardState } from '../../utils/storage';
import { 
  Check, Info, Clock, MapPin, Droplets, Truck, Home, Gift, Download, Share2, Printer, 
  Lightbulb, ShieldCheck, ListChecks, BarChart, Flame, Mail, Trash, Globe, Phone
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  initialCompleted: boolean;
  icon: React.ElementType;
  category: 'before' | 'during' | 'after';
  priority: 'high' | 'medium' | 'low';
}

const ChecklistItem = ({ 
  id,
  title, 
  description, 
  initialCompleted = false,
  icon: Icon,
  priority,
  onToggle
}: { 
  id: string;
  title: string; 
  description: string; 
  initialCompleted?: boolean;
  icon: React.ElementType;
  priority: 'high' | 'medium' | 'low';
  onToggle?: (id: string, completed: boolean) => void;
}) => {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [isHovered, setIsHovered] = useState(false);
  
  const toggleCompleted = () => {
    const newState = !isCompleted;
    setIsCompleted(newState);
    if (onToggle) {
      onToggle(id, newState);
    }
  };
  
  return (
    <div 
      className={cn(
        "flex items-start p-4 border-b border-gray-200 dark:border-gray-700 last:border-0 transition-colors",
        isHovered && !isCompleted ? "bg-gray-50 dark:bg-gray-800/50" : ""
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        type="button"
        onClick={toggleCompleted}
        className="flex-shrink-0 mt-0.5 mr-3"
        aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
      >
        {isCompleted ? (
          <div className="h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
            <Check className="h-4 w-4 text-primary-600 dark:text-primary-400" />
          </div>
        ) : (
          <div className={cn(
            "h-6 w-6 border-2 rounded-full transition-colors flex items-center justify-center",
            isHovered ? "border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/30" : "border-gray-300 dark:border-gray-600",
            priority === 'high' ? "border-red-300 dark:border-red-700" : 
            priority === 'medium' ? "border-amber-300 dark:border-amber-700" : "border-gray-300 dark:border-gray-600"
          )} />
        )}
      </button>
      
      <div className="min-w-0 flex-1">
        <div className="flex items-center">
          <div className={cn(
            "mr-2",
            isCompleted ? "text-gray-400 dark:text-gray-500" : 
            priority === 'high' ? "text-red-500 dark:text-red-400" :
            priority === 'medium' ? "text-amber-500 dark:text-amber-400" : "text-primary-500 dark:text-primary-400"
          )}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex items-center">
            <h3 className={cn(
              "text-base font-medium",
              isCompleted ? "text-gray-500 dark:text-gray-400 line-through" : "text-gray-900 dark:text-white"
            )}>
              {title}
            </h3>
            
            {priority === 'high' && !isCompleted && (
              <span className="ml-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs font-medium px-2 py-0.5 rounded">
                Priority
              </span>
            )}
          </div>
        </div>
        <p className={cn(
          "mt-1 text-sm",
          isCompleted ? "text-gray-400 dark:text-gray-500" : "text-gray-600 dark:text-gray-300"
        )}>
          {description}
        </p>
      </div>
    </div>
  );
};

const ChecklistSection = ({ 
  title, 
  subtitle,
  children,
  icon: Icon,
  initialExpanded = true,
  itemCount,
  completedCount
}: { 
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  icon: React.ElementType;
  initialExpanded?: boolean;
  itemCount: number;
  completedCount: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/80 flex items-center justify-between"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center">
          <div className="mr-2 text-primary-600 dark:text-primary-500">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="mr-3 text-sm">
            <span className="font-medium text-primary-600 dark:text-primary-500">{completedCount}</span>
            <span className="text-gray-600 dark:text-gray-300">/{itemCount}</span>
          </div>
          
          <div className="h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-200" style={{ 
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </button>
      
      {isExpanded && (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {children}
        </div>
      )}
    </div>
  );
};

const ChecklistStep = () => {
  const { wizardState, resetWizard } = useWizard();
  const { addToast } = useToast();
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [hasSharedChecklist, setHasSharedChecklist] = useState(false);
  const [isShareButtonDisabled, setIsShareButtonDisabled] = useState(false);
  
  // Checklist items data
  const checklistItems: ChecklistItem[] = [
    // Before move items
    {
      id: 'mail-forwarding',
      title: "Update your mail forwarding",
      description: "Visit USPS.com to set up mail forwarding from your old address to your new one.",
      initialCompleted: false,
      icon: Mail,
      category: 'before',
      priority: 'high'
    },
    {
      id: 'internet',
      title: "Set up internet service",
      description: "Research and select an internet provider for your new home.",
      initialCompleted: false,
      icon: Globe,
      category: 'before',
      priority: 'high'
    },
    {
      id: 'movers',
      title: "Schedule moving help",
      description: "Book movers or a rental truck at least 2 weeks before your move date.",
      initialCompleted: false,
      icon: Truck,
      category: 'before',
      priority: 'medium'
    },
    {
      id: 'water',
      title: "Set up water service",
      description: "Contact your local water utility to set up service at your new address.",
      initialCompleted: false,
      icon: Droplets,
      category: 'before',
      priority: 'high'
    },
    {
      id: 'address-update',
      title: "Update your address everywhere",
      description: "Update your address for banking, insurance, and other important services.",
      initialCompleted: true,
      icon: Home,
      category: 'before',
      priority: 'medium'
    },
    {
      id: 'trash',
      title: "Set up trash and recycling service",
      description: "Contact your local waste management provider to set up service.",
      initialCompleted: false,
      icon: Trash,
      category: 'before',
      priority: 'medium'
    },
    
    // Moving day items
    {
      id: 'electricity-confirm',
      title: "Verify electricity is connected",
      description: `When you arrive at your new home on ${formatDate(wizardState.moveInDate)}, check that your power is working.`,
      initialCompleted: true,
      icon: ElectricityIcon,
      category: 'during',
      priority: 'high'
    },
    {
      id: 'breakers',
      title: "Locate circuit breakers",
      description: "Find the breaker panel in your new home and make sure all switches are on.",
      initialCompleted: false,
      icon: ElectricityIcon,
      category: 'during',
      priority: 'high'
    },
    {
      id: 'photos',
      title: "Document property condition",
      description: "Take photos of any existing damage before moving in your belongings.",
      initialCompleted: false,
      icon: Home,
      category: 'during',
      priority: 'medium'
    },
    {
      id: 'smoke-detectors',
      title: "Test smoke detectors",
      description: "Check that all smoke and carbon monoxide detectors are working properly.",
      initialCompleted: false,
      icon: Flame,
      category: 'during',
      priority: 'high'
    },
    
    // After move items
    {
      id: 'provider-account',
      title: "Set up your online account",
      description: `Visit ${wizardState.selectedPlan.provider?.toLowerCase().replace(/\s+/g, '')}.com to create your account using your number: ${wizardState.orderConfirmation.accountNumber?.substring(0, 4)}...`,
      initialCompleted: false,
      icon: ElectricityIcon,
      category: 'after',
      priority: 'medium'
    },
    {
      id: 'autopay',
      title: "Set up auto-pay",
      description: "Sign up for automatic payments to avoid late fees and service interruptions.",
      initialCompleted: false,
      icon: ElectricityIcon,
      category: 'after',
      priority: 'medium'
    },
    {
      id: 'rebates',
      title: "Check for energy efficiency rebates",
      description: `${wizardState.selectedPlan.provider} may offer rebates for energy-efficient appliances and home improvements.`,
      initialCompleted: false,
      icon: Gift,
      category: 'after',
      priority: 'low'
    },
    {
      id: 'thermostat',
      title: "Program your thermostat",
      description: "Set your thermostat to energy-efficient temperatures to start saving on your first bill.",
      initialCompleted: false,
      icon: Home,
      category: 'after',
      priority: 'medium'
    },
    {
      id: 'contact-update',
      title: "Verify your contact info",
      description: "Make sure your phone number and email are up-to-date with your electricity provider.",
      initialCompleted: false,
      icon: Phone,
      category: 'after',
      priority: 'low'
    },
  ];

  // Initialize completed items on first render
  useEffect(() => {
    const initialCompletedItems: Record<string, boolean> = {};
    checklistItems.forEach(item => {
      initialCompletedItems[item.id] = item.initialCompleted;
    });
    setCompletedItems(initialCompletedItems);
  }, []);

  // Calculate completed items count for each category
  const getCategoryCounts = (category: 'before' | 'during' | 'after') => {
    const items = checklistItems.filter(item => item.category === category);
    const completed = items.filter(item => completedItems[item.id]).length;
    return { total: items.length, completed };
  };

  const beforeCounts = getCategoryCounts('before');
  const duringCounts = getCategoryCounts('during');
  const afterCounts = getCategoryCounts('after');
  
  // Calculate overall progress
  const totalItems = checklistItems.length;
  const completedItemsCount = Object.values(completedItems).filter(Boolean).length;
  const progress = (completedItemsCount / totalItems) * 100;

  // Update when items are toggled
  const handleItemToggle = (id: string, completed: boolean) => {
    setCompletedItems(prev => ({
      ...prev,
      [id]: completed
    }));
    
    // Show milestone toast messages
    if (completed) {
      const newTotal = completedItemsCount + 1;
      
      if (newTotal === Math.floor(totalItems / 2)) {
        addToast('success', 'You\'re halfway through your move-in checklist! Keep it up!');
      } else if (newTotal === totalItems) {
        addToast('success', '🎉 Awesome job! You\'ve completed all items on your checklist!');
      } else if ([5, 10, 15].includes(newTotal)) {
        addToast('success', `${newTotal} tasks done! Making great progress on your new home.`);
      }
    }
  };

  // Format the move-in date in a readable format
  function formatDate(dateString: string | null) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // Handle download checklist
  const handleDownloadChecklist = () => {
    addToast('info', 'Preparing your personalized checklist for download...');
    
    // In a real app, this would generate and download a PDF
    setTimeout(() => {
      addToast('success', 'Checklist PDF ready! Check your downloads folder.');
    }, 1500);
  };

  // Handle share checklist
  const handleShareChecklist = () => {
    setIsShareButtonDisabled(true);
    
    if (navigator.share) {
      navigator.share({
        title: 'My Move-In Checklist from ComparePower',
        text: `My electricity service with ${wizardState.selectedPlan.provider} is all set up for ${formatDate(wizardState.moveInDate)}!`,
        url: window.location.href,
      })
        .then(() => {
          setHasSharedChecklist(true);
          addToast('success', 'Checklist shared successfully!');
        })
        .catch((error) => {
          console.error('Error sharing:', error);
          addToast('error', 'Could not share checklist');
        })
        .finally(() => {
          setIsShareButtonDisabled(false);
        });
    } else {
      // Fallback for browsers that don't support the Web Share API
      addToast('info', 'Copy the URL from your address bar to share this checklist');
      setIsShareButtonDisabled(false);
    }
  };

  // Handle print checklist
  const handlePrintChecklist = () => {
    addToast('info', 'Opening print dialog...');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  // Clear wizard state when user completes the process
  const handleFinish = () => {
    addToast('success', 'Setup complete! Starting a fresh session.');
    clearWizardState();
    resetWizard();
    
    // Navigate to home page after brief delay
    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
  };

  return (
    <div className="wizard-step">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900/50">
          <ListChecks className="h-8 w-8 text-primary-600 dark:text-primary-500" />
        </div>
        <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">Your Moving Checklist</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          We've created a personalized list to help make your move smooth and stress-free.
        </p>
        
        {totalItems > 0 && (
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Overall Progress</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{completedItemsCount}/{totalItems} tasks</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className={cn(
                  "h-2.5 rounded-full transition-all duration-500",
                  progress < 33 ? "bg-red-500 dark:bg-red-600" :
                  progress < 66 ? "bg-amber-500 dark:bg-amber-600" :
                  "bg-green-500 dark:bg-green-600"
                )}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 space-y-6">
        <div className="bg-primary-50 dark:bg-primary-900/30 rounded-lg p-4 animate-fade-in">
          <h3 className="text-lg font-medium text-primary-800 dark:text-primary-300 flex items-center">
            <BarChart className="h-5 w-5 text-primary-600 dark:text-primary-500 mr-2" />
            Your Electricity Service
          </h3>
          <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-primary-100 dark:border-primary-800">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col">
                <p className="text-sm text-gray-500 dark:text-gray-400">Account #:</p>
                <div className="flex items-center mt-1">
                  <p className="font-medium text-primary-900 dark:text-primary-300">{wizardState.orderConfirmation.accountNumber}</p>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(wizardState.orderConfirmation.accountNumber || '');
                      addToast('success', 'Account number copied');
                    }}
                    className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label="Copy account number"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Provider:</p>
                <p className="mt-1 font-medium text-primary-900 dark:text-primary-300">{wizardState.selectedPlan.provider}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Service Start:</p>
                <p className="mt-1 font-medium text-primary-900 dark:text-primary-300">{formatDate(wizardState.moveInDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Customer Support:</p>
                <p className="mt-1 font-medium text-primary-900 dark:text-primary-300">1-800-POWER-TX</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <a 
                href="#" 
                className="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 flex items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-1.5" />
                Set up your online account at {wizardState.selectedPlan.provider?.replace(/\s+/g, '').toLowerCase()}.com
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-3 flex flex-wrap sm:flex-nowrap justify-center sm:justify-between gap-3">
          <button 
            className="btn btn-secondary flex items-center justify-center w-full sm:w-auto"
            onClick={handleDownloadChecklist}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Checklist
          </button>
          
          <button 
            className="btn btn-secondary flex items-center justify-center w-full sm:w-auto"
            onClick={handleShareChecklist}
            disabled={isShareButtonDisabled}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Checklist
          </button>
          
          <button 
            className="btn btn-secondary flex items-center justify-center w-full sm:w-auto"
            onClick={handlePrintChecklist}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Checklist
          </button>
        </div>

        <ChecklistSection 
          title="Before Your Move" 
          subtitle="Complete these tasks before moving day"
          icon={Calendar}
          itemCount={beforeCounts.total}
          completedCount={beforeCounts.completed}
        >
          {checklistItems
            .filter(item => item.category === 'before')
            .map((item) => (
              <ChecklistItem
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                initialCompleted={completedItems[item.id] || false}
                icon={item.icon}
                priority={item.priority}
                onToggle={handleItemToggle}
              />
            ))}
        </ChecklistSection>

        <ChecklistSection 
          title="Moving Day" 
          subtitle="Tasks for the day of your move"
          icon={Truck}
          itemCount={duringCounts.total}
          completedCount={duringCounts.completed}
        >
          {checklistItems
            .filter(item => item.category === 'during')
            .map((item) => (
              <ChecklistItem
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                initialCompleted={completedItems[item.id] || false}
                icon={item.icon}
                priority={item.priority}
                onToggle={handleItemToggle}
              />
            ))}
        </ChecklistSection>

        <ChecklistSection 
          title="After Moving In" 
          subtitle="Setting up your new home"
          icon={Home}
          itemCount={afterCounts.total}
          completedCount={afterCounts.completed}
        >
          {checklistItems
            .filter(item => item.category === 'after')
            .map((item) => (
              <ChecklistItem
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                initialCompleted={completedItems[item.id] || false}
                icon={item.icon}
                priority={item.priority}
                onToggle={handleItemToggle}
              />
            ))}
        </ChecklistSection>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 animate-fade-in">
          <h3 className="text-lg font-medium text-green-800 dark:text-green-300 flex items-center">
            <Lightbulb className="h-5 w-5 text-green-600 dark:text-green-500 mr-2" />
            Energy Saving Tips for Your New Home
          </h3>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-green-100 dark:border-green-800">
              <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">Temperature Settings</h4>
              <ul className="space-y-2 text-sm text-green-700 dark:text-green-400">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Set thermostat to 78°F in summer and 68°F in winter to save up to 15% on energy costs</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Adjust 7-10°F when away for 8+ hours (or use a programmable thermostat)</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-green-100 dark:border-green-800">
              <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">Appliance Efficiency</h4>
              <ul className="space-y-2 text-sm text-green-700 dark:text-green-400">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Replace air filters every 1-3 months</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Use ceiling fans in summer (counterclockwise) and winter (clockwise)</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-green-100 dark:border-green-800">
              <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">Lighting & Electronics</h4>
              <ul className="space-y-2 text-sm text-green-700 dark:text-green-400">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Switch to LED bulbs (uses up to 75% less energy)</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Unplug electronics or use smart power strips to prevent phantom energy usage</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-green-100 dark:border-green-800">
              <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">Water Heating</h4>
              <ul className="space-y-2 text-sm text-green-700 dark:text-green-400">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Set water heater to 120°F (hot enough for showers, safe for kids)</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Insulate water heater and first 6 feet of pipes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Thanks for Choosing ComparePower!</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            We hope you enjoy your new home and the electricity service we've helped set up for you.
          </p>
          
          <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800 rounded-lg inline-block">
            <p className="text-sm text-primary-800 dark:text-primary-300 mb-3">
              How was your experience with ComparePower?
            </p>
            
            <div className="flex justify-center space-x-2">
              <button className="btn btn-primary px-6">
                Complete Setup
              </button>
            </div>
          </div>
          
          <button 
            onClick={handleFinish}
            className="mt-6 btn btn-secondary"
          >
            Finish & Start New Setup
          </button>
        </div>
        
        {hasSharedChecklist && (
          <div className="bg-success-50 dark:bg-success-900/30 border-l-4 border-success-500 dark:border-success-600 p-4 animate-slide-up">
            <div className="flex">
              <div className="flex-shrink-0">
                <Check className="h-5 w-5 text-success-400 dark:text-success-500" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-success-700 dark:text-success-400">
                  Thanks for sharing! Help your friends and family save on their electricity bills too by telling them about ComparePower.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Calendar component
function Calendar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={props.className}
      {...props}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}

// ExternalLink component
function ExternalLink(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={props.className}
      {...props}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
  );
}

// Copy component
function Copy(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={props.className}
      {...props}
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  );
}

// Custom electricity icon
function ElectricityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M13 2 L3 14 h9 l-1 8 l10 -12 h-9 l1 -8Z" />
    </svg>
  );
}

export default ChecklistStep;