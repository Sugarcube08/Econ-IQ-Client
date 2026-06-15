'use client';

import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import Button from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = 'System Telemetry Warning',
  message = 'Secure connection to Econiq core analytical engines could not be established. Verify host connection.',
  onRetry
}: ErrorStateProps) {
  return (
    <div className="p-8 md:p-12 bg-error-container/10 border border-error/35 rounded-xl text-center max-w-lg mx-auto font-sans shadow-sm">
      <AlertTriangle className="text-error w-12 h-12 mx-auto" />
      <h3 className="font-headline text-xl font-bold text-error mt-4">
        {title}
      </h3>
      <p className="font-sans text-xs sm:text-sm text-outline mt-2 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <div className="mt-6 flex justify-center">
          <Button
            onClick={onRetry}
            variant="secondary"
            size="sm"
            icon={RotateCcw}
            className="border-error/45 text-error hover:bg-error/5"
          >
            Retry Connection
          </Button>
        </div>
      )}
    </div>
  );
}
