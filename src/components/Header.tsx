import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Menu, X, GraduationCap } from 'lucide-react';

interface HeaderProps {
  language: string;
  setLanguage: (lang: string) => void;
}

const Header = ({ language, setLanguage }: HeaderProps) => {
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
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-primary">AcademicSupport</h1>
              <p className="text-xs text-muted-foreground">Angola</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#students" className="text-foreground hover:text-accent transition-colors">
              {t.students}
            </a>
            <a href="#teachers" className="text-foreground hover:text-accent transition-colors">
              {t.teachers}
            </a>
            <a href="#professionals" className="text-foreground hover:text-accent transition-colors">
              {t.professionals}
            </a>
            <a href="#about" className="text-foreground hover:text-accent transition-colors">
              {t.about}
            </a>
            <a href="#contact" className="text-foreground hover:text-accent transition-colors">
              {t.contact}
            </a>
          </nav>

          {/* Language Selector & CTA */}
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
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              {t.getStarted}
            </Button>
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
              <a href="#students" className="text-foreground hover:text-accent transition-colors">
                {t.students}
              </a>
              <a href="#teachers" className="text-foreground hover:text-accent transition-colors">
                {t.teachers}
              </a>
              <a href="#professionals" className="text-foreground hover:text-accent transition-colors">
                {t.professionals}
              </a>
              <a href="#about" className="text-foreground hover:text-accent transition-colors">
                {t.about}
              </a>
              <a href="#contact" className="text-foreground hover:text-accent transition-colors">
                {t.contact}
              </a>
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
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                  {t.getStarted}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;