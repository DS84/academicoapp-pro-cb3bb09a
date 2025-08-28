import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      welcome: 'Bem-vindo, Profissional',
      overview: 'Resumo de Negócio',
      totalBookings: 'Total de Reservas',
      pendingBookings: 'Pendentes',
      completedBookings: 'Concluídas',
      totalEarned: 'Total Ganho',
      clientsServed: 'Clientes Atendidos',
      averageRating: 'Avaliação Média',
      recentBookings: 'Reservas Recentes',
      noBookings: 'Sem reservas recentes',
      viewAll: 'Ver Todas',
      manageServices: 'Gerir Serviços',
      viewCalendar: 'Ver Calendário',
      quickActions: 'Ações Rápidas',
      status: 'Estado',
      pending: 'Pendente',
      confirmed: 'Confirmado',
      completed: 'Concluído',
      cancelled: 'Cancelado',
      monthlyRevenue: 'Receita Mensal',
      activeServices: 'Serviços Ativos',
    },
    en: {
      welcome: 'Welcome, Professional',
      overview: 'Business Overview',
      totalBookings: 'Total Bookings',
      pendingBookings: 'Pending',
      completedBookings: 'Completed',
      totalEarned: 'Total Earned',
      clientsServed: 'Clients Served',
      averageRating: 'Average Rating',
      recentBookings: 'Recent Bookings',
      noBookings: 'No recent bookings',
      viewAll: 'View All',
      manageServices: 'Manage Services',
      viewCalendar: 'View Calendar',
      quickActions: 'Quick Actions',
      status: 'Status',
      pending: 'Pending',
      confirmed: 'Confirmed',
      completed: 'Completed',
      cancelled: 'Cancelled',
      monthlyRevenue: 'Monthly Revenue',
      activeServices: 'Active Services',
    }
  };

  const t = translations[language];

  const fetchDashboardData = async () => {
    if (!user || !profile) return;

    try {
      // Fetch professional bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('pro_bookings')
        .select(`
          id,
          agenda,
          status,
          valor,
          created_at,
          pro_services (nome)
        `)
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (bookingsError) throw bookingsError;
      setRecentBookings(bookings || []);

      // Calculate stats
      const totalBookings = bookings?.length || 0;
      const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0;
      const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0;
      const totalEarned = bookings?.filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + Number(b.valor || 0), 0) || 0;

      // Fetch services count
      const { count: servicesCount, error: servicesError } = await supabase
        .from('pro_services')
        .select('*', { count: 'exact' });

      const activeServices = servicesCount || 0;

      setStats({
        totalBookings,
        pendingBookings,
        completedBookings,
        totalEarned,
        clientsServed: bookings?.length || 0, // Simplified calculation
        averageRating: 4.7, // Placeholder
        monthlyRevenue: totalEarned * 0.8, // Placeholder calculation
        activeServices,
      });

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
            {[...Array(8)].map((_, i) => (
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
            {t.welcome}, {profile?.full_name?.split(' ')[0] || 'Profissional'}!
          </h1>
          <p className="text-muted-foreground">
            Aqui está o resumo do seu negócio
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
                  <p className="text-2xl font-bold">{stats?.totalBookings || 0}</p>
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
                  <p className="text-2xl font-bold text-orange-600">
                    {stats?.pendingBookings || 0}
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
                    {t.completedBookings}
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats?.completedBookings || 0}
                  </p>
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
                    {formatCurrency(stats?.totalEarned || 0)}
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
                    {t.clientsServed}
                  </p>
                  <p className="text-2xl font-bold">{stats?.clientsServed || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500" />
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
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.monthlyRevenue}
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(stats?.monthlyRevenue || 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.activeServices}
                  </p>
                  <p className="text-2xl font-bold">{stats?.activeServices || 0}</p>
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
            <Briefcase className="mr-2 h-4 w-4" />
            {t.manageServices}
          </Button>
          <Button variant="outline" size="lg" className="justify-start">
            <Calendar className="mr-2 h-4 w-4" />
            {t.viewCalendar}
          </Button>
        </div>
      </div>

      {/* Recent Bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{t.recentBookings}</h2>
          <Button variant="outline" size="sm">
            {t.viewAll}
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6">
            {recentBookings.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                {t.noBookings}
              </p>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{booking.pro_services?.nome}</p>
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

export default ProfessionalDashboard;