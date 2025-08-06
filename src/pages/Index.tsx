import { useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import Footer from '@/components/Footer';

const Index = () => {
  const [language, setLanguage] = useState('pt');

  return (
    <div className="min-h-screen bg-background">
      <Header language={language} setLanguage={setLanguage} />
      <HeroSection language={language} />
      <ServicesSection language={language} />
      <Footer language={language} />
    </div>
  );
};

export default Index;
