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
    primary: 'bg-primary text-on-primary hover:bg-primary/95 border border-transparent',
    secondary: 'bg-surface text-secondary border border-outline-variant hover:bg-surface-container-low',
    accent: 'bg-brand-accent text-white hover:bg-brand-accent/90 border border-transparent',
    success: 'bg-success text-white hover:bg-success/90 border border-transparent',
    warning: 'bg-warning text-white hover:bg-warning/90 border border-transparent',
    danger: 'bg-danger text-white hover:bg-danger/90 border border-transparent',
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
