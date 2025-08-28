-- Create missing mentorship_sessions table
CREATE TABLE public.mentorship_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id UUID REFERENCES public.profiles(id) NOT NULL,
  student_id UUID REFERENCES public.profiles(id) NOT NULL,
  subject_id UUID REFERENCES public.subjects(id),
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  session_type TEXT NOT NULL DEFAULT 'online',
  status TEXT NOT NULL DEFAULT 'scheduled',
  meeting_link TEXT,
  notes TEXT,
  feedback TEXT,
  rating INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on mentorship_sessions table
ALTER TABLE public.mentorship_sessions ENABLE ROW LEVEL SECURITY;

-- Users can view sessions where they are mentor or student
CREATE POLICY "Users can view their own sessions" 
ON public.mentorship_sessions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE (profiles.id = mentorship_sessions.mentor_id OR profiles.id = mentorship_sessions.student_id) 
    AND profiles.user_id = auth.uid()
  )
);

-- Users can manage sessions where they are mentor or student
CREATE POLICY "Users can manage their own sessions" 
ON public.mentorship_sessions 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE (profiles.id = mentorship_sessions.mentor_id OR profiles.id = mentorship_sessions.student_id) 
    AND profiles.user_id = auth.uid()
  )
);

-- Add trigger for updated_at
CREATE TRIGGER update_mentorship_sessions_updated_at
  BEFORE UPDATE ON public.mentorship_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();