import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import UserDropdown from './UserDropdown';
import SearchBar from './SearchBar';
import NotificationCenter from './notifications/NotificationCenter';

interface HeaderProps {
  language: string;
  setLanguage: (lang: string) => void;
  isAuthenticated?: boolean;
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

const Header = ({ language, setLanguage, isAuthenticated = false, user, onLogout }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const translations = {
    pt: {
      students: 'Estudantes',
      teachers: 'Professores', 
      professionals: 'Profissionais',
      about: 'Sobre',
      contact: 'Contacto',
      getStarted: 'Começar'
    },
    en: {
      students: 'Students',
      teachers: 'Teachers',
      professionals: 'Professionals', 
      about: 'About',
      contact: 'Contact',
      getStarted: 'Get Started'
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <header className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img src="/lovable-uploads/49fd2c5a-8001-4aa0-ba28-aabc45c289de.png" alt="Logotipo academicoapp" className="h-10 w-auto" loading="eager" />
              </Link>
            </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/students" className="text-foreground hover:text-accent transition-colors">
              {t.students}
            </Link>
            <Link to="/teachers" className="text-foreground hover:text-accent transition-colors">
              {t.teachers}
            </Link>
            <Link to="/professionals" className="text-foreground hover:text-accent transition-colors">
              {t.professionals}
            </Link>
            <a href="/#about" className="text-foreground hover:text-accent transition-colors">
              {t.about}
            </a>
            <a href="/#contact" className="text-foreground hover:text-accent transition-colors">
              {t.contact}
            </a>
          </nav>

          {/* Search Bar (when authenticated) */}
          {isAuthenticated && (
            <div className="hidden md:block">
              <SearchBar language={language} />
            </div>
          )}

          {/* Language Selector & User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt">PT</SelectItem>
                <SelectItem value="en">EN</SelectItem>
              </SelectContent>
            </Select>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <NotificationCenter language={language as 'pt' | 'en'} />
                <UserDropdown 
                  language={language as 'pt' | 'en'}
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={onLogout || (() => {})}
                />
              </div>
            ) : (
              <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/login">{t.getStarted}</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border">
            <nav className="flex flex-col space-y-4 mt-4">
              <Link to="/students" className="text-foreground hover:text-accent transition-colors">
                {t.students}
              </Link>
              <Link to="/teachers" className="text-foreground hover:text-accent transition-colors">
                {t.teachers}
              </Link>
              <Link to="/professionals" className="text-foreground hover:text-accent transition-colors">
                {t.professionals}
              </Link>
              <a href="/#about" className="text-foreground hover:text-accent transition-colors">
                {t.about}
              </a>
              <a href="/#contact" className="text-foreground hover:text-accent transition-colors">
                {t.contact}
              </a>
              
              {/* Mobile Search Bar (when authenticated) */}
              {isAuthenticated && (
                <div className="pt-4">
                  <SearchBar language={language} />
                </div>
              )}
              
              <div className="flex items-center space-x-4 pt-4">
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt">PT</SelectItem>
                    <SelectItem value="en">EN</SelectItem>
                  </SelectContent>
                </Select>
                
                {isAuthenticated ? (
                  <UserDropdown 
                    language={language as 'pt' | 'en'}
                    isAuthenticated={isAuthenticated}
                    user={user}
                    onLogout={onLogout || (() => {})}
                  />
                ) : (
                  <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link to="/login">{t.getStarted}</Link>
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;