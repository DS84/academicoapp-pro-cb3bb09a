/**
 * Security utilities for data protection and privacy
 */

/**
 * Masks phone numbers for privacy protection
 * Example: "123456789" becomes "***-**-6789"
 */
export function maskPhoneNumber(phone: string | null | undefined): string {
  if (!phone || phone.length < 4) {
    return phone || '';
  }
  
  const lastFour = phone.slice(-4);
  const maskedPortion = '*'.repeat(Math.max(0, phone.length - 4));
  
  // Format with dashes if it looks like a phone number
  if (phone.length >= 9) {
    return `***-**-${lastFour}`;
  }
  
  return `${maskedPortion}${lastFour}`;
}

/**
 * Masks email addresses for privacy protection
 * Example: "user@example.com" becomes "u***@example.com"
 */
export function maskEmail(email: string | null | undefined): string {
  if (!email || !email.includes('@')) {
    return email || '';
  }
  
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 1) {
    return email;
  }
  
  const maskedLocal = localPart[0] + '*'.repeat(Math.max(0, localPart.length - 1));
  return `${maskedLocal}@${domain}`;
}

/**
 * Sanitizes meeting links by removing sensitive parameters
 * Keeps the base URL but removes tokens and private room IDs
 */
export function sanitizeMeetingLink(link: string | null | undefined): string {
  if (!link) {
    return '';
  }
  
  try {
    const url = new URL(link);
    // Remove sensitive query parameters
    const sensitiveParams = ['token', 'password', 'pwd', 'key', 'secret'];
    sensitiveParams.forEach(param => {
      url.searchParams.delete(param);
    });
    
    return url.toString();
  } catch {
    // If URL parsing fails, return original link
    return link;
  }
}

/**
 * Checks if the current environment is development
 */
export function isDevelopment(): boolean {
  return import.meta.env.DEV;
}

/**
 * Validates that sensitive data is not logged in production
 */
export function secureLog(message: string, data?: any): void {
  if (isDevelopment()) {
    console.log(message, data);
  } else {
    // In production, only log the message without sensitive data
    console.log(message);
  }
}

/**
 * Rate limiting helpers for client-side protection
 */
class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}
  
  /**
   * Check if an action is rate limited
   */
  isRateLimited(key: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);
    
    if (!attempt) {
      this.attempts.set(key, { count: 1, lastAttempt: now });
      return false;
    }
    
    // Reset if window has passed
    if (now - attempt.lastAttempt > this.windowMs) {
      this.attempts.set(key, { count: 1, lastAttempt: now });
      return false;
    }
    
    // Increment attempt count
    attempt.count += 1;
    attempt.lastAttempt = now;
    
    return attempt.count > this.maxAttempts;
  }
  
  /**
   * Reset rate limit for a key
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }
}

// Export singleton instance for authentication rate limiting
export const authRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes

/**
 * Security headers configuration for production
 */
export const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'"
  ].join('; '),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};