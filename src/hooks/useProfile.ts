import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';
import { toast } from 'sonner';

export const useProfile = (userId?: string) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (id?: string) => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      setProfile(data as UserProfile);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar perfil';
      setError(errorMessage);
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!userId) {
      throw new Error('User ID is required to update profile');
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .maybeSingle();

      if (error) {
        throw error;
      }

      setProfile(data as UserProfile);
      toast.success('Perfil atualizado com sucesso!');
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar perfil';
      toast.error(errorMessage);
      return { data: null, error: new Error(errorMessage) };
    }
  };

  const getUserRole = async (id?: string) => {
    if (!id) return null;

    try {
      // First try to get from user_roles table if it exists
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', id)
        .order('assigned_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (roleData?.role) {
        return roleData.role;
      }

      // Fallback to profile user_type if user_roles doesn't exist or is empty
      if (profile?.user_type) {
        return profile.user_type;
      }

      return 'student'; // Default fallback
    } catch (err) {
      console.error('Error fetching user role:', err);
      // Return profile user_type as fallback
      return profile?.user_type || 'student';
    }
  };

  useEffect(() => {
    fetchProfile(userId);
  }, [userId]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    getUserRole,
    refreshProfile: () => fetchProfile(userId)
  };
};