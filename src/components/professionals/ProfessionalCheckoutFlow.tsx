import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar, DollarSign, FileText, CreditCard, Smartphone, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ProService {
  id: string;
  slug: string;
  nome: string;
  descricao: string | null;
  preco_base: number;
  sla_horas: number;
  formatos: string[];
  tags: string[];
}

interface ProfessionalCheckoutFlowProps {
  service: ProService;
  onSuccess: () => void;
  onBack: () => void;
  language: string;
}

const ProfessionalCheckoutFlow = ({ service, onSuccess, onBack, language }: ProfessionalCheckoutFlowProps) => {
  const [formData, setFormData] = useState({
    formato_escolhido: '',
    data_preferida: '',
    observacoes: '',
    metodo_pagamento: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const t = {
    pt: {
      title: 'Finalizar Pedido',
      subtitle: 'Revise os detalhes e escolha a forma de pagamento',
      service: 'Serviço',
      format: 'Formato preferido',
      formatPlaceholder: 'Selecione o formato',
      preferredDate: 'Data preferida',
      notes: 'Observações (opcional)',
      notesPlaceholder: 'Requisitos específicos, preferências...',
      paymentMethod: 'Método de pagamento',
      multicaixa: 'Multicaixa Express',
      mobileMoney: 'Mobile Money',
      summary: 'Resumo do Pedido',
      basePrice: 'Preço base',
      total: 'Total',
      back: 'Voltar',
      confirm: 'Confirmar Pedido',
      success: 'Pedido confirmado com sucesso!',
      error: 'Erro ao processar pedido',
      loginRequired: 'Faça login para continuar'
    },
    en: {
      title: 'Complete Order',
      subtitle: 'Review details and choose payment method',
      service: 'Service',
      format: 'Preferred format',
      formatPlaceholder: 'Select format',
      preferredDate: 'Preferred date',
      notes: 'Notes (optional)',
      notesPlaceholder: 'Specific requirements, preferences...',
      paymentMethod: 'Payment method',
      multicaixa: 'Multicaixa Express',
      mobileMoney: 'Mobile Money',
      summary: 'Order Summary',
      basePrice: 'Base price',
      total: 'Total',
      back: 'Back',
      confirm: 'Confirm Order',
      success: 'Order confirmed successfully!',
      error: 'Error processing order',
      loginRequired: 'Please log in to continue'
    }
  }[language as 'pt' | 'en'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: t.loginRequired,
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    
    try {
      // Get user profile with error handling
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) {
        throw new Error('Erro ao obter perfil: ' + profileError.message);
      }

      if (!profile) {
        throw new Error('Perfil não encontrado. Complete o seu perfil primeiro.');
      }

      // Create booking
      const bookingData = {
        service_id: service.id,
        user_id: profile.id,
        agenda: formData.data_preferida ? new Date(formData.data_preferida).toISOString() : new Date().toISOString(),
        valor: service.preco_base,
        dados_formulario: {
          formato_escolhido: formData.formato_escolhido,
          observacoes: formData.observacoes,
          metodo_pagamento: formData.metodo_pagamento
        },
        status: 'pending'
      };

      const { error } = await supabase
        .from('pro_bookings')
        .insert([bookingData]);

      if (error) throw error;

      toast({
        title: t.success,
        description: `${t.service}: ${service.nome}`
      });

      onSuccess();
    } catch (error) {
      console.error('Error creating professional booking:', error);
      toast({
        title: t.error,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const isValid = formData.formato_escolhido && formData.data_preferida && formData.metodo_pagamento;

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t.title}
          </CardTitle>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="format">{t.format} *</Label>
              <Select 
                value={formData.formato_escolhido} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, formato_escolhido: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.formatPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {service.formatos.map((formato) => (
                    <SelectItem key={formato} value={formato}>{formato}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t.preferredDate} *
              </Label>
              <Input
                id="date"
                type="datetime-local"
                value={formData.data_preferida}
                onChange={(e) => setFormData(prev => ({ ...prev, data_preferida: e.target.value }))}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t.notes}</Label>
              <Textarea
                id="notes"
                placeholder={t.notesPlaceholder}
                value={formData.observacoes}
                onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                {t.paymentMethod} *
              </Label>
              <RadioGroup
                value={formData.metodo_pagamento}
                onValueChange={(value) => setFormData(prev => ({ ...prev, metodo_pagamento: value }))}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="multicaixa" id="multicaixa" />
                  <Label htmlFor="multicaixa" className="cursor-pointer flex-1 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    {t.multicaixa}
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="mobile-money" id="mobile-money" />
                  <Label htmlFor="mobile-money" className="cursor-pointer flex-1 flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    {t.mobileMoney}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                {t.back}
              </Button>
              <Button 
                type="submit" 
                disabled={!isValid || loading}
                className="flex-1"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {loading ? 'Processando...' : t.confirm}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {t.summary}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">{t.service}</h3>
            <p className="text-lg font-semibold">{service.nome}</p>
            {service.descricao && (
              <p className="text-sm text-muted-foreground mt-1">{service.descricao}</p>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{t.basePrice}</span>
              <span className="font-medium">
                {new Intl.NumberFormat('pt-AO', {
                  style: 'currency',
                  currency: 'AOA'
                }).format(Number(service.preco_base))}
              </span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between text-lg font-bold">
            <span>{t.total}</span>
            <span>
              {new Intl.NumberFormat('pt-AO', {
                style: 'currency',
                currency: 'AOA'
              }).format(Number(service.preco_base))}
            </span>
          </div>

          {service.tags.length > 0 && (
            <div className="pt-4">
              <div className="flex flex-wrap gap-1">
                {service.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalCheckoutFlow;