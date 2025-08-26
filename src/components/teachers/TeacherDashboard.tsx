import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Users, 
  HelpCircle, 
  Globe, 
  Award, 
  Calendar,
  Download,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TeacherDashboardProps {
  language: string;
  profile: any;
}

const TeacherDashboard = ({ language, profile }: TeacherDashboardProps) => {
  const [activeTab, setActiveTab] = useState('courses');
  const [dashboardData, setDashboardData] = useState({
    courses: [],
    library: [],
    communities: [],
    tickets: [],
    exchanges: [],
    certificates: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const t = {
    pt: {
      title: 'Dashboard do Professor',
      courses: 'Cursos (CPD)',
      library: 'Biblioteca',
      communities: 'Comunidades',
      tickets: 'Tickets de Suporte',
      exchanges: 'Intercâmbios',
      certificates: 'Certificados',
      noCourses: 'Nenhum curso em progresso',
      noLibrary: 'Biblioteca vazia',
      noCommunities: 'Não participa em comunidades',
      noTickets: 'Nenhum ticket aberto',
      noExchanges: 'Nenhum convite de intercâmbio',
      noCertificates: 'Nenhum certificado disponível',
      viewCourse: 'Ver Curso',
      downloadResource: 'Descarregar',
      joinCommunity: 'Participar',
      viewTicket: 'Ver Ticket',
      viewExchange: 'Ver Convite',
      downloadCert: 'Descarregar Certificado',
      progress: 'Progresso',
      status: 'Estado',
      type: 'Tipo',
      created: 'Criado',
      members: 'Membros'
    },
    en: {
      title: 'Teacher Dashboard',
      courses: 'Courses (CPD)',
      library: 'Library',
      communities: 'Communities',
      tickets: 'Support Tickets',
      exchanges: 'Exchanges',
      certificates: 'Certificates',
      noCourses: 'No courses in progress',
      noLibrary: 'Empty library',
      noCommunities: 'Not participating in communities',
      noTickets: 'No open tickets',
      noExchanges: 'No exchange invitations',
      noCertificates: 'No certificates available',
      viewCourse: 'View Course',
      downloadResource: 'Download',
      joinCommunity: 'Join',
      viewTicket: 'View Ticket',
      viewExchange: 'View Invitation',
      downloadCert: 'Download Certificate',
      progress: 'Progress',
      status: 'Status',
      type: 'Type',
      created: 'Created',
      members: 'Members'
    }
  }[language as 'pt' | 'en'];

  useEffect(() => {
    fetchDashboardData();
  }, [profile?.id]);

  const fetchDashboardData = async () => {
    if (!profile?.id) return;
    
    setLoading(true);
    try {
      // Fetch courses (CPD)
      const { data: coursesData } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses (
            id,
            title,
            description,
            instructor_id,
            duration_hours
          )
        `)
        .eq('student_id', profile.id);

      // Fetch library materials
      const { data: libraryData } = await supabase
        .from('study_materials')
        .select('*')
        .or(`creator_id.eq.${profile.id},is_public.eq.true`)
        .limit(10);

      // Fetch communities
      const { data: communitiesData } = await supabase
        .from('study_group_members')
        .select(`
          *,
          study_groups (
            id,
            name,
            description,
            current_members
          )
        `)
        .eq('member_id', profile.id);

      // Fetch support tickets
      const { data: ticketsData } = await supabase
        .from('assistance_requests')
        .select('*')
        .eq('requester_id', profile.id)
        .order('created_at', { ascending: false });

      // Mock data for exchanges and certificates
      const exchangesData = [
        {
          id: '1',
          institution: 'Universidade de Luanda',
          program: 'Intercâmbio de Metodologias Ativas',
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ];

      const certificatesData = [
        {
          id: '1',
          title: 'Formação em Metodologias Ativas',
          issued_date: '2024-01-15',
          institution: 'AcademicoApp',
          certificate_url: '#'
        }
      ];

      setDashboardData({
        courses: coursesData || [],
        library: libraryData || [],
        communities: communitiesData || [],
        tickets: ticketsData || [],
        exchanges: exchangesData,
        certificates: certificatesData
      });

    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar dados do dashboard',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const tabsConfig = [
    {
      value: 'courses',
      label: t.courses,
      icon: BookOpen,
      count: dashboardData.courses.length
    },
    {
      value: 'library',
      label: t.library,
      icon: BookOpen,
      count: dashboardData.library.length
    },
    {
      value: 'communities',
      label: t.communities,
      icon: Users,
      count: dashboardData.communities.length
    },
    {
      value: 'tickets',
      label: t.tickets,
      icon: HelpCircle,
      count: dashboardData.tickets.length
    },
    {
      value: 'exchanges',
      label: t.exchanges,
      icon: Globe,
      count: dashboardData.exchanges.length
    },
    {
      value: 'certificates',
      label: t.certificates,
      icon: Award,
      count: dashboardData.certificates.length
    }
  ];

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando dashboard...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            {t.title}
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 mb-6">
          {tabsConfig.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-1">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.count > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {tab.count}
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>{t.courses}</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.courses.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">{t.noCourses}</p>
              ) : (
                <div className="grid gap-4">
                  {dashboardData.courses.map((enrollment: any) => (
                    <div key={enrollment.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{enrollment.courses?.title}</h3>
                        <Badge variant={enrollment.completion_date ? 'default' : 'secondary'}>
                          {enrollment.completion_date ? 'Concluído' : 'Em progresso'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {enrollment.courses?.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          <span>{t.progress}: {enrollment.progress_percentage || 0}%</span>
                        </div>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          {t.viewCourse}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library">
          <Card>
            <CardHeader>
              <CardTitle>{t.library}</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.library.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">{t.noLibrary}</p>
              ) : (
                <div className="grid gap-4">
                  {dashboardData.library.map((material: any) => (
                    <div key={material.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{material.titulo}</h3>
                        <Badge variant="outline">{material.tipo}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {material.disciplina}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-1">
                          {material.tags?.slice(0, 3).map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          {t.downloadResource}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communities">
          <Card>
            <CardHeader>
              <CardTitle>{t.communities}</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.communities.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">{t.noCommunities}</p>
              ) : (
                <div className="grid gap-4">
                  {dashboardData.communities.map((membership: any) => (
                    <div key={membership.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{membership.study_groups?.name}</h3>
                        <Badge variant="outline">{membership.role}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {membership.study_groups?.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          {t.members}: {membership.study_groups?.current_members}
                        </div>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {t.joinCommunity}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <CardTitle>{t.tickets}</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.tickets.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">{t.noTickets}</p>
              ) : (
                <div className="grid gap-4">
                  {dashboardData.tickets.map((ticket: any) => (
                    <div key={ticket.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{ticket.title}</h3>
                        <Badge variant={ticket.status === 'open' ? 'destructive' : 'default'}>
                          {ticket.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {t.type}: {ticket.request_type}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          {t.created}: {new Date(ticket.created_at).toLocaleDateString()}
                        </div>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          {t.viewTicket}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exchanges">
          <Card>
            <CardHeader>
              <CardTitle>{t.exchanges}</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.exchanges.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">{t.noExchanges}</p>
              ) : (
                <div className="grid gap-4">
                  {dashboardData.exchanges.map((exchange: any) => (
                    <div key={exchange.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{exchange.program}</h3>
                        <Badge variant={exchange.status === 'pending' ? 'secondary' : 'default'}>
                          {exchange.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {exchange.institution}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          {t.created}: {new Date(exchange.created_at).toLocaleDateString()}
                        </div>
                        <Button size="sm" variant="outline">
                          <Globe className="h-4 w-4 mr-1" />
                          {t.viewExchange}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates">
          <Card>
            <CardHeader>
              <CardTitle>{t.certificates}</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.certificates.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">{t.noCertificates}</p>
              ) : (
                <div className="grid gap-4">
                  {dashboardData.certificates.map((cert: any) => (
                    <div key={cert.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{cert.title}</h3>
                        <Badge variant="default">Certificado</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {cert.institution}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          Emitido: {new Date(cert.issued_date).toLocaleDateString()}
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          {t.downloadCert}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherDashboard;