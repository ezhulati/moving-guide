import React, { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { usePersonalization } from '../shared/PersonalizationEngine';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface MobileOptimizedLayoutProps {
  children: ReactNode;
}

const MobileOptimizedLayout: React.FC<MobileOptimizedLayoutProps> = ({ children }) => {
  const { personalizationState } = usePersonalization();
  const isMobile = personalizationState.userBehaviors.deviceType === 'mobile';
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Handle scroll events to optimize header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Get page title based on URL
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'ComparePower';
    if (path.includes('/wizard/welcome')) return 'Get Started';
    if (path.includes('/wizard/address')) return 'Your Address';
    if (path.includes('/wizard/home-profile')) return 'Home Profile';
    if (path.includes('/wizard/plan-filters')) return 'Plan Options';
    if (path.includes('/wizard/plan-selection')) return 'Select a Plan';
    if (path.includes('/wizard/personal-details')) return 'Your Details';
    if (path.includes('/wizard/service-details')) return 'Service Options';
    if (path.includes('/wizard/confirmation')) return 'Confirmation';
    if (path.includes('/city-guides')) return 'City Guides';
    if (path.includes('/transfer')) return 'Transfer Service';
    if (path.includes('/blog')) return 'Checklist';
    
    return 'ComparePower';
  };
  
  // Check if we should show back button
  const shouldShowBackButton = () => {
    return location.pathname !== '/';
  };
  
  // If not mobile, just return children
  if (!isMobile) {
    return <>{children}</>;
  }
  
  // For wizard flow, we need a specialized mobile layout
  const isWizardFlow = location.pathname.includes('/wizard/');
  
  return (
    <div className="mobile-optimized-container">
      {/* Simplified mobile header for wizard flow */}
      {isWizardFlow && (
        <header 
          className={cn(
            "sticky top-0 z-40 bg-white dark:bg-gray-900 transition-all duration-300",
            isScrolled ? "shadow-md dark:shadow-gray-800/30" : ""
          )}
        >
          <div className="flex items-center h-14 px-4">
            {shouldShowBackButton() && (
              <button 
                onClick={() => navigate(-1)}
                className="p-2 -ml-2 rounded-full text-gray-500 dark:text-gray-400"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            
            <h1 className="text-lg font-medium text-gray-900 dark:text-white mx-auto">
              {getPageTitle()}
            </h1>
            
            <div className="w-10"></div> {/* Spacer to balance the layout */}
          </div>
        </header>
      )}
      
      {/* Main content */}
      <div className={isWizardFlow ? "px-4 pb-20" : ""}>
        {children}
      </div>
      
      {/* Add extra padding at the bottom for mobile navigation */}
      <div className="h-16 md:h-0"></div>
      
      {/* Mobile-specific styles */}
      <style jsx>{`
        @media (max-width: 767px) {
          .mobile-optimized-container input, 
          .mobile-optimized-container select, 
          .mobile-optimized-container textarea {
            font-size: 16px;
          }
          
          .mobile-optimized-container button {
            touch-action: manipulation;
          }
        }
      `}</style>
    </div>
  );
};

export default MobileOptimizedLayout;