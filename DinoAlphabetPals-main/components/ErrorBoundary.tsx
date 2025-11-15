'use client';

import React, { Component, ReactNode } from 'react';
import { logError } from '@/lib/errorTracking';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: any) {
    // Log the error with context
    logError(error, {
      component: 'ErrorBoundary',
      action: 'component_error',
      metadata: {
        componentStack: errorInfo.componentStack,
        errorBoundary: true
      }
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  override render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default child-friendly error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center p-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center border-4 border-blue-200">
            <div className="text-6xl mb-4">🦕</div>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              Don't worry! Your dino friend is working to fix this. 
              Try refreshing the page to continue your adventure!
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg"
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;