import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Settings, Lightbulb, Globe } from 'lucide-react';

interface TeacherServicesCatalogProps {
  language: string;
  onServiceSelect: (service: any) => void;
  recommendedTracks?: string[];
}

const TeacherServicesCatalog = ({ language, onServiceSelect, recommendedTracks = [] }: TeacherServicesCatalogProps) => {
  const t = {
    pt: {
      title: 'Serviços para Professores',
      subtitle: 'Catálogo completo de recursos e formação pedagógica',
      recommended: 'Recomendado para ti',
      selectService: 'Escolher Serviço',
      slaLabel: 'SLA',
      formatLabel: 'Formatos',
      priceLabel: 'Preço base'
    },
    en: {
      title: 'Teacher Services',
      subtitle: 'Complete catalog of resources and pedagogical training',
      recommended: 'Recommended for you',
      selectService: 'Choose Service',
      slaLabel: 'SLA',
      formatLabel: 'Formats',
      priceLabel: 'Base price'
    }
  }[language as 'pt' | 'en'];

  const services = [
    {
      id: 'recursos-didaticos',
      name: language === 'pt' ? 'Recursos Didáticos' : 'Teaching Resources',
      description: language === 'pt' ? 
        'Materiais educativos personalizados, templates e recursos multimídia para enriquecer as suas aulas.' :
        'Customized educational materials, templates and multimedia resources to enrich your classes.',
      icon: BookOpen,
      sla: '48h',
      formats: language === 'pt' ? ['Digital', 'Presencial', 'Híbrido'] : ['Digital', 'In-person', 'Hybrid'],
      basePrice: '2.500 AOA',
      tags: ['recursos', 'materiais', 'multimedia'],
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'formacao-pedagogica',
      name: language === 'pt' ? 'Formação Pedagógica' : 'Pedagogical Training',
      description: language === 'pt' ? 
        'Cursos de desenvolvimento profissional contínuo, metodologias ativas e certificação CPD.' :
        'Continuous professional development courses, active methodologies and CPD certification.',
      icon: Lightbulb,
      sla: '24h',
      formats: language === 'pt' ? ['Online', 'Workshop', 'Mentoria'] : ['Online', 'Workshop', 'Mentoring'],
      basePrice: '5.000 AOA',
      tags: ['formacao', 'cpd', 'metodologias'],
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 'rede-professores',
      name: language === 'pt' ? 'Rede de Professores' : 'Teacher Network',
      description: language === 'pt' ? 
        'Comunidade colaborativa, grupos de estudo, co-docência e partilha de experiências entre educadores.' :
        'Collaborative community, study groups, co-teaching and experience sharing among educators.',
      icon: Users,
      sla: '12h',
      formats: language === 'pt' ? ['Comunidade', 'Grupos', 'Eventos'] : ['Community', 'Groups', 'Events'],
      basePrice: '1.500 AOA',
      tags: ['rede', 'colaboracao', 'co-docencia'],
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'apoio-tecnico',
      name: language === 'pt' ? 'Apoio Técnico e Profissional' : 'Technical and Professional Support',
      description: language === 'pt' ? 
        'Suporte especializado para Moodle, Google Classroom, Teams e outras plataformas educativas.' :
        'Specialized support for Moodle, Google Classroom, Teams and other educational platforms.',
      icon: Settings,
      sla: '4h',
      formats: language === 'pt' ? ['Remoto', 'Presencial', 'Telefone'] : ['Remote', 'In-person', 'Phone'],
      basePrice: '3.000 AOA',
      tags: ['tecnico', 'moodle', 'plataformas'],
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 'intercambio-institucional',
      name: language === 'pt' ? 'Intercâmbio Institucional' : 'Institutional Exchange',
      description: language === 'pt' ? 
        'Programas de intercâmbio, parcerias entre instituições e projectos educativos colaborativos.' :
        'Exchange programs, partnerships between institutions and collaborative educational projects.',
      icon: Globe,
      sla: '72h',
      formats: language === 'pt' ? ['Presencial', 'Virtual', 'Misto'] : ['In-person', 'Virtual', 'Mixed'],
      basePrice: '8.000 AOA',
      tags: ['intercambio', 'parcerias', 'colaboracao'],
      gradient: 'from-indigo-500 to-blue-500'
    }
  ];

  const isRecommended = (serviceId: string) => {
    return recommendedTracks.some(track => 
      track.toLowerCase().includes(serviceId.replace('-', ' ')) ||
      serviceId.includes(track.toLowerCase().replace(' ', '-'))
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">{t.title}</h2>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = service.icon;
          const recommended = isRecommended(service.id);
          
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
              
              <div className={`h-24 bg-gradient-to-r ${service.gradient} flex items-center justify-center`}>
                <Icon className="h-8 w-8 text-white" />
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{t.slaLabel}:</span>
                  <Badge variant="outline">{service.sla}</Badge>
                </div>
                
                <div>
                  <span className="text-sm font-medium">{t.formatLabel}:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {service.formats.map((format) => (
                      <Badge key={format} variant="secondary" className="text-xs">
                        {format}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t.priceLabel}:</span>
                  <span className="font-bold text-lg text-primary">{service.basePrice}</span>
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