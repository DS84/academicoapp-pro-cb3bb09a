import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { maskPhoneNumber, maskEmail } from '@/lib/security';
import { useAuditLog } from '@/hooks/useAuditLog';

interface SecureDisplayProps {
  /**
   * The sensitive data to display
   */
  data: string | null | undefined;
  
  /**
   * Type of data for appropriate masking
   */
  type: 'phone' | 'email' | 'text';
  
  /**
   * Whether to show the reveal button
   */
  showRevealButton?: boolean;
  
  /**
   * Resource ID for audit logging
   */
  resourceId?: string;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Component for securely displaying sensitive information with masking and audit logging
 */
export function SecureDisplay({ 
  data, 
  type, 
  showRevealButton = true, 
  resourceId,
  className = '' 
}: SecureDisplayProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const { logSensitiveAccess } = useAuditLog();

  const getMaskedData = (data: string | null | undefined, type: string): string => {
    switch (type) {
      case 'phone':
        return maskPhoneNumber(data);
      case 'email':
        return maskEmail(data);
      case 'text':
        return data ? '*'.repeat(Math.min(data.length, 8)) : '';
      default:
        return data || '';
    }
  };

  const handleReveal = async () => {
    if (!isRevealed && resourceId) {
      await logSensitiveAccess(`${type}_data`, resourceId);
    }
    setIsRevealed(!isRevealed);
  };

  const displayData = isRevealed ? (data || '') : getMaskedData(data, type);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-mono text-sm">
        {displayData}
      </span>
      
      {showRevealButton && data && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReveal}
          className="h-6 w-6 p-0"
          aria-label={isRevealed ? 'Hide sensitive data' : 'Reveal sensitive data'}
        >
          {isRevealed ? (
            <EyeOff className="h-3 w-3" />
          ) : (
            <Eye className="h-3 w-3" />
          )}
        </Button>
      )}
    </div>
  );
}