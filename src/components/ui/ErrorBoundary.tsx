import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { GlassCard, GlassButton } from './Glass';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="h-full w-full flex items-center justify-center p-6">
          <GlassCard className="max-w-md w-full p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-danger/10 text-danger flex items-center justify-center mb-6">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="text-secondary-text mb-8 text-sm">
              {this.state.error?.message || "An unexpected error occurred in this module."}
            </p>
            <GlassButton 
              onClick={() => this.setState({ hasError: false, error: undefined })}
              className="w-full"
            >
              Try Again
            </GlassButton>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}
