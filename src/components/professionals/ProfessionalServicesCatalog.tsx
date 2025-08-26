import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign, CheckCircle, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProService {
  id: string;
  slug: string;
  nome: string;
  descricao: string | null;
  preco_base: number;
  sla_horas: number;
  formatos: string[];
  tags: string[];
}

interface ProfessionalServicesCatalogProps {
  onServiceSelect: (service: ProService) => void;
  language: string;
}

const ProfessionalServicesCatalog = ({ onServiceSelect, language }: ProfessionalServicesCatalogProps) => {
  const [services, setServices] = useState<ProService[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const t = {
    pt: {
      title: 'Catálogo de Serviços Profissionais',
      subtitle: 'Escolha o serviço que melhor atende às suas necessidades',
      price: 'Preço base',
      sla: 'Prazo de entrega',
      hours: 'horas',
      formats: 'Formatos',
      select: 'Selecionar',
      loading: 'Carregando serviços...',
      error: 'Erro ao carregar serviços'
    },
    en: {
      title: 'Professional Services Catalog',
      subtitle: 'Choose the service that best meets your needs',
      price: 'Base price',
      sla: 'Delivery time',
      hours: 'hours',
      formats: 'Formats',
      select: 'Select',
      loading: 'Loading services...',
      error: 'Error loading services'
    }
  }[language as 'pt' | 'en'];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('pro_services')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        setServices(data || []);
      } catch (error) {
        console.error('Error fetching professional services:', error);
        toast({
          title: t.error,
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [toast, t.error]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">{t.title}</h2>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.slice(0, 6).map((service) => (
          <Card key={service.id} className="relative h-full flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">{service.nome}</CardTitle>
              {service.descricao && (
                <p className="text-muted-foreground text-sm line-clamp-3">{service.descricao}</p>
              )}
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{t.price}</span>
                  </div>
                  <span className="text-lg font-bold">
                    {new Intl.NumberFormat('pt-AO', {
                      style: 'currency',
                      currency: 'AOA'
                    }).format(Number(service.preco_base))}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{t.sla}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {service.sla_horas} {t.hours}
                  </span>
                </div>

                {service.formatos.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">{t.formats}:</p>
                    <div className="flex flex-wrap gap-1">
                      {service.formatos.map((formato) => (
                        <Badge key={formato} variant="secondary" className="text-xs">
                          {formato}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {service.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {service.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button 
                onClick={() => onServiceSelect(service)}
                className="w-full mt-4"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {t.select}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProfessionalServicesCatalog;