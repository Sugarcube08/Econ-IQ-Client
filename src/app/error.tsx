'use client';

import React, { useEffect } from 'react';

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // API Error Logging & Diagnostics
    console.error('--- FRONTEND GLOBAL RUNTIME ERROR BOUNDARY ---');
    console.error('Error Details:', error.message);
    if (error.stack) console.error('Stack Trace:', error.stack);
    if (error.digest) console.error('Error Digest:', error.digest);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-lg">
      <div className="max-w-md w-full bg-surface rounded-xl border border-outline-variant p-xl shadow-lg space-y-lg text-center">
        <div className="w-16 h-16 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto animate-pulse">
          <span className="material-symbols-outlined text-[36px]">terminal</span>
        </div>
        
        <div className="space-y-sm">
          <h2 className="font-headline text-xl font-bold text-primary">System Telemetry Interrupted</h2>
          <p className="font-sans text-xs text-outline leading-relaxed">
            A fatal runtime exception occurred within the visualization context. The query loop was halted to prevent data contamination.
          </p>
        </div>

        {error.message && (
          <div className="p-md rounded bg-secondary text-left border border-outline-variant/30 text-xs font-mono break-all text-error">
            <span className="font-semibold text-brand-gold block mb-1">Telemetry Exception:</span>
            {error.message}
          </div>
        )}

        <div className="flex gap-sm pt-md">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 px-4 py-2 border border-secondary text-secondary font-sans font-semibold text-xs rounded hover:bg-surface-container transition-colors cursor-pointer"
          >
            Hard Reload
          </button>
          
          <button
            onClick={() => reset()}
            className="flex-1 px-4 py-2 bg-brand-accent text-white font-sans font-semibold text-xs rounded hover:brightness-110 transition-colors shadow-sm cursor-pointer"
          >
            Retry Execution
          </button>
        </div>

        <div className="text-[10px] text-outline pt-sm border-t border-outline-variant/30 flex justify-between items-center font-mono">
          <span>Digest: {error.digest || 'No digest'}</span>
          <span className="flex items-center gap-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-ping"></span>
            Degraded State
          </span>
        </div>
      </div>
    </div>
  );
}
