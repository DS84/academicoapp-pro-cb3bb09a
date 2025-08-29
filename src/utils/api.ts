import { useState } from 'react';
import { toast } from 'sonner';
import { handleApiError } from '@/utils/errorHandling';
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse } from '@/types/common';

// Enhanced API utility functions with proper error handling

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeQuery = async <T>(
    operation: () => Promise<any>,
    context: string
  ): Promise<ApiResponse<T>> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: queryError } = await operation();
      
      if (queryError) {
        throw queryError;
      }
      
      return { data, error: null, loading: false };
    } catch (err) {
      const errorMessage = handleApiError(err, context);
      setError(errorMessage);
      return { data: null, error: new Error(errorMessage), loading: false };
    } finally {
      setLoading(false);
    }
  };

  return { executeQuery, loading, error };
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
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('pro_services')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
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

  getByUserId: async (profileId: string) => {
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
  },

  getByUserId: async (profileId: string) => {
    const { data, error } = await supabase
      .from('pro_bookings')
      .select('*, pro_services(nome)')
      .eq('user_id', profileId)
      .order('created_at', { ascending: false });
    
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
  },

  update: async (userId: string, updates: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }
};

// Mentorship sessions API functions
export const mentorshipSessionsApi = {
  getByStudentId: async (studentId: string) => {
    const { data, error } = await supabase
      .from('mentorship_sessions')
      .select('*')
      .eq('student_id', studentId)
      .gte('session_date', new Date().toISOString())
      .order('session_date', { ascending: true });
    
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