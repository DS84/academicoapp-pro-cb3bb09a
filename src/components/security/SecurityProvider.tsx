import React, { createContext, useContext, useEffect, useState } from 'react';
import { authRateLimiter, secureLog } from '@/lib/security';
import { useAuditLog } from '@/hooks/useAuditLog';

interface SecurityContextType {
  /**
   * Check if an action is rate limited
   */
  isRateLimited: (key: string) => boolean;
  
  /**
   * Reset rate limit for a key
   */
  resetRateLimit: (key: string) => void;
  
  /**
   * Log a security event
   */
  logSecurityEvent: (event: string, details?: any) => void;
  
  /**
   * Security monitoring state
   */
  securityAlerts: string[];
  
  /**
   * Clear security alerts
   */
  clearAlerts: () => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

interface SecurityProviderProps {
  children: React.ReactNode;
}

/**
 * Security context provider for application-wide security features
 */
export function SecurityProvider({ children }: SecurityProviderProps) {
  const [securityAlerts, setSecurityAlerts] = useState<string[]>([]);
  const { logAction } = useAuditLog();

  const isRateLimited = (key: string): boolean => {
    const limited = authRateLimiter.isRateLimited(key);
    
    if (limited) {
      logSecurityEvent('RATE_LIMIT_TRIGGERED', { key });
      addSecurityAlert(`Rate limit exceeded for: ${key}`);
    }
    
    return limited;
  };

  const resetRateLimit = (key: string): void => {
    authRateLimiter.reset(key);
    logSecurityEvent('RATE_LIMIT_RESET', { key });
  };

  const logSecurityEvent = (event: string, details?: any): void => {
    secureLog(`Security Event: ${event}`, details);
    
    // Log to audit system for serious events
    if (['SUSPICIOUS_ACTIVITY', 'RATE_LIMIT_TRIGGERED', 'UNAUTHORIZED_ACCESS'].includes(event)) {
      logAction(event, 'security_events', undefined, details);
    }
  };

  const addSecurityAlert = (alert: string): void => {
    setSecurityAlerts(prev => [...prev.slice(-4), alert]); // Keep last 5 alerts
  };

  const clearAlerts = (): void => {
    setSecurityAlerts([]);
  };

  // Monitor for suspicious patterns
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logSecurityEvent('TAB_HIDDEN');
      } else {
        logSecurityEvent('TAB_VISIBLE');
      }
    };

    const handleBeforeUnload = () => {
      logSecurityEvent('SESSION_END');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const value: SecurityContextType = {
    isRateLimited,
    resetRateLimit,
    logSecurityEvent,
    securityAlerts,
    clearAlerts
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
}

/**
 * Hook to use security context
 */
export function useSecurity() {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}