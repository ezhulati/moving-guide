import React, { ReactNode, useEffect, useState } from 'react';

interface AbTestVariantProps {
  id: string;
  variant: 'A' | 'B';
  children: ReactNode;
  onRender?: (variant: 'A' | 'B') => void;
}

const AbTestVariant: React.FC<AbTestVariantProps> = ({
  id,
  variant,
  children,
  onRender
}) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<'A' | 'B' | null>(null);
  
  useEffect(() => {
    // Check if this user already has an assigned variant for this test
    const storedVariant = localStorage.getItem(`ab_test_${id}`);
    
    if (storedVariant === 'A' || storedVariant === 'B') {
      // User already has an assigned variant
      setSelectedVariant(storedVariant);
    } else {
      // Assign a new variant (50/50 split)
      const newVariant = Math.random() < 0.5 ? 'A' : 'B';
      localStorage.setItem(`ab_test_${id}`, newVariant);
      setSelectedVariant(newVariant);
      
      // Track assignment in analytics (could be integrated with real analytics)
      console.log(`A/B Test ${id}: User assigned to variant ${newVariant}`);
    }
  }, [id]);
  
  useEffect(() => {
    // Determine if this component should render based on the selected variant
    if (selectedVariant === variant) {
      setShouldRender(true);
      
      // Call onRender callback if provided
      if (onRender) {
        onRender(variant);
      }
      
      // Track impression in analytics (could be integrated with real analytics)
      console.log(`A/B Test ${id}: Displayed variant ${variant}`);
    } else {
      setShouldRender(false);
    }
  }, [selectedVariant, variant, id, onRender]);

  return shouldRender ? <>{children}</> : null;
};

export default AbTestVariant;