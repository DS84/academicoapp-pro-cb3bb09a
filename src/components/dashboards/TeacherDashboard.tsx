import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface TeacherDashboardProps {
  language?: 'pt' | 'en';
}

const TeacherDashboard = ({ language = 'pt' }: TeacherDashboardProps) => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recentTickets, setRecentTickets] = useState<any[]>([]);

  const translations = {
    pt: {
      welcome: 'Bem-vindo de volta',
      dashboardTitle: 'Dashboard do Professor',
      overview: 'Visão Geral da Atividade',
      totalTickets: 'Total de Tickets',
      openTickets: 'Tickets Abertos',
      resolvedTickets: 'Tickets Resolvidos',
      pendingTickets: 'Tickets Pendentes',
      quickActions: 'Ações Rápidas',
      createTicket: 'Criar Ticket',
      manageCourses: 'Gerir Cursos',
      recentTickets: 'Tickets Recentes',
      noTickets: 'Nenhum ticket encontrado.',
      viewDetails: 'Ver Detalhes',
      severity: {
        baixa: 'Baixa',
        media: 'Média',
        alta: 'Alta',
        critica: 'Crítica'
      },
      status: {
        aberto: 'Aberto',
        em_progresso: 'Em Progresso',
        resolvido: 'Resolvido',
        fechado: 'Fechado'
      }
    },
    en: {
      welcome: 'Welcome back',
      dashboardTitle: 'Teacher Dashboard',
      overview: 'Activity Overview',
      totalTickets: 'Total Tickets',
      openTickets: 'Open Tickets',
      resolvedTickets: 'Resolved Tickets',
      pendingTickets: 'Pending Tickets',
      quickActions: 'Quick Actions',
      createTicket: 'Create Ticket',
      manageCourses: 'Manage Courses',
      recentTickets: 'Recent Tickets',
      noTickets: 'No tickets found.',
      viewDetails: 'View Details',
      severity: {
        baixa: 'Low',
        media: 'Medium',
        alta: 'High',
        critica: 'Critical'
      },
      status: {
        aberto: 'Open',
        em_progresso: 'In Progress',
        resolvido: 'Resolved',
        fechado: 'Closed'
      }
    }
  };

  const t = translations[language];

  const fetchDashboardData = async () => {
    if (!user || !profile) return;

    try {
      setLoading(true);

      // Fetch support tickets
      const { data: tickets } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('professor_id', profile.id)
        .order('created_at', { ascending: false });

      const ticketStats = {
        total: tickets?.length || 0,
        open: tickets?.filter(t => t.status === 'aberto').length || 0,
        resolved: tickets?.filter(t => t.status === 'resolvido').length || 0,
        pending: tickets?.filter(t => t.status === 'em_progresso').length || 0,
      };

      setStats(ticketStats);
      setRecentTickets(tickets?.slice(0, 5) || []);

    } catch (error) {
      console.error('Error fetching teacher dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user, profile]);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      aberto: { variant: 'destructive' as const, text: t.status.aberto },
      em_progresso: { variant: 'secondary' as const, text: t.status.em_progresso },
      resolvido: { variant: 'default' as const, text: t.status.resolvido },
      fechado: { variant: 'outline' as const, text: t.status.fechado }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.aberto;
    return <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>;
  };

  const getSeverityBadge = (severity: string) => {
    const severityMap = {
      baixa: { variant: 'outline' as const, text: t.severity.baixa },
      media: { variant: 'secondary' as const, text: t.severity.media },
      alta: { variant: 'destructive' as const, text: t.severity.alta },
      critica: { variant: 'destructive' as const, text: t.severity.critica }
    };
    
    const severityInfo = severityMap[severity as keyof typeof severityMap] || severityMap.media;
    return <Badge variant={severityInfo.variant}>{severityInfo.text}</Badge>;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="h-12 bg-muted rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded animate-pulse" />
            ))}
          </div>
          <div className="h-64 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary">
            {t.welcome}, {profile?.full_name || user?.email}!
          </h1>
          <p className="text-muted-foreground mt-2">{t.dashboardTitle}</p>
        </div>

        {/* Stats Overview */}
        <div>
          <h2 className="text-xl font-semibold mb-4">{t.overview}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.totalTickets}</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.openTickets}</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.open || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.resolvedTickets}</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.resolved || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.pendingTickets}</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pending || 0}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {t.quickActions}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button>
                <MessageSquare className="mr-2 h-4 w-4" />
                {t.createTicket}
              </Button>
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                {t.manageCourses}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Tickets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {t.recentTickets}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentTickets.length > 0 ? (
              <div className="space-y-4">
                {recentTickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{ticket.assunto}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getSeverityBadge(ticket.severidade)}
                      {getStatusBadge(ticket.status)}
                      <Button variant="outline" size="sm">
                        {t.viewDetails}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">{t.noTickets}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;