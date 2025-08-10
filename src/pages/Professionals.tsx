import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';

const Professionals = () => {
  const [language, setLanguage] = useState('pt');

  const t = {
    pt: {
      title: 'Profissionais — academicoapp',
      h1: 'Desenvolvimento e Oportunidades para Profissionais',
      desc: 'Cursos especializados, networking e mentoria para acelerar a tua carreira em Angola.',
    },
    en: {
      title: 'Professionals — academicoapp',
      h1: 'Development and Opportunities for Professionals',
      desc: 'Specialized courses, networking and mentoring to accelerate your career in Angola.',
    },
  }[language as 'pt' | 'en'];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{t.title}</title>
        <meta name="description" content={t.desc} />
        <link rel="canonical" href="/professionals" />
      </Helmet>
      <Header language={language} setLanguage={setLanguage} />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">{t.h1}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">{t.desc}</p>
      </main>
      <Footer language={language} />
    </div>
  );
};

export default Professionals;
