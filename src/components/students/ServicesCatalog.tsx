import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Video, FileText, Calendar, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Service {
  id: string;
  title: string;
  description: string;
  basePrice: string;
  sla: string;
  format: 'live' | 'async' | 'hybrid';
  category: 'tutoring' | 'materials' | 'career' | 'scholarships' | 'mentoring';
  icon: React.ReactNode;
  features: string[];
  ctaText: string;
}

interface ServicesCatalogProps {
  language: string;
  onServiceSelect: (serviceId: string) => void;
}

const ServicesCatalog = ({ language, onServiceSelect }: ServicesCatalogProps) => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os serviços.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  const t = {
    pt: {
      title: 'Catálogo de Serviços',
      subtitle: 'Escolha os serviços que melhor se adequam às tuas necessidades',
      formats: {
        live: 'Ao Vivo',
        async: 'Assíncrono', 
        hybrid: 'Híbrido'
      },
      basePrice: 'A partir de',
      sla: 'SLA',
      features: 'Inclui',
      services: {
        tutoring: {
          title: 'Tutorias Online',
          description: 'Aulas personalizadas com professores especializados',
          basePrice: '2.500 AOA/hora',
          sla: 'Resposta em 2h',
          features: [
            'Agendamento flexível',
            'Sala virtual dedicada',
            'Gravação das sessões',
            'Material complementar',
            'Suporte via WhatsApp'
          ],
          ctaText: 'Agendar Tutoria'
        },
        materials: {
          title: 'Materiais de Estudo',
          description: 'Biblioteca filtrável com planos de estudo estruturados',
          basePrice: '8.000 AOA/mês',
          sla: 'Acesso imediato',
          features: [
            'Biblioteca com 1000+ recursos',
            'Planos de 4 semanas',
            'Exercícios interativos',
            'Simulados personalizados',
            'Downloads ilimitados'
          ],
          ctaText: 'Aceder Biblioteca'
        },
        career: {
          title: 'Orientação Profissional',
          description: 'Revisão de CV, LinkedIn e simulação de entrevistas',
          basePrice: '15.000 AOA',
          sla: 'Entrega em 3 dias',
          features: [
            'Revisão completa de CV',
            'Otimização do LinkedIn',
            'Simulação de entrevista',
            'Relatório de feedback',
            'Acompanhamento por 30 dias'
          ],
          ctaText: 'Começar Orientação'
        },
        scholarships: {
          title: 'Bolsas de Estudo',
          description: 'Scanner de elegibilidade e submissão assistida',
          basePrice: '12.000 AOA',
          sla: 'Entrega em 7 dias',
          features: [
            'Scanner de oportunidades',
            'Verificação de elegibilidade',
            'Submissão assistida',
            'Calendário de prazos',
            'Templates de candidatura'
          ],
          ctaText: 'Encontrar Bolsas'
        },
        mentoring: {
          title: 'Mentoria & Acompanhamento',
          description: 'Metas mensais, checkpoints e relatórios de progresso',
          basePrice: '25.000 AOA/mês',
          sla: 'Reunião semanal',
          features: [
            'Mentor dedicado',
            'Metas personalizadas',
            'Checkpoints semanais',
            'Relatório PDF mensal',
            'Suporte contínuo'
          ],
          ctaText: 'Começar Mentoria'
        }
      }
    },
    en: {
      title: 'Services Catalog',
      subtitle: 'Choose the services that best fit your needs',
      formats: {
        live: 'Live',
        async: 'Async',
        hybrid: 'Hybrid'
      },
      basePrice: 'Starting from',
      sla: 'SLA',
      features: 'Includes',
      services: {
        tutoring: {
          title: 'Online Tutoring',
          description: 'Personalized classes with specialized teachers',
          basePrice: '2,500 AOA/hour',
          sla: '2h response',
          features: [
            'Flexible scheduling',
            'Dedicated virtual room',
            'Session recordings',
            'Complementary materials',
            'WhatsApp support'
          ],
          ctaText: 'Schedule Tutoring'
        },
        materials: {
          title: 'Study Materials',
          description: 'Filterable library with structured study plans',
          basePrice: '8,000 AOA/month',
          sla: 'Immediate access',
          features: [
            'Library with 1000+ resources',
            '4-week plans',
            'Interactive exercises',
            'Personalized mock exams',
            'Unlimited downloads'
          ],
          ctaText: 'Access Library'
        },
        career: {
          title: 'Career Guidance',
          description: 'CV review, LinkedIn optimization and interview simulation',
          basePrice: '15,000 AOA',
          sla: '3-day delivery',
          features: [
            'Complete CV review',
            'LinkedIn optimization',
            'Interview simulation',
            'Feedback report',
            '30-day follow-up'
          ],
          ctaText: 'Start Guidance'
        },
        scholarships: {
          title: 'Scholarships',
          description: 'Eligibility scanner and assisted submission',
          basePrice: '12,000 AOA',
          sla: '7-day delivery',
          features: [
            'Opportunity scanner',
            'Eligibility verification',
            'Assisted submission',
            'Deadline calendar',
            'Application templates'
          ],
          ctaText: 'Find Scholarships'
        },
        mentoring: {
          title: 'Mentoring & Follow-up',
          description: 'Monthly goals, checkpoints and progress reports',
          basePrice: '25,000 AOA/month',
          sla: 'Weekly meeting',
          features: [
            'Dedicated mentor',
            'Personalized goals',
            'Weekly checkpoints',
            'Monthly PDF report',
            'Continuous support'
          ],
          ctaText: 'Start Mentoring'
        }
      }
    }
  }[language as 'pt' | 'en'];

  // Static fallback services
  const staticServices: Service[] = [
    {
      id: 'tutoring',
      title: t.services.tutoring.title,
      description: t.services.tutoring.description,
      basePrice: t.services.tutoring.basePrice,
      sla: t.services.tutoring.sla,
      format: 'live',
      category: 'tutoring',
      icon: <Video className="h-6 w-6" />,
      features: t.services.tutoring.features,
      ctaText: t.services.tutoring.ctaText
    },
    {
      id: 'materials',
      title: t.services.materials.title,
      description: t.services.materials.description,
      basePrice: t.services.materials.basePrice,
      sla: t.services.materials.sla,
      format: 'async',
      category: 'materials',
      icon: <FileText className="h-6 w-6" />,
      features: t.services.materials.features,
      ctaText: t.services.materials.ctaText
    },
    {
      id: 'career',
      title: t.services.career.title,
      description: t.services.career.description,
      basePrice: t.services.career.basePrice,
      sla: t.services.career.sla,
      format: 'hybrid',
      category: 'career',
      icon: <Users className="h-6 w-6" />,
      features: t.services.career.features,
      ctaText: t.services.career.ctaText
    },
    {
      id: 'scholarships',
      title: t.services.scholarships.title,
      description: t.services.scholarships.description,
      basePrice: t.services.scholarships.basePrice,
      sla: t.services.scholarships.sla,
      format: 'async',
      category: 'scholarships',
      icon: <Star className="h-6 w-6" />,
      features: t.services.scholarships.features,
      ctaText: t.services.scholarships.ctaText
    },
    {
      id: 'mentoring',
      title: t.services.mentoring.title,
      description: t.services.mentoring.description,
      basePrice: t.services.mentoring.basePrice,
      sla: t.services.mentoring.sla,
      format: 'hybrid',
      category: 'mentoring',
      icon: <Calendar className="h-6 w-6" />,
      features: t.services.mentoring.features,
      ctaText: t.services.mentoring.ctaText
    }
  ];

  // Use real services data from API or fallback to static data
  const servicesToDisplay = services.length > 0 ? services.map(service => ({
    id: service.slug,
    title: service.nome,
    description: service.descricao,
    basePrice: `${service.preco_base.toLocaleString('pt-PT')} AOA`,
    sla: `${service.sla_horas}h`,
    format: service.formatos[0] as 'live' | 'async' | 'hybrid',
    category: service.tags[0] as 'tutoring' | 'materials' | 'career' | 'scholarships' | 'mentoring',
    icon: <Video className="h-6 w-6" />,
    features: ['Feature 1', 'Feature 2'],
    ctaText: 'Selecionar'
  })) : staticServices;

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'live': return 'bg-green-100 text-green-800';
      case 'async': return 'bg-blue-100 text-blue-800';
      case 'hybrid': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-4">{t.title}</h2>
        <p className="text-lg text-muted-foreground">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {servicesToDisplay.map((service) => (
          <Card key={service.id} className="h-full flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {service.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </div>
                </div>
                <Badge className={getFormatColor(service.format)}>
                  {t.formats[service.format]}
                </Badge>
              </div>
              <p className="text-muted-foreground">{service.description}</p>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4 p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">{t.basePrice}</p>
                  <p className="text-lg font-bold text-primary">{service.basePrice}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{t.sla}</p>
                  <p className="text-sm font-medium flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {service.sla}
                  </p>
                </div>
              </div>

              <div className="flex-1 mb-6">
                <p className="text-sm font-medium text-muted-foreground mb-3">{t.features}:</p>
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                onClick={() => onServiceSelect(service.id)}
                className="w-full"
                size="lg"
              >
                {service.ctaText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ServicesCatalog;