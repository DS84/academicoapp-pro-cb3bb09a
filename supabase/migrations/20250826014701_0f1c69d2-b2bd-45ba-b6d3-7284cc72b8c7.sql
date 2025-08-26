-- Create professional services table
CREATE TABLE public.pro_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  descricao TEXT,
  preco_base NUMERIC NOT NULL,
  sla_horas INTEGER NOT NULL,
  formatos TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pro_services ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing services
CREATE POLICY "Anyone can view professional services" 
ON public.pro_services 
FOR SELECT 
USING (true);

-- Create courses table for professionals
CREATE TABLE public.pro_courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  trilha TEXT NOT NULL,
  carga_horaria INTEGER NOT NULL,
  modalidade TEXT NOT NULL,
  datas DATE[] DEFAULT '{}',
  instrutor_id UUID,
  certificado BOOLEAN DEFAULT false,
  preco NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for courses
ALTER TABLE public.pro_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view professional courses" 
ON public.pro_courses 
FOR SELECT 
USING (true);

-- Create professional mentors table  
CREATE TABLE public.pro_mentors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  areas TEXT[] DEFAULT '{}',
  experiencia_anos INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC DEFAULT 0,
  slots JSONB DEFAULT '{}',
  avatar_url TEXT,
  bio TEXT,
  hourly_rate NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pro_mentors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view professional mentors" 
ON public.pro_mentors 
FOR SELECT 
USING (true);

-- Create professional events table
CREATE TABLE public.pro_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL,
  data TIMESTAMP WITH TIME ZONE NOT NULL,
  local_plataforma TEXT,
  vagas INTEGER,
  vagas_ocupadas INTEGER DEFAULT 0,
  preco NUMERIC DEFAULT 0,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pro_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view professional events" 
ON public.pro_events 
FOR SELECT 
USING (true);

-- Create opportunities table
CREATE TABLE public.pro_opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  empresa TEXT NOT NULL,
  local TEXT,
  senioridade TEXT NOT NULL,
  requisitos TEXT[] DEFAULT '{}',
  link TEXT,
  salario_min NUMERIC,
  salario_max NUMERIC,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pro_opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active opportunities" 
ON public.pro_opportunities 
FOR SELECT 
USING (is_active = true);

-- Create CV reviews table
CREATE TABLE public.cv_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  sugestoes TEXT[] DEFAULT '{}',
  score_ats INTEGER,
  arquivo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cv_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own CV reviews" 
ON public.cv_reviews 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = cv_reviews.user_id 
  AND profiles.user_id = auth.uid()
));

-- Create professional skills table
CREATE TABLE public.pro_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  trilha TEXT NOT NULL,
  nivel_recomendado TEXT NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pro_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view professional skills" 
ON public.pro_skills 
FOR SELECT 
USING (true);

-- Create assessments table
CREATE TABLE public.pro_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  skill_id UUID NOT NULL REFERENCES public.pro_skills(id),
  score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pro_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own assessments" 
ON public.pro_assessments 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = pro_assessments.user_id 
  AND profiles.user_id = auth.uid()
));

-- Create professional bookings table
CREATE TABLE public.pro_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES public.pro_services(id),
  user_id UUID NOT NULL,
  agenda TIMESTAMP WITH TIME ZONE NOT NULL,
  valor NUMERIC NOT NULL,
  dados_formulario JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pro_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own professional bookings" 
ON public.pro_bookings 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = pro_bookings.user_id 
  AND profiles.user_id = auth.uid()
));

CREATE POLICY "Users can create their own professional bookings" 
ON public.pro_bookings 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = pro_bookings.user_id 
  AND profiles.user_id = auth.uid()
));

-- Add triggers for timestamp updates
CREATE TRIGGER update_pro_services_updated_at
BEFORE UPDATE ON public.pro_services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pro_courses_updated_at
BEFORE UPDATE ON public.pro_courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pro_mentors_updated_at
BEFORE UPDATE ON public.pro_mentors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pro_events_updated_at
BEFORE UPDATE ON public.pro_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pro_opportunities_updated_at
BEFORE UPDATE ON public.pro_opportunities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cv_reviews_updated_at
BEFORE UPDATE ON public.cv_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pro_assessments_updated_at
BEFORE UPDATE ON public.pro_assessments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pro_bookings_updated_at
BEFORE UPDATE ON public.pro_bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();