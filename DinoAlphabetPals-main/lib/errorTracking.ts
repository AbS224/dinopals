interface ErrorContext {
  userId?: string;
  sessionId: string;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
}

interface ErrorLog {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  context: ErrorContext;
  userAgent: string;
  url: string;
}

class ErrorTracker {
  private sessionId: string;
  private logs: ErrorLog[] = [];
  private maxLogs = 100; // Keep last 100 errors in memory

  constructor() {
    this.sessionId = this.generateSessionId();
    // Only setup global error handlers on the client side
    if (typeof window !== 'undefined') {
      this.setupGlobalErrorHandlers();
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupGlobalErrorHandlers() {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Catch unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.logError(new Error(event.message), {
        component: 'Global',
        action: 'unhandled_error',
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError(new Error(`Unhandled Promise Rejection: ${event.reason}`), {
        component: 'Global',
        action: 'unhandled_promise_rejection'
      });
    });
  }

  logError(error: Error, context: Partial<ErrorContext> = {}) {
    const errorLog: ErrorLog = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      level: 'error',
      message: error.message,
      stack: error.stack,
      context: {
        sessionId: this.sessionId,
        ...context
      },
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server',
      url: typeof window !== 'undefined' ? window.location.href : 'Server'
    };

    this.logs.push(errorLog);
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error tracked:', errorLog);
    }

    // Send to backend (if available)
    this.sendToBackend(errorLog);

    // Store in localStorage for persistence (client-side only)
    if (typeof window !== 'undefined') {
      this.persistToStorage();
    }
  }

  logWarning(message: string, context: Partial<ErrorContext> = {}) {
    const warningLog: ErrorLog = {
      id: `warning_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      level: 'warning',
      message,
      context: {
        sessionId: this.sessionId,
        ...context
      },
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server',
      url: typeof window !== 'undefined' ? window.location.href : 'Server'
    };

    this.logs.push(warningLog);
    
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    if (process.env.NODE_ENV === 'development') {
      console.warn('Warning tracked:', warningLog);
    }

    // Store in localStorage for persistence (client-side only)
    if (typeof window !== 'undefined') {
      this.persistToStorage();
    }
  }

  logInfo(message: string, context: Partial<ErrorContext> = {}) {
    const infoLog: ErrorLog = {
      id: `info_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      context: {
        sessionId: this.sessionId,
        ...context
      },
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server',
      url: typeof window !== 'undefined' ? window.location.href : 'Server'
    };

    this.logs.push(infoLog);
    
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Store in localStorage for persistence (client-side only)
    if (typeof window !== 'undefined') {
      this.persistToStorage();
    }
  }

  private async sendToBackend(errorLog: ErrorLog) {
    try {
      // Only send errors and warnings to backend, not info logs
      if (errorLog.level === 'info') return;

      // Only attempt to send on client side
      if (typeof window === 'undefined') return;

      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorLog),
      });
    } catch (err) {
      // Silently fail - don't create infinite error loops
      console.warn('Failed to send error to backend:', err);
    }
  }

  private persistToStorage() {
    // Only run on client side
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;

    try {
      localStorage.setItem('dinoalphabet_error_logs', JSON.stringify(this.logs));
    } catch (err) {
      // Storage might be full or unavailable
      console.warn('Failed to persist error logs:', err);
    }
  }

  getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  getErrorsOnly(): ErrorLog[] {
    return this.logs.filter(log => log.level === 'error');
  }

  clearLogs() {
    this.logs = [];
    // Only clear localStorage on client side
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem('dinoalphabet_error_logs');
    }
  }

  exportLogs(): string {
    return JSON.stringify({
      sessionId: this.sessionId,
      exportedAt: new Date().toISOString(),
      logs: this.logs
    }, null, 2);
  }

  // Load persisted logs on initialization
  loadPersistedLogs() {
    // Only run on client side
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;

    try {
      const stored = localStorage.getItem('dinoalphabet_error_logs');
      if (stored) {
        const parsedLogs = JSON.parse(stored);
        this.logs = parsedLogs.slice(-this.maxLogs); // Keep only recent logs
      }
    } catch (err) {
      console.warn('Failed to load persisted error logs:', err);
    }
  }
}

// Create singleton instance
export const errorTracker = new ErrorTracker();

// Load any persisted logs (only on client side)
if (typeof window !== 'undefined') {
  errorTracker.loadPersistedLogs();
}

// Convenience functions for easy use throughout the app
export const logError = (error: Error, context?: Partial<ErrorContext>) => {
  errorTracker.logError(error, context);
};

export const logWarning = (message: string, context?: Partial<ErrorContext>) => {
  errorTracker.logWarning(message, context);
};

export const logInfo = (message: string, context?: Partial<ErrorContext>) => {
  errorTracker.logInfo(message, context);
};

export default errorTracker;