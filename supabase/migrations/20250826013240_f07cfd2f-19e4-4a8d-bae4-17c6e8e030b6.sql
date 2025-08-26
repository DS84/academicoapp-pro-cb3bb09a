-- Create teacher_services table
CREATE TABLE public.teacher_services (
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

-- Create trainings table
CREATE TABLE public.trainings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  carga_horaria INTEGER NOT NULL,
  certificacao_cpd BOOLEAN DEFAULT false,
  modalidade TEXT NOT NULL,
  datas DATE[] DEFAULT '{}',
  instrutor_id UUID,
  preco NUMERIC,
  descricao TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create oer_resources table
CREATE TABLE public.oer_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  disciplina TEXT NOT NULL,
  nivel TEXT NOT NULL,
  tipo TEXT NOT NULL,
  url TEXT,
  licenca TEXT DEFAULT 'CC BY',
  tags TEXT[] DEFAULT '{}',
  autor TEXT,
  downloads INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create communities table
CREATE TABLE public.communities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  tema TEXT NOT NULL,
  canal TEXT,
  membros_count INTEGER DEFAULT 0,
  descricao TEXT,
  tipo TEXT DEFAULT 'publico',
  criador_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create support_tickets table
CREATE TABLE public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professor_id UUID NOT NULL,
  assunto TEXT NOT NULL,
  plataforma TEXT,
  severidade TEXT DEFAULT 'media',
  status TEXT DEFAULT 'aberto',
  sla INTEGER,
  descricao TEXT,
  resposta TEXT,
  atribuido_a UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create partnerships table
CREATE TABLE public.partnerships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  instituicao_origem TEXT NOT NULL,
  instituicao_destino TEXT NOT NULL,
  tipo TEXT NOT NULL,
  status TEXT DEFAULT 'proposta',
  documento_mou_url TEXT,
  contato_origem TEXT,
  contato_destino TEXT,
  detalhes JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.teacher_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oer_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnerships ENABLE ROW LEVEL SECURITY;

-- RLS Policies for teacher_services
CREATE POLICY "Anyone can view teacher services" 
ON public.teacher_services 
FOR SELECT 
USING (true);

-- RLS Policies for trainings
CREATE POLICY "Anyone can view active trainings" 
ON public.trainings 
FOR SELECT 
USING (status = 'active');

-- RLS Policies for oer_resources
CREATE POLICY "Anyone can view OER resources" 
ON public.oer_resources 
FOR SELECT 
USING (true);

-- RLS Policies for communities
CREATE POLICY "Anyone can view public communities" 
ON public.communities 
FOR SELECT 
USING (tipo = 'publico');

-- RLS Policies for support_tickets
CREATE POLICY "Users can view their own support tickets" 
ON public.support_tickets 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = support_tickets.professor_id 
  AND profiles.user_id = auth.uid()
));

CREATE POLICY "Users can create their own support tickets" 
ON public.support_tickets 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = support_tickets.professor_id 
  AND profiles.user_id = auth.uid()
));

CREATE POLICY "Users can update their own support tickets" 
ON public.support_tickets 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = support_tickets.professor_id 
  AND profiles.user_id = auth.uid()
));

-- RLS Policies for partnerships
CREATE POLICY "Anyone can view partnerships" 
ON public.partnerships 
FOR SELECT 
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_teacher_services_slug ON public.teacher_services(slug);
CREATE INDEX idx_trainings_modalidade ON public.trainings(modalidade);
CREATE INDEX idx_trainings_cpd ON public.trainings(certificacao_cpd);
CREATE INDEX idx_oer_disciplina ON public.oer_resources(disciplina);
CREATE INDEX idx_oer_nivel ON public.oer_resources(nivel);
CREATE INDEX idx_communities_tema ON public.communities(tema);
CREATE INDEX idx_support_tickets_professor ON public.support_tickets(professor_id);
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);

-- Add update triggers
CREATE TRIGGER update_teacher_services_updated_at
BEFORE UPDATE ON public.teacher_services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trainings_updated_at
BEFORE UPDATE ON public.trainings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_oer_resources_updated_at
BEFORE UPDATE ON public.oer_resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_communities_updated_at
BEFORE UPDATE ON public.communities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partnerships_updated_at
BEFORE UPDATE ON public.partnerships
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for teacher_services
INSERT INTO public.teacher_services (slug, nome, descricao, preco_base, sla_horas, formatos, tags) VALUES
('recursos-didaticos', 'Recursos Didáticos', 'Materiais educativos personalizados, templates e recursos multimídia', 2500, 48, ARRAY['Digital', 'Presencial', 'Híbrido'], ARRAY['recursos', 'materiais', 'multimedia']),
('formacao-pedagogica', 'Formação Pedagógica', 'Cursos de desenvolvimento profissional contínuo e certificação CPD', 5000, 24, ARRAY['Online', 'Workshop', 'Mentoria'], ARRAY['formacao', 'cpd', 'metodologias']),
('rede-professores', 'Rede de Professores', 'Comunidade colaborativa e partilha de experiências', 1500, 12, ARRAY['Comunidade', 'Grupos', 'Eventos'], ARRAY['rede', 'colaboracao', 'co-docencia']),
('apoio-tecnico', 'Apoio Técnico e Profissional', 'Suporte especializado para plataformas educativas', 3000, 4, ARRAY['Remoto', 'Presencial', 'Telefone'], ARRAY['tecnico', 'moodle', 'plataformas']),
('intercambio-institucional', 'Intercâmbio Institucional', 'Programas de intercâmbio e parcerias entre instituições', 8000, 72, ARRAY['Presencial', 'Virtual', 'Misto'], ARRAY['intercambio', 'parcerias', 'colaboracao']);

