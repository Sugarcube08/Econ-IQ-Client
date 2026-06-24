'use client';

import React from 'react';

interface LoadingStateProps {
  message?: string;
  type?: 'spinner' | 'skeleton';
}

export default function LoadingState({ message = 'Reconstructing ledger telemetries...', type = 'skeleton' }: LoadingStateProps) {
  if (type === 'skeleton') {
    return (
      <div className="space-y-6 w-full animate-pulse">
        <div className="h-8 bg-surface-container-high rounded-lg w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-surface-container rounded-xl"></div>
          <div className="h-32 bg-surface-container rounded-xl"></div>
          <div className="h-32 bg-surface-container rounded-xl"></div>
        </div>
        <div className="h-64 bg-surface-container rounded-xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6">
      <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-sans text-sm text-outline tracking-wide">
        {message}
      </p>
    </div>
  );
}
