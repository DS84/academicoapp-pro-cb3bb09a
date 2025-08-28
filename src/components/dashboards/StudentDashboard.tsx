import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  BookOpen, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Award,
  Clock,
  CheckCircle
} from 'lucide-react';

interface DashboardStats {
  total_bookings: number;
  pending_bookings: number;
  completed_bookings: number;
  total_spent: number;
  total_earned: number;
  courses_completed: number;
  courses_enrolled: number;
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
      overview: 'Resumo da Conta',
      totalBookings: 'Total de Serviços',
      pendingBookings: 'Pendentes',
      completedBookings: 'Concluídos',
      totalSpent: 'Total Gasto',
      coursesEnrolled: 'Cursos Inscritos',
      coursesCompleted: 'Cursos Concluídos',
      recentActivity: 'Atividade Recente',
      noActivity: 'Sem atividade recente',
      viewAll: 'Ver Todos',
      bookNewService: 'Reservar Novo Serviço',
      browseCourses: 'Explorar Cursos',
      quickActions: 'Ações Rápidas',
      status: 'Estado',
      pending: 'Pendente',
      confirmed: 'Confirmado',
      completed: 'Concluído',
      cancelled: 'Cancelado',
    },
    en: {
      welcome: 'Welcome back',
      overview: 'Account Overview',
      totalBookings: 'Total Services',
      pendingBookings: 'Pending',
      completedBookings: 'Completed',
      totalSpent: 'Total Spent',
      coursesEnrolled: 'Courses Enrolled',
      coursesCompleted: 'Courses Completed',
      recentActivity: 'Recent Activity',
      noActivity: 'No recent activity',
      viewAll: 'View All',
      bookNewService: 'Book New Service',
      browseCourses: 'Browse Courses',
      quickActions: 'Quick Actions',
      status: 'Status',
      pending: 'Pending',
      confirmed: 'Confirmed',
      completed: 'Completed',
      cancelled: 'Cancelled',
    }
  };

  const t = translations[language];

  const fetchDashboardStats = async () => {
    if (!user) return;

    try {
      // Fetch or create dashboard stats
      const { data: existingStats, error: statsError } = await supabase
        .from('user_dashboard_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (statsError && statsError.code !== 'PGRST116') {
        throw statsError;
      }

      if (!existingStats) {
        // Create initial stats record
        const { data: newStats, error: createError } = await supabase
          .from('user_dashboard_stats')
          .insert({
            user_id: user.id,
            total_bookings: 0,
            pending_bookings: 0,
            completed_bookings: 0,
            total_spent: 0,
            courses_enrolled: 0,
            courses_completed: 0,
          })
          .select()
          .single();

        if (createError) throw createError;
        setStats(newStats);
      } else {
        setStats(existingStats);
      }

      // Fetch recent bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          id,
          agenda,
          status,
          valor,
          created_at,
          services (nome)
        `)
        .eq('estudante_id', profile?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (bookingsError) throw bookingsError;
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
    const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
      pending: 'outline',
      confirmed: 'default',
      completed: 'secondary',
      cancelled: 'destructive',
    };

    return (
      <Badge variant={variants[status] || 'outline'}>
        {t[status as keyof typeof t] || status}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
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
            {t.welcome}, {profile?.full_name?.split(' ')[0] || 'Estudante'}!
          </h1>
          <p className="text-muted-foreground">
            Aqui está o resumo da sua atividade académica
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div>
        <h2 className="text-xl font-semibold mb-4">{t.overview}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.totalBookings}
                  </p>
                  <p className="text-2xl font-bold">{stats?.total_bookings || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.pendingBookings}
                  </p>
                  <p className="text-2xl font-bold">{stats?.pending_bookings || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.completedBookings}
                  </p>
                  <p className="text-2xl font-bold">{stats?.completed_bookings || 0}</p>
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
                    {t.totalSpent}
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(stats?.total_spent || 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.coursesEnrolled}
                  </p>
                  <p className="text-2xl font-bold">{stats?.courses_enrolled || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.coursesCompleted}
                  </p>
                  <p className="text-2xl font-bold">{stats?.courses_completed || 0}</p>
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
            <Calendar className="mr-2 h-4 w-4" />
            {t.bookNewService}
          </Button>
          <Button variant="outline" size="lg" className="justify-start">
            <BookOpen className="mr-2 h-4 w-4" />
            {t.browseCourses}
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{t.recentActivity}</h2>
          <Button variant="outline" size="sm">
            {t.viewAll}
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6">
            {recentBookings.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                {t.noActivity}
              </p>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{booking.services?.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(booking.agenda).toLocaleDateString('pt-PT')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {formatCurrency(booking.valor)}
                      </span>
                      {getStatusBadge(booking.status)}
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

export default StudentDashboard;