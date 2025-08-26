import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// API integration hooks and utilities for the student platform

export const useServices = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('services');
      if (error) throw error;
      setServices(data.services || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  return { services, loading, fetchServices };
};

export const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createBooking = async (bookingData: {
    service_id: string;
    agenda: string;
    dados_formulario: any;
  }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('pedido', {
        body: bookingData
      });
      
      if (error) throw error;
      
      toast({
        title: 'Pedido criado com sucesso!',
        description: `Serviço: ${data.service} | Valor: ${data.valor} AOA`
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: 'Erro ao criar pedido',
        description: error.message,
        variant: 'destructive'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { createBooking, loading };
};

export const useCheckout = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const processPayment = async (paymentData: {
    booking_id: string;
    payment_method: string;
    phone_number?: string;
  }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('checkout', {
        body: paymentData
      });
      
      if (error) throw error;
      
      toast({
        title: 'Pagamento processado!',
        description: `Referência: ${data.payment_reference}`
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: 'Erro no pagamento',
        description: error.message,
        variant: 'destructive'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { processPayment, loading };
};

export const useScholarships = () => {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<any>({});

  const fetchScholarships = async (filters: {
    grau?: string;
    pais?: string;
    limit?: number;
    offset?: number;
  } = {}) => {
    setLoading(true);
    try {
      const searchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) searchParams.append(key, value.toString());
      });

      const { data, error } = await supabase.functions.invoke('scholarships', {
        body: null,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (error) throw error;
      
      setScholarships(data.scholarships || []);
      setPagination(data.pagination || {});
    } catch (error) {
      console.error('Error fetching scholarships:', error);
    } finally {
      setLoading(false);
    }
  };

  return { scholarships, loading, pagination, fetchScholarships };
};

export const usePDF = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generatePDF = async (bookingId: string) => {
    setLoading(true);
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
      
      toast({
        title: 'PDF gerado com sucesso!',
        description: 'O arquivo foi baixado automaticamente.'
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao gerar PDF',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return { generatePDF, loading };
};

// Real-time updates for bookings
export const useBookingUpdates = (studentId: string, onUpdate: (booking: any) => void) => {
  const { toast } = useToast();

  const channel = supabase
    .channel('booking-updates')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'bookings',
        filter: `estudante_id=eq.${studentId}`
      },
      (payload) => {
        console.log('Booking updated:', payload);
        onUpdate(payload.new);
        
        // Show notification for status changes
        if (payload.old.status !== payload.new.status) {
          toast({
            title: 'Status do pedido atualizado',
            description: `Novo status: ${payload.new.status}`
          });
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};