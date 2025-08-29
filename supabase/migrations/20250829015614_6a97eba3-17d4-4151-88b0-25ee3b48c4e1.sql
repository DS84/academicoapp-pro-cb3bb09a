-- Clean up and fix remaining RLS policy conflicts

-- Drop conflicting policies for profiles table
DROP POLICY IF EXISTS "Users can view basic profile info for joins" ON public.profiles;

-- Update profiles policies to allow necessary joins while maintaining security
CREATE POLICY "Allow profile joins for data relations" 
ON public.profiles 
FOR SELECT 
USING (
  -- Allow own profile access
  auth.uid() = user_id OR
  -- Allow basic profile info access for joins in bookings/sessions
  (id IN (
    SELECT DISTINCT estudante_id FROM bookings WHERE EXISTS (
      SELECT 1 FROM profiles p WHERE p.user_id = auth.uid()
    )
  )) OR
  (id IN (
    SELECT DISTINCT user_id FROM pro_bookings WHERE EXISTS (
      SELECT 1 FROM profiles p WHERE p.user_id = auth.uid()
    )
  )) OR
  (id IN (
    SELECT DISTINCT student_id FROM mentorship_sessions WHERE EXISTS (
      SELECT 1 FROM profiles p WHERE p.user_id = auth.uid()
    )
  )) OR
  (id IN (
    SELECT DISTINCT mentor_id FROM mentorship_sessions WHERE EXISTS (
      SELECT 1 FROM profiles p WHERE p.user_id = auth.uid()
    )
  ))
);

-- Fix notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ensure notifications RLS is enabled
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create notification policies if they don't exist
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;

CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (user_id = auth.uid());

-- Add trigger for notifications if it doesn't exist
DROP TRIGGER IF EXISTS update_notifications_updated_at ON public.notifications;
CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();