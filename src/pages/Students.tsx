import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
          <Card>
            <CardHeader>
              <CardTitle>{t.dashboard}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{t.loginCta}</p>
              <Button asChild>
                <Link to="/login">{t.goLogin}</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <section aria-label={t.dashboard}>
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
                <TabsTrigger value="profile">{t.tabs.profile}</TabsTrigger>
                <TabsTrigger value="schedule">{t.tabs.schedule}</TabsTrigger>
                <TabsTrigger value="classes">{t.tabs.classes}</TabsTrigger>
                <TabsTrigger value="payments">{t.tabs.payments}</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>{t.tabs.profile}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingProfile ? (
                      <p className="text-muted-foreground">Carregando…</p>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">{t.profileLabels.name}</p>
                          <p className="font-medium">{profile?.full_name ?? '-'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{t.profileLabels.email}</p>
                          <p className="font-medium">{profile?.email ?? session?.user?.email ?? '-'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{t.profileLabels.phone}</p>
                          <p className="font-medium">{profile?.phone ?? '-'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{t.profileLabels.userType}</p>
                          <p className="font-medium">{profile?.user_type ?? 'student'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{t.profileLabels.plan}</p>
                          <p className="font-medium">Gratuito</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="schedule">
                <Card>
                  <CardHeader>
                    <CardTitle>{t.tabs.schedule}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSchedule} className="grid gap-4 max-w-xl">
                      <div className="grid gap-2">
                        <Label htmlFor="subject">{t.scheduleForm.subject}</Label>
                        <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Ex.: Matemática" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="datetime">{t.scheduleForm.datetime}</Label>
                        <Input id="datetime" type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="duration">{t.scheduleForm.duration}</Label>
                        <Input id="duration" type="number" min={15} step={15} value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
                      </div>
                      <p className="text-sm text-muted-foreground">{t.scheduleForm.note}</p>
                      <div>
                        <Button type="submit">{t.scheduleForm.submit}</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="classes">
                <Card>
                  <CardHeader>
                    <CardTitle>{t.tabs.classes}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingSessions ? (
                      <p className="text-muted-foreground">Carregando…</p>
                    ) : sessionsList.length === 0 ? (
                      <p className="text-muted-foreground">{t.classesEmpty}</p>
                    ) : (
                      <div className="grid gap-4">
                        {sessionsList.map((s) => (
                          <div key={s.id} className="border rounded-md p-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                              <div>
                                <p className="font-medium">{new Date(s.session_date).toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">Duração: {s.duration_minutes} min • Tipo: {s.session_type}</p>
                              </div>
                              <div>
                                <span className="text-sm text-muted-foreground">Assunto ID: {s.subject_id ?? '—'}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payments">
                <Card>
                  <CardHeader>
                    <CardTitle>{t.tabs.payments}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePayment} className="grid gap-4 max-w-md">
                      <div className="grid gap-2">
                        <Label htmlFor="mm-phone">{t.profileLabels.phone}</Label>
                        <Input id="mm-phone" inputMode="numeric" placeholder="Ex.: 923123456" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="mm-amount">Valor (AOA)</Label>
                        <Input id="mm-amount" type="number" min={100} step={50} value={amount} onChange={(e) => setAmount(e.target.value)} />
                      </div>
                      <div>
                        <Button type="submit">Pagar</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>
        )}
      </main>
      <Footer language={language} />
    </div>
  );
};

export default Students;
