import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CreditCard, Smartphone, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TeacherCheckoutFlowProps {
  language: string;
  service: any;
  onComplete: () => void;
  onBack: () => void;
}

const TeacherCheckoutFlow = ({ language, service, onComplete, onBack }: TeacherCheckoutFlowProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    agenda: '',
    paymentMethod: '',
    phoneNumber: '',
    objectives: '',
    experience: '',
    institution: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const t = {
    pt: {
      title: 'Finalizar Pedido',
      step1: 'Detalhes do Serviço',
      step2: 'Informações Adicionais',
      step3: 'Pagamento',
      step4: 'Confirmação',
      agenda: 'Data preferida',
      objectives: 'Objetivos específicos',
      experience: 'Experiência atual',
      institution: 'Instituição',
      paymentMethod: 'Método de pagamento',
      phoneNumber: 'Número de telefone',
      multicaixa: 'Multicaixa',
      mobileMoney: 'Mobile Money',
      basePrice: 'Preço base',
      total: 'Total',
      next: 'Continuar',
      back: 'Voltar',
      confirm: 'Confirmar Pedido',
      processing: 'Processando...',
      success: 'Pedido criado com sucesso!',
      downloadPdf: 'Descarregar PDF',
      orderSummary: 'Resumo do Pedido',
      serviceDetails: 'Detalhes do Serviço',
      paymentDetails: 'Detalhes do Pagamento'
    },
    en: {
      title: 'Complete Order',
      step1: 'Service Details',
      step2: 'Additional Information',
      step3: 'Payment',
      step4: 'Confirmation',
      agenda: 'Preferred date',
      objectives: 'Specific objectives',
      experience: 'Current experience',
      institution: 'Institution',
      paymentMethod: 'Payment method',
      phoneNumber: 'Phone number',
      multicaixa: 'Multicaixa',
      mobileMoney: 'Mobile Money',
      basePrice: 'Base price',
      total: 'Total',
      next: 'Continue',
      back: 'Back',
      confirm: 'Confirm Order',
      processing: 'Processing...',
      success: 'Order created successfully!',
      downloadPdf: 'Download PDF',
      orderSummary: 'Order Summary',
      serviceDetails: 'Service Details',
      paymentDetails: 'Payment Details'
    }
  }[language as 'pt' | 'en'];

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('teacher-services', {
        body: {
          service_slug: service.slug,
          agenda: formData.agenda,
          dados_formulario: {
            objectives: formData.objectives,
            experience: formData.experience,
            institution: formData.institution,
            paymentMethod: formData.paymentMethod,
            phoneNumber: formData.phoneNumber
          }
        }
      });

      if (error) throw error;
      
      toast({
        title: t.success,
        description: 'O seu pedido foi registado e será processado em breve.',
      });
      
      handleNext();
    } catch (error) {
      console.error('Error submitting teacher order:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao processar o pedido',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return formData.agenda !== '';
      case 2: return formData.objectives !== '' && formData.institution !== '';
      case 3: return formData.paymentMethod !== '' && (formData.paymentMethod === 'multicaixa' || formData.phoneNumber !== '');
      default: return true;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="agenda">{t.agenda}</Label>
              <Input
                id="agenda"
                type="datetime-local"
                value={formData.agenda}
                onChange={(e) => setFormData({...formData, agenda: e.target.value})}
              />
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">{service.nome}</h3>
              <p className="text-sm text-muted-foreground mb-3">{service.descricao}</p>
              <div className="flex gap-2 mb-2">
                {service.formatos?.map((format: string) => (
                  <Badge key={format} variant="secondary">{format}</Badge>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <span>SLA: {service.sla_horas}h</span>
                <span className="font-bold">{service.preco_base} AOA</span>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="objectives">{t.objectives}</Label>
              <Textarea
                id="objectives"
                placeholder="Descreva os seus objetivos específicos para este serviço..."
                value={formData.objectives}
                onChange={(e) => setFormData({...formData, objectives: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="experience">{t.experience}</Label>
              <Textarea
                id="experience"
                placeholder="Descreva a sua experiência atual na área..."
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="institution">{t.institution}</Label>
              <Input
                id="institution"
                placeholder="Nome da sua instituição de ensino"
                value={formData.institution}
                onChange={(e) => setFormData({...formData, institution: e.target.value})}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label>{t.paymentMethod}</Label>
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData({...formData, paymentMethod: value})}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="multicaixa" id="multicaixa" />
                  <Label htmlFor="multicaixa" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    {t.multicaixa}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mobile-money" id="mobile-money" />
                  <Label htmlFor="mobile-money" className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    {t.mobileMoney}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {formData.paymentMethod === 'mobile-money' && (
              <div>
                <Label htmlFor="phone">{t.phoneNumber}</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+244 9XX XXX XXX"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                />
              </div>
            )}

            <div className="border rounded-lg p-4 bg-muted/50">
              <h3 className="font-semibold mb-3">{t.orderSummary}</h3>
              <div className="flex justify-between mb-2">
                <span>{t.basePrice}:</span>
                <span>{service.preco_base} AOA</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>{t.total}:</span>
                <span>{service.preco_base} AOA</span>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="text-green-600">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                ✓
              </div>
              <h3 className="text-xl font-bold">{t.success}</h3>
            </div>
            
            <div className="border rounded-lg p-4 text-left">
              <h4 className="font-semibold mb-2">{t.serviceDetails}</h4>
              <p className="text-sm text-muted-foreground mb-1">Serviço: {service.nome}</p>
              <p className="text-sm text-muted-foreground mb-1">Data: {new Date(formData.agenda).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Instituição: {formData.institution}</p>
            </div>

            <div className="border rounded-lg p-4 text-left">
              <h4 className="font-semibold mb-2">{t.paymentDetails}</h4>
              <p className="text-sm text-muted-foreground mb-1">Método: {formData.paymentMethod === 'multicaixa' ? t.multicaixa : t.mobileMoney}</p>
              <p className="text-sm text-muted-foreground">Total: {service.preco_base} AOA</p>
            </div>

            <Button
              onClick={() => {
                // Simular download do PDF
                toast({
                  title: 'PDF gerado',
                  description: 'O documento foi gerado com sucesso.'
                });
              }}
              variant="outline"
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              {t.downloadPdf}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handlePrevious}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>{t.title}</CardTitle>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Passo {step} de 4
          </span>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full ${
                  s <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {renderStep()}
      </CardContent>
      
      {step < 4 && (
        <CardFooter className="flex gap-3">
          <Button
            variant="outline"
            onClick={handlePrevious}
          >
            {t.back}
          </Button>
          
          {step < 3 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {t.next}
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || loading}
            >
              {loading ? t.processing : t.confirm}
            </Button>
          )}
        </CardFooter>
      )}
      
      {step === 4 && (
        <CardFooter>
          <Button onClick={onComplete} className="w-full">
            Concluir
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default TeacherCheckoutFlow;