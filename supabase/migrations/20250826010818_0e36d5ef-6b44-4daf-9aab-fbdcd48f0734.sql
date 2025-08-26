-- Create services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  preco_base DECIMAL(10,2) NOT NULL,
  sla_horas INTEGER NOT NULL,
  formatos TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  estudante_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  agenda TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  valor DECIMAL(10,2) NOT NULL,
  dados_formulario JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create mentors table (extending existing structure)
CREATE TABLE public.service_mentors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  areas TEXT[] DEFAULT '{}',
  rating DECIMAL(3,2) DEFAULT 0,
  slots JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create materials table (extending existing structure)
CREATE TABLE public.study_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  disciplina TEXT NOT NULL,
  tipo TEXT NOT NULL,
  url TEXT,
  content JSONB,
  tags TEXT[] DEFAULT '{}',
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create scholarships table
CREATE TABLE public.scholarship_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  pais TEXT NOT NULL,
  grau TEXT NOT NULL,
  prazo DATE,
  requisitos JSONB DEFAULT '{}',
  link TEXT,
  valor_bolsa DECIMAL(12,2),
  descricao TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create goals table
CREATE TABLE public.student_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estudante_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  meta TEXT NOT NULL,
  prazo DATE,
  progresso_percent INTEGER DEFAULT 0 CHECK (progresso_percent >= 0 AND progresso_percent <= 100),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarship_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for services (public read)
CREATE POLICY "Anyone can view services" ON public.services
  FOR SELECT USING (true);

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = bookings.estudante_id 
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own bookings" ON public.bookings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = bookings.estudante_id 
      AND profiles.user_id = auth.uid()
    )
  );

-- RLS Policies for mentors
CREATE POLICY "Anyone can view active mentors" ON public.service_mentors
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can manage their mentor profile" ON public.service_mentors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = service_mentors.profile_id 
      AND profiles.user_id = auth.uid()
    )
  );

-- RLS Policies for materials
CREATE POLICY "Anyone can view public materials" ON public.study_materials
  FOR SELECT USING (is_public = true OR creator_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their materials" ON public.study_materials
  FOR ALL USING (
    creator_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for scholarships (public read)
CREATE POLICY "Anyone can view active scholarships" ON public.scholarship_opportunities
  FOR SELECT USING (is_active = true);

-- RLS Policies for goals
CREATE POLICY "Users can manage their own goals" ON public.student_goals
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = student_goals.estudante_id 
      AND profiles.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_services_slug ON public.services(slug);
CREATE INDEX idx_bookings_estudante ON public.bookings(estudante_id);
CREATE INDEX idx_bookings_service ON public.bookings(service_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_scholarships_grau ON public.scholarship_opportunities(grau);
CREATE INDEX idx_scholarships_pais ON public.scholarship_opportunities(pais);
CREATE INDEX idx_materials_disciplina ON public.study_materials(disciplina);
CREATE INDEX idx_goals_estudante ON public.student_goals(estudante_id);

-- Insert sample services
INSERT INTO public.services (slug, nome, descricao, preco_base, sla_horas, formatos, tags) VALUES
('tutoria-online', 'Tutoria Online', 'Aulas personalizadas com professores especializados', 2500.00, 2, ARRAY['live', 'video'], ARRAY['educacao', 'tutoria']),
('materiais-estudo', 'Materiais de Estudo', 'Biblioteca filtrável com planos de estudo estruturados', 8000.00, 0, ARRAY['async', 'download'], ARRAY['materiais', 'biblioteca']),
('orientacao-profissional', 'Orientação Profissional', 'Revisão de CV, LinkedIn e simulação de entrevistas', 15000.00, 72, ARRAY['hybrid', 'consultation'], ARRAY['carreira', 'cv']),
('bolsas-estudo', 'Bolsas de Estudo', 'Scanner de elegibilidade e submissão assistida', 12000.00, 168, ARRAY['async', 'research'], ARRAY['bolsas', 'financiamento']),
('mentoria-acompanhamento', 'Mentoria & Acompanhamento', 'Metas mensais, checkpoints e relatórios de progresso', 25000.00, 24, ARRAY['hybrid', 'ongoing'], ARRAY['mentoria', 'acompanhamento']);

-- Insert sample scholarship opportunities
INSERT INTO public.scholarship_opportunities (nome, pais, grau, prazo, requisitos, link, valor_bolsa, descricao) VALUES
('Bolsa Santander Universidades', 'Brasil', 'licenciatura', '2024-06-30', '{"gpa_minimo": 14, "idade_maxima": 25}', 'https://becas.santander.com', 50000.00, 'Bolsa para estudos no Brasil'),
('Programa Erasmus+', 'Portugal', 'licenciatura', '2024-05-15', '{"gpa_minimo": 15, "nivel_lingua": "B2"}', 'https://erasmus-plus.ec.europa.eu', 75000.00, 'Programa de mobilidade europeia'),
('Chevening Scholarship', 'Reino Unido', 'mestrado', '2024-11-01', '{"experiencia_trabalho": 2, "nivel_lingua": "IELTS 6.5"}', 'https://chevening.org', 150000.00, 'Bolsa integral para mestrado no Reino Unido');

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mentors_updated_at BEFORE UPDATE ON public.service_mentors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON public.study_materials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scholarships_updated_at BEFORE UPDATE ON public.scholarship_opportunities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.student_goals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();