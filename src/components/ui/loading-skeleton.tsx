
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'default' | 'card' | 'text' | 'avatar' | 'button';
  lines?: number;
}

const LoadingSkeleton = ({ 
  className, 
  variant = 'default',
  lines = 1 
}: LoadingSkeletonProps) => {
  const baseClasses = "animate-pulse bg-gray-200 dark:bg-gray-700 rounded";
  
  const variants = {
    default: "h-4 w-full",
    card: "h-32 w-full rounded-lg",
    text: "h-4",
    avatar: "h-10 w-10 rounded-full",
    button: "h-10 w-24 rounded-lg"
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              variants.text,
              i === lines - 1 ? "w-3/4" : "w-full",
              className
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        baseClasses,
        variants[variant],
        className
      )}
    />
  );
};

// Pre-built skeleton components for common use cases
const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={cn("p-6 border border-gray-200 dark:border-gray-700 rounded-lg", className)}>
    <div className="space-y-4">
      <LoadingSkeleton variant="text" lines={3} />
      <LoadingSkeleton variant="button" />
    </div>
  </div>
);

const SkeletonAvatar = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center space-x-3", className)}>
    <LoadingSkeleton variant="avatar" />
    <div className="space-y-2">
      <LoadingSkeleton className="h-4 w-24" />
      <LoadingSkeleton className="h-3 w-32" />
    </div>
  </div>
);

const SkeletonTable = ({ rows = 5 }: { rows?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex space-x-4">
        <LoadingSkeleton className="h-4 w-1/4" />
        <LoadingSkeleton className="h-4 w-1/3" />
        <LoadingSkeleton className="h-4 w-1/4" />
        <LoadingSkeleton className="h-4 w-1/6" />
      </div>
    ))}
  </div>
);

export { 
  LoadingSkeleton, 
  SkeletonCard, 
  SkeletonAvatar, 
  SkeletonTable 
};
export default LoadingSkeleton;
