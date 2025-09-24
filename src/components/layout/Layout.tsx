import React, { ReactNode, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileOptimizedLayout from './MobileOptimizedLayout';
import { usePersonalization } from '../shared/PersonalizationEngine';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { personalizationState, updateBehaviors } = usePersonalization();
  const location = useLocation();
  
  // Track page views and interaction times
  useEffect(() => {
    // Track page view on route change
    updateBehaviors({
      pageViews: personalizationState.userBehaviors.pageViews + 1,
      currentPage: location.pathname
    });
    
    // Record the start time for this page view
    const startTime = Date.now();
    
    // When component unmounts, calculate time spent on page
    return () => {
      const timeSpent = (Date.now() - startTime) / 1000; // in seconds
      updateBehaviors({
        timeSpent: personalizationState.userBehaviors.timeSpent + timeSpent
      });
    };
  }, [location.pathname]);
  
  // Use mobile optimized layout for small screens
  const isMobile = personalizationState.userBehaviors.deviceType === 'mobile';
  
  // Special pages that need the full height of the screen and minimal UI
  const isFullscreenPage = 
    location.pathname.includes('/wizard/confirmation') ||
    location.pathname.includes('/wizard/checklist');
  
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      {/* Only show navbar on non-fullscreen pages */}
      {!isFullscreenPage && <Navbar />}
      
      <MobileOptimizedLayout>
        <main className="flex-grow">
          {children}
        </main>
      </MobileOptimizedLayout>
      
      {/* Only show footer on non-fullscreen pages */}
      {!isFullscreenPage && <Footer />}
    </div>
  );
};

export default Layout;