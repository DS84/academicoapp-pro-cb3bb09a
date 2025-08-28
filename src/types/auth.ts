import { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  user_type: 'student' | 'teacher' | 'professional';
  institution?: string;
  field_of_study?: string;
  year_of_study?: number;
  bio?: string;
  avatar_url?: string;
  linkedin_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'student' | 'teacher' | 'professional' | 'admin';
  assigned_at: string;
  assigned_by?: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  userRole: string | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  full_name?: string;
  user_type?: 'student' | 'teacher' | 'professional';
  phone?: string;
  institution?: string;
  field_of_study?: string;
  year_of_study?: number;
}