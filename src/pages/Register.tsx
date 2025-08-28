import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';

const Register = () => {
  const [language, setLanguage] = useState<'pt' | 'en'>('pt');
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Don't render the form if user is already authenticated
  if (user) {
    return null;
  }

  return <AuthForm mode="register" language={language} />;
};

export default Register;
