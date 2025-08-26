import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ChevronRight, Clock, Target, User, Calendar } from 'lucide-react';

interface TriagingData {
  area: string;
  nivel: string;
  objetivo: string;
  experiencia_anos: number;
  disponibilidade: string;
}

interface ProfessionalTriagingProps {
  onComplete: (data: TriagingData) => void;
  language: string;
}

const ProfessionalTriaging = ({ onComplete, language }: ProfessionalTriagingProps) => {
  const [formData, setFormData] = useState<TriagingData>({
    area: '',
    nivel: '',
    objetivo: '',
    experiencia_anos: 0,
    disponibilidade: ''
  });

  const t = {
    pt: {
      title: 'Triagem Profissional',
      subtitle: 'Responda algumas perguntas para personalizarmos sua experiência (60 segundos)',
      area: 'Área/Nível Profissional',
      areaPlaceholder: 'Ex: Tecnologia, Medicina, Engenharia',
      objetivo: 'Qual o seu objetivo?',
      objetivos: {
        emprego: 'Conseguir emprego',
        promocao: 'Promoção/Aumento',
        transicao: 'Transição de carreira', 
        upskilling: 'Melhorar competências'
      },
      experiencia: 'Anos de experiência',
      disponibilidade: 'Disponibilidade para formação',
      disponibilidades: {
        fulltime: 'Tempo integral (40h/semana)',
        parttime: 'Meio período (20h/semana)',
        weekend: 'Fins de semana (10h/semana)',
        flexible: 'Horário flexível'
      },
      continue: 'Continuar'
    },
    en: {
      title: 'Professional Assessment',
      subtitle: 'Answer a few questions to personalize your experience (60 seconds)',
      area: 'Professional Area/Level',
      areaPlaceholder: 'Ex: Technology, Medicine, Engineering',
      objetivo: 'What is your goal?',
      objetivos: {
        emprego: 'Get a job',
        promocao: 'Promotion/Raise',
        transicao: 'Career transition',
        upskilling: 'Improve skills'
      },
      experiencia: 'Years of experience',
      disponibilidade: 'Training availability',
      disponibilidades: {
        fulltime: 'Full time (40h/week)',
        parttime: 'Part time (20h/week)', 
        weekend: 'Weekends (10h/week)',
        flexible: 'Flexible schedule'
      },
      continue: 'Continue'
    }
  }[language as 'pt' | 'en'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const isValid = formData.area && formData.objetivo && formData.experiencia_anos >= 0 && formData.disponibilidade;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Clock className="h-5 w-5 text-primary" />
          <span className="text-sm text-muted-foreground">60s</span>
        </div>
        <CardTitle className="text-2xl">{t.title}</CardTitle>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="area" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {t.area}
            </Label>
            <Input
              id="area"
              placeholder={t.areaPlaceholder}
              value={formData.area}
              onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
            />
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              {t.objetivo}
            </Label>
            <RadioGroup
              value={formData.objetivo}
              onValueChange={(value) => setFormData(prev => ({ ...prev, objetivo: value }))}
              className="grid grid-cols-2 gap-3"
            >
              {Object.entries(t.objetivos).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent cursor-pointer">
                  <RadioGroupItem value={key} id={key} />
                  <Label htmlFor={key} className="cursor-pointer flex-1">{label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experiencia">{t.experiencia}</Label>
            <Input
              id="experiencia"
              type="number"
              min="0"
              max="50"
              value={formData.experiencia_anos}
              onChange={(e) => setFormData(prev => ({ ...prev, experiencia_anos: parseInt(e.target.value) || 0 }))}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {t.disponibilidade}
            </Label>
            <Select 
              value={formData.disponibilidade} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, disponibilidade: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione sua disponibilidade" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(t.disponibilidades).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={!isValid}
          >
            {t.continue}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfessionalTriaging;