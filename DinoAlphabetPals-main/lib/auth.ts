interface AuthData {
  authenticated: boolean;
  user: string;
  timestamp: number;
}

export class AuthManager {
  private static readonly AUTH_KEY = 'dinoalphabet_auth';
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  static setAuth(user: string): void {
    if (typeof window === 'undefined') return;

    const authData: AuthData = {
      authenticated: true,
      user,
      timestamp: Date.now()
    };

    // Store in localStorage
    localStorage.setItem(this.AUTH_KEY, JSON.stringify(authData));
    
    // Also set as cookie for middleware
    document.cookie = `${this.AUTH_KEY}=${JSON.stringify(authData)}; path=/; max-age=${this.SESSION_DURATION / 1000}; SameSite=Strict`;
  }

  static getAuth(): AuthData | null {
    if (typeof window === 'undefined') return null;

    try {
      const stored = localStorage.getItem(this.AUTH_KEY);
      if (!stored) return null;

      const authData: AuthData = JSON.parse(stored);
      
      // Check if session is still valid
      if (Date.now() - authData.timestamp > this.SESSION_DURATION) {
        this.clearAuth();
        return null;
      }

      return authData;
    } catch (error) {
      this.clearAuth();
      return null;
    }
  }

  static isAuthenticated(): boolean {
    const auth = this.getAuth();
    return auth?.authenticated === true;
  }

  static clearAuth(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(this.AUTH_KEY);
    document.cookie = `${this.AUTH_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  static extendSession(): void {
    const auth = this.getAuth();
    if (auth && auth.authenticated) {
      this.setAuth(auth.user);
    }
  }
}

// Hook for React components
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState<string | null>(null);

  React.useEffect(() => {
    const auth = AuthManager.getAuth();
    setIsAuthenticated(auth?.authenticated === true);
    setUser(auth?.user || null);
  }, []);

  const login = (username: string) => {
    AuthManager.setAuth(username);
    setIsAuthenticated(true);
    setUser(username);
  };

  const logout = () => {
    AuthManager.clearAuth();
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    user,
    login,
    logout
  };
}

// Import React for the hook
import React from 'react';