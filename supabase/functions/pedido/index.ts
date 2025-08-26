import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    if (req.method === "POST") {
      // Get authenticated user
      const authHeader = req.headers.get("Authorization")!;
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      const user = data.user;

      if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        });
      }

      // Get user profile
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        return new Response(JSON.stringify({ error: "Profile not found" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        });
      }

      const requestBody = await req.json();
      const { service_id, agenda, dados_formulario } = requestBody;

      // Get service details
      const { data: service, error: serviceError } = await supabaseClient
        .from('services')
        .select('*')
        .eq('id', service_id)
        .single();

      if (serviceError || !service) {
        return new Response(JSON.stringify({ error: "Service not found" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        });
      }

      // Create booking
      const { data: booking, error: bookingError } = await supabaseClient
        .from('bookings')
        .insert({
          service_id: service_id,
          estudante_id: profile.id,
          agenda: agenda,
          valor: service.preco_base,
          dados_formulario: dados_formulario,
          status: 'pending'
        })
        .select()
        .single();

      if (bookingError) {
        console.error('Error creating booking:', bookingError);
        return new Response(JSON.stringify({ error: bookingError.message }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }

      console.log('Booking created:', booking.id);

      return new Response(JSON.stringify({ 
        booking_id: booking.id,
        service: service.nome,
        valor: booking.valor,
        status: booking.status,
        agenda: booking.agenda
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 201,
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    });

  } catch (error) {
    console.error('Pedido API error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});