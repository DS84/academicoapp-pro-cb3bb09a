-- Create audit log table for security monitoring
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only allow viewing audit logs for admin users (adjust as needed)
CREATE POLICY "Admin users can view audit logs"
ON public.audit_logs
FOR SELECT
USING (false); -- Disable for now, can be enabled with proper admin role system

-- Create function to log profile changes
CREATE OR REPLACE FUNCTION public.log_profile_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Log UPDATE operations
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (
      user_id,
      action,
      table_name,
      record_id,
      old_values,
      new_values
    ) VALUES (
      auth.uid(),
      'UPDATE',
      TG_TABLE_NAME,
      NEW.id,
      to_jsonb(OLD),
      to_jsonb(NEW)
    );
    RETURN NEW;
  END IF;
  
  -- Log DELETE operations
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (
      user_id,
      action,
      table_name,
      record_id,
      old_values
    ) VALUES (
      auth.uid(),
      'DELETE',
      TG_TABLE_NAME,
      OLD.id,
      to_jsonb(OLD)
    );
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for audit logging on sensitive tables
CREATE TRIGGER audit_profiles_changes
  AFTER UPDATE OR DELETE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_profile_changes();

-- Create rate limiting table for authentication attempts
CREATE TABLE public.auth_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address INET NOT NULL,
  email TEXT,
  attempts INTEGER NOT NULL DEFAULT 1,
  last_attempt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  blocked_until TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on rate limits
ALTER TABLE public.auth_rate_limits ENABLE ROW LEVEL SECURITY;

-- Policy to allow reading own rate limit status
CREATE POLICY "Users can view their own rate limits"
ON public.auth_rate_limits
FOR SELECT
USING (true); -- Can be restricted further based on IP or email

-- Create index for performance on rate limiting
CREATE INDEX idx_auth_rate_limits_ip ON public.auth_rate_limits(ip_address);
CREATE INDEX idx_auth_rate_limits_email ON public.auth_rate_limits(email);