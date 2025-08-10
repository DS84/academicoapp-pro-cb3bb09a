import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';

const Students = () => {
  const [language, setLanguage] = useState('pt');

  const t = {
    pt: {
      title: 'Estudantes — academicoapp',
      h1: 'Recursos e Oportunidades para Estudantes',
      desc: 'Tutorias, materiais de estudo, bolsas e orientação de carreira para acelerar o teu caminho académico.',
    },
    en: {
      title: 'Students — academicoapp',
      h1: 'Resources and Opportunities for Students',
      desc: 'Tutoring, study materials, scholarships and career guidance to accelerate your academic path.',
    },
  }[language as 'pt' | 'en'];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{t.title}</title>
        <meta name="description" content={t.desc} />
        <link rel="canonical" href="/students" />
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

export default Students;
