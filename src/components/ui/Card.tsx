'use client';

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  elevation?: 'none' | 'low' | 'medium';
}

export function Card({
  children,
  hoverable = false,
  elevation = 'low',
  className = '',
  ...props
}: CardProps) {
  
  const shadows = {
    none: 'shadow-none',
    low: 'shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.03)]',
    medium: 'shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)]',
  };

  const hoverStyle = hoverable ? 'hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 transition-all duration-300' : '';

  return (
    <div
      className={`bg-white border border-[#E3E2DF] rounded-xl p-6 ${shadows[elevation]} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function CardHeader({
  title,
  subtitle,
  action,
  className = '',
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={`flex items-start justify-between gap-4 border-b border-[#E3E2DF]/60 pb-4 mb-4 ${className}`}
      {...props}
    >
      <div className="space-y-1">
        <h3 className="font-headline text-sm font-bold text-[#111827] uppercase tracking-wider">
          {title}
        </h3>
        {subtitle && (
          <p className="font-sans text-xs text-[#6B7280] leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({ children, className = '', ...props }: CardContentProps) {
  return (
    <div className={`font-sans text-xs sm:text-sm text-[#6B7280] leading-relaxed space-y-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardFooter({ children, className = '', ...props }: CardFooterProps) {
  return (
    <div
      className={`flex items-center justify-between gap-4 border-t border-[#E3E2DF]/60 pt-4 mt-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
