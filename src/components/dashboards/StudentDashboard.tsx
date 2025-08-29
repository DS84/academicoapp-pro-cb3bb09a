import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  BookOpen, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Clock,
  CheckCircle,
  Star
} from 'lucide-react';

interface DashboardStats {
  total_bookings: number;
  pending_bookings: number;
  completed_bookings: number;
  total_spent: number;
  courses_enrolled: number;
  courses_completed: number;
  reviews_received: number;
  average_rating: number;
  last_activity: string;
}

interface StudentDashboardProps {
  language?: 'pt' | 'en';
}

const StudentDashboard = ({ language = 'pt' }: StudentDashboardProps) => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  const translations = {
    pt: {
      welcome: 'Bem-vindo de volta',
      dashboardTitle: 'Dashboard do Estudante',
      overview: 'Visão Geral da Atividade',
      totalBookings: 'Total de Reservas',
      pendingBookings: 'Reservas Pendentes',
      totalSpent: 'Total Gasto',
      coursesEnrolled: 'Cursos Inscritos',
      coursesCompleted: 'Cursos Completados',
      quickActions: 'Ações Rápidas',
      bookNewService: 'Reservar Serviço',
      browseCourses: 'Explorar Cursos',
      recentActivity: 'Atividade Recente',
      noActivity: 'Nenhuma atividade recente.',
      viewDetails: 'Ver Detalhes'
    },
    en: {
      welcome: 'Welcome back',
      dashboardTitle: 'Student Dashboard',
      overview: 'Activity Overview',
      totalBookings: 'Total Bookings',
      pendingBookings: 'Pending Bookings',
      totalSpent: 'Total Spent',
      coursesEnrolled: 'Courses Enrolled',
      coursesCompleted: 'Courses Completed',
      quickActions: 'Quick Actions',
      bookNewService: 'Book Service',
      browseCourses: 'Browse Courses',
      recentActivity: 'Recent Activity',
      noActivity: 'No recent activity.',
      viewDetails: 'View Details'
    }
  };

  const t = translations[language];

  const fetchDashboardStats = async () => {
    if (!user || !profile) return;

    try {
      setLoading(true);

      // Fetch or create dashboard stats
      let { data: existingStats } = await supabase
        .from('user_dashboard_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!existingStats) {
        // Create initial stats
        const { data: newStats } = await supabase
          .from('user_dashboard_stats')
          .insert({
            user_id: user.id,
            total_bookings: 0,
            pending_bookings: 0,
            completed_bookings: 0,
            total_spent: 0,
            courses_enrolled: 0,
            courses_completed: 0,
            reviews_received: 0,
            average_rating: 0,
            last_activity: new Date().toISOString()
          })
          .select()
          .single();

        existingStats = newStats;
      }

      setStats(existingStats);

      // Fetch recent bookings
      const { data: bookings } = await supabase
        .from('bookings')
        .select(`
          *,
          services (nome)
        `)
        .eq('estudante_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentBookings(bookings || []);

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
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
                <CardTitle className="text-sm font-medium">{t.totalBookings}</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total_bookings || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.pendingBookings}</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pending_bookings || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.totalSpent}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats?.total_spent || 0)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.coursesEnrolled}</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.courses_enrolled || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.courses_completed || 0} {t.coursesCompleted.toLowerCase()}
                </p>
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
                <Calendar className="mr-2 h-4 w-4" />
                {t.bookNewService}
              </Button>
              <Button variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                {t.browseCourses}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              {t.recentActivity}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{booking.services?.nome || 'Serviço'}</p>
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
              <p className="text-muted-foreground text-center py-8">{t.noActivity}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;