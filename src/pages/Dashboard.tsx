import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
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

  const translations = {
    pt: {
      title: 'Dashboard',
      welcome: 'Bem-vindo ao seu dashboard',
      description: 'Aqui podes gerir as tuas atividades e configurações.'
    },
    en: {
      title: 'Dashboard',
      welcome: 'Welcome to your dashboard',
      description: 'Here you can manage your activities and settings.'
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        language={language} 
        setLanguage={setLanguage}
        isAuthenticated={!!user}
        user={getUserData()}
        onLogout={handleLogout}
      />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-4">{t.title}</h1>
          <p className="text-xl text-muted-foreground mb-8">{t.welcome}</p>
          <p className="text-muted-foreground">{t.description}</p>
        </div>
      </main>
      <Footer language={language} />
    </div>
  );
};

export default Dashboard;