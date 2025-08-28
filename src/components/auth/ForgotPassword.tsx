import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Mail } from 'lucide-react';

interface ForgotPasswordProps {
  language?: 'pt' | 'en';
}

const ForgotPassword = ({ language = 'pt' }: ForgotPasswordProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const translations = {
    pt: {
      title: 'Recuperar Palavra-passe',
      description: 'Introduza o seu email para receber um link de recuperação',
      emailLabel: 'Email',
      emailPlaceholder: 'seu@email.com',
      sendButton: 'Enviar Link de Recuperação',
      backToLogin: 'Voltar ao Login',
      emailSentTitle: 'Email Enviado!',
      emailSentDescription: 'Verifique a sua caixa de entrada e siga as instruções para redefinir a sua palavra-passe.',
      emailSentInfo: 'Se não receber o email em alguns minutos, verifique a pasta de spam.',
      resendButton: 'Reenviar Email',
      sendingButton: 'A enviar...',
    },
    en: {
      title: 'Reset Password',
      description: 'Enter your email to receive a recovery link',
      emailLabel: 'Email',
      emailPlaceholder: 'your@email.com',
      sendButton: 'Send Recovery Link',
      backToLogin: 'Back to Login',
      emailSentTitle: 'Email Sent!',
      emailSentDescription: 'Check your inbox and follow the instructions to reset your password.',
      emailSentInfo: 'If you don\'t receive the email in a few minutes, check your spam folder.',
      resendButton: 'Resend Email',
      sendingButton: 'Sending...',
    }
  };

  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Por favor, introduza o seu email');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      setEmailSent(true);
      toast.success('Email de recuperação enviado!');

    } catch (error) {
      console.error('Error sending reset email:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao enviar email');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setEmailSent(false);
    handleSubmit(new Event('submit') as any);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">
              {t.emailSentTitle}
            </CardTitle>
            <CardDescription className="text-center">
              {t.emailSentDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              {t.emailSentInfo}
            </p>
            
            <div className="space-y-2">
              <Button
                onClick={handleResend}
                variant="outline"
                className="w-full"
                disabled={loading}
              >
                {loading ? t.sendingButton : t.resendButton}
              </Button>
              
              <Button asChild variant="ghost" className="w-full">
                <Link to="/login" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  {t.backToLogin}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t.emailLabel}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? t.sendingButton : t.sendButton}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button asChild variant="ghost">
              <Link to="/login" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                {t.backToLogin}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;