import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, BookOpen, Users, Settings, Shuffle } from 'lucide-react';

interface TeacherTriagingProps {
  language: string;
  onRecommendation: (tracks: string[]) => void;
}

const TeacherTriaging = ({ language, onRecommendation }: TeacherTriagingProps) => {
  const [level, setLevel] = useState('');
  const [area, setArea] = useState('');
  const [objectives, setObjectives] = useState<string[]>([]);
  const [availability, setAvailability] = useState('');
  const [platform, setPlatform] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  const t = {
    pt: {
      title: 'Triagem do Docente',
      subtitle: 'Responda 5 perguntas rápidas para receber trilhas personalizadas',
      step1: 'Nível de ensino',
      step2: 'Área/Disciplina',
      step3: 'Objetivos',
      step4: 'Disponibilidade',
      step5: 'Plataforma preferida',
      levels: {
        ciclo1: '1º Ciclo',
        medio: 'Ensino Médio',
        superior: 'Ensino Superior'
      },
      areas: {
        ciencias: 'Ciências Exatas',
        humanas: 'Ciências Humanas',
        linguagens: 'Linguagens',
        artes: 'Artes',
        tecnologia: 'Tecnologia'
      },
      objectivesList: {
        tech: 'Integrar tecnologia',
        cpd: 'Obter CPD',
        rubrics: 'Criar rubricas',
        coteaching: 'Co-docência',
        assessment: 'Avaliação moderna'
      },
      availabilities: {
        morning: 'Manhã',
        afternoon: 'Tarde',
        evening: 'Noite',
        weekend: 'Fins de semana'
      },
      platforms: {
        moodle: 'Moodle',
        classroom: 'Google Classroom',
        teams: 'Microsoft Teams',
        outros: 'Outros'
      },
      next: 'Próximo',
      back: 'Anterior',
      getRecommendations: 'Obter Recomendações',
      recommendedTracks: 'Trilhas Recomendadas',
      timeEstimate: '⏱️ Tempo estimado: 60 segundos'
    },
    en: {
      title: 'Teacher Assessment',
      subtitle: 'Answer 5 quick questions to receive personalized learning tracks',
      step1: 'Teaching level',
      step2: 'Subject/Area',
      step3: 'Objectives',
      step4: 'Availability',
      step5: 'Preferred platform',
      levels: {
        ciclo1: 'Primary Education',
        medio: 'Secondary Education',
        superior: 'Higher Education'
      },
      areas: {
        ciencias: 'Sciences',
        humanas: 'Humanities',
        linguagens: 'Languages',
        artes: 'Arts',
        tecnologia: 'Technology'
      },
      objectivesList: {
        tech: 'Integrate technology',
        cpd: 'Obtain CPD',
        rubrics: 'Create rubrics',
        coteaching: 'Co-teaching',
        assessment: 'Modern assessment'
      },
      availabilities: {
        morning: 'Morning',
        afternoon: 'Afternoon',
        evening: 'Evening',
        weekend: 'Weekends'
      },
      platforms: {
        moodle: 'Moodle',
        classroom: 'Google Classroom',
        teams: 'Microsoft Teams',
        outros: 'Others'
      },
      next: 'Next',
      back: 'Previous',
      getRecommendations: 'Get Recommendations',
      recommendedTracks: 'Recommended Tracks',
      timeEstimate: '⏱️ Estimated time: 60 seconds'
    }
  }[language as 'pt' | 'en'];

  const handleObjectiveChange = (objective: string, checked: boolean) => {
    if (checked) {
      setObjectives([...objectives, objective]);
    } else {
      setObjectives(objectives.filter(o => o !== objective));
    }
  };

  const generateRecommendations = () => {
    const tracks: string[] = [];
    
    // Lógica de recomendação baseada nas respostas
    if (objectives.includes('tech')) {
      tracks.push('Formação pedagógica digital');
      tracks.push('Apoio técnico especializado');
    }
    
    if (objectives.includes('cpd')) {
      tracks.push('Formação pedagógica contínua');
      tracks.push('Certificação profissional');
    }
    
    if (objectives.includes('coteaching')) {
      tracks.push('Rede de professores');
      tracks.push('Intercâmbio institucional');
    }
    
    if (platform === 'moodle') {
      tracks.push('Apoio técnico ao Moodle');
    }
    
    if (area === 'tecnologia') {
      tracks.push('Recursos didáticos digitais');
    }
    
    // Sempre incluir pelo menos uma trilha base
    if (tracks.length === 0) {
      tracks.push('Formação pedagógica', 'Recursos didáticos');
    }
    
    onRecommendation([...new Set(tracks)]);
  };

  const steps = [
    {
      title: t.step1,
      content: (
        <RadioGroup value={level} onValueChange={setLevel}>
          {Object.entries(t.levels).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <RadioGroupItem value={key} id={key} />
              <Label htmlFor={key}>{value}</Label>
            </div>
          ))}
        </RadioGroup>
      )
    },
    {
      title: t.step2,
      content: (
        <RadioGroup value={area} onValueChange={setArea}>
          {Object.entries(t.areas).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <RadioGroupItem value={key} id={key} />
              <Label htmlFor={key}>{value}</Label>
            </div>
          ))}
        </RadioGroup>
      )
    },
    {
      title: t.step3,
      content: (
        <div className="space-y-3">
          {Object.entries(t.objectivesList).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox
                id={key}
                checked={objectives.includes(key)}
                onCheckedChange={(checked) => handleObjectiveChange(key, checked as boolean)}
              />
              <Label htmlFor={key}>{value}</Label>
            </div>
          ))}
        </div>
      )
    },
    {
      title: t.step4,
      content: (
        <RadioGroup value={availability} onValueChange={setAvailability}>
          {Object.entries(t.availabilities).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <RadioGroupItem value={key} id={key} />
              <Label htmlFor={key}>{value}</Label>
            </div>
          ))}
        </RadioGroup>
      )
    },
    {
      title: t.step5,
      content: (
        <RadioGroup value={platform} onValueChange={setPlatform}>
          {Object.entries(t.platforms).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <RadioGroupItem value={key} id={key} />
              <Label htmlFor={key}>{value}</Label>
            </div>
          ))}
        </RadioGroup>
      )
    }
  ];

  const canProceed = () => {
    switch (currentStep) {
      case 0: return level !== '';
      case 1: return area !== '';
      case 2: return objectives.length > 0;
      case 3: return availability !== '';
      case 4: return platform !== '';
      default: return false;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <CardTitle>{t.title}</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
        <Badge variant="outline" className="w-fit">
          {t.timeEstimate}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              {currentStep + 1} / {steps.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {steps[currentStep].title}
            </h3>
            {steps[currentStep].content}
          </div>

          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                {t.back}
              </Button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
              >
                {t.next}
              </Button>
            ) : (
              <Button
                onClick={generateRecommendations}
                disabled={!canProceed()}
                className="flex items-center gap-2"
              >
                <Shuffle className="h-4 w-4" />
                {t.getRecommendations}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherTriaging;