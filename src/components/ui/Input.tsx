import React from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({ label, error, hint, leftIcon, rightIcon, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm text-gray-400 font-medium">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-gray-500 pointer-events-none">{leftIcon}</div>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full bg-white/5 border border-white/10 rounded-xl',
            'text-white placeholder-gray-600 text-sm',
            'focus:outline-none focus:border-green-500/50 focus:bg-white/8',
            'transition-all duration-200',
            leftIcon ? 'pl-10 pr-4 py-3' : 'px-4 py-3',
            rightIcon ? 'pr-10' : '',
            error && 'border-red-500/50 focus:border-red-500/70',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 text-gray-500">{rightIcon}</div>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-600">{hint}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({ label, error, hint, className, id, ...props }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm text-gray-400 font-medium">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn(
          'w-full bg-white/5 border border-white/10 rounded-xl',
          'text-white placeholder-gray-600 text-sm',
          'focus:outline-none focus:border-green-500/50 focus:bg-white/8',
          'transition-all duration-200 resize-none',
          'px-4 py-3',
          error && 'border-red-500/50',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-600">{hint}</p>}
    </div>
  );
}
