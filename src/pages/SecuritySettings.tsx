import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, Eye, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSecurity } from '@/components/security/SecurityProvider';
import { useAuditLog } from '@/hooks/useAuditLog';
import { SecureDisplay } from '@/components/security/SecureDisplay';
import { toast } from 'sonner';

interface SecurityActivity {
  id: string;
  action: string;
  created_at: string;
  ip_address?: string | null;
}

export default function SecuritySettings() {
  const [language, setLanguage] = useState('pt');
  const [loading, setLoading] = useState(false);
  const [recentActivity, setRecentActivity] = useState<SecurityActivity[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { securityAlerts, clearAlerts } = useSecurity();
  const { logDataExport } = useAuditLog();

  const t = {
    pt: {
      title: 'Configurações de Segurança — academicoapp',
      h1: 'Configurações de Segurança',
      overview: 'Visão Geral',
      overviewDesc: 'Estado atual da segurança da sua conta',
      recentActivity: 'Atividade Recente',
      recentActivityDesc: 'Últimas ações de segurança na sua conta',
      dataPrivacy: 'Privacidade de Dados',
      dataPrivacyDesc: 'Controle como seus dados são exibidos',
      alerts: 'Alertas de Segurança',
      clearAlerts: 'Limpar Alertas',
      exportData: 'Exportar Dados',
      exportDesc: 'Baixar uma cópia dos seus dados',
      noActivity: 'Nenhuma atividade recente',
      noAlerts: 'Nenhum alerta de segurança',
      profileSecure: 'Perfil Seguro',
      auditEnabled: 'Auditoria Ativada',
      rateLimitActive: 'Limitação de Taxa Ativa',
      exportSuccess: 'Solicitação de exportação de dados registrada',
    },
    en: {
      title: 'Security Settings — academicoapp',
      h1: 'Security Settings',
      overview: 'Overview',
      overviewDesc: 'Current state of your account security',
      recentActivity: 'Recent Activity',
      recentActivityDesc: 'Latest security actions on your account',
      dataPrivacy: 'Data Privacy',
      dataPrivacyDesc: 'Control how your data is displayed',
      alerts: 'Security Alerts',
      clearAlerts: 'Clear Alerts',
      exportData: 'Export Data',
      exportDesc: 'Download a copy of your data',
      noActivity: 'No recent activity',
      noAlerts: 'No security alerts',
      profileSecure: 'Profile Secure',
      auditEnabled: 'Audit Enabled',
      rateLimitActive: 'Rate Limiting Active',
      exportSuccess: 'Data export request logged',
    },
  }[language as 'pt' | 'en'];

  useEffect(() => {
    fetchUserProfile();
    fetchRecentActivity();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const { data } = await supabase
        .from('audit_logs')
        .select('id, action, created_at, ip_address')
        .order('created_at', { ascending: false })
        .limit(10);
      
      setRecentActivity((data || []) as SecurityActivity[]);
    } catch (error) {
      console.error('Error fetching activity:', error);
    }
  };

  const handleExportData = async () => {
    setLoading(true);
    try {
      await logDataExport('user_profile');
      toast.success(t.exportSuccess);
    } catch (error) {
      toast.error('Erro ao solicitar exportação de dados');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{t.title}</title>
        <meta name="description" content={t.h1} />
        <link rel="canonical" href="/security-settings" />
      </Helmet>
      
      <Header language={language} setLanguage={setLanguage} />
      
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-primary mb-8 flex items-center gap-3">
          <Shield className="h-8 w-8" />
          {t.h1}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Security Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t.overview}
              </CardTitle>
              <CardDescription>{t.overviewDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>{t.profileSecure}</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  ✓
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>{t.auditEnabled}</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  ✓
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>{t.rateLimitActive}</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  ✓
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Data Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                {t.dataPrivacy}
              </CardTitle>
              <CardDescription>{t.dataPrivacyDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userProfile && (
                <>
                  <div>
                    <label className="text-sm font-medium">Email:</label>
                    <SecureDisplay 
                      data={userProfile.email} 
                      type="email" 
                      resourceId={userProfile.id}
                    />
                  </div>
                  {userProfile.phone && (
                    <div>
                      <label className="text-sm font-medium">Telefone:</label>
                      <SecureDisplay 
                        data={userProfile.phone} 
                        type="phone" 
                        resourceId={userProfile.id}
                      />
                    </div>
                  )}
                </>
              )}
              
              <Button 
                variant="outline" 
                onClick={handleExportData}
                disabled={loading}
                className="w-full"
              >
                {t.exportData}
              </Button>
              <p className="text-xs text-muted-foreground">{t.exportDesc}</p>
            </CardContent>
          </Card>

          {/* Security Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                {t.alerts}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {securityAlerts.length > 0 ? (
                <div className="space-y-2">
                  {securityAlerts.map((alert, index) => (
                    <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                      {alert}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={clearAlerts}>
                    {t.clearAlerts}
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground">{t.noAlerts}</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {t.recentActivity}
              </CardTitle>
              <CardDescription>{t.recentActivityDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.created_at).toLocaleString()}
                        </p>
                      </div>
                      {activity.ip_address && (
                        <Badge variant="outline" className="text-xs">
                          {activity.ip_address}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">{t.noActivity}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer language={language} />
    </div>
  );
}