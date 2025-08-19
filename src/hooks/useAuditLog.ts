import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { secureLog } from '@/lib/security';
import { toast } from '@/hooks/use-toast';

interface AuditLogEntry {
  id: string;
  action: string;
  table_name: string;
  record_id: string | null;
  created_at: string;
  ip_address?: string;
  user_agent?: string;
}

/**
 * Hook for audit logging functionality
 * Provides methods to log security-relevant user actions
 */
export function useAuditLog() {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Log a custom security-relevant action
   */
  const logAction = async (
    action: string,
    tableName: string,
    recordId?: string,
    additionalData?: Record<string, any>
  ) => {
    try {
      setIsLoading(true);
      
      // Get user's IP address (in a real app, this would come from server)
      const ipAddress = await fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => data.ip)
        .catch(() => 'unknown');

      const { error } = await supabase
        .from('audit_logs')
        .insert({
          action,
          table_name: tableName,
          record_id: recordId,
          ip_address: ipAddress,
          user_agent: navigator.userAgent,
          new_values: additionalData
        });

      if (error) {
        secureLog('Audit log error:', error);
        // Don't show user error for audit logging to avoid disruption
        return;
      }

      secureLog(`Audit logged: ${action} on ${tableName}`, { recordId });
    } catch (error) {
      secureLog('Audit logging failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Log profile view action (for privacy compliance)
   */
  const logProfileView = async (profileId: string) => {
    await logAction('PROFILE_VIEW', 'profiles', profileId);
  };

  /**
   * Log sensitive data access
   */
  const logSensitiveAccess = async (resourceType: string, resourceId: string) => {
    await logAction('SENSITIVE_ACCESS', resourceType, resourceId);
  };

  /**
   * Log failed authentication attempts
   */
  const logAuthFailure = async (email: string, reason: string) => {
    await logAction('AUTH_FAILURE', 'auth', undefined, { email, reason });
  };

  /**
   * Log successful authentication
   */
  const logAuthSuccess = async (email: string) => {
    await logAction('AUTH_SUCCESS', 'auth', undefined, { email });
  };

  /**
   * Log password change attempts
   */
  const logPasswordChange = async (success: boolean) => {
    await logAction(
      success ? 'PASSWORD_CHANGE_SUCCESS' : 'PASSWORD_CHANGE_FAILURE',
      'auth'
    );
  };

  /**
   * Log data export requests (for GDPR compliance)
   */
  const logDataExport = async (dataType: string) => {
    await logAction('DATA_EXPORT', dataType, undefined, { 
      timestamp: new Date().toISOString() 
    });
  };

  return {
    logAction,
    logProfileView,
    logSensitiveAccess,
    logAuthFailure,
    logAuthSuccess,
    logPasswordChange,
    logDataExport,
    isLoading
  };
}