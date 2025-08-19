import { Button } from "@/components/ui/button";
import { ArrowRight, Users, BookOpen, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-angola.jpg';

interface HeroSectionProps {
  language: string;
}

const HeroSection = ({ language }: HeroSectionProps) => {
  const translations = {
    pt: {
      title: 'Apoio Académico e Profissional',
      subtitle: 'para Angola',
      description: 'Conectamos estudantes, professores e profissionais em Angola através de uma plataforma inovadora de apoio educacional e desenvolvimento profissional.',
      cta: 'Começar Agora',
      secondary: 'Saber Mais',
      stats: {
        students: '10,000+ Estudantes',
        teachers: '500+ Professores', 
        professionals: '2,000+ Profissionais'
      }
    },
    en: {
      title: 'Academic and Professional Support',
      subtitle: 'for Angola',
      description: 'We connect students, teachers and professionals in Angola through an innovative platform for educational support and professional development.',
      cta: 'Get Started Now',
      secondary: 'Learn More',
      stats: {
        students: '10,000+ Students',
        teachers: '500+ Teachers',
        professionals: '2,000+ Professionals'
      }
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage}
          alt="Angola Academic Support"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/70"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6">
            {t.title}
            <span className="block text-accent text-4xl md:text-5xl">
              {t.subtitle}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl leading-relaxed">
            {t.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button asChild 
              size="lg" 
              className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6 shadow-elegant"
            >
              <Link to="/login">
                {t.cta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg"
              className="bg-red-600 text-primary-foreground hover:bg-red-700 text-lg px-8 py-6"
              asChild
            >
              <a href="#about">{t.secondary}</a>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl">
            <div className="flex items-center space-x-3 text-primary-foreground">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <span className="font-semibold text-lg">{t.stats.students}</span>
            </div>
            <div className="flex items-center space-x-3 text-primary-foreground">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-accent" />
              </div>
              <span className="font-semibold text-lg">{t.stats.teachers}</span>
            </div>
            <div className="flex items-center space-x-3 text-primary-foreground">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-accent" />
              </div>
              <span className="font-semibold text-lg">{t.stats.professionals}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;