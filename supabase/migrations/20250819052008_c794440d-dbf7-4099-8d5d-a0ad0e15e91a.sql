-- Fix critical security vulnerability: restrict profiles table access
-- Drop the overly permissive policy that allows viewing all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a secure policy that only allows users to view their own profile
CREATE POLICY "Users can view only their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Ensure other policies remain secure
-- Keep the existing INSERT policy (already secure)
-- Keep the existing UPDATE policy (already secure)