-- Create missing tables that are referenced in the code

-- Create mentorship_sessions table to replace career_sessions usage in student dashboard
CREATE TABLE IF NOT EXISTS public.mentorship_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  mentor_id UUID NOT NULL, 
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'scheduled',
  meeting_link TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.mentorship_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for mentorship sessions
CREATE POLICY "Users can view their own mentorship sessions" 
ON public.mentorship_sessions 
FOR SELECT 
USING (
  (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = mentorship_sessions.student_id AND profiles.user_id = auth.uid())) OR
  (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = mentorship_sessions.mentor_id AND profiles.user_id = auth.uid()))
);

CREATE POLICY "Users can create mentorship sessions" 
ON public.mentorship_sessions 
FOR INSERT 
WITH CHECK (
  (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = mentorship_sessions.student_id AND profiles.user_id = auth.uid())) OR
  (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = mentorship_sessions.mentor_id AND profiles.user_id = auth.uid()))
);

CREATE POLICY "Users can update their own mentorship sessions" 
ON public.mentorship_sessions 
FOR UPDATE 
USING (
  (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = mentorship_sessions.student_id AND profiles.user_id = auth.uid())) OR
  (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = mentorship_sessions.mentor_id AND profiles.user_id = auth.uid()))
);

-- Create course_enrollments table for teacher dashboard
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  course_id UUID NOT NULL,
  enrollment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completion_date TIMESTAMP WITH TIME ZONE,
  progress_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

-- Create policies for course enrollments
CREATE POLICY "Users can view their own course enrollments" 
ON public.course_enrollments 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = course_enrollments.student_id AND profiles.user_id = auth.uid()));

CREATE POLICY "Users can create their own course enrollments" 
ON public.course_enrollments 
FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = course_enrollments.student_id AND profiles.user_id = auth.uid()));

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_mentorship_sessions_updated_at
BEFORE UPDATE ON public.mentorship_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_enrollments_updated_at
BEFORE UPDATE ON public.course_enrollments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Fix missing foreign key relationships where needed
-- Note: We avoid creating foreign keys to auth.users as per best practices