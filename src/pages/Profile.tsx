import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
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
      title: 'Perfil',
      personalInfo: 'Informações Pessoais',
      name: 'Nome',
      email: 'Email',
      phone: 'Telefone',
      role: 'Tipo de Conta'
    },
    en: {
      title: 'Profile',
      personalInfo: 'Personal Information',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      role: 'Account Type'
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
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-8">{t.title}</h1>
          
          <div className="bg-card border border-border rounded-lg p-6 shadow-card">
            <h2 className="text-2xl font-semibold text-primary mb-6">{t.personalInfo}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t.name}</label>
                <p className="text-lg text-foreground">{user?.user_metadata?.full_name || 'Não informado'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t.email}</label>
                <p className="text-lg text-foreground">{user?.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t.phone}</label>
                <p className="text-lg text-foreground">{user?.user_metadata?.phone || 'Não informado'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t.role}</label>
                <p className="text-lg text-foreground capitalize">{user?.user_metadata?.role || 'Não informado'}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer language={language} />
    </div>
  );
};

export default Profile;