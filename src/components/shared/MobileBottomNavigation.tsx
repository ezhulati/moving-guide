import React, { useState, useEffect } from 'react';
import { 
  Home, MapPin, User, Zap, HelpCircle, 
  Menu, X, Search, Phone, Clock
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useWizard } from '../../context/WizardContext';
import { useToast } from '../../context/ToastContext';
import { cn } from '../../utils/cn';

interface MobileBottomNavigationProps {
  className?: string;
}

const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({ className }) => {
  const location = useLocation();
  const { wizardState } = useWizard();
  const { addToast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [needsHelp, setNeedsHelp] = useState(false);
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);
  
  // Check if the user needs help based on time spent on the current page
  useEffect(() => {
    const timer = setTimeout(() => {
      // If user has spent more than 2 minutes on the page without interacting, show help tooltip
      setNeedsHelp(true);
      setShowHelpTooltip(true);
      
      // Hide tooltip after 5 seconds
      setTimeout(() => {
        setShowHelpTooltip(false);
      }, 5000);
    }, 120000); // 2 minutes
    
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  // Check if the device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileViewport(window.innerWidth < 768);
    };
    
    // Check on load
    checkMobile();
    
    // Listen for window resize events
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Hide the navigation on desktop
  if (!isMobileViewport) {
    return null;
  }
  
  // Skip showing bottom navigation on specific screens
  if (location.pathname.includes('/confirmation') || location.pathname.includes('/checklist')) {
    return null;
  }
  
  // Format phone number
  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  };
  
  // Check if current location is wizard flow
  const isWizardFlow = location.pathname.includes('/wizard/');
  
  // Handle help button click
  const handleHelpClick = () => {
    addToast('info', 'Need help? Call us at 1-800-COMPARE', 0, {
      text: 'Call Now',
      onClick: () => {
        window.location.href = 'tel:18002667273';
      }
    });
    
    setNeedsHelp(false);
  };
  
  return (
    <>
      {/* Fixed bottom navigation bar */}
      <div className={cn(
        "fixed bottom-0 inset-x-0 z-30 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 md:hidden",
        className
      )}>
        <div className="grid grid-cols-5 h-16">
          <Link 
            to="/"
            className={cn(
              "flex flex-col items-center justify-center text-xs font-medium",
              location.pathname === '/' ? 
                "text-primary-600 dark:text-primary-400" : 
                "text-gray-600 dark:text-gray-400"
            )}
          >
            <Home className="h-6 w-6 mb-1" />
            <span>Home</span>
          </Link>
          
          <Link 
            to="/city-guides"
            className={cn(
              "flex flex-col items-center justify-center text-xs font-medium",
              location.pathname.includes('/city-guides') ? 
                "text-primary-600 dark:text-primary-400" : 
                "text-gray-600 dark:text-gray-400"
            )}
          >
            <MapPin className="h-6 w-6 mb-1" />
            <span>Cities</span>
          </Link>
          
          {isWizardFlow ? (
            <div className="flex flex-col items-center justify-center -mt-5">
              <div className="relative">
                <div className="absolute -top-5 w-14 h-14 rounded-full bg-primary-600 dark:bg-primary-700 flex items-center justify-center shadow-lg">
                  <Zap className="h-8 w-8 text-white" />
                </div>
              </div>
              <span className="text-xs font-medium text-primary-600 dark:text-primary-400 mt-7">
                Setup
              </span>
            </div>
          ) : (
            <Link 
              to="/wizard/welcome"
              className="flex flex-col items-center justify-center -mt-5"
            >
              <div className="relative">
                <div className="absolute -top-5 w-14 h-14 rounded-full bg-primary-600 dark:bg-primary-700 flex items-center justify-center shadow-lg pulse-animation">
                  <Zap className="h-8 w-8 text-white" />
                </div>
              </div>
              <span className="text-xs font-medium text-primary-600 dark:text-primary-400 mt-7">
                Get Power
              </span>
            </Link>
          )}
          
          <Link 
            to="/transfer"
            className={cn(
              "flex flex-col items-center justify-center text-xs font-medium",
              location.pathname.includes('/transfer') ? 
                "text-primary-600 dark:text-primary-400" : 
                "text-gray-600 dark:text-gray-400"
            )}
          >
            <Zap className="h-6 w-6 mb-1" />
            <span>Transfer</span>
          </Link>
          
          <button
            className={cn(
              "flex flex-col items-center justify-center text-xs font-medium relative",
              isExpanded || needsHelp ? 
                "text-primary-600 dark:text-primary-400" : 
                "text-gray-600 dark:text-gray-400"
            )}
            onClick={() => {
              if (needsHelp) {
                handleHelpClick();
              } else {
                setIsExpanded(!isExpanded);
              }
            }}
          >
            {needsHelp && showHelpTooltip && (
              <div className="absolute -top-16 w-32 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 p-2 rounded-lg text-xs font-medium border border-amber-200 dark:border-amber-800 shadow-md">
                Need help?
                <div className="absolute bottom-0 left-1/2 transform translate-y-1/2 -translate-x-1/2 rotate-45 w-2 h-2 bg-amber-50 dark:bg-amber-900/30 border-r border-b border-amber-200 dark:border-amber-800"></div>
              </div>
            )}
            
            {needsHelp ? (
              <div className="relative">
                <HelpCircle className="h-6 w-6 mb-1" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-amber-500 rounded-full animate-ping"></span>
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-amber-500 rounded-full"></span>
              </div>
            ) : (
              isExpanded ? <X className="h-6 w-6 mb-1" /> : <Menu className="h-6 w-6 mb-1" />
            )}
            <span>{needsHelp ? "Get Help" : "Menu"}</span>
          </button>
        </div>
      </div>
      
      {/* Expanded menu panel */}
      {isExpanded && (
        <div className="fixed bottom-16 inset-x-0 z-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 rounded-t-xl shadow-lg transition-all duration-300 md:hidden">
          <div className="p-4 space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Access</h3>
            
            {/* Contact button */}
            <a
              href="tel:18002667273"
              className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg border border-primary-100 dark:border-primary-800"
            >
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-3" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Need Help?</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">1-800-COMPARE</div>
                </div>
              </div>
              <span className="text-primary-600 dark:text-primary-400">Call</span>
            </a>
            
            {/* Same Day Service button */}
            <Link
              to="/wizard/welcome"
              className="flex items-center justify-between p-3 bg-success-50 dark:bg-success-900/30 rounded-lg border border-success-100 dark:border-success-800"
            >
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-success-600 dark:text-success-400 mr-3" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Same-Day Service</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Get connected today</div>
                </div>
              </div>
              <span className="text-success-600 dark:text-success-400">Order by 5PM</span>
            </Link>
            
            {/* Grid menu items */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link 
                to="/city-guides"
                className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-400 mb-1" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">City Guides</span>
              </Link>
              
              <Link 
                to="/transfer"
                className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <Zap className="h-5 w-5 text-gray-600 dark:text-gray-400 mb-1" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Transfer Service</span>
              </Link>
              
              <Link 
                to="/blog/ultimate-texas-electricity-setup-checklist"
                className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <Check className="h-5 w-5 text-gray-600 dark:text-gray-400 mb-1" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Moving Checklist</span>
              </Link>
              
              <button
                onClick={() => {
                  addToast('info', 'Search feature coming soon!');
                  setIsExpanded(false);
                }}
                className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <Search className="h-5 w-5 text-gray-600 dark:text-gray-400 mb-1" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Search</span>
              </button>
            </div>
          </div>
          
          {/* Close button for expanded menu */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-center">
            <button
              className="text-gray-500 dark:text-gray-400"
              onClick={() => setIsExpanded(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
      
      {/* Backdrop when expanded */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 dark:bg-black/80 z-10 md:hidden animate-fade-in"
          onClick={() => setIsExpanded(false)}
        ></div>
      )}
      
      <style jsx>{`
        @keyframes pulse-animation {
          0% {
            box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(37, 99, 235, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);
          }
        }
        .pulse-animation {
          animation: pulse-animation 2s infinite;
        }
      `}</style>
    </>
  );
};

export default MobileBottomNavigation;