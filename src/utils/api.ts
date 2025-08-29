import { handleError, showErrorToast, handleApiError } from '@/utils/errorHandling';
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse } from '@/types/common';

// Standardized API utilities with proper error handling

export const createApiHandler = <T>(
  operation: string
) => {
  return async (apiCall: () => Promise<{ data: T | null; error: any }>): Promise<ApiResponse<T>> => {
    try {
      const { data, error } = await apiCall();
      
      if (error) {
        const errorMessage = handleApiError(error, operation);
        return { data: null, error: new Error(errorMessage), loading: false };
      }
      
      return { data, error: null, loading: false };
    } catch (error) {
      const errorMessage = handleApiError(error, operation);
      return { data: null, error: new Error(errorMessage), loading: false };
    }
  };
};

// Standardized CRUD operations with error handling
export const apiUtils = {
  // Generic select with error handling
  select: async <T>(
    table: string,
    query?: string,
    filters?: Record<string, any>
  ): Promise<ApiResponse<T[]>> => {
    const handler = createApiHandler<T[]>(`buscar dados de ${table}`);
    
    return handler(async () => {
      let queryBuilder = supabase.from(table).select(query || '*');
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryBuilder = queryBuilder.eq(key, value);
          }
        });
      }
      
      return await queryBuilder;
    });
  },

  // Generic insert with error handling
  insert: async <T>(
    table: string,
    data: Partial<T> | Partial<T>[]
  ): Promise<ApiResponse<T>> => {
    const handler = createApiHandler<T>(`inserir dados em ${table}`);
    
    return handler(async () => {
      return await supabase.from(table).insert(data).select().single();
    });
  },

  // Generic update with error handling
  update: async <T>(
    table: string,
    id: string,
    updates: Partial<T>
  ): Promise<ApiResponse<T>> => {
    const handler = createApiHandler<T>(`atualizar dados em ${table}`);
    
    return handler(async () => {
      return await supabase.from(table).update(updates).eq('id', id).select().single();
    });
  },

  // Generic delete with error handling
  delete: async (
    table: string,
    id: string
  ): Promise<ApiResponse<void>> => {
    const handler = createApiHandler<void>(`deletar dados de ${table}`);
    
    return handler(async () => {
      const { error } = await supabase.from(table).delete().eq('id', id);
      return { data: null, error };
    });
  },

  // Get single record with error handling
  getById: async <T>(
    table: string,
    id: string,
    query?: string
  ): Promise<ApiResponse<T>> => {
    const handler = createApiHandler<T>(`buscar registro por ID em ${table}`);
    
    return handler(async () => {
      return await supabase
        .from(table)
        .select(query || '*')
        .eq('id', id)
        .maybeSingle();
    });
  },

  // Get records by user with error handling  
  getByUserId: async <T>(
    table: string,
    userId: string,
    userIdColumn: string = 'user_id',
    query?: string
  ): Promise<ApiResponse<T[]>> => {
    const handler = createApiHandler<T[]>(`buscar dados do usuário em ${table}`);
    
    return handler(async () => {
      return await supabase
        .from(table)
        .select(query || '*')
        .eq(userIdColumn, userId)
        .order('created_at', { ascending: false });
    });
  },

  // Storage operations with error handling
  storage: {
    upload: async (
      bucket: string,
      path: string,
      file: File
    ): Promise<ApiResponse<{ path: string }>> => {
      const handler = createApiHandler<{ path: string }>(`fazer upload para ${bucket}`);
      
      return handler(async () => {
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(path, file, { upsert: true });
        
        return { data, error };
      });
    },

    getPublicUrl: (bucket: string, path: string): string => {
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      return data.publicUrl;
    },

    delete: async (
      bucket: string,
      paths: string[]
    ): Promise<ApiResponse<void>> => {
      const handler = createApiHandler<void>(`deletar arquivos de ${bucket}`);
      
      return handler(async () => {
        const { error } = await supabase.storage.from(bucket).remove(paths);
        return { data: null, error };
      });
    }
  }
};

// Specific API functions for commonly used operations
export const profileApi = {
  getCurrentProfile: async (userId: string) => {
    return apiUtils.select('profiles', '*', { user_id: userId });
  },

  updateProfile: async (userId: string, updates: any) => {
    const handler = createApiHandler('atualizar perfil');
    return handler(async () => {
      return await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();
    });
  }
};

export const bookingsApi = {
  getUserBookings: async (profileId: string) => {
    return apiUtils.getByUserId('bookings', profileId, 'estudante_id', '*, services(nome)');
  },

  createBooking: async (bookingData: any) => {
    return apiUtils.insert('bookings', bookingData);
  }
};

export const servicesApi = {
  getAllServices: async () => {
    return apiUtils.select('services', '*');
  },

  getProServices: async () => {
    return apiUtils.select('pro_services', '*');
  },

  getTeacherServices: async () => {
    return apiUtils.select('teacher_services', '*');
  }
};