import React from 'react';
import { cn } from '@/lib/utils';

interface HeroSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const HeroSection = React.forwardRef<HTMLDivElement, HeroSectionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-gradient-to-br from-stone-200 via-stone-300/50 to-stone-200 text-stone-800 px-6 shadow-sm relative overflow-hidden shrink-0 transition-all duration-300 border-b border-stone-300/50",
          className
        )}
        {...props}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-stone-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>
        {children}
      </div>
    );
  }
);

HeroSection.displayName = "HeroSection";

export { HeroSection };
