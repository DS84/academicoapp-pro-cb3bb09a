import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const [language, setLanguage] = useState('pt');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logout realizado com sucesso!');
      navigate('/');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  const getUserData = () => {
    if (!user) return undefined;
    return {
      name: user.user_metadata?.full_name || user.email?.split('@')[0],
      email: user.email,
      avatar: user.user_metadata?.avatar_url
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        language={language} 
        setLanguage={setLanguage}
        isAuthenticated={!!user}
        user={getUserData()}
        onLogout={handleLogout}
      />
      <HeroSection language={language} />
      <ServicesSection language={language} />
      <div id="about">
        <AboutSection language={language} />
      </div>
      <div id="contact">
        <ContactSection language={language} />
      </div>
      <Footer language={language as 'pt' | 'en'} />
    </div>
  );
};

export default Index;
