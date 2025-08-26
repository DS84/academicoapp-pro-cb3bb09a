import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, FileText, Target, TrendingUp, Clock, BookOpen, Award, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface StudentDashboardProps {
  language: string;
  profile: any;
}

interface DashboardData {
  upcomingSessions: any[];
  materials: any[];
  tasks: any[];
  progress: any[];
  history: any[];
  certificates: any[];
}

const StudentDashboard = ({ language, profile }: StudentDashboardProps) => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    upcomingSessions: [],
    materials: [],
    tasks: [],
    progress: [],
    history: [],
    certificates: []
  });
  const [loading, setLoading] = useState(true);

  const t = {
    pt: {
      title: 'Dashboard do Estudante',
      welcome: 'Bem-vindo de volta',
      tabs: {
        overview: 'Visão Geral',
        sessions: 'Sessões',
        materials: 'Materiais',
        progress: 'Progresso',
        history: 'Histórico',
        certificates: 'Certificados'
      },
      overview: {
        nextSession: 'Próxima Sessão',
        noNextSession: 'Nenhuma sessão agendada',
        scheduleSession: 'Agendar Sessão',
        activeTasks: 'Tarefas Ativas',
        noActiveTasks: 'Nenhuma tarefa pendente',
        weeklyProgress: 'Progresso Semanal',
        studyStreak: 'Sequência de Estudos',
        days: 'dias',
        totalHours: 'Horas Totais',
        completedTasks: 'Tarefas Concluídas'
      },
      sessions: {
        upcoming: 'Próximas Sessões',
        noUpcoming: 'Não tens sessões agendadas para as próximas semanas.',
        join: 'Entrar',
        reschedule: 'Reagendar',
        cancel: 'Cancelar'
      },
      materials: {
        library: 'Biblioteca de Materiais',
        noMaterials: 'Nenhum material disponível no momento.',
        download: 'Baixar',
        view: 'Visualizar',
        studyPlan: 'Plano de Estudo',
        week: 'Semana'
      },
      progress: {
        subjects: 'Progresso por Disciplina',
        overall: 'Progresso Geral',
        goals: 'Metas do Mês',
        achievements: 'Conquistas'
      },
      history: {
        recentActivity: 'Atividade Recente',
        completedSessions: 'Sessões Concluídas',
        noHistory: 'Nenhuma atividade registrada ainda.'
      },
      certificates: {
        earned: 'Certificados Obtidos',
        noCertificates: 'Ainda não obtiveste nenhum certificado.',
        download: 'Baixar PDF',
        share: 'Partilhar'
      }
    },
    en: {
      title: 'Student Dashboard',
      welcome: 'Welcome back',
      tabs: {
        overview: 'Overview',
        sessions: 'Sessions',
        materials: 'Materials',
        progress: 'Progress',
        history: 'History',
        certificates: 'Certificates'
      },
      overview: {
        nextSession: 'Next Session',
        noNextSession: 'No scheduled sessions',
        scheduleSession: 'Schedule Session',
        activeTasks: 'Active Tasks',
        noActiveTasks: 'No pending tasks',
        weeklyProgress: 'Weekly Progress',
        studyStreak: 'Study Streak',
        days: 'days',
        totalHours: 'Total Hours',
        completedTasks: 'Completed Tasks'
      },
      sessions: {
        upcoming: 'Upcoming Sessions',
        noUpcoming: 'You have no sessions scheduled for the coming weeks.',
        join: 'Join',
        reschedule: 'Reschedule',
        cancel: 'Cancel'
      },
      materials: {
        library: 'Materials Library',
        noMaterials: 'No materials available at the moment.',
        download: 'Download',
        view: 'View',
        studyPlan: 'Study Plan',
        week: 'Week'
      },
      progress: {
        subjects: 'Progress by Subject',
        overall: 'Overall Progress',
        goals: 'Monthly Goals',
        achievements: 'Achievements'
      },
      history: {
        recentActivity: 'Recent Activity',
        completedSessions: 'Completed Sessions',
        noHistory: 'No activity recorded yet.'
      },
      certificates: {
        earned: 'Earned Certificates',
        noCertificates: 'You have not earned any certificates yet.',
        download: 'Download PDF',
        share: 'Share'
      }
    }
  }[language as 'pt' | 'en'];

  useEffect(() => {
    loadDashboardData();
  }, [profile?.id]);

  const loadDashboardData = async () => {
    if (!profile?.id) return;
    
    setLoading(true);
    try {
      // Carregar sessões de mentoria próximas
      const { data: sessions } = await supabase
        .from('mentorship_sessions')
        .select('*')
        .eq('student_id', profile.id)
        .gte('session_date', new Date().toISOString())
        .order('session_date', { ascending: true })
        .limit(5);

      // Carregar materiais (demo data)
      const materials = [
        {
          id: 1,
          title: 'Cálculo I - Derivadas',
          type: 'PDF',
          size: '2.3 MB',
          downloadUrl: '#'
        },
        {
          id: 2,
          title: 'Física - Mecânica',
          type: 'Video',
          duration: '45 min',
          viewUrl: '#'
        }
      ];

      // Carregar tarefas (demo data)
      const tasks = [
        {
          id: 1,
          title: 'Resolver exercícios de derivadas',
          subject: 'Cálculo I',
          dueDate: '2024-01-15',
          completed: false
        },
        {
          id: 2,
          title: 'Revisar leis de Newton',
          subject: 'Física',
          dueDate: '2024-01-18',
          completed: false
        }
      ];

      setDashboardData({
        upcomingSessions: sessions || [],
        materials,
        tasks,
        progress: [],
        history: [],
        certificates: []
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">{t.title}</h1>
          <p className="text-lg text-muted-foreground">
            {t.welcome}, {profile?.full_name || 'Estudante'}!
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6">
          <TabsTrigger value="overview">{t.tabs.overview}</TabsTrigger>
          <TabsTrigger value="sessions">{t.tabs.sessions}</TabsTrigger>
          <TabsTrigger value="materials">{t.tabs.materials}</TabsTrigger>
          <TabsTrigger value="progress">{t.tabs.progress}</TabsTrigger>
          <TabsTrigger value="history">{t.tabs.history}</TabsTrigger>
          <TabsTrigger value="certificates">{t.tabs.certificates}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Stats Cards */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t.overview.totalHours}</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t.overview.completedTasks}</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t.overview.studyStreak}</p>
                    <p className="text-2xl font-bold">7 {t.overview.days}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t.overview.weeklyProgress}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={75} className="flex-1 h-2" />
                      <span className="text-sm font-medium">75%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Próxima Sessão */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {t.overview.nextSession}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.upcomingSessions.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.upcomingSessions.slice(0, 1).map((session) => (
                      <div key={session.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">Sessão de Mentoria</h4>
                          <Badge variant="outline">
                            {new Date(session.session_date).toLocaleDateString()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {new Date(session.session_date).toLocaleTimeString()} • {session.duration_minutes} min
                        </p>
                        <Button size="sm" className="w-full">
                          {t.sessions.join}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">{t.overview.noNextSession}</p>
                    <Button variant="outline">{t.overview.scheduleSession}</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tarefas Ativas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {t.overview.activeTasks}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.tasks.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.tasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-4 h-4 border-2 border-primary rounded"></div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{task.title}</p>
                          <p className="text-xs text-muted-foreground">{task.subject} • {task.dueDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">{t.overview.noActiveTasks}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>{t.sessions.upcoming}</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.upcomingSessions.map((session) => (
                    <div key={session.id} className="p-4 border rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h4 className="font-medium mb-1">Sessão de Mentoria</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(session.session_date).toLocaleString()} • {session.duration_minutes} min
                          </p>
                          <Badge variant="outline" className="mt-2">
                            {session.status}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm">{t.sessions.join}</Button>
                          <Button size="sm" variant="outline">{t.sessions.reschedule}</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">{t.sessions.noUpcoming}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Materials Tab */}
        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <CardTitle>{t.materials.library}</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.materials.length > 0 ? (
                <div className="grid gap-4">
                  {dashboardData.materials.map((material) => (
                    <div key={material.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-primary" />
                          <div>
                            <h4 className="font-medium">{material.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {material.type} • {material.size || material.duration}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            {t.materials.download}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">{t.materials.noMaterials}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.progress.overall}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Matemática</span>
                      <span className="text-sm text-muted-foreground">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Física</span>
                      <span className="text-sm text-muted-foreground">72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Química</span>
                      <span className="text-sm text-muted-foreground">90%</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>{t.history.recentActivity}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t.history.noHistory}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certificates Tab */}
        <TabsContent value="certificates">
          <Card>
            <CardHeader>
              <CardTitle>{t.certificates.earned}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t.certificates.noCertificates}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;