-- Insert sample data for trainings (with proper date casting)
INSERT INTO public.trainings (titulo, carga_horaria, certificacao_cpd, modalidade, datas, preco, descricao) VALUES
('Metodologias Ativas de Ensino', 40, true, 'online', ARRAY['2024-02-15'::date, '2024-03-15'::date], 15000, 'Formação em metodologias ativas e aprendizagem baseada em projetos'),
('Tecnologia na Educação', 30, true, 'hibrido', ARRAY['2024-02-20'::date, '2024-03-20'::date], 12000, 'Integração de tecnologias digitais no processo de ensino-aprendizagem'),
('Avaliação Formativa', 25, true, 'presencial', ARRAY['2024-03-01'::date, '2024-03-30'::date], 10000, 'Técnicas modernas de avaliação e feedback'),
('Co-docência e Trabalho Colaborativo', 35, true, 'online', ARRAY['2024-03-10'::date, '2024-04-10'::date], 14000, 'Estratégias para ensino colaborativo entre docentes'),
('Gestão de Sala de Aula Digital', 20, false, 'online', ARRAY['2024-02-25'::date], 8000, 'Ferramentas e técnicas para gestão de ambientes virtuais de aprendizagem');

-- Insert sample data for oer_resources
INSERT INTO public.oer_resources (titulo, disciplina, nivel, tipo, url, tags, autor) VALUES
('Guia de Matemática Interativa', 'Matemática', 'medio', 'manual', 'https://example.com/math-guide', ARRAY['matematica', 'interativo', 'exercicios'], 'Prof. Ana Silva'),
('Recursos de Física Experimental', 'Física', 'superior', 'video', 'https://example.com/physics-exp', ARRAY['fisica', 'experimental', 'laboratorio'], 'Dr. João Santos'),
('Kit de Língua Portuguesa', 'Português', 'fundamental', 'kit', 'https://example.com/port-kit', ARRAY['portugues', 'gramatica', 'redacao'], 'Prof. Maria Costa'),
('História Digital de Angola', 'História', 'medio', 'multimidia', 'https://example.com/angola-history', ARRAY['historia', 'angola', 'cultura'], 'Prof. Carlos Neto'),
('Ciências da Natureza STEM', 'Ciências', 'fundamental', 'projeto', 'https://example.com/stem-sciences', ARRAY['ciencias', 'stem', 'projetos'], 'Equipa STEM Angola');

-- Insert sample data for communities
INSERT INTO public.communities (nome, tema, canal, membros_count, descricao) VALUES
('Professores de Matemática Angola', 'Matemática', 'WhatsApp', 250, 'Comunidade de professores de matemática para partilha de recursos e experiências'),
('Educação Digital AO', 'Tecnologia Educativa', 'Telegram', 180, 'Grupo focado em tecnologias digitais aplicadas à educação'),
('Rede CPD Luanda', 'Desenvolvimento Profissional', 'Teams', 320, 'Rede de desenvolvimento profissional contínuo para educadores de Luanda'),
('Co-docência Colaborativa', 'Metodologias', 'Discord', 95, 'Espaço para discussão sobre práticas de co-docência e ensino colaborativo'),
('Intercâmbio Educativo', 'Parcerias', 'Slack', 140, 'Comunidade para promover intercâmbios e parcerias entre instituições');

-- Insert sample data for partnerships
INSERT INTO public.partnerships (instituicao_origem, instituicao_destino, tipo, status, detalhes) VALUES
('Universidade Agostinho Neto', 'Universidade de Coimbra', 'academico', 'ativo', '{"area": "formacao_professores", "duracao": "2_anos"}'),
('Instituto Superior Politécnico', 'Instituto Politécnico do Porto', 'tecnico', 'proposta', '{"area": "engenharia_educativa", "modalidade": "virtual"}'),
('Escola do Futuro Luanda', 'Escola Digital Lisboa', 'metodologico', 'negociacao', '{"foco": "metodologias_ativas", "intercambio_professores": true}'),
('Centro de Formação Docente', 'Universidade do Minho', 'investigacao', 'ativo', '{"projeto": "educacao_digital_angola", "financiamento": "erasmus"}'),
('Rede Escolas Inovadoras', 'Microsoft Education', 'tecnologico', 'ativo', '{"plataforma": "teams_education", "formacao": "office365"}')