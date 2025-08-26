import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmartTriaging from '@/components/students/SmartTriaging';
import ServicesCatalog from '@/components/students/ServicesCatalog';
import StudentDashboard from '@/components/students/StudentDashboard';
import ServiceFlows from '@/components/students/ServiceFlows';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Students = () => {
  const [language, setLanguage] = useState('pt');
  const { toast } = useToast();

  const t = {
    pt: {
      title: 'Estudantes — academicoapp',
      h1: 'Recursos e Oportunidades para Estudantes',
      desc: 'Tutorias, materiais de estudo, bolsas e orientação de carreira para acelerar o teu caminho académico.',
      dashboard: 'Painel do Estudante',
      tabs: {
        profile: 'Meu Perfil',
        schedule: 'Agendar Aula',
        classes: 'Minhas Aulas',
        payments: 'Pagamentos',
      },
      loginCta: 'Inicia sessão para aceder ao teu painel.',
      goLogin: 'Ir para login',
      profileLabels: {
        name: 'Nome',
        email: 'Email',
        phone: 'Telefone',
        plan: 'Plano',
        userType: 'Tipo de utilizador',
      },
      scheduleForm: {
        subject: 'Disciplina/Assunto',
        datetime: 'Data e Hora',
        duration: 'Duração (minutos)',
        submit: 'Agendar',
        note: 'Demonstração: o agendamento será confirmado por email.',
      },
      classesEmpty: 'Ainda não tens aulas agendadas.',
      paying: 'Pagamento iniciado',
      payingDesc: 'A processar Mobile Money (demonstração).',
      scheduled: 'Aula agendada',
      scheduledDesc: 'Receberás confirmação por email (demonstração).',
    },
    en: {
      title: 'Students — academicoapp',
      h1: 'Resources and Opportunities for Students',
      desc: 'Tutoring, study materials, scholarships and career guidance to accelerate your academic path.',
      dashboard: 'Student Dashboard',
      tabs: {
        profile: 'My Profile',
        schedule: 'Schedule Class',
        classes: 'My Classes',
        payments: 'Payments',
      },
      loginCta: 'Please log in to access your dashboard.',
      goLogin: 'Go to login',
      profileLabels: {
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        plan: 'Plan',
        userType: 'User type',
      },
      scheduleForm: {
        subject: 'Subject/Topic',
        datetime: 'Date & Time',
        duration: 'Duration (minutes)',
        submit: 'Schedule',
        note: 'Demo: the scheduling will be confirmed via email.',
      },
      classesEmpty: "You don't have any scheduled classes yet.",
      paying: 'Payment started',
      payingDesc: 'Processing Mobile Money (demo).',
      scheduled: 'Class scheduled',
      scheduledDesc: 'You will receive a confirmation email (demo).',
    },
  }[language as 'pt' | 'en'];

  // Auth & profile
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [selectedService, setSelectedService] = useState<string>('');
  const [showServiceFlow, setShowServiceFlow] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.user) { setLoadingProfile(false); return; }
      setLoadingProfile(true);
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();
      setProfile(data || null);
      setLoadingProfile(false);
    };
    loadProfile();
  }, [session?.user?.id]);

  // Sessions (Minhas Aulas)
  const [sessionsList, setSessionsList] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  useEffect(() => {
    const loadSessions = async () => {
      if (!profile?.id) return;
      setLoadingSessions(true);
      const { data } = await supabase
        .from('mentorship_sessions')
        .select('*')
        .eq('student_id', profile.id)
        .order('session_date', { ascending: true });
      setSessionsList(data || []);
      setLoadingSessions(false);
    };
    loadSessions();
  }, [profile?.id]);

  // Schedule form (demo)
  const [subject, setSubject] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [duration, setDuration] = useState<number>(60);

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: t.scheduled, description: t.scheduledDesc });
    setSubject('');
    setDateTime('');
    setDuration(60);
  };

  // Payments (demo)
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState<string>('');
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: t.paying, description: t.payingDesc });
    setPhone('');
    setAmount('');
  };

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
        <p className="text-lg text-muted-foreground max-w-3xl mb-10">{t.desc}</p>

        {!session?.user ? (
          <div className="space-y-16">
            {/* Triagem Inteligente */}
            <SmartTriaging language={language} />
            
            {/* Catálogo de Serviços */}
            <ServicesCatalog 
              language={language} 
              onServiceSelect={(serviceId) => {
                setSelectedService(serviceId);
                setShowServiceFlow(true);
              }} 
            />
          </div>
        ) : (
          <div className="space-y-8">
            {showServiceFlow && selectedService ? (
              <ServiceFlows
                language={language}
                selectedService={selectedService}
                onComplete={() => {
                  setShowServiceFlow(false);
                  setSelectedService('');
                }}
              />
            ) : (
              <>
                {/* Triagem Inteligente */}
                <SmartTriaging language={language} />
                
                {/* Catálogo de Serviços */}
                <ServicesCatalog 
                  language={language} 
                  onServiceSelect={(serviceId) => {
                    setSelectedService(serviceId);
                    setShowServiceFlow(true);
                  }} 
                />
                
                {/* Dashboard do Estudante */}
                <StudentDashboard language={language} profile={profile} />
              </>
            )}
          </div>
        )}
      </main>
      <Footer language={language} />
    </div>
  );
};

export default Students;
