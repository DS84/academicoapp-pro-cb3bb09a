import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Target } from 'lucide-react';

interface TriagingData {
  educationLevel: string;
  field: string;
  objective: string;
  availability: string;
  budget: string;
}

interface RecommendedPath {
  name: string;
  description: string;
  services: string[];
  estimatedCost: string;
  duration: string;
  priority: 'high' | 'medium' | 'low';
}

interface SmartTriagingProps {
  language: string;
}

const SmartTriaging = ({ language }: SmartTriagingProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [triagingData, setTriagingData] = useState<TriagingData>({
    educationLevel: '',
    field: '',
    objective: '',
    availability: '',
    budget: ''
  });
  const [recommendations, setRecommendations] = useState<RecommendedPath[]>([]);
  const [showResults, setShowResults] = useState(false);

  const t = {
    pt: {
      title: 'Triagem Inteligente',
      subtitle: 'Responda 5 perguntas rápidas e receba trilhas personalizadas',
      timeEstimate: '⏱️ Tempo estimado: 60 segundos',
      step1: {
        title: 'Qual é o teu nível educacional?',
        options: {
          primary: '1º Ciclo (Ensino Básico)',
          secondary: 'Ensino Médio/Secundário',
          university: 'Universitário',
          postgrad: 'Pós-graduação'
        }
      },
      step2: {
        title: 'Qual é a tua área/curso?',
        placeholder: 'Selecione sua área'
      },
      step3: {
        title: 'Qual é o teu principal objetivo?',
        options: {
          passSubject: 'Aprovar numa disciplina específica',
          internship: 'Conseguir estágio',
          scholarship: 'Obter bolsa de estudos',
          firstJob: 'Primeiro emprego',
          skillImprovement: 'Melhorar competências'
        }
      },
      step4: {
        title: 'Qual é a tua disponibilidade?',
        options: {
          flexible: 'Flexível',
          weekends: 'Fins de semana apenas',
          evenings: 'Noites (18h-22h)',
          mornings: 'Manhãs (8h-12h)'
        }
      },
      step5: {
        title: 'Qual é o teu orçamento mensal?',
        options: {
          low: 'Até 15.000 AOA',
          medium: '15.000 - 30.000 AOA',
          high: '30.000 - 50.000 AOA',
          premium: 'Acima de 50.000 AOA'
        }
      },
      buttons: {
        next: 'Próximo',
        previous: 'Anterior',
        getRecommendations: 'Ver Recomendações',
        restart: 'Refazer Triagem'
      },
      results: {
        title: 'Trilhas Recomendadas para Ti',
        subtitle: 'Baseado no teu perfil, estas são as melhores opções:',
        priority: {
          high: 'Prioridade Alta',
          medium: 'Prioridade Média',
          low: 'Considerar'
        },
        estimatedCost: 'Custo estimado',
        duration: 'Duração',
        selectPath: 'Escolher esta Trilha'
      },
      areas: {
        exact: 'Ciências Exatas',
        humanities: 'Ciências Humanas',
        health: 'Ciências da Saúde',
        engineering: 'Engenharias',
        business: 'Negócios/Gestão',
        arts: 'Artes e Design',
        law: 'Direito',
        education: 'Educação'
      }
    },
    en: {
      title: 'Smart Triaging',
      subtitle: 'Answer 5 quick questions and receive personalized learning paths',
      timeEstimate: '⏱️ Estimated time: 60 seconds',
      step1: {
        title: 'What is your education level?',
        options: {
          primary: 'Primary School',
          secondary: 'High School/Secondary',
          university: 'University',
          postgrad: 'Postgraduate'
        }
      },
      step2: {
        title: 'What is your field/course?',
        placeholder: 'Select your field'
      },
      step3: {
        title: 'What is your main objective?',
        options: {
          passSubject: 'Pass a specific subject',
          internship: 'Get an internship',
          scholarship: 'Obtain scholarship',
          firstJob: 'First job',
          skillImprovement: 'Improve skills'
        }
      },
      step4: {
        title: 'What is your availability?',
        options: {
          flexible: 'Flexible',
          weekends: 'Weekends only',
          evenings: 'Evenings (6pm-10pm)',
          mornings: 'Mornings (8am-12pm)'
        }
      },
      step5: {
        title: 'What is your monthly budget?',
        options: {
          low: 'Up to 15,000 AOA',
          medium: '15,000 - 30,000 AOA',
          high: '30,000 - 50,000 AOA',
          premium: 'Above 50,000 AOA'
        }
      },
      buttons: {
        next: 'Next',
        previous: 'Previous',
        getRecommendations: 'Get Recommendations',
        restart: 'Restart Triaging'
      },
      results: {
        title: 'Recommended Paths for You',
        subtitle: 'Based on your profile, these are the best options:',
        priority: {
          high: 'High Priority',
          medium: 'Medium Priority',
          low: 'Consider'
        },
        estimatedCost: 'Estimated cost',
        duration: 'Duration',
        selectPath: 'Choose this Path'
      },
      areas: {
        exact: 'Exact Sciences',
        humanities: 'Humanities',
        health: 'Health Sciences',
        engineering: 'Engineering',
        business: 'Business/Management',
        arts: 'Arts and Design',
        law: 'Law',
        education: 'Education'
      }
    }
  }[language as 'pt' | 'en'];

  const generateRecommendations = (): RecommendedPath[] => {
    const recommendations: RecommendedPath[] = [];

    // Lógica de recomendação baseada nas respostas
    if (triagingData.objective === 'passSubject') {
      recommendations.push({
        name: language === 'pt' ? 'Trilha Acadêmica Intensiva' : 'Intensive Academic Path',
        description: language === 'pt' ? 'Tutoria + materiais + simulados' : 'Tutoring + materials + mock exams',
        services: ['Tutoria Online', 'Materiais de Estudo', 'Simulados'],
        estimatedCost: triagingData.budget === 'low' ? '12.000 AOA' : '25.000 AOA',
        duration: '4-8 semanas',
        priority: 'high'
      });
    }

    if (triagingData.objective === 'firstJob' || triagingData.objective === 'internship') {
      recommendations.push({
        name: language === 'pt' ? 'Trilha Carreira Professional' : 'Professional Career Path',
        description: language === 'pt' ? 'CV + LinkedIn + simulação de entrevistas' : 'CV + LinkedIn + interview simulation',
        services: ['Orientação Profissional', 'Revisão CV/LinkedIn', 'Simulação de Entrevistas'],
        estimatedCost: triagingData.budget === 'premium' ? '45.000 AOA' : '30.000 AOA',
        duration: '6-12 semanas',
        priority: 'high'
      });
    }

    if (triagingData.objective === 'scholarship') {
      recommendations.push({
        name: language === 'pt' ? 'Trilha Bolsas de Estudo' : 'Scholarship Path',
        description: language === 'pt' ? 'Scanner de elegibilidade + submissão assistida' : 'Eligibility scanner + assisted submission',
        services: ['Scanner de Bolsas', 'Submissão Assistida', 'Preparação de Documentos'],
        estimatedCost: '20.000 AOA',
        duration: '3-6 meses',
        priority: 'medium'
      });
    }

    // Sempre adicionar mentoria como opção
    recommendations.push({
      name: language === 'pt' ? 'Mentoria & Acompanhamento' : 'Mentoring & Follow-up',
      description: language === 'pt' ? 'Metas mensais + checkpoints + relatórios' : 'Monthly goals + checkpoints + reports',
      services: ['Mentoria Mensal', 'Checkpoints', 'Relatório PDF'],
      estimatedCost: triagingData.budget === 'low' ? '15.000 AOA' : '35.000 AOA',
      duration: '3-6 meses',
      priority: triagingData.objective === 'skillImprovement' ? 'high' : 'medium'
    });

    return recommendations;
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      const recs = generateRecommendations();
      setRecommendations(recs);
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setTriagingData({
      educationLevel: '',
      field: '',
      objective: '',
      availability: '',
      budget: ''
    });
    setRecommendations([]);
    setShowResults(false);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return triagingData.educationLevel !== '';
      case 2: return triagingData.field !== '';
      case 3: return triagingData.objective !== '';
      case 4: return triagingData.availability !== '';
      case 5: return triagingData.budget !== '';
      default: return false;
    }
  };

  const progress = (currentStep / 5) * 100;

  if (showResults) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-primary flex items-center gap-2">
                <CheckCircle className="h-6 w-6" />
                {t.results.title}
              </CardTitle>
              <p className="text-muted-foreground mt-2">{t.results.subtitle}</p>
            </div>
            <Button variant="outline" onClick={handleRestart}>
              {t.buttons.restart}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {recommendations.map((rec, index) => (
              <Card key={index} className={`border-l-4 ${
                rec.priority === 'high' ? 'border-l-green-500' : 
                rec.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-gray-400'
              }`}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{rec.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rec.priority === 'high' ? 'bg-green-100 text-green-800' :
                          rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {t.results.priority[rec.priority]}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-3">{rec.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {rec.services.map((service, i) => (
                          <span key={i} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                            {service}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          {t.results.estimatedCost}: {rec.estimatedCost}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {t.results.duration}: {rec.duration}
                        </div>
                      </div>
                    </div>
                    <div>
                      <Button className="w-full lg:w-auto">
                        {t.results.selectPath}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">{t.title}</CardTitle>
        <p className="text-muted-foreground">{t.subtitle}</p>
        <p className="text-sm text-muted-foreground">{t.timeEstimate}</p>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Passo {currentStep} de 5</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {currentStep === 1 && (
            <div>
              <Label className="text-lg font-medium">{t.step1.title}</Label>
              <RadioGroup 
                value={triagingData.educationLevel} 
                onValueChange={(value) => setTriagingData({...triagingData, educationLevel: value})}
                className="mt-4"
              >
                {Object.entries(t.step1.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={key} />
                    <Label htmlFor={key}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <Label className="text-lg font-medium">{t.step2.title}</Label>
              <Select value={triagingData.field} onValueChange={(value) => setTriagingData({...triagingData, field: value})}>
                <SelectTrigger className="mt-4">
                  <SelectValue placeholder={t.step2.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(t.areas).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <Label className="text-lg font-medium">{t.step3.title}</Label>
              <RadioGroup 
                value={triagingData.objective} 
                onValueChange={(value) => setTriagingData({...triagingData, objective: value})}
                className="mt-4"
              >
                {Object.entries(t.step3.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={key} />
                    <Label htmlFor={key}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <Label className="text-lg font-medium">{t.step4.title}</Label>
              <RadioGroup 
                value={triagingData.availability} 
                onValueChange={(value) => setTriagingData({...triagingData, availability: value})}
                className="mt-4"
              >
                {Object.entries(t.step4.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={key} />
                    <Label htmlFor={key}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {currentStep === 5 && (
            <div>
              <Label className="text-lg font-medium">{t.step5.title}</Label>
              <RadioGroup 
                value={triagingData.budget} 
                onValueChange={(value) => setTriagingData({...triagingData, budget: value})}
                className="mt-4"
              >
                {Object.entries(t.step5.options).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={key} />
                    <Label htmlFor={key}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button 
              variant="outline" 
              onClick={handlePrevious} 
              disabled={currentStep === 1}
            >
              {t.buttons.previous}
            </Button>
            <Button 
              onClick={handleNext} 
              disabled={!isStepValid()}
            >
              {currentStep === 5 ? t.buttons.getRecommendations : t.buttons.next}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartTriaging;