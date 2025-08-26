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
      title: 'Suporte académico personalizado para transformar o teu estudo em resultados.',
      subtitle: 'Tutorias, materiais de estudo, orientação profissional e bolsas — tudo num só lugar.',
      description: 'Conectamos estudantes, professores e profissionais em Angola através de uma plataforma inovadora de apoio educacional e desenvolvimento profissional.',
      cta: 'Começar agora (60s)',
      secondary: 'Saber Mais',
      stats: '+1.200 sessões concluídas • Satisfação 4,8/5'
    },
    en: {
      title: 'Personalized academic support to transform your studies into results.',
      subtitle: 'Tutoring, study materials, career guidance and scholarships — all in one place.',
      description: 'We connect students, teachers and professionals in Angola through an innovative platform for educational support and professional development.',
      cta: 'Start now (60s)',
      secondary: 'Learn More',
      stats: '+1,200 completed sessions • 4.8/5 satisfaction'
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
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            {t.title}
          </h1>
          
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl leading-relaxed">
            {t.subtitle}
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

          {/* Prova Social */}
          <div className="flex items-center justify-center gap-4 text-primary-foreground/90">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="font-medium">{t.stats}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;