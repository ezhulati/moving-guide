import { useState } from 'react';
import { Download, Check, Clock, AlertTriangle, ChevronRight, Clipboard, ExternalLink } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: 'before' | 'moving-day' | 'after';
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

const PowerSetupChecklist = () => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    // Before Moving
    {
      id: 'start-early',
      title: "Start your electricity setup process early",
      description: "Begin at least 2 weeks before your move to ensure everything is ready.",
      category: 'before',
      priority: 'high',
      completed: false
    },
    {
      id: 'compare-plans',
      title: "Compare electricity plans and providers",
      description: "Research and compare plans based on rate, term length, and features.",
      category: 'before',
      priority: 'high',
      completed: false
    },
    {
      id: 'check-reviews',
      title: "Check provider reviews and satisfaction ratings",
      description: "Research customer experiences with different electricity providers.",
      category: 'before',
      priority: 'medium',
      completed: false
    },
    {
      id: 'understand-contract',
      title: "Understand contract terms and cancellation fees",
      description: "Review the fine print regarding contract length and early termination fees.",
      category: 'before',
      priority: 'medium',
      completed: false
    },
    {
      id: 'understand-rates',
      title: "Understand the difference between fixed and variable rates",
      description: "Fixed rates remain constant during your contract, while variable rates can change monthly.",
      category: 'before',
      priority: 'medium',
      completed: false
    },
    
    // Moving Day
    {
      id: 'confirm-connection',
      title: "Confirm electricity is connected at your new home",
      description: "Check that power is on when you arrive at your new place.",
      category: 'moving-day',
      priority: 'high',
      completed: false
    },
    {
      id: 'locate-breaker',
      title: "Locate the circuit breaker box",
      description: "Find and familiarize yourself with the circuit breaker box in your new home.",
      category: 'moving-day',
      priority: 'high',
      completed: false
    },
    {
      id: 'test-outlets',
      title: "Test outlets and switches",
      description: "Verify that all electrical outlets and light switches are working properly.",
      category: 'moving-day',
      priority: 'medium',
      completed: false
    },
    
    // After Moving
    {
      id: 'create-account',
      title: "Create an online account with your provider",
      description: "Set up your account to manage billing, payments, and service online.",
      category: 'after',
      priority: 'high',
      completed: false
    },
    {
      id: 'setup-autopay',
      title: "Set up autopay to avoid late fees",
      description: "Configure automatic payments to ensure you never miss a bill.",
      category: 'after',
      priority: 'medium',
      completed: false
    },
    {
      id: 'optimize-thermostat',
      title: "Program your thermostat for energy efficiency",
      description: "Set your thermostat to 78°F in summer and 68°F in winter to optimize energy use.",
      category: 'after',
      priority: 'medium',
      completed: false
    },
    {
      id: 'check-first-bill',
      title: "Review your first electricity bill",
      description: "Carefully check your first bill to ensure all charges are correct and as expected.",
      category: 'after',
      priority: 'medium',
      completed: false
    }
  ]);
  
  const [activeCategory, setActiveCategory] = useState<'before' | 'moving-day' | 'after' | 'all'>('all');
  
  // Toggle item completion
  const toggleItemCompletion = (id: string) => {
    setChecklistItems(items => 
      items.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };
  
  // Filter items by category
  const filteredItems = activeCategory === 'all' 
    ? checklistItems 
    : checklistItems.filter(item => item.category === activeCategory);
  
  // Calculate completion stats
  const getCompletionStats = () => {
    const total = checklistItems.length;
    const completed = checklistItems.filter(item => item.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, percentage };
  };
  
  const stats = getCompletionStats();
  
  // Download checklist as text
  const downloadChecklist = () => {
    const checklistText = checklistItems.map(item => 
      `[ ${item.completed ? 'X' : ' '} ] ${item.title}\n    ${item.description}\n`
    ).join('\n');
    
    const element = document.createElement('a');
    const file = new Blob([checklistText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'power-setup-checklist.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  // Copy checklist to clipboard
  const copyChecklistToClipboard = () => {
    const checklistText = checklistItems.map(item => 
      `[ ${item.completed ? 'X' : ' '} ] ${item.title}\n    ${item.description}\n`
    ).join('\n');
    
    navigator.clipboard.writeText(checklistText);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <Clipboard className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
            Power Setup Checklist
          </h2>
          <div className="flex space-x-2">
            <button 
              className="btn btn-sm btn-secondary"
              onClick={downloadChecklist}
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </button>
            <button 
              className="btn btn-sm btn-secondary"
              onClick={copyChecklistToClipboard}
            >
              <Clipboard className="h-4 w-4 mr-1" />
              Copy
            </button>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{stats.completed}/{stats.total} tasks</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className={cn(
                "h-2.5 rounded-full transition-all duration-500",
                stats.percentage < 33 ? "bg-red-500 dark:bg-red-600" :
                stats.percentage < 66 ? "bg-amber-500 dark:bg-amber-600" :
                "bg-green-500 dark:bg-green-600"
              )}
              style={{ width: `${stats.percentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mt-4 flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2",
              activeCategory === 'all'
                ? "text-primary-600 dark:text-primary-400 border-primary-500 dark:border-primary-500"
                : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            )}
            onClick={() => setActiveCategory('all')}
          >
            All Tasks
          </button>
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2",
              activeCategory === 'before'
                ? "text-primary-600 dark:text-primary-400 border-primary-500 dark:border-primary-500"
                : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            )}
            onClick={() => setActiveCategory('before')}
          >
            Before Moving
          </button>
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2",
              activeCategory === 'moving-day'
                ? "text-primary-600 dark:text-primary-400 border-primary-500 dark:border-primary-500"
                : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            )}
            onClick={() => setActiveCategory('moving-day')}
          >
            Moving Day
          </button>
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2",
              activeCategory === 'after'
                ? "text-primary-600 dark:text-primary-400 border-primary-500 dark:border-primary-500"
                : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            )}
            onClick={() => setActiveCategory('after')}
          >
            After Moving
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
        {filteredItems.map(item => (
          <div 
            key={item.id}
            className={cn(
              "p-4 transition-colors",
              item.completed ? "bg-gray-50 dark:bg-gray-800/50" : ""
            )}
          >
            <div className="flex items-start">
              <button
                type="button"
                onClick={() => toggleItemCompletion(item.id)}
                className={cn(
                  "h-5 w-5 rounded border flex-shrink-0 mt-0.5 mr-3 flex items-center justify-center transition-colors",
                  item.completed 
                    ? "bg-primary-500 border-primary-500 dark:bg-primary-600 dark:border-primary-600" 
                    : "border-gray-300 dark:border-gray-600"
                )}
                aria-label={item.completed ? "Mark as incomplete" : "Mark as complete"}
              >
                {item.completed && <Check className="h-3 w-3 text-white" />}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <h3 className={cn(
                    "text-sm font-medium",
                    item.completed 
                      ? "text-gray-500 dark:text-gray-400 line-through" 
                      : "text-gray-900 dark:text-white"
                  )}>
                    {item.title}
                  </h3>
                  
                  {!item.completed && item.priority === 'high' && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                      Priority
                    </span>
                  )}
                  
                  {item.category === 'before' && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      Before Moving
                    </span>
                  )}
                  
                  {item.category === 'moving-day' && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                      Moving Day
                    </span>
                  )}
                  
                  {item.category === 'after' && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      After Moving
                    </span>
                  )}
                </div>
                
                <p className={cn(
                  "mt-1 text-sm",
                  item.completed 
                    ? "text-gray-400 dark:text-gray-500" 
                    : "text-gray-600 dark:text-gray-300"
                )}>
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <a 
          href="/blog/ultimate-texas-electricity-setup-checklist"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium flex items-center"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Read our detailed guide on preparing for your electricity setup
        </a>
      </div>
    </div>
  );
};

export default PowerSetupChecklist;