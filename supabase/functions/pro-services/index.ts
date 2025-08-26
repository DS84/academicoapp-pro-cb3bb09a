import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    if (req.method === 'GET') {
      console.log('Fetching professional services');
      
      const { data: services, error } = await supabase
        .from('pro_services')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching services:', error);
        throw error;
      }

      console.log(`Found ${services?.length || 0} professional services`);
      
      return new Response(
        JSON.stringify({ services: services || [] }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    if (req.method === 'POST') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        throw new Error('No authorization header');
      }

      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      
      if (userError || !user) {
        throw new Error('Invalid token');
      }

      const requestBody = await req.json();
      console.log('Creating professional booking:', requestBody);

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileError || !profile) {
        throw new Error('Profile not found');
      }

      // Get service details
      const { data: service, error: serviceError } = await supabase
        .from('pro_services')
        .select('*')
        .eq('id', requestBody.service_id)
        .single();

      if (serviceError || !service) {
        throw new Error('Service not found');
      }

      // Create booking
      const bookingData = {
        service_id: service.id,
        user_id: profile.id,
        agenda: requestBody.agenda,
        valor: service.preco_base,
        dados_formulario: requestBody.dados_formulario,
        status: 'pending'
      };

      const { data: booking, error: bookingError } = await supabase
        .from('pro_bookings')
        .insert([bookingData])
        .select()
        .single();

      if (bookingError) {
        console.error('Error creating booking:', bookingError);
        throw bookingError;
      }

      console.log('Professional booking created:', booking.id);

      return new Response(
        JSON.stringify({ 
          success: true, 
          booking_id: booking.id,
          message: 'Professional booking created successfully'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405 
      }
    );

  } catch (error) {
    console.error('Error in pro-services function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});