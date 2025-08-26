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

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const bookingId = pathParts[pathParts.length - 2]; // /api/teacher/pedido/{id}/pdf

    if (req.method === "GET" && bookingId && url.pathname.endsWith('/pdf')) {
      // PDF generation endpoint
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return new Response(JSON.stringify({ error: "Authorization required" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        });
      }

      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
      
      if (authError || !user) {
        return new Response(JSON.stringify({ error: "Invalid token" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        });
      }

      // Get booking with related data
      const { data: booking, error: bookingError } = await supabaseClient
        .from('bookings')
        .select(`
          *,
          services (nome, descricao),
          profiles!bookings_estudante_id_fkey (full_name, email, institution)
        `)
        .eq('id', bookingId)
        .single();

      if (bookingError || !booking) {
        return new Response(JSON.stringify({ error: "Booking not found" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        });
      }

      // Generate HTML for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Confirmação de Pedido - ${booking.id}</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #007bff; padding-bottom: 20px; }
            .section { margin-bottom: 25px; }
            .section h3 { color: #007bff; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .info-item { margin-bottom: 10px; }
            .info-item strong { color: #333; }
            .status { padding: 5px 10px; border-radius: 5px; display: inline-block; }
            .status.pending { background-color: #fff3cd; color: #856404; }
            .status.confirmed { background-color: #d4edda; color: #155724; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>AcademicoApp</h1>
            <h2>Confirmação de Pedido</h2>
            <p>Número do Pedido: <strong>${booking.id}</strong></p>
          </div>

          <div class="section">
            <h3>Dados do Professor</h3>
            <div class="info-item"><strong>Nome:</strong> ${booking.profiles?.full_name || 'N/A'}</div>
            <div class="info-item"><strong>Email:</strong> ${booking.profiles?.email || 'N/A'}</div>
            <div class="info-item"><strong>Instituição:</strong> ${booking.profiles?.institution || 'N/A'}</div>
          </div>

          <div class="section">
            <h3>Detalhes do Serviço</h3>
            <div class="info-item"><strong>Serviço:</strong> ${booking.services?.nome || 'N/A'}</div>
            <div class="info-item"><strong>Descrição:</strong> ${booking.services?.descricao || 'N/A'}</div>
            <div class="info-item"><strong>Data Agendada:</strong> ${new Date(booking.agenda).toLocaleString('pt-PT')}</div>
            <div class="info-item"><strong>Valor:</strong> ${booking.valor} AOA</div>
            <div class="info-item"><strong>Status:</strong> <span class="status ${booking.status}">${booking.status}</span></div>
          </div>

          ${booking.dados_formulario ? `
          <div class="section">
            <h3>Informações Adicionais</h3>
            <div class="info-item"><strong>Objetivos:</strong> ${booking.dados_formulario.objectives || 'N/A'}</div>
            <div class="info-item"><strong>Experiência:</strong> ${booking.dados_formulario.experience || 'N/A'}</div>
            <div class="info-item"><strong>Plataforma:</strong> ${booking.dados_formulario.platform || 'N/A'}</div>
          </div>
          ` : ''}

          <div class="section">
            <h3>Informações do Pedido</h3>
            <div class="info-item"><strong>Data do Pedido:</strong> ${new Date(booking.created_at).toLocaleString('pt-PT')}</div>
            <div class="info-item"><strong>Última Atualização:</strong> ${new Date(booking.updated_at).toLocaleString('pt-PT')}</div>
          </div>

          <div class="footer">
            <p>Este documento foi gerado automaticamente pelo sistema AcademicoApp.</p>
            <p>Para dúvidas ou suporte, contacte-nos através do nosso sistema de tickets.</p>
          </div>
        </body>
        </html>
      `;

      return new Response(htmlContent, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/html",
          "Content-Disposition": `attachment; filename="pedido-${booking.id}.html"`
        },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ error: "Endpoint not found" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 404,
    });

  } catch (error) {
    console.error('Teacher PDF API error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});