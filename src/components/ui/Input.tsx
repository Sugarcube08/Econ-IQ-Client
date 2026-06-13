'use client';

import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full text-xs font-sans">
        {label && (
          <label htmlFor={id} className="font-bold text-outline uppercase tracking-wider block">
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={`w-full bg-background border rounded-lg px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-brand-accent/20 transition-all placeholder:text-outline/60 ${
            error ? 'border-error focus:ring-error/20' : 'border-outline-variant focus:border-brand-accent'
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-error text-[10px] font-semibold">{error}</p>
        ) : helperText ? (
          <p className="text-outline text-[10px]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
