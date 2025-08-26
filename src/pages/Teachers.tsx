import { useEffect, useMemo, useState } from 'react';
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
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from 'date-fns';
import TeacherTriaging from '@/components/teachers/TeacherTriaging';
import TeacherServicesCatalog from '@/components/teachers/TeacherServicesCatalog';
import TeacherDashboard from '@/components/teachers/TeacherDashboard';
import TeacherCheckoutFlow from '@/components/teachers/TeacherCheckoutFlow';

const Teachers = () => {
  const [language, setLanguage] = useState('pt');
  const { toast } = useToast();

  const t = {
    pt: {
      title: 'Professores — academicoapp',
      h1: 'Ferramentas e Formação para Professores',
      desc: 'Recursos didácticos, formação pedagógica contínua e comunidade de colaboração docente.',
      dashboard: 'Minha Agenda',
      tabs: {
        week: 'Semanal',
        month: 'Mensal',
        period: 'Por Período',
      },
      loginCta: 'Inicia sessão para ver a tua agenda.',
      goLogin: 'Ir para login',
      noMentor: 'Não encontrámos um perfil de mentor associado à tua conta.',
      classesEmpty: 'Não existem aulas neste período.',
      periodStart: 'Data inicial',
      periodEnd: 'Data final',
      search: 'Buscar',
      rangeLabel: (a: string, b: string) => `Período: ${a} – ${b}`,
    },
    en: {
      title: 'Teachers — academicoapp',
      h1: 'Tools and Training for Teachers',
      desc: 'Teaching resources, continuous pedagogical training and a collaborative teacher community.',
      dashboard: 'My Schedule',
      tabs: {
        week: 'Weekly',
        month: 'Monthly',
        period: 'By Period',
      },
      loginCta: 'Please log in to view your schedule.',
      goLogin: 'Go to login',
      noMentor: "We couldn't find a mentor profile linked to your account.",
      classesEmpty: 'No classes for this period.',
      periodStart: 'Start date',
      periodEnd: 'End date',
      search: 'Search',
      rangeLabel: (a: string, b: string) => `Range: ${a} – ${b}`,
    },
  }[language as 'pt' | 'en'];

  // Auth & profile
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [mentor, setMentor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTriaging, setShowTriaging] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [recommendedTracks, setRecommendedTracks] = useState<string[]>([]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProfileAndMentor = async () => {
      if (!session?.user) { setLoading(false); return; }
      setLoading(true);
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();
      setProfile(prof || null);

      if (prof?.id) {
        const { data: mentorData, error } = await supabase
          .from('mentors')
          .select('*')
          .eq('profile_id', prof.id)
          .maybeSingle();
        if (error) {
          toast({ title: 'Erro', description: error.message });
        }
        setMentor(mentorData || null);
      } else {
        setMentor(null);
      }
      setLoading(false);
    };
    fetchProfileAndMentor();
  }, [session?.user?.id]);

  // Date helpers for ranges
  const now = new Date();
  const weekRange = useMemo(() => ({
    start: startOfWeek(now, { weekStartsOn: 1 }),
    end: endOfWeek(now, { weekStartsOn: 1 }),
  }), [now]);
  const monthRange = useMemo(() => ({
    start: startOfMonth(now),
    end: endOfMonth(now),
  }), [now]);

  // Sessions lists
  const [activeTab, setActiveTab] = useState<'week' | 'month' | 'period'>('week');
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  const [periodStart, setPeriodStart] = useState<string>('');
  const [periodEnd, setPeriodEnd] = useState<string>('');

  const fetchSessionsRange = async (start: Date, end: Date) => {
    if (!mentor?.id) return;
    setLoadingSessions(true);
    const { data, error } = await supabase
      .from('mentorship_sessions')
      .select('*')
      .eq('mentor_id', mentor.id)
      .gte('session_date', start.toISOString())
      .lt('session_date', new Date(end.getTime() + 1000).toISOString())
      .order('session_date', { ascending: true });
    if (error) {
      toast({ title: 'Erro ao carregar agenda', description: error.message });
    }
    setSessions(data || []);
    setLoadingSessions(false);
  };

  // Auto-fetch for week/month
  useEffect(() => {
    if (!mentor?.id) return;
    if (activeTab === 'week') {
      fetchSessionsRange(weekRange.start, weekRange.end);
    }
    if (activeTab === 'month') {
      fetchSessionsRange(monthRange.start, monthRange.end);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentor?.id, activeTab]);

  const handleSearchPeriod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!periodStart || !periodEnd) {
      toast({ title: 'Dados em falta', description: 'Seleciona datas válidas.' });
      return;
    }
    const start = new Date(`${periodStart}T00:00:00`);
    const end = new Date(`${periodEnd}T23:59:59`);
    if (start > end) {
      toast({ title: 'Período inválido', description: 'A data inicial é posterior à final.' });
      return;
    }
    fetchSessionsRange(start, end);
  };

  const handleTriagingComplete = (tracks: string[]) => {
    setRecommendedTracks(tracks);
    setShowTriaging(false);
    setShowCatalog(true);
  };

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    setShowCatalog(false);
    setShowCheckout(true);
  };

  const handleCheckoutComplete = () => {
    setShowCheckout(false);
    setSelectedService(null);
    // Refresh dashboard or show success message
  };

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
        <p className="text-lg text-muted-foreground max-w-3xl mb-10">{t.desc}</p>


        {/* Triagem e Catálogo - sempre visíveis */}
        {showTriaging && (
          <div className="mb-10">
            <TeacherTriaging
              language={language}
              onRecommendation={handleTriagingComplete}
            />
          </div>
        )}

        {showCatalog && (
          <div className="mb-10">
            <TeacherServicesCatalog
              language={language}
              onServiceSelect={handleServiceSelect}
              recommendedTracks={recommendedTracks}
            />
          </div>
        )}

        {showCheckout && selectedService && (
          <div className="mb-10">
            <TeacherCheckoutFlow
              language={language}
              service={selectedService}
              onComplete={handleCheckoutComplete}
              onBack={() => {
                setShowCheckout(false);
                setShowCatalog(true);
              }}
            />
          </div>
        )}

        {/* Botões principais - sempre visíveis */}
        {!showTriaging && !showCatalog && !showCheckout && (
          <div className="text-center space-y-4 mb-10">
            <Button
              size="lg"
              onClick={() => setShowTriaging(true)}
              className="mr-4"
            >
              Começar Triagem (60s)
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowCatalog(true)}
            >
              Ver Catálogo de Serviços
            </Button>
          </div>
        )}

        {/* Seção de login/dashboard */}
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
        ) : loading ? (
          <p className="text-muted-foreground">Carregando…</p>
        ) : (
          <div className="space-y-8">
            {session?.user && profile && !showTriaging && !showCatalog && !showCheckout && (
              <TeacherDashboard
                language={language}
                profile={profile}
              />
            )}

            {/* Legacy mentor schedule view */}
            {mentor && !showTriaging && !showCatalog && !showCheckout && (
              <section aria-label={t.dashboard}>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>{t.dashboard}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {format(weekRange.start, 'dd/MM/yyyy')} – {format(weekRange.end, 'dd/MM/yyyy')}
                  </CardContent>
                </Card>

                <Tabs defaultValue="week" value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="week">{t.tabs.week}</TabsTrigger>
                    <TabsTrigger value="month">{t.tabs.month}</TabsTrigger>
                    <TabsTrigger value="period">{t.tabs.period}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="week">
                    <Card>
                      <CardHeader>
                        <CardTitle>{t.tabs.week}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {loadingSessions ? (
                          <p className="text-muted-foreground">Carregando…</p>
                        ) : sessions.length === 0 ? (
                          <p className="text-muted-foreground">{t.classesEmpty}</p>
                        ) : (
                          <div className="grid gap-4">
                            {sessions.map((s) => (
                              <div key={s.id} className="border rounded-md p-4">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                  <div>
                                    <p className="font-medium">{new Date(s.session_date).toLocaleString()}</p>
                                    <p className="text-sm text-muted-foreground">Duração: {s.duration_minutes} min • Tipo: {s.session_type} • Estado: {s.status}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-muted-foreground">Aluno ID: {s.student_id}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="month">
                    <Card>
                      <CardHeader>
                        <CardTitle>{t.tabs.month}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {loadingSessions ? (
                          <p className="text-muted-foreground">Carregando…</p>
                        ) : sessions.length === 0 ? (
                          <p className="text-muted-foreground">{t.classesEmpty}</p>
                        ) : (
                          <div className="grid gap-4">
                            {sessions.map((s) => (
                              <div key={s.id} className="border rounded-md p-4">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                  <div>
                                    <p className="font-medium">{new Date(s.session_date).toLocaleString()}</p>
                                    <p className="text-sm text-muted-foreground">Duração: {s.duration_minutes} min • Tipo: {s.session_type} • Estado: {s.status}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-muted-foreground">Aluno ID: {s.student_id}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="period">
                    <Card>
                      <CardHeader>
                        <CardTitle>{t.tabs.period}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleSearchPeriod} className="grid gap-4 max-w-xl mb-6">
                          <div className="grid gap-2">
                            <Label htmlFor="start">{t.periodStart}</Label>
                            <Input id="start" type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="end">{t.periodEnd}</Label>
                            <Input id="end" type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} />
                          </div>
                          <div>
                            <Button type="submit">{t.search}</Button>
                          </div>
                        </form>

                        {periodStart && periodEnd && (
                          <p className="text-sm text-muted-foreground mb-4">
                            {t.rangeLabel(format(new Date(`${periodStart}T00:00:00`), 'dd/MM/yyyy'), format(new Date(`${periodEnd}T00:00:00`), 'dd/MM/yyyy'))}
                          </p>
                        )}

                        {loadingSessions ? (
                          <p className="text-muted-foreground">Carregando…</p>
                        ) : sessions.length === 0 ? (
                          <p className="text-muted-foreground">{t.classesEmpty}</p>
                        ) : (
                          <div className="grid gap-4">
                            {sessions.map((s) => (
                              <div key={s.id} className="border rounded-md p-4">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                  <div>
                                    <p className="font-medium">{new Date(s.session_date).toLocaleString()}</p>
                                    <p className="text-sm text-muted-foreground">Duração: {s.duration_minutes} min • Tipo: {s.session_type} • Estado: {s.status}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-muted-foreground">Aluno ID: {s.student_id}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </section>
            )}
          </div>
        )}
      </main>
      <Footer language={language} />
    </div>
  );
};

export default Teachers;
