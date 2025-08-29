-- Fix RLS policies to ensure proper data access

-- Update profiles table RLS policies to allow viewing other users' basic info for joins
DROP POLICY IF EXISTS "Users can view only their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view basic profile info for joins" 
ON public.profiles 
FOR SELECT 
USING (true); -- Allow basic profile access for joins

-- Fix bookings table RLS to use profile IDs correctly
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create their own bookings" ON public.bookings;

CREATE POLICY "Users can view their own bookings" 
ON public.bookings 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = bookings.estudante_id AND profiles.user_id = auth.uid()));

CREATE POLICY "Users can create their own bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = bookings.estudante_id AND profiles.user_id = auth.uid()));

-- Fix pro_bookings table RLS  
DROP POLICY IF EXISTS "Users can view their own professional bookings" ON public.pro_bookings;
DROP POLICY IF EXISTS "Users can create their own professional bookings" ON public.pro_bookings;

CREATE POLICY "Users can view their own professional bookings" 
ON public.pro_bookings 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = pro_bookings.user_id AND profiles.user_id = auth.uid()));

CREATE POLICY "Users can create their own professional bookings" 
ON public.pro_bookings 
FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = pro_bookings.user_id AND profiles.user_id = auth.uid()));

-- Fix support_tickets table RLS
DROP POLICY IF EXISTS "Users can view their own support tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Users can create their own support tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Users can update their own support tickets" ON public.support_tickets;

CREATE POLICY "Users can view their own support tickets" 
ON public.support_tickets 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = support_tickets.professor_id AND profiles.user_id = auth.uid()));

CREATE POLICY "Users can create their own support tickets" 
ON public.support_tickets 
FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = support_tickets.professor_id AND profiles.user_id = auth.uid()));

CREATE POLICY "Users can update their own support tickets" 
ON public.support_tickets 
FOR UPDATE 
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = support_tickets.professor_id AND profiles.user_id = auth.uid()));

-- Ensure notifications table has proper policies
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

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