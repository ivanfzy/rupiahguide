import React from 'react';
import { cn } from '@/lib/utils';

interface CardOverlapProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardOverlap = React.forwardRef<HTMLDivElement, CardOverlapProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative z-10 transition-all duration-300",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardOverlap.displayName = "CardOverlap";

export { CardOverlap };
