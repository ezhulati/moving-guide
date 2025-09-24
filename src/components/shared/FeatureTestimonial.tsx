import { Star, Quote } from 'lucide-react';
import { cn } from '../../utils/cn';

interface FeatureTestimonialProps {
  quote: string;
  author: {
    name: string;
    location: string;
    avatar?: string;
  };
  feature: string;
  rating?: number;
  className?: string;
  theme?: 'light' | 'primary' | 'subtle';
}

const FeatureTestimonial: React.FC<FeatureTestimonialProps> = ({
  quote,
  author,
  feature,
  rating = 5,
  className,
  theme = 'light'
}) => {
  // Generate avatar initials if no avatar URL provided
  const initials = author.name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  // Background and text styles based on theme
  const themeStyles = {
    light: {
      container: 'bg-white border border-gray-200',
      quote: 'text-gray-700',
      feature: 'text-gray-900 bg-gray-100',
      featureText: 'text-primary-700',
      nameText: 'text-gray-900',
      locationText: 'text-gray-500',
      avatarBg: 'bg-gray-200 text-gray-600'
    },
    primary: {
      container: 'bg-primary-50 border border-primary-200',
      quote: 'text-primary-800',
      feature: 'text-primary-800 bg-primary-100',
      featureText: 'text-primary-800',
      nameText: 'text-primary-900',
      locationText: 'text-primary-700',
      avatarBg: 'bg-primary-200 text-primary-700'
    },
    subtle: {
      container: 'bg-gray-50 border border-gray-100',
      quote: 'text-gray-600',
      feature: 'text-gray-700 bg-white border border-gray-200',
      featureText: 'text-primary-600',
      nameText: 'text-gray-800',
      locationText: 'text-gray-500',
      avatarBg: 'bg-gray-100 text-gray-600'
    }
  };
  
  const styles = themeStyles[theme];
  
  return (
    <div className={cn('rounded-lg shadow-sm p-4 transition-shadow hover:shadow-md', styles.container, className)}>
      <div className="flex justify-between items-start mb-3">
        <div className={cn('rounded-full px-3 py-1 text-xs font-medium flex items-center', styles.feature)}>
          <span className={styles.featureText}>{feature}</span>
        </div>
        
        {rating > 0 && (
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={cn(
                  "h-3.5 w-3.5", 
                  i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
                )} 
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="flex mb-4">
        <Quote className="h-6 w-6 text-gray-300 mr-2 flex-shrink-0" />
        <p className={cn("text-sm", styles.quote)}>
          {quote}
        </p>
      </div>
      
      <div className="flex items-center mt-4">
        {author.avatar ? (
          <img 
            src={author.avatar} 
            alt={author.name}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className={cn("h-8 w-8 rounded-full flex items-center justify-center font-medium text-sm", styles.avatarBg)}>
            {initials}
          </div>
        )}
        <div className="ml-3">
          <p className={cn("text-sm font-medium", styles.nameText)}>{author.name}</p>
          <p className={cn("text-xs", styles.locationText)}>{author.location}</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureTestimonial;