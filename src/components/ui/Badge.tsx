'use client';

import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

export default function Badge({
  children,
  variant = 'info',
  size = 'md',
  className = '',
  ...props
}: BadgeProps) {
  
  const baseStyle = 'inline-flex items-center font-sans font-bold uppercase tracking-wider rounded-full border';

  const variants = {
    primary: 'bg-[#161A1D]/10 border-[#161A1D]/30 text-[#161A1D]',
    secondary: 'bg-[#243447]/10 border-[#243447]/30 text-[#243447]',
    accent: 'bg-[#0F766E]/10 border-[#0F766E]/30 text-[#0F766E]',
    success: 'bg-[#2E7D32]/10 border-[#2E7D32]/30 text-[#2E7D32]',
    warning: 'bg-[#B7791F]/10 border-[#B7791F]/30 text-[#B7791F]',
    danger: 'bg-[#B91C1C]/10 border-[#B91C1C]/30 text-[#B91C1C]',
    info: 'bg-[#6B7280]/10 border-[#6B7280]/30 text-[#6B7280]'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[9px]',
    md: 'px-2.5 py-0.5 text-[10px]'
  };

  return (
    <span
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
