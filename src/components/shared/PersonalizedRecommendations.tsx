import React, { useState, useEffect } from 'react';
import { usePersonalization } from './PersonalizationEngine';
import { useWizard } from '../../context/WizardContext';
import { 
  Lightbulb, ArrowRight, DollarSign, Leaf, Home, 
  Clock, CheckCircle, Shield, Info, Zap
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { Link } from 'react-router-dom';

interface PersonalizedRecommendationsProps {
  className?: string;
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({ className }) => {
  const { 
    personalizationState, 
    getPersonalizedPlanRecommendation, 
    getPersonalizedMessage,
    getPriceConsciousnessLevel,
    getRiskToleranceLevel
  } = usePersonalization();
  
  const { wizardState } = useWizard();
  const [animate, setAnimate] = useState(false);

  // Trigger animation effect on initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Get personalized recommendations based on user profile
  const getRecommendations = () => {
    const deviceType = personalizationState.userBehaviors.deviceType;
    const recommendations = [];

    // Price-conscious recommendation
    if (getPriceConsciousnessLevel() === 'high') {
      recommendations.push({
        icon: <DollarSign className="h-5 w-5 text-green-500" />,
        title: "Value-Focused Plans",
        description: "Based on your preferences, we've highlighted the most cost-effective plans for your usage pattern.",
        action: "See Value Plans",
        link: "/wizard/plan-selection"
      });
    }

    // Green energy recommendation
    if (personalizationState.userPreferences.greenEnergy) {
      recommendations.push({
        icon: <Leaf className="h-5 w-5 text-green-500" />,
        title: "Renewable Energy Options",
        description: "You've shown interest in green energy. Texas leads the nation in wind power, with many affordable options.",
        action: "Explore Green Plans",
        link: "/wizard/plan-filters"
      });
    }

    // Home size-based recommendation
    if (wizardState.homeProfile.squareFootage > 2000) {
      recommendations.push({
        icon: <Home className="h-5 w-5 text-blue-500" />,
        title: "High-Usage Optimized Plans",
        description: "For your larger home, we've identified plans with excellent tiered rates and bill credits at higher usage levels.",
        action: "View Optimized Plans",
        link: "/wizard/plan-selection"
      });
    }

    // Time-based recommendation (urgent need)
    if (personalizationState.userPreferences.serviceSpeed === 'priority') {
      recommendations.push({
        icon: <Clock className="h-5 w-5 text-amber-500" />,
        title: "Same-Day Connection",
        description: "Need power today? We've highlighted plans with guaranteed same-day connection when ordered before 5PM.",
        action: "Get Connected Today",
        link: "/wizard/service-details"
      });
    }

    // No-deposit recommendation
    if (personalizationState.userPreferences.depositsAversion) {
      recommendations.push({
        icon: <Shield className="h-5 w-5 text-purple-500" />,
        title: "No-Deposit Plans",
        description: "Avoid upfront costs with these no-deposit electricity plans that don't require a credit check.",
        action: "See No-Deposit Options",
        link: "/wizard/plan-filters"
      });
    }

    // Device-specific recommendations
    if (deviceType === 'mobile') {
      recommendations.push({
        icon: <Zap className="h-5 w-5 text-primary-500" />,
        title: "Quick Setup for Mobile",
        description: "On the go? Our streamlined mobile process lets you set up electricity in under 3 minutes.",
        action: "Try Express Setup",
        link: "/wizard/address"
      });
    }

    // If we have no specific recommendations, provide a default
    if (recommendations.length === 0) {
      recommendations.push({
        icon: <Lightbulb className="h-5 w-5 text-yellow-500" />,
        title: "Personalized Suggestions",
        description: "As you navigate our site, we'll learn your preferences to provide more tailored recommendations.",
        action: "Explore Plans",
        link: "/wizard/plan-selection"
      });
    }

    return recommendations.slice(0, 3); // Return at most 3 recommendations
  };

  const recommendations = getRecommendations();
  const personalizedMessage = getPersonalizedMessage();

  return (
    <div 
      className={cn(
        "bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden",
        animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        "transition-all duration-500",
        className
      )}
    >
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/40 dark:to-primary-800/30 px-4 py-3 border-b border-primary-100 dark:border-primary-800">
        <div className="flex items-center">
          <Lightbulb className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
          <h3 className="text-base font-medium text-primary-800 dark:text-primary-200">
            Just For You
          </h3>
        </div>
      </div>
      
      <div className="p-4">
        {personalizedMessage && (
          <div className="mb-4 text-gray-600 dark:text-gray-300 text-sm">
            {personalizedMessage}
          </div>
        )}
        
        <div className="space-y-3">
          {recommendations.map((rec, index) => (
            <div 
              key={index}
              className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-shadow"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-3">
                  {rec.icon}
                </div>
                <div className="flex-grow">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {rec.title}
                  </h4>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    {rec.description}
                  </p>
                  <Link 
                    to={rec.link}
                    className="mt-2 inline-flex items-center text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                  >
                    {rec.action} <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Mobile-specific UI enhancements */}
      {personalizationState.userBehaviors.deviceType === 'mobile' && (
        <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-800">
          <div className="flex items-center">
            <Info className="h-4 w-4 text-blue-500 dark:text-blue-400 mr-2" />
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Quick tip: Turn your phone sideways for easier plan comparison on smaller screens
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalizedRecommendations;