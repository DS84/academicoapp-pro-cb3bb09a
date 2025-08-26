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

    if (req.method === "GET") {
      const url = new URL(req.url);
      const bookingId = url.pathname.split('/').pop();

      if (!bookingId) {
        return new Response(JSON.stringify({ error: "Booking ID required" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

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

      // Get booking with service and profile details
      const { data: booking, error: bookingError } = await supabaseClient
        .from('bookings')
        .select(`
          *,
          services (nome, descricao, sla_horas),
          profiles (full_name, email, phone)
        `)
        .eq('id', bookingId)
        .single();

      if (bookingError || !booking) {
        return new Response(JSON.stringify({ error: "Booking not found" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        });
      }

      // Generate HTML for PDF (simplified version)
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
            .invoice-info { margin-bottom: 30px; }
            .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            .table th { background-color: #f5f5f5; }
            .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; }
            .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">academicoapp</div>
            <h2>Comprovativo de Pedido</h2>
          </div>
          
          <div class="invoice-info">
            <p><strong>Pedido ID:</strong> ${booking.id}</p>
            <p><strong>Data:</strong> ${new Date(booking.created_at).toLocaleDateString('pt-PT')}</p>
            <p><strong>Status:</strong> ${booking.status}</p>
          </div>
          
          <h3>Dados do Cliente</h3>
          <p><strong>Nome:</strong> ${booking.profiles.full_name}</p>
          <p><strong>Email:</strong> ${booking.profiles.email}</p>
          <p><strong>Telefone:</strong> ${booking.profiles.phone || 'N/A'}</p>
          
          <h3>Detalhes do Serviço</h3>
          <table class="table">
            <tr>
              <th>Serviço</th>
              <th>Descrição</th>
              <th>Data Agendada</th>
              <th>SLA</th>
              <th>Valor</th>
            </tr>
            <tr>
              <td>${booking.services.nome}</td>
              <td>${booking.services.descricao}</td>
              <td>${new Date(booking.agenda).toLocaleString('pt-PT')}</td>
              <td>${booking.services.sla_horas}h</td>
              <td>${booking.valor.toLocaleString('pt-PT')} AOA</td>
            </tr>
          </table>
          
          <div class="total">
            <p>Total: ${booking.valor.toLocaleString('pt-PT')} AOA</p>
          </div>
          
          ${booking.dados_formulario?.payment_reference ? `
            <h3>Informações de Pagamento</h3>
            <p><strong>Referência:</strong> ${booking.dados_formulario.payment_reference}</p>
            <p><strong>Método:</strong> ${booking.dados_formulario.payment_method || 'N/A'}</p>
            <p><strong>Data do Pagamento:</strong> ${booking.dados_formulario.paid_at ? new Date(booking.dados_formulario.paid_at).toLocaleString('pt-PT') : 'Pendente'}</p>
          ` : ''}
          
          <div class="footer">
            <p>Este documento foi gerado automaticamente pelo sistema academicoapp.</p>
            <p>Para questões, contacte: contacto@academicoapp.com | 942065632</p>
          </div>
        </body>
        </html>
      `;

      console.log('Generated PDF for booking:', bookingId);

      // For demo purposes, return HTML content
      // In production, use a PDF generation library like Puppeteer
      return new Response(htmlContent, {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "text/html",
          "Content-Disposition": `attachment; filename="pedido-${bookingId}.html"`
        },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});