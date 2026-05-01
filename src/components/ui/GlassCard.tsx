import React from 'react';
import { cn } from '@/utils/cn';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
}

export function GlassCard({ children, className, glow = false, hover = false, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl border border-white/10',
        'bg-white/5 backdrop-blur-xl',
        'shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
        glow && 'shadow-[0_0_30px_rgba(34,197,94,0.15),0_8px_32px_rgba(0,0,0,0.4)]',
        hover && 'transition-all duration-300 hover:border-green-500/30 hover:shadow-[0_0_40px_rgba(34,197,94,0.2),0_8px_32px_rgba(0,0,0,0.5)] hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
