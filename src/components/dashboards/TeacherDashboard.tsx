import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  HelpCircle, 
  BookOpen, 
  DollarSign, 
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
      welcome: 'Bem-vindo, Professor',
      overview: 'Resumo de Atividade',
      totalTickets: 'Total de Tickets',
      openTickets: 'Tickets Abertos',
      resolvedTickets: 'Tickets Resolvidos',
      totalEarned: 'Total Ganho',
      studentsHelped: 'Estudantes Ajudados',
      averageRating: 'Avaliação Média',
      recentTickets: 'Tickets Recentes',
      noTickets: 'Sem tickets recentes',
      viewAll: 'Ver Todos',
      createTicket: 'Criar Ticket',
      manageCourses: 'Gerir Cursos',
      quickActions: 'Ações Rápidas',
      status: 'Estado',
      open: 'Aberto',
      closed: 'Fechado',
      inProgress: 'Em Progresso',
      severity: 'Severidade',
      low: 'Baixa',
      medium: 'Média',
      high: 'Alta',
      critical: 'Crítica',
    },
    en: {
      welcome: 'Welcome, Teacher',
      overview: 'Activity Overview',
      totalTickets: 'Total Tickets',
      openTickets: 'Open Tickets',
      resolvedTickets: 'Resolved Tickets',
      totalEarned: 'Total Earned',
      studentsHelped: 'Students Helped',
      averageRating: 'Average Rating',
      recentTickets: 'Recent Tickets',
      noTickets: 'No recent tickets',
      viewAll: 'View All',
      createTicket: 'Create Ticket',
      manageCourses: 'Manage Courses',
      quickActions: 'Quick Actions',
      status: 'Status',
      open: 'Open',
      closed: 'Closed',
      inProgress: 'In Progress',
      severity: 'Severity',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      critical: 'Critical',
    }
  };

  const t = translations[language];

  const fetchDashboardData = async () => {
    if (!user || !profile) return;

    try {
      // Fetch support tickets
      const { data: tickets, error: ticketsError } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('professor_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (ticketsError) throw ticketsError;
      setRecentTickets(tickets || []);

      // Calculate stats
      const totalTickets = tickets?.length || 0;
      const openTickets = tickets?.filter(t => t.status === 'aberto').length || 0;
      const resolvedTickets = tickets?.filter(t => t.status === 'fechado').length || 0;

      setStats({
        totalTickets,
        openTickets,
        resolvedTickets,
        totalEarned: 0, // Will be calculated from actual earnings
        studentsHelped: 0, // Will be calculated from unique students
        averageRating: 4.5, // Placeholder
      });

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
    const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
      aberto: 'destructive',
      'em progresso': 'default',
      fechado: 'secondary',
    };

    return (
      <Badge variant={variants[status] || 'outline'}>
        {status === 'aberto' ? t.open : status === 'fechado' ? t.closed : status}
      </Badge>
    );
  };

  const getSeverityBadge = (severity: string) => {
    const colors: { [key: string]: string } = {
      baixa: 'bg-green-500',
      media: 'bg-yellow-500',
      alta: 'bg-orange-500',
      critica: 'bg-red-500',
    };

    return (
      <span className={`w-2 h-2 rounded-full ${colors[severity] || 'bg-gray-500'}`} />
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            {t.welcome}, {profile?.full_name?.split(' ')[0] || 'Professor'}!
          </h1>
          <p className="text-muted-foreground">
            Aqui está o resumo da sua atividade de ensino
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div>
        <h2 className="text-xl font-semibold mb-4">{t.overview}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.totalTickets}
                  </p>
                  <p className="text-2xl font-bold">{stats?.totalTickets || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.openTickets}
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats?.openTickets || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.resolvedTickets}
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats?.resolvedTickets || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.studentsHelped}
                  </p>
                  <p className="text-2xl font-bold">{stats?.studentsHelped || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.averageRating}
                  </p>
                  <p className="text-2xl font-bold">{stats?.averageRating || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.totalEarned}
                  </p>
                  <p className="text-2xl font-bold">
                    {new Intl.NumberFormat('pt-AO', {
                      style: 'currency',
                      currency: 'AOA',
                      minimumFractionDigits: 0,
                    }).format(stats?.totalEarned || 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">{t.quickActions}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Button size="lg" className="justify-start">
            <HelpCircle className="mr-2 h-4 w-4" />
            {t.createTicket}
          </Button>
          <Button variant="outline" size="lg" className="justify-start">
            <BookOpen className="mr-2 h-4 w-4" />
            {t.manageCourses}
          </Button>
        </div>
      </div>

      {/* Recent Tickets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{t.recentTickets}</h2>
          <Button variant="outline" size="sm">
            {t.viewAll}
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6">
            {recentTickets.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                {t.noTickets}
              </p>
            ) : (
              <div className="space-y-4">
                {recentTickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getSeverityBadge(ticket.severidade)}
                      <div className="flex-1">
                        <p className="font-medium">{ticket.assunto}</p>
                        <p className="text-sm text-muted-foreground">
                          {ticket.plataforma} • {new Date(ticket.created_at).toLocaleDateString('pt-PT')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(ticket.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;