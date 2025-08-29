import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Enhanced API utility functions with proper error handling

export const handleApiError = (error: unknown, context?: string): string => {
  const errorMessage = error instanceof Error ? error.message : 'Erro inesperado';
  
  if (context) {
    console.error(`Error in ${context}:`, errorMessage);
  }
  
  return errorMessage;
};

// Services API functions
export const servicesApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }
};

// Professional services API functions
export const proServicesApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('pro_services')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

// Teacher services API functions  
export const teacherServicesApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('teacher_services')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

// Bookings API functions
export const bookingsApi = {
  create: async (bookingData: any) => {
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  getByProfileId: async (profileId: string) => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, services(nome)')
      .eq('estudante_id', profileId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

// Professional bookings API functions
export const proBookingsApi = {
  create: async (bookingData: any) => {
    const { data, error } = await supabase
      .from('pro_bookings')
      .insert([bookingData])
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }
};

// Profiles API functions
export const profilesApi = {
  getByUserId: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }
};

// Support tickets API functions
export const supportTicketsApi = {
  getByProfessorId: async (professorId: string) => {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('professor_id', professorId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};