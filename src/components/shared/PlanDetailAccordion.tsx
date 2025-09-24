import { useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

interface PlanDetailAccordionProps {
  plan: {
    details: Array<{name: string, value: string}>;
    features: string[];
    incentives: string;
  };
}

const PlanDetailAccordion = ({ plan }: PlanDetailAccordionProps) => {
  const [activeSection, setActiveSection] = useState<'details' | 'features' | 'fine-print'>('details');
  
  // Toggle active section
  const toggleSection = (section: 'details' | 'features' | 'fine-print') => {
    setActiveSection(activeSection === section ? null : section);
  };
  
  return (
    <div className="px-5 pb-5 pt-1 border-t border-gray-200 dark:border-gray-700 animate-fade-in">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex -mb-px space-x-4">
          <button
            className={cn(
              "py-2 px-1 border-b-2 text-sm font-medium",
              activeSection === 'details'
                ? "border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600"
            )}
            onClick={() => toggleSection('details')}
          >
            Plan Details
          </button>
          
          <button
            className={cn(
              "py-2 px-1 border-b-2 text-sm font-medium",
              activeSection === 'features'
                ? "border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600"
            )}
            onClick={() => toggleSection('features')}
          >
            Features
          </button>
          
          <button
            className={cn(
              "py-2 px-1 border-b-2 text-sm font-medium",
              activeSection === 'fine-print'
                ? "border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600"
            )}
            onClick={() => toggleSection('fine-print')}
          >
            Fine Print
          </button>
        </nav>
      </div>
      
      <div className="mt-4">
        {activeSection === 'details' && (
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <dl className="divide-y divide-gray-200 dark:divide-gray-700">
              {plan.details.map((detail, index) => (
                <div key={index} className="flex justify-between py-2 text-sm">
                  <dt className="text-gray-500 dark:text-gray-400">{detail.name}</dt>
                  <dd className="font-medium text-gray-900 dark:text-gray-200">{detail.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        
        {activeSection === 'features' && (
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-2">Plan Highlights</h4>
            <ul className="space-y-1.5 text-gray-600 dark:text-gray-300 text-xs">
              <li className="flex items-start">
                <Check className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400 mr-1.5 flex-shrink-0 mt-0.5" />
                <span>All-in pricing with no hidden fees</span>
              </li>
              <li className="flex items-start">
                <Check className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400 mr-1.5 flex-shrink-0 mt-0.5" />
                <span>Online account management and paperless billing</span>
              </li>
              {plan.features.includes('renewable') && (
                <li className="flex items-start">
                  <Check className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400 mr-1.5 flex-shrink-0 mt-0.5" />
                  <span>Powered by 100% renewable energy sources</span>
                </li>
              )}
              {plan.features.includes('guarantee') && (
                <li className="flex items-start">
                  <Check className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400 mr-1.5 flex-shrink-0 mt-0.5" />
                  <span>30-day satisfaction guarantee with option to switch plans</span>
                </li>
              )}
              {plan.features.includes('no-deposit') && (
                <li className="flex items-start">
                  <Check className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400 mr-1.5 flex-shrink-0 mt-0.5" />
                  <span>No deposit required for customers with good credit</span>
                </li>
              )}
              {plan.incentives && (
                <li className="flex items-start">
                  <Check className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400 mr-1.5 flex-shrink-0 mt-0.5" />
                  <span>{plan.incentives}</span>
                </li>
              )}
            </ul>
          </div>
        )}
        
        {activeSection === 'fine-print' && (
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-2">Important Terms</h4>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                Prices shown include all recurring charges and fees. Your total bill will include taxes which vary by location. 
                This plan is subject to change based on changes in law or regulatory charges. 
                The Early Termination Fee applies if you switch providers before your contract term ends, except when moving to a new location.
                Please review the Electricity Facts Label (EFL) and Terms of Service (TOS) for complete details.
              </p>
              
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                <p>Rate displayed is for the Oncor service area. Rates may vary for other service areas.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanDetailAccordion;