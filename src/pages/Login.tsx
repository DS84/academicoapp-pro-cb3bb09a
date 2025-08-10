import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Login = () => {
  const [language, setLanguage] = useState('pt');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const t = {
    pt: {
      title: 'Login — academicoapp',
      h1: 'Entrar na conta',
      email: 'Email',
      password: 'Palavra-passe',
      submit: 'Entrar',
      alt: 'Não tens conta? Cadastrar',
      or: 'ou',
      google: 'Entrar com Google',
      microsoft: 'Entrar com Microsoft',
    },
    en: {
      title: 'Login — academicoapp',
      h1: 'Sign in',
      email: 'Email',
      password: 'Password',
      submit: 'Sign in',
      alt: "Don't have an account? Register",
      or: 'or',
      google: 'Sign in with Google',
      microsoft: 'Sign in with Microsoft',
    },
  }[language as 'pt' | 'en'];

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const role = (session.user.user_metadata as any)?.role as string | undefined;
        if (role === 'student') navigate('/students');
        else if (role === 'teacher') navigate('/teachers');
        else navigate('/');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const role = (session.user.user_metadata as any)?.role as string | undefined;
        if (role === 'student') navigate('/students');
        else if (role === 'teacher') navigate('/teachers');
        else navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Login bem-sucedido!');
      // onAuthStateChange will redirect
    } catch (err: any) {
      toast.error(err?.message ?? 'Email ou palavra-passe incorretos.');
    } finally {
      setLoading(false);
    }
  };

  const oauthSignIn = async (provider: 'google' | 'azure') => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/` }
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err?.message ?? 'Não foi possível iniciar sessão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{t.title}</title>
        <meta name="description" content={t.h1} />
        <link rel="canonical" href="/login" />
      </Helmet>
      <Header language={language} setLanguage={setLanguage} />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-card border border-border rounded-lg p-6 shadow-card">
          <h1 className="text-3xl font-bold text-primary mb-6">{t.h1}</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input id="email" name="email" type="email" required placeholder="nome@exemplo.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t.password}</Label>
              <Input id="password" name="password" type="password" required placeholder="••••••••" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              {loading ? '...' : t.submit}
            </Button>
          </form>

          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="px-3 text-xs text-muted-foreground uppercase">{t.or}</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid gap-3">
            <Button variant="outline" disabled={loading} onClick={() => oauthSignIn('google')}> {t.google} </Button>
            <Button variant="outline" disabled={loading} onClick={() => oauthSignIn('azure')}> {t.microsoft} </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            <Link to="/register" className="text-primary hover:underline">{t.alt}</Link>
          </p>
        </div>
      </main>
      <Footer language={language} />
    </div>
  );
};

export default Login;
