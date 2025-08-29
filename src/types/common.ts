// Common types and interfaces used across the application

export interface BaseProps {
  language: 'pt' | 'en';
  className?: string;
}

export interface LoadingState {
  loading: boolean;
  error?: string | null;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface FilterState {
  search?: string;
  category?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

export interface ToastMessage {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}

// Service interfaces
export interface Service {
  id: string;
  slug: string;
  nome: string;
  descricao?: string;
  preco_base: number;
  sla_horas: number;
  formatos?: string[];
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface ProService extends Service {
  // Professional-specific service properties
}

export interface TeacherService extends Service {
  // Teacher-specific service properties
}

// Booking interfaces
export interface BaseBooking {
  id: string;
  agenda: string;
  valor: number;
  dados_formulario?: any;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface StudentBooking extends BaseBooking {
  service_id: string;
  estudante_id: string;
}

export interface ProBooking extends BaseBooking {
  service_id: string;
  user_id: string;
}

// Dashboard interfaces
export interface DashboardStats {
  total_bookings: number;
  pending_bookings: number;
  completed_bookings: number;
  total_spent: number;
  total_earned: number;
  courses_completed: number;
  courses_enrolled: number;
  reviews_received: number;
  average_rating: number;
}

// Form interfaces
export interface CheckoutFormData {
  payment_method: 'multicaixa' | 'paypal';
  phone?: string;
  email?: string;
  name: string;
  additional_notes?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  user_type?: 'student' | 'teacher' | 'professional';
}

// Utility types
export type Status = 'pending' | 'active' | 'completed' | 'cancelled' | 'archived';
export type UserType = 'student' | 'teacher' | 'professional' | 'admin';
export type PaymentMethod = 'multicaixa' | 'paypal' | 'bank_transfer';
export type ServiceType = 'online' | 'presential' | 'hybrid';