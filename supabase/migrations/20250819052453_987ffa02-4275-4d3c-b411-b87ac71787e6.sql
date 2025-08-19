-- Fix function search path issue for security
ALTER FUNCTION public.log_profile_changes() SET search_path = public, auth;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;