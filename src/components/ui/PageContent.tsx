'use client';

import React from 'react';

interface PageContentProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContent({ children, className = '' }: PageContentProps) {
  return (
    <div className={`space-y-6 md:space-y-8 animate-fade-in ${className}`}>
      {children}
    </div>
  );
}
