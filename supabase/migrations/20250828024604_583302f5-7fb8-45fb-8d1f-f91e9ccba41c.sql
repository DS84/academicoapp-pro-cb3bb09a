-- Create missing subjects table
CREATE TABLE public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on subjects table
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- Anyone can view subjects
CREATE POLICY "Anyone can view subjects" 
ON public.subjects 
FOR SELECT 
USING (true);

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

-- Insert some sample subjects
INSERT INTO public.subjects (name, description, category) VALUES
('Matemática', 'Matemática geral e aplicada', 'Ciências Exatas'),
('Física', 'Física fundamental e aplicada', 'Ciências Exatas'),
('Química', 'Química geral e orgânica', 'Ciências Exatas'),
('História', 'História geral e nacional', 'Ciências Humanas'),
('Geografia', 'Geografia física e humana', 'Ciências Humanas'),
('Português', 'Língua portuguesa e literatura', 'Linguagens'),
('Inglês', 'Língua inglesa', 'Linguagens'),
('Biologia', 'Biologia geral e molecular', 'Ciências da Natureza'),
('Programação', 'Desenvolvimento de software', 'Tecnologia'),
('Design', 'Design gráfico e UX/UI', 'Artes');