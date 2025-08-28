import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const Profile = () => {
  const [language, setLanguage] = useState('pt');
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

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
      name: profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0],
      email: user.email,
      avatar: profile?.avatar_url || user.user_metadata?.avatar_url
    };
  };

  const translations = {
    pt: {
      title: 'Perfil',
      personalInfo: 'Informações Pessoais',
      name: 'Nome',
      email: 'Email',
      phone: 'Telefone',
      role: 'Tipo de Conta',
      institution: 'Instituição',
      fieldOfStudy: 'Área de Estudo',
      yearOfStudy: 'Ano de Estudo',
      bio: 'Bio',
      loading: 'Carregando...',
      notInformed: 'Não informado'
    },
    en: {
      title: 'Profile',
      personalInfo: 'Personal Information',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      role: 'Account Type',
      institution: 'Institution',
      fieldOfStudy: 'Field of Study',
      yearOfStudy: 'Year of Study',
      bio: 'Bio',
      loading: 'Loading...',
      notInformed: 'Not informed'
    }
  };

  const t = translations[language as keyof typeof translations];

  if (loading) {
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
          <div className="max-w-2xl mx-auto space-y-6">
            <Skeleton className="h-12 w-32" />
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer language={language} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
          
          <Card>
            <CardHeader>
              <CardTitle>{t.personalInfo}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t.name}</label>
                <p className="text-lg text-foreground">
                  {profile?.full_name || user?.user_metadata?.full_name || t.notInformed}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t.email}</label>
                <p className="text-lg text-foreground">{user?.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t.phone}</label>
                <p className="text-lg text-foreground">
                  {profile?.phone || user?.user_metadata?.phone || t.notInformed}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t.role}</label>
                <p className="text-lg text-foreground capitalize">
                  {profile?.user_type || user?.user_metadata?.user_type || t.notInformed}
                </p>
              </div>

              {profile?.institution && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t.institution}</label>
                  <p className="text-lg text-foreground">{profile.institution}</p>
                </div>
              )}

              {profile?.field_of_study && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t.fieldOfStudy}</label>
                  <p className="text-lg text-foreground">{profile.field_of_study}</p>
                </div>
              )}

              {profile?.year_of_study && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t.yearOfStudy}</label>
                  <p className="text-lg text-foreground">{profile.year_of_study}º ano</p>
                </div>
              )}

              {profile?.bio && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t.bio}</label>
                  <p className="text-lg text-foreground">{profile.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer language={language} />
    </div>
  );
};

export default Profile;