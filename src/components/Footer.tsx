import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { FaWhatsapp, FaXTwitter } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import TermsModal from './TermsModal';

interface FooterProps {
  language: string;
}

const Footer = ({ language }: FooterProps) => {
  const translations = {
    pt: {
      tagline: 'Conectando futuros, construindo Angola',
      address: 'Luanda, Angola',
      services: 'Serviços',
      students: 'Estudantes',
      teachers: 'Professores',
      professionals: 'Profissionais',
      company: 'Empresa',
      about: 'Sobre Nós',
      careers: 'Carreiras',
      career: 'Carreira',
      opportunities: 'Oportunidades',
      internships: 'Estágios',
      benefits: 'Benefícios',
      contact: {
        email: 'contacto@academicoapp.com',
        phone: '942065632',
        address: 'Luanda, Angola'
      },
      legal: 'Legal',
      privacy: 'Privacidade',
      terms: 'Termos de Uso',
      cookies: 'Políticas de Cookies',
      rights: '© 2025 academicoapp Angola. Todos os direitos reservados.'
    },
    en: {
      tagline: 'Connecting futures, building Angola',
      address: 'Luanda, Angola',
      services: 'Services',
      students: 'Students',
      teachers: 'Teachers', 
      professionals: 'Professionals',
      company: 'Company',
      about: 'About Us',
      careers: 'Careers',
      career: 'Career',
      opportunities: 'Oportunidades',
      internships: 'Estágios',
      benefits: 'Benefícios',
      contact: {
        email: 'contacto@academicoapp.com',
        phone: '942065632',
        address: 'Luanda, Angola'
      },
      legal: 'Legal',
      privacy: 'Privacy',
      terms: 'Terms of Use',
      cookies: 'Cookie Policies',
      rights: '© 2025 academicoapp Angola. All rights reserved.'
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src="/lovable-uploads/f0aef100-4cfc-4c89-9f09-3a3df31884f5.png"
                  alt="Logotipo academicoapp Angola"
                  className="w-8 h-8 object-contain"
                  loading="lazy"
                  width={32}
                  height={32}
                />
              </div>
              <div>
                <h3 className="font-bold text-xl">academicoapp</h3>
                <p className="text-sm text-primary-foreground/70">Angola</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 mb-6 max-w-md">
              {t.tagline}
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-6 w-6 text-primary-foreground/60 hover:text-accent cursor-pointer transition-colors" />
              <Instagram className="h-6 w-6 text-primary-foreground/60 hover:text-accent cursor-pointer transition-colors" />
              <Linkedin className="h-6 w-6 text-primary-foreground/60 hover:text-accent cursor-pointer transition-colors" />
              <a href="https://wa.me/244942065632" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp className="h-6 w-6 text-primary-foreground/60 hover:text-green-500 cursor-pointer transition-colors" />
              </a>
              <a href="https://x.com/academicoapp" target="_blank" rel="noopener noreferrer">
                <FaXTwitter className="h-6 w-6 text-primary-foreground/60 hover:text-slate-400 cursor-pointer transition-colors" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t.services}</h4>
            <ul className="space-y-3">
              <li><Link to="/students" className="text-primary-foreground/80 hover:text-accent transition-colors">{t.students}</Link></li>
              <li><Link to="/teachers" className="text-primary-foreground/80 hover:text-accent transition-colors">{t.teachers}</Link></li>
              <li><Link to="/professionals" className="text-primary-foreground/80 hover:text-accent transition-colors">{t.professionals}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t.company}</h4>
            <ul className="space-y-3">
              <li><a href="#about" className="text-primary-foreground/80 hover:text-accent transition-colors">{t.about}</a></li>
              <li><a href="#contact" className="text-primary-foreground/80 hover:text-accent transition-colors">Contacto</a></li>
            </ul>
          </div>

          {/* Career */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t.career}</h4>
            <ul className="space-y-3">
              <li><a href="#jobs" className="text-primary-foreground/80 hover:text-accent transition-colors">{t.opportunities}</a></li>
              <li><a href="#internships" className="text-primary-foreground/80 hover:text-accent transition-colors">{t.internships}</a></li>
              <li><a href="#mentorship" className="text-primary-foreground/80 hover:text-accent transition-colors">Mentoria</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t.legal}</h4>
            <div className="space-y-3 text-sm">
              <TermsModal 
                type="privacy" 
                language={language}
                trigger={
                  <button className="text-primary-foreground/80 hover:text-accent transition-colors text-left">
                    {t.privacy}
                  </button>
                }
              />
              <br />
              <TermsModal 
                type="terms" 
                language={language}
                trigger={
                  <button className="text-primary-foreground/80 hover:text-accent transition-colors text-left">
                    {t.terms}
                  </button>
                }
              />
              <br />
              <TermsModal 
                type="cookies" 
                language={language}
                trigger={
                  <button className="text-primary-foreground/80 hover:text-accent transition-colors text-left">
                    {t.cookies}
                  </button>
                }
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{t.contact.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{t.contact.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{t.address}</span>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/60">
              {t.rights}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;