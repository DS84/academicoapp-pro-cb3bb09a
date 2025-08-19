import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Trophy, Globe } from 'lucide-react';

interface AboutSectionProps {
  language: string;
}

const AboutSection = ({ language }: AboutSectionProps) => {
  const translations = {
    pt: {
      title: 'Sobre a Nossa Plataforma',
      subtitle: 'Transformando a educação em Angola através da tecnologia',
      description: 'Somos uma plataforma inovadora que conecta estudantes, professores e profissionais em Angola, criando oportunidades de aprendizagem e desenvolvimento que impactam positivamente o futuro do país.',
      mission: 'A Nossa Missão',
      missionText: 'Democratizar o acesso à educação de qualidade e oportunidades profissionais para todos os angolanos.',
      vision: 'A Nossa Visão',
      visionText: 'Ser a principal plataforma educacional de Angola, contribuindo para o desenvolvimento sustentável do país.',
      values: {
        title: 'Os Nossos Valores',
        items: [
          { icon: Target, title: 'Excelência', description: 'Comprometidos com a qualidade em tudo que fazemos' },
          { icon: Users, title: 'Inclusão', description: 'Acesso igual para todos, independentemente da localização' },
          { icon: Trophy, title: 'Inovação', description: 'Sempre buscando maneiras melhores de educar' },
          { icon: Globe, title: 'Impacto', description: 'Criando mudanças positivas na sociedade angolana' }
        ]
      }
    },
    en: {
      title: 'About Our Platform',
      subtitle: 'Transforming education in Angola through technology',
      description: 'We are an innovative platform that connects students, teachers and professionals in Angola, creating learning and development opportunities that positively impact the country\'s future.',
      mission: 'Our Mission',
      missionText: 'To democratize access to quality education and professional opportunities for all Angolans.',
      vision: 'Our Vision',
      visionText: 'To be Angola\'s leading educational platform, contributing to the country\'s sustainable development.',
      values: {
        title: 'Our Values',
        items: [
          { icon: Target, title: 'Excellence', description: 'Committed to quality in everything we do' },
          { icon: Users, title: 'Inclusion', description: 'Equal access for all, regardless of location' },
          { icon: Trophy, title: 'Innovation', description: 'Always seeking better ways to educate' },
          { icon: Globe, title: 'Impact', description: 'Creating positive changes in Angolan society' }
        ]
      }
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-accent max-w-3xl mx-auto mb-8">
            {t.subtitle}
          </p>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {t.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <Card className="border-0 shadow-card">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold text-primary mb-4">{t.mission}</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">{t.missionText}</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-card">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold text-primary mb-4">{t.vision}</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">{t.visionText}</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-primary mb-8">{t.values.title}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.values.items.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card key={index} className="border-0 shadow-card hover:shadow-elegant transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                    <Icon className="h-8 w-8 text-accent" />
                  </div>
                  <h4 className="text-xl font-bold text-primary mb-3">{value.title}</h4>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;