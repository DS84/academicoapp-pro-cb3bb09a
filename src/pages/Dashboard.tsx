import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StudentDashboard from '@/components/students/StudentDashboard';
import TeacherDashboard from '@/components/teachers/TeacherDashboard';
import ProfessionalDashboard from '@/components/professionals/ProfessionalDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const [language, setLanguage] = useState('pt');
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading } = useProfile(user?.id);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

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

  const renderDashboard = () => {
    if (profileLoading) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <Skeleton className="h-12 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <Skeleton className="h-64" />
          </div>
        </div>
      );
    }

    if (!profile) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-primary mb-4">Perfil não encontrado</h1>
            <p className="text-muted-foreground">
              Por favor, complete o seu perfil para aceder ao dashboard.
            </p>
          </div>
        </div>
      );
    }

    switch (profile.user_type) {
      case 'student':
        return <StudentDashboard language={language as 'pt' | 'en'} profile={profile} />;
      case 'teacher':
        return <TeacherDashboard language={language as 'pt' | 'en'} profile={profile} />;
      case 'professional':
        return <ProfessionalDashboard language={language as 'pt' | 'en'} />;
      default:
        return <StudentDashboard language={language as 'pt' | 'en'} profile={profile} />;
    }
  };

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
      <main>
        {renderDashboard()}
      </main>
      <Footer language={language as 'pt' | 'en'} />
    </div>
  );
};

export default Dashboard;