import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Briefcase, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Users,
  Award,
  Clock,
  CheckCircle,
  Star
} from 'lucide-react';

interface ProfessionalDashboardProps {
  language?: 'pt' | 'en';
}

const ProfessionalDashboard = ({ language = 'pt' }: ProfessionalDashboardProps) => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  const translations = {
    pt: {
      welcome: 'Bem-vindo de volta',
      dashboardTitle: 'Dashboard Profissional',
      overview: 'Visão Geral do Negócio',
      totalBookings: 'Total de Reservas',
      pendingBookings: 'Reservas Pendentes',
      completedBookings: 'Reservas Concluídas',
      totalEarned: 'Total Ganho',
      clientsServed: 'Clientes Atendidos',
      activeServices: 'Serviços Ativos',
      quickActions: 'Ações Rápidas',
      manageServices: 'Gerir Serviços',
      viewCalendar: 'Ver Calendário',
      recentBookings: 'Reservas Recentes',
      noBookings: 'Nenhuma reserva encontrada.',
      viewDetails: 'Ver Detalhes'
    },
    en: {
      welcome: 'Welcome back',
      dashboardTitle: 'Professional Dashboard',
      overview: 'Business Overview',
      totalBookings: 'Total Bookings',
      pendingBookings: 'Pending Bookings',
      completedBookings: 'Completed Bookings',
      totalEarned: 'Total Earned',
      clientsServed: 'Clients Served',
      activeServices: 'Active Services',
      quickActions: 'Quick Actions',
      manageServices: 'Manage Services',
      viewCalendar: 'View Calendar',
      recentBookings: 'Recent Bookings',
      noBookings: 'No bookings found.',
      viewDetails: 'View Details'
    }
  };

  const t = translations[language];

  const fetchDashboardData = async () => {
    if (!user || !profile) return;

    try {
      setLoading(true);

      // Fetch professional bookings
      const { data: bookings } = await supabase
        .from('pro_bookings')
        .select(`
          *,
          pro_services (nome)
        `)
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      const bookingStats = {
        total: bookings?.length || 0,
        pending: bookings?.filter(b => b.status === 'pending').length || 0,
        completed: bookings?.filter(b => b.status === 'completed').length || 0,
        earned: bookings?.filter(b => b.status === 'completed').reduce((sum, b) => sum + Number(b.valor), 0) || 0,
        clients: new Set(bookings?.map(b => b.user_id)).size || 0,
        activeServices: 5 // This would come from a services query
      };

      setStats(bookingStats);
      setRecentBookings(bookings?.slice(0, 5) || []);

    } catch (error) {
      console.error('Error fetching professional dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user, profile]);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { variant: 'secondary' as const, text: language === 'pt' ? 'Pendente' : 'Pending' },
      confirmed: { variant: 'default' as const, text: language === 'pt' ? 'Confirmado' : 'Confirmed' },
      completed: { variant: 'default' as const, text: language === 'pt' ? 'Concluído' : 'Completed' },
      cancelled: { variant: 'destructive' as const, text: language === 'pt' ? 'Cancelado' : 'Cancelled' }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="h-12 bg-muted rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.totalBookings}</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.pendingBookings}</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pending || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.completedBookings}</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.completed || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.totalEarned}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats?.earned || 0)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.clientsServed}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.clients || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.activeServices}</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activeServices || 0}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              {t.quickActions}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button>
                <Briefcase className="mr-2 h-4 w-4" />
                {t.manageServices}
              </Button>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                {t.viewCalendar}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {t.recentBookings}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{booking.pro_services?.nome || 'Serviço'}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(booking.agenda).toLocaleDateString()} - {formatCurrency(booking.valor)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(booking.status)}
                      <Button variant="outline" size="sm">
                        {t.viewDetails}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">{t.noBookings}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;