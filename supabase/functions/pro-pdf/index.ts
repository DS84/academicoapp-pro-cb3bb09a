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
    const url = new URL(req.url);
    const bookingId = url.pathname.split('/').pop();

    if (!bookingId) {
      throw new Error('Booking ID is required');
    }

    console.log('Generating PDF for professional booking:', bookingId);

    // Get booking details with service information
    const { data: booking, error: bookingError } = await supabase
      .from('pro_bookings')
      .select(`
        *,
        pro_services (
          nome,
          descricao,
          preco_base,
          sla_horas,
          formatos,
          tags
        ),
        profiles (
          full_name,
          email,
          phone
        )
      `)
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      throw new Error('Booking not found');
    }

    // Generate HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Pedido Profissional #${bookingId}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #007bff;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #007bff;
              margin-bottom: 10px;
            }
            .section {
              margin-bottom: 25px;
              padding: 15px;
              border: 1px solid #ddd;
              border-radius: 5px;
            }
            .section h3 {
              margin-top: 0;
              color: #007bff;
              border-bottom: 1px solid #eee;
              padding-bottom: 10px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
            }
            .info-item {
              margin-bottom: 10px;
            }
            .label {
              font-weight: bold;
              color: #555;
            }
            .value {
              margin-left: 10px;
            }
            .status {
              display: inline-block;
              padding: 5px 10px;
              border-radius: 3px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .status.pending {
              background-color: #ffc107;
              color: #856404;
            }
            .status.completed {
              background-color: #28a745;
              color: white;
            }
            .status.cancelled {
              background-color: #dc3545;
              color: white;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">AcademicoApp</div>
            <h1>Pedido de Serviço Profissional</h1>
            <p>Pedido #${bookingId}</p>
          </div>

          <div class="section">
            <h3>Informações do Cliente</h3>
            <div class="info-item">
              <span class="label">Nome:</span>
              <span class="value">${booking.profiles?.full_name || 'N/A'}</span>
            </div>
            <div class="info-item">
              <span class="label">Email:</span>
              <span class="value">${booking.profiles?.email || 'N/A'}</span>
            </div>
            <div class="info-item">
              <span class="label">Telefone:</span>
              <span class="value">${booking.profiles?.phone || 'N/A'}</span>
            </div>
          </div>

          <div class="section">
            <h3>Detalhes do Serviço</h3>
            <div class="info-item">
              <span class="label">Serviço:</span>
              <span class="value">${booking.pro_services?.nome || 'N/A'}</span>
            </div>
            <div class="info-item">
              <span class="label">Descrição:</span>
              <span class="value">${booking.pro_services?.descricao || 'N/A'}</span>
            </div>
            <div class="info-item">
              <span class="label">SLA:</span>
              <span class="value">${booking.pro_services?.sla_horas || 0} horas</span>
            </div>
            <div class="info-item">
              <span class="label">Formatos Disponíveis:</span>
              <span class="value">${booking.pro_services?.formatos?.join(', ') || 'N/A'}</span>
            </div>
          </div>

          <div class="section">
            <h3>Informações do Pedido</h3>
            <div class="info-item">
              <span class="label">Data do Agendamento:</span>
              <span class="value">${new Date(booking.agenda).toLocaleString('pt-AO')}</span>
            </div>
            <div class="info-item">
              <span class="label">Valor:</span>
              <span class="value">${new Intl.NumberFormat('pt-AO', {
                style: 'currency',
                currency: 'AOA'
              }).format(Number(booking.valor))}</span>
            </div>
            <div class="info-item">
              <span class="label">Status:</span>
              <span class="value">
                <span class="status ${booking.status}">
                  ${booking.status === 'pending' ? 'Pendente' : 
                    booking.status === 'completed' ? 'Concluído' : 'Cancelado'}
                </span>
              </span>
            </div>
            <div class="info-item">
              <span class="label">Data do Pedido:</span>
              <span class="value">${new Date(booking.created_at).toLocaleString('pt-AO')}</span>
            </div>
          </div>

          ${booking.dados_formulario?.formato_escolhido || booking.dados_formulario?.observacoes ? `
          <div class="section">
            <h3>Detalhes Adicionais</h3>
            ${booking.dados_formulario?.formato_escolhido ? `
            <div class="info-item">
              <span class="label">Formato Escolhido:</span>
              <span class="value">${booking.dados_formulario.formato_escolhido}</span>
            </div>
            ` : ''}
            ${booking.dados_formulario?.observacoes ? `
            <div class="info-item">
              <span class="label">Observações:</span>
              <span class="value">${booking.dados_formulario.observacoes}</span>
            </div>
            ` : ''}
            ${booking.dados_formulario?.metodo_pagamento ? `
            <div class="info-item">
              <span class="label">Método de Pagamento:</span>
              <span class="value">${booking.dados_formulario.metodo_pagamento === 'multicaixa' ? 'Multicaixa Express' : 'Mobile Money'}</span>
            </div>
            ` : ''}
          </div>
          ` : ''}

          <div class="footer">
            <p>Este documento foi gerado automaticamente pelo sistema AcademicoApp</p>
            <p>Data de geração: ${new Date().toLocaleString('pt-AO')}</p>
          </div>
        </body>
      </html>
    `;

    // Return HTML content (in a real implementation, you would convert this to PDF)
    return new Response(htmlContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="pedido-profissional-${bookingId}.html"`
      },
    });

  } catch (error) {
    console.error('Error generating professional PDF:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});