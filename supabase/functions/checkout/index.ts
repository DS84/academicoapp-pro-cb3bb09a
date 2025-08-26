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

      const requestBody = await req.json();
      const { booking_id, payment_method, phone_number } = requestBody;

      // Get booking details
      const { data: booking, error: bookingError } = await supabaseClient
        .from('bookings')
        .select(`
          *,
          services (nome, descricao),
          profiles (full_name, email)
        `)
        .eq('id', booking_id)
        .single();

      if (bookingError || !booking) {
        return new Response(JSON.stringify({ error: "Booking not found" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        });
      }

      // Simulate payment processing (in real implementation, integrate with Multicaixa/Mobile Money)
      const payment_reference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Update booking status
      const { error: updateError } = await supabaseClient
        .from('bookings')
        .update({ 
          status: 'confirmed',
          dados_formulario: {
            ...booking.dados_formulario,
            payment_reference,
            payment_method,
            phone_number,
            paid_at: new Date().toISOString()
          }
        })
        .eq('id', booking_id);

      if (updateError) {
        console.error('Error updating booking:', updateError);
        return new Response(JSON.stringify({ error: updateError.message }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }

      console.log('Payment processed for booking:', booking_id, 'reference:', payment_reference);

      return new Response(JSON.stringify({
        success: true,
        payment_reference,
        booking_id,
        service_name: booking.services.nome,
        amount: booking.valor,
        status: 'confirmed',
        next_steps: [
          'Receberás um email de confirmação em breve',
          'Um responsável entrará em contacto contigo nas próximas 2 horas',
          'Podes acompanhar o progresso no teu dashboard'
        ]
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    });

  } catch (error) {
    console.error('Checkout API error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});