'use client';

import React from 'react';
import { LucideIcon, Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  
  const baseStyle = 'inline-flex items-center justify-center font-sans font-bold text-xs uppercase tracking-wider rounded transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

  const variants = {
    primary: 'bg-[#161A1D] text-white hover:bg-[#161A1D]/90 border border-transparent',
    secondary: 'bg-white text-[#243447] border border-[#E3E2DF] hover:bg-[#F8F7F4]',
    accent: 'bg-[#0F766E] text-white hover:bg-[#0F766E]/90 border border-transparent',
    success: 'bg-[#2E7D32] text-white hover:bg-[#2E7D32]/90 border border-transparent',
    warning: 'bg-[#B7791F] text-white hover:bg-[#B7791F]/90 border border-transparent',
    danger: 'bg-[#B91C1C] text-white hover:bg-[#B91C1C]/90 border border-transparent',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[10px] h-8',
    md: 'px-5 py-2.5 h-10',
    lg: 'px-8 py-3 h-12 text-sm',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0 mr-2" />
      ) : Icon && iconPosition === 'left' ? (
        <Icon className="w-4 h-4 shrink-0 mr-1.5" />
      ) : null}
      
      {children}
      
      {!isLoading && Icon && iconPosition === 'right' ? (
        <Icon className="w-4 h-4 shrink-0 ml-1.5" />
      ) : null}
    </button>
  );
}
