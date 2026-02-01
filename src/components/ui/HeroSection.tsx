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
          "bg-slate-900 text-white px-6 shadow-2xl relative overflow-hidden shrink-0 transition-all duration-300",
          className
        )}
        {...props}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        {children}
      </div>
    );
  }
);

HeroSection.displayName = "HeroSection";

export { HeroSection };
