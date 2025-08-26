import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Settings, Lightbulb, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TeacherServicesCatalogProps {
  language: string;
  onServiceSelect: (service: any) => void;
  recommendedTracks?: string[];
}

const TeacherServicesCatalog = ({ language, onServiceSelect, recommendedTracks = [] }: TeacherServicesCatalogProps) => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const t = {
    pt: {
      title: 'Serviços para Professores',
      subtitle: 'Catálogo completo de recursos e formação pedagógica',
      recommended: 'Recomendado para ti',
      selectService: 'Escolher Serviço',
      slaLabel: 'SLA',
      formatLabel: 'Formatos',
      priceLabel: 'Preço base',
      loading: 'Carregando serviços...',
      error: 'Erro ao carregar serviços'
    },
    en: {
      title: 'Teacher Services',
      subtitle: 'Complete catalog of resources and pedagogical training',
      recommended: 'Recommended for you',
      selectService: 'Choose Service',
      slaLabel: 'SLA',
      formatLabel: 'Formats',
      priceLabel: 'Base price',
      loading: 'Loading services...',
      error: 'Error loading services'
    }
  }[language as 'pt' | 'en'];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('teacher_services')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching teacher services:', error);
      toast({
        title: t.error,
        description: 'Não foi possível carregar os serviços.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (slug: string) => {
    const iconMap: any = {
      'recursos-didaticos': BookOpen,
      'formacao-pedagogica': Lightbulb,
      'rede-professores': Users,
      'apoio-tecnico': Settings,
      'intercambio-institucional': Globe
    };
    return iconMap[slug] || BookOpen;
  };

  const getServiceGradient = (slug: string) => {
    const gradientMap: any = {
      'recursos-didaticos': 'from-blue-500 to-cyan-500',
      'formacao-pedagogica': 'from-green-500 to-emerald-500',
      'rede-professores': 'from-purple-500 to-pink-500',
      'apoio-tecnico': 'from-orange-500 to-red-500',
      'intercambio-institucional': 'from-indigo-500 to-blue-500'
    };
    return gradientMap[slug] || 'from-gray-500 to-gray-600';
  };

  const isRecommended = (serviceSlug: string) => {
    return recommendedTracks.some(track => 
      track.toLowerCase().includes(serviceSlug.replace('-', ' ')) ||
      serviceSlug.includes(track.toLowerCase().replace(' ', '-'))
    );
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground">{t.loading}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">{t.title}</h2>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = getServiceIcon(service.slug);
          const recommended = isRecommended(service.slug);
          
          return (
            <Card
              key={service.id}
              className={`relative overflow-hidden transition-all hover:shadow-lg ${
                recommended ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
            >
              {recommended && (
                <Badge
                  className="absolute top-3 right-3 z-10 bg-primary text-primary-foreground"
                >
                  {t.recommended}
                </Badge>
              )}
              
              <div className={`h-24 bg-gradient-to-r ${getServiceGradient(service.slug)} flex items-center justify-center`}>
                <Icon className="h-8 w-8 text-white" />
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{service.nome}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {service.descricao}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{t.slaLabel}:</span>
                  <Badge variant="outline">{service.sla_horas}h</Badge>
                </div>
                
                <div>
                  <span className="text-sm font-medium">{t.formatLabel}:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {service.formatos?.map((format: string) => (
                      <Badge key={format} variant="secondary" className="text-xs">
                        {format}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t.priceLabel}:</span>
                  <span className="font-bold text-lg text-primary">{service.preco_base} AOA</span>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => onServiceSelect(service)}
                  variant={recommended ? 'default' : 'outline'}
                >
                  {t.selectService}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherServicesCatalog;