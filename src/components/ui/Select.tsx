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
          <label htmlFor={id} className="font-bold text-[#6B7280] uppercase tracking-wider block">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={id}
            ref={ref}
            className={`w-full bg-[#F8F7F4] border rounded-lg px-3.5 py-2.5 text-xs text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#0F766E]/40 transition-all ${
              error ? 'border-[#B91C1C] focus:ring-[#B91C1C]/20' : 'border-[#E3E2DF] focus:border-[#0F766E]'
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
          <p className="text-[#B91C1C] text-[10px] font-semibold">{error}</p>
        ) : helperText ? (
          <p className="text-[#6B7280] text-[10px]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
