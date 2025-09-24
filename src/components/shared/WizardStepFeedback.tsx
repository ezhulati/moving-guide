import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Smile, Frown, Star, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { usePersonalization } from './PersonalizationEngine';
import { useWizard } from '../../context/WizardContext';

interface WizardStepFeedbackProps {
  stepId: string;
  className?: string;
}

const WizardStepFeedback: React.FC<WizardStepFeedbackProps> = ({ 
  stepId,
  className 
}) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const { personalizationState, updateBehaviors } = usePersonalization();
  const { wizardState } = useWizard();
  
  // Determine if this is a good step to ask for feedback
  useEffect(() => {
    // Don't show on first step or last step
    if (stepId === 'welcome' || stepId === 'checklist') {
      return;
    }
    
    // Show feedback request after user completes key steps 
    // like plan selection or address confirmation
    if (['plan-selection', 'address-confirmation', 'service-details'].includes(stepId)) {
      // Only show after a delay to let the user interact with the page first
      const timer = setTimeout(() => {
        // Show feedback request to 20% of users randomly
        if (Math.random() < 0.2 && !feedbackSubmitted) {
          setShowFeedback(true);
        }
      }, 15000); // 15 seconds
      
      return () => clearTimeout(timer);
    }
  }, [stepId, feedbackSubmitted]);
  
  // Submit feedback
  const handleSubmitFeedback = () => {
    if (rating === null) return;
    
    setIsSubmitting(true);
    
    // In a real app, this would send data to an API
    // For now, we'll just simulate the API call
    setTimeout(() => {
      // Store feedback in personalization engine
      updateBehaviors({
        stepFeedback: {
          ...personalizationState.userBehaviors.stepFeedback,
          [stepId]: { rating, comment, timestamp: new Date().toISOString() }
        }
      });
      
      setIsSubmitting(false);
      setFeedbackSubmitted(true);
      
      // Auto-dismiss after showing thank you message
      setTimeout(() => {
        setShowFeedback(false);
      }, 3000);
    }, 1000);
  };
  
  // If not showing feedback, return null
  if (!showFeedback) {
    return null;
  }
  
  return (
    <div 
      className={cn(
        "fixed bottom-16 right-4 z-20 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-64 overflow-hidden",
        "transition-all duration-300 ease-in-out",
        "animate-slide-up",
        className
      )}
    >
      <div className="p-3 bg-primary-50 dark:bg-primary-900/30 border-b border-primary-100 dark:border-primary-800 flex justify-between items-center">
        <h3 className="text-sm font-medium text-primary-800 dark:text-primary-200">
          {feedbackSubmitted ? 'Thank you!' : 'Quick feedback?'}
        </h3>
        <button
          onClick={() => setShowFeedback(false)}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="p-4">
        {feedbackSubmitted ? (
          <div className="text-center">
            <Smile className="h-8 w-8 text-success-500 dark:text-success-400 mx-auto mb-2" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Thanks for helping us improve!
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
              How was your experience with this step?
            </p>
            
            <div className="flex justify-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={cn(
                    "p-1 rounded-full transition-colors",
                    rating && star <= rating 
                      ? "text-yellow-400 hover:text-yellow-500" 
                      : "text-gray-300 hover:text-gray-400 dark:text-gray-600 dark:hover:text-gray-500"
                  )}
                  aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                >
                  <Star className="h-6 w-6" fill={rating && star <= rating ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
            
            {rating !== null && (
              <div className="animate-fade-in space-y-3">
                <textarea
                  placeholder="Any specific feedback? (optional)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  rows={2}
                ></textarea>
                
                <button
                  onClick={handleSubmitFeedback}
                  disabled={isSubmitting}
                  className={cn(
                    "w-full py-2 px-4 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
                    isSubmitting && "opacity-70 cursor-wait"
                  )}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WizardStepFeedback;