import { useCallback } from 'react';
import { logError, logWarning, logInfo } from '@/lib/errorTracking';

interface UseErrorHandlerOptions {
  component?: string;
  showUserFeedback?: boolean;
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const { component = 'Unknown', showUserFeedback = false } = options;

  const handleError = useCallback((error: Error, action?: string, metadata?: Record<string, any>) => {
    logError(error, {
      component,
      action,
      metadata
    });

    if (showUserFeedback) {
      // Could show a toast notification here
      console.error(`Error in ${component}:`, error.message);
    }
  }, [component, showUserFeedback]);

  const handleWarning = useCallback((message: string, action?: string, metadata?: Record<string, any>) => {
    logWarning(message, {
      component,
      action,
      metadata
    });
  }, [component]);

  const handleInfo = useCallback((message: string, action?: string, metadata?: Record<string, any>) => {
    logInfo(message, {
      component,
      action,
      metadata
    });
  }, [component]);

  const safeAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    fallback?: T,
    errorAction?: string
  ): Promise<T | undefined> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error as Error, errorAction || 'async_operation');
      return fallback;
    }
  }, [handleError]);

  const safeSync = useCallback(<T>(
    syncFn: () => T,
    fallback?: T,
    errorAction?: string
  ): T | undefined => {
    try {
      return syncFn();
    } catch (error) {
      handleError(error as Error, errorAction || 'sync_operation');
      return fallback;
    }
  }, [handleError]);

  return {
    handleError,
    handleWarning,
    handleInfo,
    safeAsync,
    safeSync
  };
}