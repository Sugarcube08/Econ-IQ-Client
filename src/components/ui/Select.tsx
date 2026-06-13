'use client';

import React, { forwardRef } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className = '', id, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full text-xs font-sans">
        {label && (
          <label htmlFor={id} className="font-bold text-outline uppercase tracking-wider block">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={id}
            ref={ref}
            className={`w-full bg-background border rounded-lg px-3.5 py-2.5 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-brand-accent/20 transition-all ${
              error ? 'border-error focus:ring-error/20' : 'border-outline-variant focus:border-brand-accent'
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        {error ? (
          <p className="text-error text-[10px] font-semibold">{error}</p>
        ) : helperText ? (
          <p className="text-outline text-[10px]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
