import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const Login = () => {
  const [language, setLanguage] = useState('pt');

  const t = {
    pt: {
      title: 'Login — academicoapp',
      h1: 'Entrar na conta',
      email: 'Email',
      password: 'Palavra-passe',
      submit: 'Entrar',
      alt: 'Não tens conta? Cadastrar',
    },
    en: {
      title: 'Login — academicoapp',
      h1: 'Sign in',
      email: 'Email',
      password: 'Password',
      submit: 'Sign in',
      alt: "Don't have an account? Register",
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
        <link rel="canonical" href="/login" />
      </Helmet>
      <Header language={language} setLanguage={setLanguage} />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-card border border-border rounded-lg p-6 shadow-card">
          <h1 className="text-3xl font-bold text-primary mb-6">{t.h1}</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <Link to="/register" className="text-primary hover:underline">{t.alt}</Link>
          </p>
        </div>
      </main>
      <Footer language={language} />
    </div>
  );
};

export default Login;
