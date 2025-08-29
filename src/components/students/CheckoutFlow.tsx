import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Clock, CreditCard, Smartphone, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CheckoutFlowProps {
  language: string;
  bookingData: {
    service_id: string;
    service_name: string;
    valor: number;
    agenda: string;
    dados_formulario: any;
  };
  onComplete: () => void;
}

const CheckoutFlow = ({ language, bookingData, onComplete }: CheckoutFlowProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [bookingId, setBookingId] = useState<string>('');
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [paymentReference, setPaymentReference] = useState<string>('');
  
  const [bookingLoading, setBookingLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const { user, session } = useAuth();

  const t = {
    pt: {
      title: 'Finalizar Pedido',
      steps: {
        1: 'Confirmação',
        2: 'Pagamento',
        3: 'Concluído'
      },
      confirmation: {
        title: 'Confirmar Detalhes',
        service: 'Serviço',
        schedule: 'Agendamento',
        total: 'Total',
        sla: 'SLA',
        nextSteps: 'Próximos Passos'
      },
      payment: {
        title: 'Método de Pagamento',
        multicaixa: 'Multicaixa Express',
        mobileMoney: 'Mobile Money',
        phoneLabel: 'Número de Telefone',
        phonePlaceholder: 'Ex: 923456789',
        processing: 'A processar pagamento...',
        process: 'Processar Pagamento'
      },
      success: {
        title: 'Pagamento Confirmado!',
        reference: 'Referência',
        status: 'Status',
        nextSteps: 'Próximos Passos',
        downloadPdf: 'Baixar Comprovativo PDF',
        backToDashboard: 'Voltar ao Dashboard'
      },
      nextStepsList: [
        'Receberás um email de confirmação em breve',
        'Um responsável entrará em contacto contigo nas próximas 2 horas',
        'Podes acompanhar o progresso no teu dashboard'
      ]
    },
    en: {
      title: 'Complete Order',
      steps: {
        1: 'Confirmation',
        2: 'Payment',
        3: 'Completed'
      },
      confirmation: {
        title: 'Confirm Details',
        service: 'Service',
        schedule: 'Schedule',
        total: 'Total',
        sla: 'SLA',
        nextSteps: 'Next Steps'
      },
      payment: {
        title: 'Payment Method',
        multicaixa: 'Multicaixa Express',
        mobileMoney: 'Mobile Money',
        phoneLabel: 'Phone Number',
        phonePlaceholder: 'Ex: 923456789',
        processing: 'Processing payment...',
        process: 'Process Payment'
      },
      success: {
        title: 'Payment Confirmed!',
        reference: 'Reference',
        status: 'Status',
        nextSteps: 'Next Steps',
        downloadPdf: 'Download PDF Receipt',
        backToDashboard: 'Back to Dashboard'
      },
      nextStepsList: [
        'You will receive a confirmation email shortly',
        'A representative will contact you within the next 2 hours',
        'You can track progress in your dashboard'
      ]
    }
  }[language as 'pt' | 'en'];

  // Step 1: Create booking with proper profile validation
  const handleCreateBooking = async () => {
    setBookingLoading(true);
    try {
      // Get user profile first
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', session?.user?.id)
        .maybeSingle();

      if (profileError) {
        throw new Error('Erro ao obter perfil: ' + profileError.message);
      }

      if (!userProfile) {
        throw new Error('Perfil não encontrado. Complete o seu perfil primeiro.');
      }

      // Create booking using edge function
      const { data, error } = await supabase.functions.invoke('pedido', {
        body: {
          service_id: bookingData.service_id,
          estudante_id: userProfile.id,
          agenda: bookingData.agenda,
          dados_formulario: bookingData.dados_formulario
        }
      });
      
      if (error) throw error;
      
      setBookingId(data.booking_id);
      setCheckoutStep(2);
      
      toast.success(`Pedido criado! Serviço: ${data.service} | Valor: ${data.valor} AOA`);
    } catch (error: any) {
      console.error('Booking creation failed:', error);
      toast.error(error.message || 'Erro ao criar pedido');
    } finally {
      setBookingLoading(false);
    }
  };

  // Step 2: Process payment
  const handlePayment = async () => {
    if (!paymentMethod || !phoneNumber) {
      toast.error('Por favor, preenche todos os campos de pagamento.');
      return;
    }

    setPaymentLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('checkout', {
        body: {
          booking_id: bookingId,
          payment_method: paymentMethod,
          phone_number: phoneNumber
        }
      });
      
      if (error) throw error;
      
      setPaymentReference(data.payment_reference);
      setCheckoutStep(3);
      
      toast.success(`Pagamento processado! Referência: ${data.payment_reference}`);
    } catch (error: any) {
      console.error('Payment processing failed:', error);
      toast.error(error.message || 'Erro no pagamento');
    } finally {
      setPaymentLoading(false);
    }
  };

  // Auto-create booking on mount
  useEffect(() => {
    if (bookingData.service_id && checkoutStep === 1) {
      handleCreateBooking();
    }
  }, [bookingData.service_id]);

  const handleDownloadPDF = async () => {
    if (!bookingId) return;
    
    setPdfLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(`pedido-pdf/${bookingId}`);
      
      if (error) throw error;
      
      // Create download link
      const blob = new Blob([data], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pedido-${bookingId}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF gerado com sucesso! O arquivo foi baixado automaticamente.');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao gerar PDF');
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-primary" />
          {t.title}
        </CardTitle>
        
        {/* Progress Steps */}
        <div className="flex items-center gap-4 mt-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === checkoutStep ? 'bg-primary text-primary-foreground' :
                step < checkoutStep ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {step < checkoutStep ? <CheckCircle className="h-4 w-4" /> : step}
              </div>
              <span className="text-sm text-muted-foreground">
                {t.steps[step as keyof typeof t.steps]}
              </span>
              {step < 3 && <div className="w-8 h-px bg-muted mx-2" />}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {/* Step 1: Confirmation */}
        {checkoutStep === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">A criar o teu pedido...</p>
            </div>
          </div>
        )}

        {/* Step 2: Payment */}
        {checkoutStep === 2 && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-3">{t.confirmation.title}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{t.confirmation.service}:</span>
                  <span className="font-medium">{bookingData.service_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.confirmation.schedule}:</span>
                  <span>{new Date(bookingData.agenda).toLocaleString('pt-PT')}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>{t.confirmation.total}:</span>
                  <span>{bookingData.valor.toLocaleString('pt-PT')} AOA</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <h3 className="font-medium">{t.payment.title}</h3>
              
              <div className="grid gap-3">
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === 'multicaixa' ? 'border-primary bg-primary/5' : 'hover:bg-accent'
                  }`}
                  onClick={() => setPaymentMethod('multicaixa')}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5" />
                    <span className="font-medium">{t.payment.multicaixa}</span>
                    <input 
                      type="radio" 
                      checked={paymentMethod === 'multicaixa'} 
                      onChange={() => setPaymentMethod('multicaixa')}
                      className="ml-auto"
                    />
                  </div>
                </div>
                
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === 'mobile_money' ? 'border-primary bg-primary/5' : 'hover:bg-accent'
                  }`}
                  onClick={() => setPaymentMethod('mobile_money')}
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5" />
                    <span className="font-medium">{t.payment.mobileMoney}</span>
                    <input 
                      type="radio" 
                      checked={paymentMethod === 'mobile_money'} 
                      onChange={() => setPaymentMethod('mobile_money')}
                      className="ml-auto"
                    />
                  </div>
                </div>
              </div>

              {paymentMethod && (
                <div className="space-y-3">
                  <Label htmlFor="phone">{t.payment.phoneLabel}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={t.payment.phonePlaceholder}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              )}
            </div>

            <Button 
              onClick={handlePayment} 
              disabled={paymentLoading || !paymentMethod || !phoneNumber}
              className="w-full"
              size="lg"
            >
              {paymentLoading ? t.payment.processing : t.payment.process}
            </Button>
          </div>
        )}

        {/* Step 3: Success */}
        {checkoutStep === 3 && (
          <div className="space-y-6 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-600">{t.success.title}</h3>
            </div>

            <div className="p-4 bg-green-50 rounded-lg text-left">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{t.success.reference}:</span>
                  <Badge variant="outline">{paymentReference}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{t.success.status}:</span>
                  <Badge className="bg-green-500">{language === 'pt' ? 'Confirmado' : 'Confirmed'}</Badge>
                </div>
              </div>
            </div>

            <div className="text-left">
              <h4 className="font-medium mb-3">{t.success.nextSteps}:</h4>
              <ul className="space-y-2">
                {t.nextStepsList.map((step, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleDownloadPDF}
                disabled={pdfLoading}
                variant="outline"
                className="flex-1"
              >
                <FileText className="h-4 w-4 mr-2" />
                {t.success.downloadPdf}
              </Button>
              <Button 
                onClick={onComplete}
                className="flex-1"
              >
                {t.success.backToDashboard}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CheckoutFlow;