import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Register = () => {
  const [language, setLanguage] = useState('pt');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'student' | 'teacher' | 'professional'>('student');
  const navigate = useNavigate();

  const t = {
    pt: {
      title: 'Cadastro — academicoapp',
      h1: 'Criar conta',
      name: 'Nome completo',
      email: 'Email',
      password: 'Palavra-passe',
      phone: 'Telefone',
      accountType: 'Tipo de conta',
      student: 'Estudante',
      teacher: 'Professor/Orientador',
      professional: 'Profissional',
      professionalArea: 'Área Profissional',
      institution: 'Instituição',
      submit: 'Cadastrar',
      alt: 'Já tens conta? Entrar',
      or: 'ou',
    },
    en: {
      title: 'Register — academicoapp',
      h1: 'Create account',
      name: 'Full name',
      email: 'Email',
      password: 'Password',
      phone: 'Phone',
      accountType: 'Account type',
      student: 'Student',
      teacher: 'Teacher/Mentor',
      professional: 'Professional',
      professionalArea: 'Professional Area',
      institution: 'Institution',
      submit: 'Register',
      alt: 'Already have an account? Sign in',
      or: 'or',
    },
  }[language as 'pt' | 'en'];

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const r = (session.user.user_metadata as any)?.role as string | undefined;
        if (r === 'student') navigate('/students');
        else if (r === 'teacher') navigate('/teachers');
        else navigate('/');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const r = (session.user.user_metadata as any)?.role as string | undefined;
        if (r === 'student') navigate('/students');
        else if (r === 'teacher') navigate('/teachers');
        else navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
    const professionalArea = (form.elements.namedItem('professionalArea') as HTMLInputElement)?.value || '';
    const institution = (form.elements.namedItem('institution') as HTMLInputElement)?.value || '';

    if (password.length < 6) {
      toast.error('A palavra-passe deve ter no mínimo 6 caracteres.');
      return;
    }

    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { role, full_name: name, phone, professional_area: professionalArea, institution }
        }
      });
      if (error) throw error;
      toast.success('Cadastro realizado! Verifica o teu email para confirmar.');
    } catch (err: any) {
      toast.error(err?.message ?? 'Não foi possível concluir o cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{t.title}</title>
        <meta name="description" content={t.h1} />
        <link rel="canonical" href="/register" />
      </Helmet>
      <Header language={language} setLanguage={setLanguage} />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-card border border-border rounded-lg p-6 shadow-card">
          <h1 className="text-3xl font-bold text-primary mb-6">{t.h1}</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t.name}</Label>
              <Input id="name" name="name" required placeholder="O teu nome" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input id="email" name="email" type="email" required placeholder="nome@exemplo.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t.password}</Label>
              <Input id="password" name="password" type="password" required placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t.phone}</Label>
              <Input id="phone" name="phone" type="tel" required placeholder="+244 ..." />
            </div>
            <div className="space-y-2">
              <Label>{t.accountType}</Label>
              <RadioGroup value={role} onValueChange={(v) => setRole(v as 'student' | 'teacher' | 'professional')} className="grid grid-cols-3 gap-3">
                <div className="flex items-center space-x-2 border border-border rounded-md p-3">
                  <RadioGroupItem id="student" value="student" />
                  <Label htmlFor="student" className="cursor-pointer">{t.student}</Label>
                </div>
                <div className="flex items-center space-x-2 border border-border rounded-md p-3">
                  <RadioGroupItem id="teacher" value="teacher" />
                  <Label htmlFor="teacher" className="cursor-pointer">{t.teacher}</Label>
                </div>
                <div className="flex items-center space-x-2 border border-border rounded-md p-3">
                  <RadioGroupItem id="professional" value="professional" />
                  <Label htmlFor="professional" className="cursor-pointer">{t.professional}</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="professionalArea">{t.professionalArea}</Label>
              <Input id="professionalArea" name="professionalArea" placeholder="Ex: Tecnologia, Medicina, Engenharia..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="institution">{t.institution}</Label>
              <Input id="institution" name="institution" placeholder="Ex: Universidade Agostinho Neto, ISPTEC..." />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              {loading ? '...' : t.submit}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground mt-4">
            <Link to="/login" className="text-primary hover:underline">{t.alt}</Link>
          </p>
        </div>
      </main>
      <Footer language={language} />
    </div>
  );
};

export default Register;
