'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { telemetry } from '@/lib/telemetry';
import Button from '@/components/ui/Button';
import { AlertOctagon, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  routeName: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class RouteErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    telemetry.log('render', 'error', `Render crash in route: ${this.props.routeName}`, {
      errorMessage: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-slate-50 border border-red-200/60 rounded-2xl space-y-4 max-w-2xl mx-auto my-8 font-sans">
          <div className="flex items-center gap-3 text-red-600">
            <AlertOctagon className="w-8 h-8" />
            <div>
              <h3 className="font-headline text-lg font-bold">Route Telemetry Interrupted</h3>
              <p className="text-xs text-slate-500">Failed to render page: {this.props.routeName}</p>
            </div>
          </div>
          
          {this.state.error && (
            <div className="p-4 bg-slate-900 text-red-400 font-mono text-xs rounded-xl overflow-x-auto max-h-40 border border-slate-800">
              {this.state.error.message}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={this.handleReset}
              variant="accent"
              size="sm"
              icon={RefreshCw}
            >
              Retry Render
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="secondary"
              size="sm"
            >
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
