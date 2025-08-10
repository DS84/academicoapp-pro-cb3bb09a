import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';

const Teachers = () => {
  const [language, setLanguage] = useState('pt');

  const t = {
    pt: {
      title: 'Professores — academicoapp',
      h1: 'Ferramentas e Formação para Professores',
      desc: 'Recursos didácticos, formação pedagógica contínua e comunidade de colaboração docente.',
    },
    en: {
      title: 'Teachers — academicoapp',
      h1: 'Tools and Training for Teachers',
      desc: 'Teaching resources, continuous pedagogical training and a collaborative teacher community.',
    },
  }[language as 'pt' | 'en'];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{t.title}</title>
        <meta name="description" content={t.desc} />
        <link rel="canonical" href="/teachers" />
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

export default Teachers;
