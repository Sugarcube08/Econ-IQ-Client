'use client';

import React from 'react';

interface PageToolbarProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageToolbar({ children, className = '' }: PageToolbarProps) {
  return (
    <div className={`flex flex-col md:flex-row gap-4 items-center justify-between bg-surface border border-outline-variant p-4 rounded-xl shadow-sm mb-6 ${className}`}>
      {children}
    </div>
  );
}
