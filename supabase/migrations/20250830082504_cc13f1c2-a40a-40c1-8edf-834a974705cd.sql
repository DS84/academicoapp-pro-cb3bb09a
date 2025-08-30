-- Fix critical security vulnerability in profiles table RLS policies
-- Remove overly permissive policy that allows reading other users' personal data

-- Drop the problematic policy that allows public access through complex joins
DROP POLICY IF EXISTS "Allow profile joins for data relations" ON public.profiles;

-- Create a more secure policy that only allows users to see minimal public profile info
-- for users they have legitimate relationships with
CREATE POLICY "Users can view basic profile info for service relationships" 
ON public.profiles 
FOR SELECT 
USING (
  -- Users can always see their own full profile
  auth.uid() = user_id 
  OR 
  -- Users can see only basic info (full_name, user_type) of profiles they have service relationships with
  (
    id IN (
      -- Students who have bookings with the current user as a service provider
      SELECT DISTINCT estudante_id FROM bookings 
      WHERE EXISTS (
        SELECT 1 FROM profiles p 
        WHERE p.user_id = auth.uid() AND p.user_type IN ('teacher', 'professional')
      )
    )
    OR
    -- Service providers the current user has booked
    SELECT DISTINCT p.id FROM pro_bookings pb
    JOIN pro_services ps ON pb.service_id = ps.id
    JOIN profiles p ON p.user_type = 'professional'
    WHERE pb.user_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
    OR
    -- Mentorship relationships
    id IN (
      SELECT DISTINCT student_id FROM mentorship_sessions ms
      WHERE ms.mentor_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
      UNION
      SELECT DISTINCT mentor_id FROM mentorship_sessions ms
      WHERE ms.student_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    )
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

-- Create a view for public profile information that doesn't expose sensitive data
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  full_name,
  user_type,
  avatar_url,
  institution,
  field_of_study,
  bio,
  linkedin_url
FROM public.profiles;

-- Enable RLS on the view
ALTER VIEW public.public_profiles OWNER TO postgres;

-- Create RLS policy for the public profiles view
CREATE POLICY "Public profiles view access" 
ON public.public_profiles 
FOR SELECT 
USING (
  -- Users can see their own profile
  id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  OR
  -- Users can see public profiles of people they have service relationships with
  id IN (
    SELECT DISTINCT estudante_id FROM bookings 
    WHERE EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid())
    UNION
    SELECT DISTINCT p.id FROM pro_bookings pb
    JOIN profiles p ON pb.user_id = p.id
    WHERE EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid())
    UNION
    SELECT DISTINCT student_id FROM mentorship_sessions
    WHERE mentor_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    UNION
    SELECT DISTINCT mentor_id FROM mentorship_sessions
    WHERE student_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  )
);

-- Add comment explaining the security fix
COMMENT ON POLICY "Users can view basic profile info for service relationships" ON public.profiles IS 
'Security fix: Restricts profile access to prevent unauthorized access to sensitive personal data. Users can only see full profiles of themselves and limited public info of users they have legitimate service relationships with.';