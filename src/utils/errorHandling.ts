import { toast } from 'sonner';
import { ToastMessage } from '@/types/common';

// Standardized error handling utilities

export const handleError = (error: unknown, context?: string): string => {
  const errorMessage = error instanceof Error ? error.message : 'Erro inesperado';
  
  if (context) {
    console.error(`Error in ${context}:`, errorMessage);
  } else {
    console.error('Error:', errorMessage);
  }
  
  return errorMessage;
};

export const showErrorToast = (error: unknown, context?: string) => {
  const errorMessage = handleError(error, context);
  toast.error(errorMessage);
};

export const showSuccessToast = (message: string) => {
  toast.success(message);
};

export const showInfoToast = (message: string) => {
  toast.info(message);
};

export const createToastMessage = (
  title: string,
  description?: string,
  variant: 'default' | 'destructive' | 'success' = 'default'
): ToastMessage => ({
  title,
  description,
  variant
});

export const handleApiError = (error: unknown, operation: string) => {
  const message = error instanceof Error ? error.message : `Erro ao ${operation}`;
  console.error(`API Error - ${operation}:`, error);
  return message;
};

export const handleNetworkError = (error: unknown) => {
  const isNetworkError = error instanceof Error && 
    (error.message.includes('network') || error.message.includes('fetch'));
  
  if (isNetworkError) {
    return 'Erro de conexão. Verifique sua internet e tente novamente.';
  }
  
  return handleError(error);
};

export const validateRequired = (value: any, fieldName: string): string | null => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} é obrigatório`;
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Email inválido';
  }
  return null;
};

export const validatePhone = (phone: string): string | null => {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  if (!phoneRegex.test(phone)) {
    return 'Número de telefone inválido';
  }
  return null;
};