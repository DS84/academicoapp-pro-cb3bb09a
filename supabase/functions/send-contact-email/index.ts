import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message }: ContactEmailRequest = await req.json();

    // Send email to support
    const emailResponse = await resend.emails.send({
      from: "Académico App <noreply@resend.dev>",
      to: ["suporte@academicoapp.com"],
      subject: `[Contacto] ${subject}`,
      html: `
        <h2>Nova mensagem de contacto</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Assunto:</strong> ${subject}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        
        <hr>
        <p><small>Esta mensagem foi enviada através do formulário de contacto do Académico App.</small></p>
      `,
    });

    // Send confirmation email to user
    await resend.emails.send({
      from: "Académico App <noreply@resend.dev>",
      to: [email],
      subject: "Mensagem recebida - Académico App",
      html: `
        <h2>Obrigado pelo seu contacto, ${name}!</h2>
        <p>Recebemos a sua mensagem e entraremos em contacto consigo brevemente.</p>
        <p><strong>Resumo da sua mensagem:</strong></p>
        <p><strong>Assunto:</strong> ${subject}</p>
        <p><strong>Mensagem:</strong> ${message.replace(/\n/g, '<br>')}</p>
        
        <hr>
        <p>Cumprimentos,<br>Equipa Académico App</p>
      `,
    });

    console.log("Contact email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);