import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Video, FileText, Users, Star, Target, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ServiceFlowsProps {
  language: string;
  selectedService: string;
  onComplete: () => void;
}

const ServiceFlows = ({ language, selectedService, onComplete }: ServiceFlowsProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const { toast } = useToast();

  const t = {
    pt: {
      tutoring: {
        title: 'Agendar Tutoria Online',
        steps: {
          1: 'Informações da Sessão',
          2: 'Pacote de Horas',
          3: 'Confirmação'
        },
        fields: {
          subject: 'Disciplina/Assunto',
          level: 'Nível',
          preferredDate: 'Data Preferida',
          preferredTime: 'Horário Preferido',
          duration: 'Duração da Sessão',
          objectives: 'Objetivos da Sessão',
          packageHours: 'Pacote de Horas',
          frequency: 'Frequência'
        },
        packages: {
          single: 'Sessão Única - 2.500 AOA',
          basic: 'Pacote Básico (4h) - 9.000 AOA',
          standard: 'Pacote Standard (8h) - 17.000 AOA',
          premium: 'Pacote Premium (12h) - 24.000 AOA'
        },
        confirm: 'Confirmar Agendamento'
      },
      materials: {
        title: 'Acesso à Biblioteca de Materiais',
        steps: {
          1: 'Seleção de Área',
          2: 'Plano de Estudo',
          3: 'Confirmação'
        },
        fields: {
          subject: 'Área de Interesse',
          level: 'Nível Acadêmico',
          studyGoal: 'Objetivo de Estudo',
          timeCommitment: 'Tempo Disponível/Semana',
          planDuration: 'Duração do Plano'
        },
        plans: {
          weekly: 'Plano 4 Semanas - 8.000 AOA',
          monthly: 'Plano 2 Meses - 14.000 AOA',
          semester: 'Plano Semestral - 25.000 AOA'
        },
        confirm: 'Ativar Acesso'
      },
      career: {
        title: 'Orientação Profissional',
        steps: {
          1: 'Informações Profissionais',
          2: 'Serviços Incluídos',
          3: 'Agendamento'
        },
        fields: {
          currentStatus: 'Status Atual',
          targetRole: 'Cargo Desejado',
          experience: 'Experiência',
          hasCV: 'Possui CV atualizado?',
          hasLinkedIn: 'Possui perfil LinkedIn?',
          interviewDate: 'Data da Consulta'
        },
        services: {
          cvReview: 'Revisão Completa de CV',
          linkedinOpt: 'Otimização do LinkedIn',
          interviewSim: 'Simulação de Entrevista',
          feedbackReport: 'Relatório de Feedback',
          followUp: 'Acompanhamento 30 dias'
        },
        confirm: 'Agendar Consulta'
      },
      scholarships: {
        title: 'Busca de Bolsas de Estudo',
        steps: {
          1: 'Perfil Acadêmico',
          2: 'Critérios de Busca',
          3: 'Serviços'
        },
        fields: {
          academicLevel: 'Nível Acadêmico',
          fieldOfStudy: 'Área de Estudo',
          gpa: 'Nota Média (GPA)',
          country: 'País de Interesse',
          budgetRange: 'Faixa de Custo',
          deadline: 'Prazo Desejado'
        },
        services: {
          scanner: 'Scanner de Oportunidades',
          eligibility: 'Verificação de Elegibilidade',
          submission: 'Submissão Assistida',
          calendar: 'Calendário de Prazos',
          templates: 'Templates de Candidatura'
        },
        confirm: 'Iniciar Busca'
      },
      mentoring: {
        title: 'Mentoria & Acompanhamento',
        steps: {
          1: 'Objetivos e Metas',
          2: 'Frequência',
          3: 'Confirmação'
        },
        fields: {
          currentSituation: 'Situação Atual',
          mainGoals: 'Principais Objetivos',
          timeframe: 'Prazo para Resultados',
          mentorPreference: 'Preferência de Mentor',
          meetingFrequency: 'Frequência de Reuniões',
          communicationMode: 'Modo de Comunicação'
        },
        frequencies: {
          weekly: 'Semanal - 35.000 AOA/mês',
          biweekly: 'Quinzenal - 25.000 AOA/mês',
          monthly: 'Mensal - 15.000 AOA/mês'
        },
        confirm: 'Começar Mentoria'
      },
      common: {
        next: 'Próximo',
        previous: 'Anterior',
        finish: 'Finalizar',
        processing: 'A processar...',
        success: 'Sucesso!',
        successMessage: 'O teu pedido foi registrado com sucesso. Receberás mais informações por email.'
      }
    },
    en: {
      tutoring: {
        title: 'Schedule Online Tutoring',
        steps: {
          1: 'Session Information',
          2: 'Hour Package',
          3: 'Confirmation'
        },
        fields: {
          subject: 'Subject/Topic',
          level: 'Level',
          preferredDate: 'Preferred Date',
          preferredTime: 'Preferred Time',
          duration: 'Session Duration',
          objectives: 'Session Objectives',
          packageHours: 'Hour Package',
          frequency: 'Frequency'
        },
        packages: {
          single: 'Single Session - 2,500 AOA',
          basic: 'Basic Package (4h) - 9,000 AOA',
          standard: 'Standard Package (8h) - 17,000 AOA',
          premium: 'Premium Package (12h) - 24,000 AOA'
        },
        confirm: 'Confirm Booking'
      },
      materials: {
        title: 'Materials Library Access',
        steps: {
          1: 'Area Selection',
          2: 'Study Plan',
          3: 'Confirmation'
        },
        fields: {
          subject: 'Area of Interest',
          level: 'Academic Level',
          studyGoal: 'Study Goal',
          timeCommitment: 'Available Time/Week',
          planDuration: 'Plan Duration'
        },
        plans: {
          weekly: '4 Week Plan - 8,000 AOA',
          monthly: '2 Month Plan - 14,000 AOA',
          semester: 'Semester Plan - 25,000 AOA'
        },
        confirm: 'Activate Access'
      },
      career: {
        title: 'Career Guidance',
        steps: {
          1: 'Professional Information',
          2: 'Included Services',
          3: 'Scheduling'
        },
        fields: {
          currentStatus: 'Current Status',
          targetRole: 'Target Role',
          experience: 'Experience',
          hasCV: 'Have updated CV?',
          hasLinkedIn: 'Have LinkedIn profile?',
          interviewDate: 'Consultation Date'
        },
        services: {
          cvReview: 'Complete CV Review',
          linkedinOpt: 'LinkedIn Optimization',
          interviewSim: 'Interview Simulation',
          feedbackReport: 'Feedback Report',
          followUp: '30-day Follow-up'
        },
        confirm: 'Schedule Consultation'
      },
      scholarships: {
        title: 'Scholarship Search',
        steps: {
          1: 'Academic Profile',
          2: 'Search Criteria',
          3: 'Services'
        },
        fields: {
          academicLevel: 'Academic Level',
          fieldOfStudy: 'Field of Study',
          gpa: 'GPA',
          country: 'Country of Interest',
          budgetRange: 'Budget Range',
          deadline: 'Desired Deadline'
        },
        services: {
          scanner: 'Opportunity Scanner',
          eligibility: 'Eligibility Verification',
          submission: 'Assisted Submission',
          calendar: 'Deadline Calendar',
          templates: 'Application Templates'
        },
        confirm: 'Start Search'
      },
      mentoring: {
        title: 'Mentoring & Follow-up',
        steps: {
          1: 'Goals and Objectives',
          2: 'Frequency',
          3: 'Confirmation'
        },
        fields: {
          currentSituation: 'Current Situation',
          mainGoals: 'Main Goals',
          timeframe: 'Timeline for Results',
          mentorPreference: 'Mentor Preference',
          meetingFrequency: 'Meeting Frequency',
          communicationMode: 'Communication Mode'
        },
        frequencies: {
          weekly: 'Weekly - 35,000 AOA/month',
          biweekly: 'Bi-weekly - 25,000 AOA/month',
          monthly: 'Monthly - 15,000 AOA/month'
        },
        confirm: 'Start Mentoring'
      },
      common: {
        next: 'Next',
        previous: 'Previous',
        finish: 'Finish',
        processing: 'Processing...',
        success: 'Success!',
        successMessage: 'Your request has been successfully registered. You will receive more information by email.'
      }
    }
  }[language as 'pt' | 'en'];

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'tutoring': return <Video className="h-6 w-6" />;
      case 'materials': return <FileText className="h-6 w-6" />;
      case 'career': return <Users className="h-6 w-6" />;
      case 'scholarships': return <Star className="h-6 w-6" />;
      case 'mentoring': return <Target className="h-6 w-6" />;
      default: return <CheckCircle className="h-6 w-6" />;
    }
  };

  const getCurrentService = () => {
    const serviceKey = selectedService as keyof Omit<typeof t, 'common'>;
    return t[serviceKey];
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    toast({
      title: t.common.success,
      description: t.common.successMessage
    });
    onComplete();
  };

  const renderStepContent = () => {
    const service = getCurrentService();
    
    switch (selectedService) {
      case 'tutoring':
        return renderTutoringStep(service);
      case 'materials':
        return renderMaterialsStep(service);
      case 'career':
        return renderCareerStep(service);
      case 'scholarships':
        return renderScholarshipsStep(service);
      case 'mentoring':
        return renderMentoringStep(service);
      default:
        return null;
    }
  };

  const renderTutoringStep = (service: any) => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{service.fields.subject}</Label>
                <Input placeholder="Ex: Matemática, Física..." />
              </div>
              <div>
                <Label>{service.fields.level}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">Ensino Médio</SelectItem>
                    <SelectItem value="university">Universitário</SelectItem>
                    <SelectItem value="postgrad">Pós-graduação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{service.fields.preferredDate}</Label>
                <Input type="date" />
              </div>
              <div>
                <Label>{service.fields.preferredTime}</Label>
                <Input type="time" />
              </div>
            </div>
            <div>
              <Label>{service.fields.objectives}</Label>
              <Textarea placeholder="Descreva os objetivos da sessão..." rows={3} />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-lg">{service.fields.packageHours}</Label>
              <div className="grid gap-3 mt-4">
                {Object.entries(service.packages).map(([key, label]) => (
                  <div key={key} className="p-4 border rounded-lg cursor-pointer hover:bg-accent">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{String(label)}</span>
                      <input type="radio" name="package" value={key} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Resumo da Reserva</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Serviço:</span>
                  <span>Tutoria Online</span>
                </div>
                <div className="flex justify-between">
                  <span>Pacote:</span>
                  <span>Pacote Básico (4h)</span>
                </div>
                <div className="flex justify-between">
                  <span>Valor:</span>
                  <span className="font-medium">9.000 AOA</span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderMaterialsStep = (service: any) => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{service.fields.subject}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="math">Matemática</SelectItem>
                    <SelectItem value="physics">Física</SelectItem>
                    <SelectItem value="chemistry">Química</SelectItem>
                    <SelectItem value="biology">Biologia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{service.fields.level}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">Ensino Médio</SelectItem>
                    <SelectItem value="university">Universitário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>{service.fields.studyGoal}</Label>
              <Textarea placeholder="Qual é o teu objetivo de estudo?" rows={3} />
            </div>
            <div>
              <Label>{service.fields.timeCommitment}</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Tempo disponível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5-10h">5-10 horas</SelectItem>
                  <SelectItem value="10-15h">10-15 horas</SelectItem>
                  <SelectItem value="15h+">Mais de 15 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-lg">{service.fields.planDuration}</Label>
              <div className="grid gap-3 mt-4">
                {Object.entries(service.plans).map(([key, label]) => (
                  <div key={key} className="p-4 border rounded-lg cursor-pointer hover:bg-accent">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{String(label)}</span>
                      <input type="radio" name="plan" value={key} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Resumo do Plano</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Área:</span>
                  <span>Matemática</span>
                </div>
                <div className="flex justify-between">
                  <span>Plano:</span>
                  <span>4 Semanas</span>
                </div>
                <div className="flex justify-between">
                  <span>Valor:</span>
                  <span className="font-medium">8.000 AOA</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const renderCareerStep = (service: any) => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{service.fields.currentStatus}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Status atual" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Estudante</SelectItem>
                    <SelectItem value="unemployed">Desempregado</SelectItem>
                    <SelectItem value="employed">Empregado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{service.fields.targetRole}</Label>
                <Input placeholder="Cargo que pretende" />
              </div>
            </div>
            <div>
              <Label>{service.fields.experience}</Label>
              <Textarea placeholder="Descreva a tua experiência..." rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{service.fields.hasCV}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Sim</SelectItem>
                    <SelectItem value="no">Não</SelectItem>
                    <SelectItem value="outdated">Desatualizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{service.fields.hasLinkedIn}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Sim</SelectItem>
                    <SelectItem value="no">Não</SelectItem>
                    <SelectItem value="basic">Perfil básico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-lg">Serviços Incluídos</Label>
              <div className="grid gap-3 mt-4">
                {Object.entries(service.services).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-3 p-3 border rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>{String(label)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <div>
              <Label>{service.fields.interviewDate}</Label>
              <Input type="datetime-local" />
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Resumo do Serviço</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Serviço:</span>
                  <span>Orientação Profissional Completa</span>
                </div>
                <div className="flex justify-between">
                  <span>Valor:</span>
                  <span className="font-medium">15.000 AOA</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const renderScholarshipsStep = (service: any) => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{service.fields.academicLevel}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Nível acadêmico" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="undergraduate">Licenciatura</SelectItem>
                    <SelectItem value="masters">Mestrado</SelectItem>
                    <SelectItem value="phd">Doutorado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{service.fields.fieldOfStudy}</Label>
                <Input placeholder="Ex: Engenharia, Medicina..." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{service.fields.gpa}</Label>
                <Input placeholder="Ex: 16.5" type="number" step="0.1" />
              </div>
              <div>
                <Label>{service.fields.country}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="País de interesse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portugal">Portugal</SelectItem>
                    <SelectItem value="brazil">Brasil</SelectItem>
                    <SelectItem value="usa">Estados Unidos</SelectItem>
                    <SelectItem value="canada">Canadá</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{service.fields.budgetRange}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Faixa de custo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Gratuitas</SelectItem>
                    <SelectItem value="partial">Parciais</SelectItem>
                    <SelectItem value="any">Qualquer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{service.fields.deadline}</Label>
                <Input type="date" />
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-lg">Serviços Incluídos</Label>
              <div className="grid gap-3 mt-4">
                {Object.entries(service.services).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-3 p-3 border rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>{String(label)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between">
                <span>Valor:</span>
                <span className="font-medium">12.000 AOA</span>
              </div>
            </div>
          </div>
        );
    }
  };

  const renderMentoringStep = (service: any) => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label>{service.fields.currentSituation}</Label>
              <Textarea placeholder="Descreva a tua situação atual..." rows={3} />
            </div>
            <div>
              <Label>{service.fields.mainGoals}</Label>
              <Textarea placeholder="Quais são os teus principais objetivos?" rows={3} />
            </div>
            <div>
              <Label>{service.fields.timeframe}</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Prazo para resultados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3months">3 meses</SelectItem>
                  <SelectItem value="6months">6 meses</SelectItem>
                  <SelectItem value="1year">1 ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-lg">{service.fields.meetingFrequency}</Label>
              <div className="grid gap-3 mt-4">
                {Object.entries(service.frequencies).map(([key, label]) => (
                  <div key={key} className="p-4 border rounded-lg cursor-pointer hover:bg-accent">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{String(label)}</span>
                      <input type="radio" name="frequency" value={key} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Resumo da Mentoria</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Frequência:</span>
                  <span>Quinzenal</span>
                </div>
                <div className="flex justify-between">
                  <span>Valor Mensal:</span>
                  <span className="font-medium">25.000 AOA</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  if (!selectedService) return null;

  const service = getCurrentService();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            {getServiceIcon(selectedService)}
          </div>
          {service.title}
        </CardTitle>
        <div className="flex items-center gap-4 mt-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === currentStep ? 'bg-primary text-primary-foreground' :
                step < currentStep ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
              </div>
              <span className="text-sm text-muted-foreground">
                {service.steps?.[step as keyof typeof service.steps] || `Step ${step}`}
              </span>
              {step < 3 && <div className="w-8 h-px bg-muted mx-2" />}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {renderStepContent()}

          <div className="flex justify-between pt-6">
            <Button 
              variant="outline" 
              onClick={handlePrevious} 
              disabled={currentStep === 1}
            >
              {t.common.previous}
            </Button>
            <Button onClick={handleNext}>
              {currentStep === 3 ? (service as any).confirm || t.common.finish : t.common.next}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceFlows;