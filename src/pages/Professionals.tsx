import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import ProfessionalTriaging from '@/components/professionals/ProfessionalTriaging';
import ProfessionalServicesCatalog from '@/components/professionals/ProfessionalServicesCatalog';
import ProfessionalCheckoutFlow from '@/components/professionals/ProfessionalCheckoutFlow';
import ProfessionalDashboard from '@/components/professionals/ProfessionalDashboard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Users, Trophy } from 'lucide-react';

interface ProService {
  id: string;
  slug: string;
  nome: string;
  descricao: string | null;
  preco_base: number;
  sla_horas: number;
  formatos: string[];
  tags: string[];
}

type Step = 'landing' | 'triaging' | 'catalog' | 'checkout' | 'success' | 'dashboard';

const Professionals = () => {
  const [language, setLanguage] = useState('pt');
  const [currentStep, setCurrentStep] = useState<Step>('landing');
  const [selectedService, setSelectedService] = useState<ProService | null>(null);

  const t = {
    pt: {
      title: 'Profissionais — academicoapp',
      hero: 'Evolua a sua carreira com formação prática, mentoria e networking.',
      ctaPrimary: 'Começar agora (60s)',
      socialProof: '+900 profissionais apoiados • 4,8/5 satisfação • Certificados',
      dashboard: 'Ver Dashboard',
      back: 'Voltar',
      success: 'Pedido confirmado com sucesso!',
      successDesc: 'Entraremos em contacto consigo em breve para dar seguimento ao seu pedido.',
      newOrder: 'Fazer novo pedido'
    },
    en: {
      title: 'Professionals — academicoapp',
      hero: 'Evolve your career with practical training, mentoring and networking.',
      ctaPrimary: 'Start now (60s)',
      socialProof: '+900 professionals supported • 4.8/5 satisfaction • Certificates',
      dashboard: 'View Dashboard',
      back: 'Back',
      success: 'Order confirmed successfully!',
      successDesc: 'We will contact you shortly to follow up on your order.',
      newOrder: 'Make new order'
    },
  }[language as 'pt' | 'en'];

  const handleTriagingComplete = () => {
    setCurrentStep('catalog');
  };

  const handleServiceSelect = (service: ProService) => {
    setSelectedService(service);
    setCurrentStep('checkout');
  };

  const handleCheckoutSuccess = () => {
    setCurrentStep('success');
  };

  const handleBackToLanding = () => {
    setCurrentStep('landing');
    setSelectedService(null);
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'triaging':
        return (
          <ProfessionalTriaging 
            onComplete={handleTriagingComplete}
            language={language}
          />
        );
      
      case 'catalog':
        return (
          <ProfessionalServicesCatalog 
            onServiceSelect={handleServiceSelect}
            language={language}
          />
        );
      
      case 'checkout':
        return selectedService ? (
          <ProfessionalCheckoutFlow
            service={selectedService}
            onSuccess={handleCheckoutSuccess}
            onBack={() => setCurrentStep('catalog')}
            language={language}
          />
        ) : null;
      
      case 'success':
        return (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-green-600 mb-2">{t.success}</h2>
              <p className="text-muted-foreground">{t.successDesc}</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setCurrentStep('catalog')}>
                {t.newOrder}
              </Button>
              <Button variant="outline" onClick={() => setCurrentStep('dashboard')}>
                {t.dashboard}
              </Button>
            </div>
          </div>
        );
      
      case 'dashboard':
        return <ProfessionalDashboard language={language as 'pt' | 'en'} />;
      
      default:
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-primary leading-tight">
                {t.hero}
              </h1>
              
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>+900 profissionais</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>4,8/5 satisfação</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  <span>Certificados</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => setCurrentStep('triaging')}
                className="text-lg px-8 py-6"
              >
                {t.ctaPrimary}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setCurrentStep('dashboard')}
                className="text-lg px-8 py-6"
              >
                {t.dashboard}
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{t.title}</title>
        <meta name="description" content={t.hero} />
        <link rel="canonical" href="/professionals" />
      </Helmet>
      
      <Header 
        language={language} 
        setLanguage={setLanguage}
        isAuthenticated={false}
        onLogout={() => {}}
      />
      
      <main className="container mx-auto px-4 py-16">
        {currentStep !== 'landing' && currentStep !== 'dashboard' && (
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={currentStep === 'triaging' ? handleBackToLanding : () => {
                if (currentStep === 'catalog') setCurrentStep('triaging');
                if (currentStep === 'checkout') setCurrentStep('catalog');
                if (currentStep === 'success') setCurrentStep('landing');
              }}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.back}
            </Button>
          </div>
        )}
        
        {renderContent()}
      </main>
      
      <Footer language={language as 'pt' | 'en'} />
    </div>
  );
};

export default Professionals;
