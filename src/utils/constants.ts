// Application constants

export const LANGUAGES = {
  PT: 'pt' as const,
  EN: 'en' as const,
} as const;

export const USER_TYPES = {
  STUDENT: 'student' as const,
  TEACHER: 'teacher' as const,
  PROFESSIONAL: 'professional' as const,
  ADMIN: 'admin' as const,
} as const;

export const BOOKING_STATUS = {
  PENDING: 'pending' as const,
  CONFIRMED: 'confirmed' as const,
  COMPLETED: 'completed' as const,
  CANCELLED: 'cancelled' as const,
} as const;

export const PAYMENT_METHODS = {
  MULTICAIXA: 'multicaixa' as const,
  PAYPAL: 'paypal' as const,
  BANK_TRANSFER: 'bank_transfer' as const,
} as const;

export const SERVICE_TYPES = {
  ONLINE: 'online' as const,
  PRESENTIAL: 'presential' as const,
  HYBRID: 'hybrid' as const,
} as const;

export const DEFAULT_PAGINATION = {
  PAGE_SIZE: 10,
  INITIAL_PAGE: 1,
} as const;

export const ROUTES = {
  HOME: '/',
  STUDENTS: '/students',
  TEACHERS: '/teachers',
  PROFESSIONALS: '/professionals',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SECURITY_SETTINGS: '/security-settings',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
} as const;

export const API_ENDPOINTS = {
  SERVICES: 'services',
  PRO_SERVICES: 'pro_services',
  TEACHER_SERVICES: 'teacher_services',
  BOOKINGS: 'bookings',
  PRO_BOOKINGS: 'pro_bookings',
  PROFILES: 'profiles',
  NOTIFICATIONS: 'notifications',
} as const;

export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  LANGUAGE: 'language',
  THEME: 'theme',
} as const;

export const TOAST_DURATION = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 8000,
} as const;

export const VALIDATION_RULES = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_NAME_LENGTH: 100,
  MAX_MESSAGE_LENGTH: 1000,
} as const;