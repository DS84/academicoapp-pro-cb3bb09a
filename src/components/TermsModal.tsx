import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface TermsModalProps {
  trigger: React.ReactNode;
  type: 'privacy' | 'terms' | 'cookies';
  language: string;
}

const TermsModal = ({ trigger, type, language }: TermsModalProps) => {
  const [accepted, setAccepted] = useState(false);

  const content = {
    pt: {
      privacy: {
        title: 'Política de Privacidade',
        content: `
          <h3>1. Informações que Coletamos</h3>
          <p>Coletamos informações que você nos fornece diretamente, incluindo nome, email, telefone e informações acadêmicas.</p>
          
          <h3>2. Como Usamos suas Informações</h3>
          <p>Utilizamos suas informações para fornecer nossos serviços, melhorar a plataforma e comunicar com você.</p>
          
          <h3>3. Compartilhamento de Informações</h3>
          <p>Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros sem seu consentimento.</p>
          
          <h3>4. Segurança</h3>
          <p>Implementamos medidas de segurança adequadas para proteger suas informações pessoais.</p>
        `
      },
      terms: {
        title: 'Termos de Uso',
        content: `
          <h3>1. Aceitação dos Termos</h3>
          <p>Ao usar nossos serviços, você concorda com estes termos de uso.</p>
          
          <h3>2. Uso da Plataforma</h3>
          <p>Você pode usar nossa plataforma para fins educacionais e profissionais legítimos.</p>
          
          <h3>3. Responsabilidades do Usuário</h3>
          <p>Você é responsável por manter a confidencialidade de sua conta e todas as atividades.</p>
          
          <h3>4. Propriedade Intelectual</h3>
          <p>Todo o conteúdo da plataforma é protegido por direitos autorais.</p>
        `
      },
      cookies: {
        title: 'Política de Cookies',
        content: `
          <h3>1. O que são Cookies</h3>
          <p>Cookies são pequenos arquivos de texto armazenados em seu dispositivo.</p>
          
          <h3>2. Como Usamos Cookies</h3>
          <p>Usamos cookies para melhorar sua experiência, lembrar preferências e analisar uso.</p>
          
          <h3>3. Tipos de Cookies</h3>
          <p>Utilizamos cookies essenciais, de funcionalidade e de análise.</p>
          
          <h3>4. Controle de Cookies</h3>
          <p>Você pode controlar cookies através das configurações do seu navegador.</p>
        `
      },
      accept: 'Aceitar',
      close: 'Fechar'
    },
    en: {
      privacy: {
        title: 'Privacy Policy',
        content: `
          <h3>1. Information We Collect</h3>
          <p>We collect information you provide directly, including name, email, phone and academic information.</p>
          
          <h3>2. How We Use Your Information</h3>
          <p>We use your information to provide our services, improve the platform and communicate with you.</p>
          
          <h3>3. Information Sharing</h3>
          <p>We do not sell, rent or share your personal information with third parties without your consent.</p>
          
          <h3>4. Security</h3>
          <p>We implement appropriate security measures to protect your personal information.</p>
        `
      },
      terms: {
        title: 'Terms of Use',
        content: `
          <h3>1. Acceptance of Terms</h3>
          <p>By using our services, you agree to these terms of use.</p>
          
          <h3>2. Platform Use</h3>
          <p>You may use our platform for legitimate educational and professional purposes.</p>
          
          <h3>3. User Responsibilities</h3>
          <p>You are responsible for maintaining the confidentiality of your account and all activities.</p>
          
          <h3>4. Intellectual Property</h3>
          <p>All platform content is protected by copyright.</p>
        `
      },
      cookies: {
        title: 'Cookie Policy',
        content: `
          <h3>1. What are Cookies</h3>
          <p>Cookies are small text files stored on your device.</p>
          
          <h3>2. How We Use Cookies</h3>
          <p>We use cookies to improve your experience, remember preferences and analyze usage.</p>
          
          <h3>3. Types of Cookies</h3>
          <p>We use essential, functionality and analytics cookies.</p>
          
          <h3>4. Cookie Control</h3>
          <p>You can control cookies through your browser settings.</p>
        `
      },
      accept: 'Accept',
      close: 'Close'
    }
  };

  const t = content[language as keyof typeof content];
  const typeContent = t[type];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            {typeContent.title}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-96 mt-4">
          <div 
            className="prose prose-sm max-w-none text-foreground"
            dangerouslySetInnerHTML={{ __html: typeContent.content }}
          />
        </ScrollArea>
        <div className="flex gap-4 mt-6">
          <Button 
            onClick={() => setAccepted(true)}
            className="bg-accent hover:bg-accent/90"
          >
            {t.accept}
          </Button>
          <Button variant="outline">
            {t.close}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TermsModal;