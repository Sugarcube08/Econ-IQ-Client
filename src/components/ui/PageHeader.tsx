'use client';

import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/20 pb-6 mb-6">
      <div className="space-y-1">
        <h1 className="font-headline text-[32px] font-extrabold text-primary tracking-tight leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="font-sans text-[16px] font-normal text-outline leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
