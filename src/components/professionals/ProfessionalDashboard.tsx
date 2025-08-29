import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  BookOpen, Users, Calendar, Briefcase, FileText, Award, 
  Clock, DollarSign, Star, ExternalLink, Download, Eye 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardData {
  courses: any[];
  mentors: any[];
  events: any[];
  opportunities: any[];
  cvReviews: any[];
  bookings: any[];
  assessments: any[];
}

interface ProfessionalDashboardProps {
  language: 'pt' | 'en';
}

const ProfessionalDashboard = ({ language }: ProfessionalDashboardProps) => {
  const [data, setData] = useState<DashboardData>({
    courses: [],
    mentors: [],
    events: [],
    opportunities: [],
    cvReviews: [],
    bookings: [],
    assessments: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const t = {
    pt: {
      title: 'Dashboard Profissional',
      subtitle: 'Gerencie seu desenvolvimento de carreira',
      courses: 'Cursos',
      mentors: 'Mentores',
      events: 'Eventos de Networking',
      opportunities: 'Oportunidades',
      cv: 'CV/Portfólio',
      certificates: 'Certificados',
      bookings: 'Meus Pedidos',
      skills: 'Competências',
      noCourses: 'Nenhum curso encontrado',
      noMentors: 'Nenhum mentor disponível',
      noEvents: 'Nenhum evento próximo',
      noOpportunities: 'Nenhuma oportunidade disponível',
      viewDetails: 'Ver detalhes',
      register: 'Inscrever-se',
      contact: 'Contactar',
      apply: 'Candidatar-se',
      hours: 'horas',
      experience: 'anos de experiência',
      rating: 'avaliação',
      salary: 'Salário',
      location: 'Local',
      company: 'Empresa',
      seniority: 'Senioridade',
      status: 'Status',
      pending: 'Pendente',
      completed: 'Concluído',
      cancelled: 'Cancelado'
    },
    en: {
      title: 'Professional Dashboard',
      subtitle: 'Manage your career development',
      courses: 'Courses',
      mentors: 'Mentors',
      events: 'Networking Events',
      opportunities: 'Opportunities',
      cv: 'CV/Portfolio',
      certificates: 'Certificates',
      bookings: 'My Orders',
      skills: 'Skills',
      noCourses: 'No courses found',
      noMentors: 'No mentors available',
      noEvents: 'No upcoming events',
      noOpportunities: 'No opportunities available',
      viewDetails: 'View details',
      register: 'Register',
      contact: 'Contact',
      apply: 'Apply',
      hours: 'hours',
      experience: 'years of experience',
      rating: 'rating',
      salary: 'Salary',
      location: 'Location',
      company: 'Company',
      seniority: 'Seniority',
      status: 'Status',
      pending: 'Pending',
      completed: 'Completed',
      cancelled: 'Cancelled'
    }
  }[language as 'pt' | 'en'];

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (!profile) return;

        // Fetch all data in parallel
        const [
          coursesRes,
          mentorsRes,
          eventsRes,
          cvReviewsRes,
          bookingsRes,
          assessmentsRes
        ] = await Promise.all([
          supabase.from('pro_courses').select('*').order('created_at', { ascending: false }),
          supabase.from('service_mentors').select('*, profiles(full_name, avatar_url)').eq('is_active', true).order('rating', { ascending: false }),
          supabase.from('pro_events').select('*').gte('data', new Date().toISOString()).order('data'),
          supabase.from('cv_reviews').select('*').eq('user_id', profile.id).order('created_at', { ascending: false }),
          supabase.from('pro_bookings').select('*, pro_services(nome)').eq('user_id', profile.id).order('created_at', { ascending: false }),
          supabase.from('pro_assessments').select('*, skills(name, difficulty_level)').eq('user_id', profile.id).order('created_at', { ascending: false })
        ]);

        setData({
          courses: coursesRes.data || [],
          mentors: mentorsRes.data || [],
          events: eventsRes.data || [],
          opportunities: [],
          cvReviews: cvReviewsRes.data || [],
          bookings: bookingsRes.data || [],
          assessments: assessmentsRes.data || []
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Erro ao carregar dados',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, toast]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="courses" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">{t.courses}</span>
          </TabsTrigger>
          <TabsTrigger value="mentors" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">{t.mentors}</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">{t.events}</span>
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">{t.opportunities}</span>
          </TabsTrigger>
          <TabsTrigger value="cv" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">{t.cv}</span>
          </TabsTrigger>
          <TabsTrigger value="certificates" className="flex items-center gap-1">
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">{t.certificates}</span>
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">{t.bookings}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.courses.length === 0 ? (
              <p className="col-span-full text-center text-muted-foreground">{t.noCourses}</p>
            ) : (
              data.courses.map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{course.titulo}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{course.trilha}</Badge>
                      <Badge variant="outline">{course.modalidade}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{t.hours}</span>
                        <span className="text-sm font-medium">{course.carga_horaria}h</span>
                      </div>
                      {course.preco && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Preço</span>
                          <span className="text-sm font-medium">
                            {new Intl.NumberFormat('pt-AO', {
                              style: 'currency',
                              currency: 'AOA'
                            }).format(Number(course.preco))}
                          </span>
                        </div>
                      )}
                      <Button className="w-full" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        {t.viewDetails}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="mentors" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.mentors.length === 0 ? (
              <p className="col-span-full text-center text-muted-foreground">{t.noMentors}</p>
            ) : (
              data.mentors.map((mentor) => (
                <Card key={mentor.id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                       <Avatar>
                         <AvatarImage src={mentor.profiles?.avatar_url} />
                         <AvatarFallback>{(mentor.nome || mentor.profiles?.full_name || 'M').charAt(0)}</AvatarFallback>
                       </Avatar>
                      <div>
                        <CardTitle className="text-lg">{mentor.nome || mentor.profiles?.full_name}</CardTitle>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{mentor.rating}/5</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {mentor.areas.map((area: string) => (
                          <Badge key={area} variant="outline" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Mentor especializado
                      </div>
                      <div className="text-sm font-medium">
                        Disponível para mentoria
                      </div>
                      <Button className="w-full" size="sm">
                        <Users className="mr-2 h-4 w-4" />
                        {t.contact}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.events.length === 0 ? (
              <p className="col-span-full text-center text-muted-foreground">{t.noEvents}</p>
            ) : (
              data.events.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{event.nome}</CardTitle>
                    <Badge variant="secondary">{event.tipo}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(event.data).toLocaleDateString('pt-AO')}
                        </span>
                      </div>
                      {event.local_plataforma && (
                        <div className="text-sm text-muted-foreground">
                          {event.local_plataforma}
                        </div>
                      )}
                      {event.vagas && (
                        <div className="text-sm">
                          Vagas: {event.vagas_ocupadas || 0}/{event.vagas}
                        </div>
                      )}
                      <Button className="w-full" size="sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        {t.register}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="opportunities" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.opportunities.length === 0 ? (
              <p className="col-span-full text-center text-muted-foreground">{t.noOpportunities}</p>
            ) : (
              data.opportunities.map((opportunity) => (
                <Card key={opportunity.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{opportunity.titulo}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge>{opportunity.empresa}</Badge>
                      <Badge variant="outline">{opportunity.senioridade}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {opportunity.local && (
                        <div className="text-sm text-muted-foreground">
                          📍 {opportunity.local}
                        </div>
                      )}
                      {(opportunity.salario_min || opportunity.salario_max) && (
                        <div className="text-sm font-medium">
                          {t.salary}: {opportunity.salario_min && 
                            new Intl.NumberFormat('pt-AO', {
                              style: 'currency',
                              currency: 'AOA'
                            }).format(Number(opportunity.salario_min))
                          }
                          {opportunity.salario_min && opportunity.salario_max && ' - '}
                          {opportunity.salario_max && 
                            new Intl.NumberFormat('pt-AO', {
                              style: 'currency',
                              currency: 'AOA'
                            }).format(Number(opportunity.salario_max))
                          }
                        </div>
                      )}
                      {opportunity.requisitos.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {opportunity.requisitos.slice(0, 3).map((req: string) => (
                            <Badge key={req} variant="outline" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <Button className="w-full" size="sm">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {t.apply}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="cv" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.cvReviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <CardTitle className="text-lg">Revisão de CV</CardTitle>
                  <Badge variant={
                    review.status === 'completed' ? 'default' : 
                    review.status === 'pending' ? 'secondary' : 'destructive'
                  }>
                    {review.status === 'completed' ? t.completed :
                     review.status === 'pending' ? t.pending : t.cancelled}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {review.score_ats && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Score ATS</span>
                          <span>{review.score_ats}/100</span>
                        </div>
                        <Progress value={review.score_ats} className="h-2" />
                      </div>
                    )}
                    {review.arquivo_url && (
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download CV
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="certificates" className="mt-6">
          <div className="text-center py-8">
            <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Certificados serão exibidos aqui</p>
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {booking.pro_services?.nome || 'Serviço'}
                  </CardTitle>
                  <Badge variant={
                    booking.status === 'completed' ? 'default' : 
                    booking.status === 'pending' ? 'secondary' : 'destructive'
                  }>
                    {booking.status === 'completed' ? t.completed :
                     booking.status === 'pending' ? t.pending : t.cancelled}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Valor</span>
                      <span className="text-sm font-medium">
                        {new Intl.NumberFormat('pt-AO', {
                          style: 'currency',
                          currency: 'AOA'
                        }).format(Number(booking.valor))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Data</span>
                      <span className="text-sm">
                        {new Date(booking.agenda).toLocaleDateString('pt-AO')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfessionalDashboard;