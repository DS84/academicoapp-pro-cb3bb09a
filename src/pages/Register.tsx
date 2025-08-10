import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const Register = () => {
  const [language, setLanguage] = useState('pt');

  const t = {
    pt: {
      title: 'Cadastro — academicoapp',
      h1: 'Criar conta',
      name: 'Nome',
      email: 'Email',
      password: 'Palavra-passe',
      submit: 'Cadastrar',
      alt: 'Já tens conta? Entrar',
    },
    en: {
      title: 'Register — academicoapp',
      h1: 'Create account',
      name: 'Name',
      email: 'Email',
      password: 'Password',
      submit: 'Register',
      alt: 'Already have an account? Sign in',
    },
  }[language as 'pt' | 'en'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
              <Input id="name" required placeholder="O teu nome" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input id="email" type="email" required placeholder="nome@exemplo.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t.password}</Label>
              <Input id="password" type="password" required placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">{t.submit}</Button>
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
