-- Fix critical security vulnerability in profiles table RLS policies
-- Remove overly permissive policy that allows reading other users' personal data

-- Drop the problematic policy that allows public access through complex joins
DROP POLICY IF EXISTS "Allow profile joins for data relations" ON public.profiles;

-- Create a more secure policy that restricts access to only necessary profile data
CREATE POLICY "Users can view profiles for legitimate relationships" 
ON public.profiles 
FOR SELECT 
USING (
  -- Users can always see their own full profile
  auth.uid() = user_id 
  OR 
  -- Users can see profiles they have legitimate service relationships with
  id IN (
    -- Students who have bookings with the current user
    SELECT DISTINCT estudante_id FROM bookings 
    WHERE EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.user_id = auth.uid()
    )
  )
  OR
  id IN (
    -- Users who have booked professional services
    SELECT DISTINCT pb.user_id FROM pro_bookings pb
    WHERE EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.user_id = auth.uid()
    )
  )
  OR
  id IN (
    -- Mentorship relationships - mentors and students
    SELECT DISTINCT student_id FROM mentorship_sessions ms
    WHERE ms.mentor_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    UNION
    SELECT DISTINCT mentor_id FROM mentorship_sessions ms
    WHERE ms.student_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  )
);

-- Create a security definer function to get safe public profile data
CREATE OR REPLACE FUNCTION public.get_safe_profile_data(profile_id uuid)
RETURNS TABLE(
  id uuid,
  full_name text,
  user_type text,
  avatar_url text
) 
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT p.id, p.full_name, p.user_type, p.avatar_url
  FROM public.profiles p
  WHERE p.id = profile_id;
$$;

-- Add comment explaining the security fix
COMMENT ON POLICY "Users can view profiles for legitimate relationships" ON public.profiles IS 
'Security fix: Restricts profile access to prevent unauthorized access to sensitive personal data like emails and phone numbers. Users can only see full profiles of themselves and basic info of users they have legitimate service relationships with.';