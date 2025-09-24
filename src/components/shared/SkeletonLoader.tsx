import { cn } from '../../utils/cn';

type SkeletonProps = {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  animate?: boolean;
};

const SkeletonLoader: React.FC<SkeletonProps> = ({ 
  className, 
  width, 
  height,
  rounded = 'md',
  animate = true
}) => {
  const roundedStyles = {
    'none': '',
    'sm': 'rounded-sm',
    'md': 'rounded-md',
    'lg': 'rounded-lg',
    'full': 'rounded-full',
  };
  
  return (
    <div 
      className={cn(
        'bg-gray-200', 
        animate ? 'animate-pulse' : '',
        roundedStyles[rounded],
        className
      )}
      style={{ 
        width: width, 
        height: height
      }}
      aria-hidden="true"
    />
  );
};

export const TextSkeleton: React.FC<{ lines?: number; width?: string; className?: string }> = ({ 
  lines = 1, 
  width = '100%',
  className 
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLoader
          key={i}
          className="h-4"
          width={i === lines - 1 && lines > 1 ? '80%' : width}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;