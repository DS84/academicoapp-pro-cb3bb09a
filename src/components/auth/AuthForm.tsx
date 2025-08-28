import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { AuthFormData } from '@/types/auth';
import { toast } from 'sonner';

interface AuthFormProps {
  mode: 'login' | 'register';
  language: 'pt' | 'en';
}

const AuthForm = ({ mode, language }: AuthFormProps) => {
  const navigate = useNavigate();
  const { signIn, signUp, loading } = useAuth();
  
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    user_type: 'student',
    phone: '',
    institution: '',
    field_of_study: '',
    year_of_study: undefined,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const translations = {
    pt: {
      login: 'Entrar',
      register: 'Criar Conta',
      email: 'Email',
      password: 'Palavra-passe',
      confirmPassword: 'Confirmar Palavra-passe',
      fullName: 'Nome Completo',
      userType: 'Tipo de Utilizador',
      phone: 'Telefone',
      institution: 'Instituição',
      fieldOfStudy: 'Área de Estudo',
      yearOfStudy: 'Ano de Estudo',
      student: 'Estudante',
      teacher: 'Professor',
      professional: 'Profissional',
      loginTitle: 'Bem-vindo de volta',
      loginDescription: 'Entre na sua conta para continuar',
      registerTitle: 'Criar nova conta',
      registerDescription: 'Preencha os dados para criar sua conta',
      hasAccount: 'Já tem conta?',
      noAccount: 'Não tem conta?',
      loginLink: 'Fazer login',
      registerLink: 'Criar conta',
      optional: '(opcional)',
      passwordMatch: 'As palavras-passe não coincidem',
      fillRequired: 'Preencha todos os campos obrigatórios',
    },
    en: {
      login: 'Sign In',
      register: 'Create Account',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      fullName: 'Full Name',
      userType: 'User Type',
      phone: 'Phone',
      institution: 'Institution',
      fieldOfStudy: 'Field of Study',
      yearOfStudy: 'Year of Study',
      student: 'Student',
      teacher: 'Teacher',
      professional: 'Professional',
      loginTitle: 'Welcome back',
      loginDescription: 'Sign in to your account to continue',
      registerTitle: 'Create new account',
      registerDescription: 'Fill in the details to create your account',
      hasAccount: 'Already have an account?',
      noAccount: "Don't have an account?",
      loginLink: 'Sign in',
      registerLink: 'Create account',
      optional: '(optional)',
      passwordMatch: 'Passwords do not match',
      fillRequired: 'Please fill in all required fields',
    },
  };

  const t = translations[language];

  const handleInputChange = (field: keyof AuthFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast.error(t.fillRequired);
      return false;
    }

    if (mode === 'register') {
      if (!formData.full_name || !formData.confirmPassword) {
        toast.error(t.fillRequired);
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error(t.passwordMatch);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(formData.email, formData.password);
        if (!error) {
          navigate('/dashboard');
        }
      } else {
        const { error } = await signUp(formData.email, formData.password, {
          full_name: formData.full_name,
          user_type: formData.user_type,
          phone: formData.phone,
          institution: formData.institution,
          field_of_study: formData.field_of_study,
          year_of_study: formData.year_of_study,
        });
        
        if (!error) {
          // User will be redirected after email confirmation
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {mode === 'login' ? t.loginTitle : t.registerTitle}
          </CardTitle>
          <CardDescription>
            {mode === 'login' ? t.loginDescription : t.registerDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>

            {mode === 'register' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="full_name">{t.fullName}</Label>
                  <Input
                    id="full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder="João Silva"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user_type">{t.userType}</Label>
                  <Select 
                    value={formData.user_type} 
                    onValueChange={(value) => handleInputChange('user_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">{t.student}</SelectItem>
                      <SelectItem value="teacher">{t.teacher}</SelectItem>
                      <SelectItem value="professional">{t.professional}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t.phone} {t.optional}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+244 900 000 000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institution">{t.institution} {t.optional}</Label>
                  <Input
                    id="institution"
                    type="text"
                    value={formData.institution}
                    onChange={(e) => handleInputChange('institution', e.target.value)}
                    placeholder="Universidade de Luanda"
                  />
                </div>

                {formData.user_type === 'student' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="field_of_study">{t.fieldOfStudy} {t.optional}</Label>
                      <Input
                        id="field_of_study"
                        type="text"
                        value={formData.field_of_study}
                        onChange={(e) => handleInputChange('field_of_study', e.target.value)}
                        placeholder="Engenharia Informática"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year_of_study">{t.yearOfStudy} {t.optional}</Label>
                      <Input
                        id="year_of_study"
                        type="number"
                        min="1"
                        max="10"
                        value={formData.year_of_study || ''}
                        onChange={(e) => handleInputChange('year_of_study', parseInt(e.target.value) || undefined)}
                        placeholder="3"
                      />
                    </div>
                  </>
                )}
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">{t.password}</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || loading}
            >
              {isSubmitting ? '...' : (mode === 'login' ? t.login : t.register)}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            {mode === 'login' ? (
              <>
                {t.noAccount}{' '}
                <Link to="/register" className="text-primary hover:underline">
                  {t.registerLink}
                </Link>
              </>
            ) : (
              <>
                {t.hasAccount}{' '}
                <Link to="/login" className="text-primary hover:underline">
                  {t.loginLink}
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;