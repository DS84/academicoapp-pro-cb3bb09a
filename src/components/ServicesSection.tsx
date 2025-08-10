import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Briefcase, BookOpen, Target, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ServicesSectionProps {
  language: string;
}

const ServicesSection = ({ language }: ServicesSectionProps) => {
  const translations = {
    pt: {
      title: 'Serviços para Todos',
      subtitle: 'Apoio especializado para cada etapa da sua jornada',
      services: {
        students: {
          title: 'Para Estudantes',
          description: 'Apoio académico, orientação de carreira e recursos de estudo personalizados',
          features: ['Tutorias online', 'Materiais de estudo', 'Orientação profissional', 'Bolsas de estudo'],
          cta: 'Explorar'
        },
        teachers: {
          title: 'Para Professores',
          description: 'Ferramentas pedagógicas, formação contínua e rede de colaboração',
          features: ['Recursos didácticos', 'Formação pedagógica', 'Rede de professores', 'Apoio técnico'],
          cta: 'Juntar-se'
        },
        professionals: {
          title: 'Para Profissionais',
          description: 'Desenvolvimento de competências, networking e oportunidades de carreira',
          features: ['Cursos especializados', 'Networking', 'Mentoria profissional', 'Oportunidades'],
          cta: 'Conectar'
        }
      }
    },
    en: {
      title: 'Services for Everyone',
      subtitle: 'Specialized support for every stage of your journey',
      services: {
        students: {
          title: 'For Students',
          description: 'Academic support, career guidance and personalized study resources',
          features: ['Online tutoring', 'Study materials', 'Career guidance', 'Scholarships'],
          cta: 'Explore'
        },
        teachers: {
          title: 'For Teachers',
          description: 'Pedagogical tools, continuous training and collaboration network',
          features: ['Teaching resources', 'Pedagogical training', 'Teacher network', 'Technical support'],
          cta: 'Join'
        },
        professionals: {
          title: 'For Professionals',
          description: 'Skill development, networking and career opportunities',
          features: ['Specialized courses', 'Networking', 'Professional mentoring', 'Opportunities'],
          cta: 'Connect'
        }
      }
    }
  };

  const t = translations[language as keyof typeof translations];

  const serviceData = [
    {
      key: 'students',
      icon: GraduationCap,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      key: 'teachers', 
      icon: BookOpen,
      gradient: 'from-green-500 to-green-600'
    },
    {
      key: 'professionals',
      icon: Briefcase,
      gradient: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <section id="services" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {serviceData.map((service) => {
            const serviceInfo = t.services[service.key as keyof typeof t.services];
            const Icon = service.icon;
            
            return (
              <Card key={service.key} className="group hover:shadow-card transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-primary mb-4">
                    {serviceInfo.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {serviceInfo.description}
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    {serviceInfo.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link to={`/${service.key}`}>{serviceInfo.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;