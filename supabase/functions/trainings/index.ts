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

    if (req.method === "GET") {
      // Parse query parameters
      const cpd = url.searchParams.get('cpd');
      const modalidade = url.searchParams.get('modalidade');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const offset = parseInt(url.searchParams.get('offset') || '0');

      let query = supabaseClient
        .from('trainings')
        .select('*')
        .eq('status', 'active')
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      // Apply filters
      if (cpd === 'true') {
        query = query.eq('certificacao_cpd', true);
      }
      if (modalidade) {
        query = query.eq('modalidade', modalidade);
      }

      const { data: trainings, error } = await query;

      if (error) {
        console.error('Error fetching trainings:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }

      // Get total count for pagination
      let countQuery = supabaseClient
        .from('trainings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      if (cpd === 'true') countQuery = countQuery.eq('certificacao_cpd', true);
      if (modalidade) countQuery = countQuery.eq('modalidade', modalidade);

      const { count: totalCount } = await countQuery;

      return new Response(JSON.stringify({ 
        trainings,
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + limit < (totalCount || 0)
        }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (req.method === "POST") {
      // Create new training (requires authentication)
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

      // Get user profile
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      const body = await req.json();
      const { titulo, carga_horaria, certificacao_cpd, modalidade, datas, preco, descricao } = body;

      const { data: training, error: insertError } = await supabaseClient
        .from('trainings')
        .insert({
          titulo,
          carga_horaria,
          certificacao_cpd: certificacao_cpd || false,
          modalidade,
          datas: datas || [],
          preco,
          descricao,
          instrutor_id: profile?.id,
          status: 'active'
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating training:', insertError);
        return new Response(JSON.stringify({ error: insertError.message }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }

      return new Response(JSON.stringify({ training }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 201,
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    });

  } catch (error) {
    console.error('Trainings API error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});