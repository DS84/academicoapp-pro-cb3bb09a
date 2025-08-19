-- Fix security vulnerability: Restrict access to auth_rate_limits table
-- Remove the overly permissive policy that allows all users to view rate limiting data
DROP POLICY IF EXISTS "Users can view their own rate limits" ON public.auth_rate_limits;

-- Create a restrictive policy that denies access to regular users
-- This sensitive security data should only be accessible to administrators
CREATE POLICY "Deny public access to rate limits" 
ON public.auth_rate_limits 
FOR ALL 
USING (false);

-- Add a comment explaining the security consideration
COMMENT ON TABLE public.auth_rate_limits IS 'Contains sensitive authentication security data including IP addresses and email addresses. Access restricted to prevent data exposure.';