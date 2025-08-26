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
      const disciplina = url.searchParams.get('disciplina');
      const nivel = url.searchParams.get('nivel');
      const tipo = url.searchParams.get('tipo');
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const offset = parseInt(url.searchParams.get('offset') || '0');

      let query = supabaseClient
        .from('oer_resources')
        .select('*')
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      // Apply filters
      if (disciplina) {
        query = query.ilike('disciplina', `%${disciplina}%`);
      }
      if (nivel) {
        query = query.eq('nivel', nivel);
      }
      if (tipo) {
        query = query.eq('tipo', tipo);
      }

      const { data: resources, error, count } = await query;

      if (error) {
        console.error('Error fetching OER resources:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }

      // Also get total count for pagination
      let countQuery = supabaseClient
        .from('oer_resources')
        .select('*', { count: 'exact', head: true });

      if (disciplina) countQuery = countQuery.ilike('disciplina', `%${disciplina}%`);
      if (nivel) countQuery = countQuery.eq('nivel', nivel);
      if (tipo) countQuery = countQuery.eq('tipo', tipo);

      const { count: totalCount } = await countQuery;

      return new Response(JSON.stringify({ 
        resources,
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
      // Create new OER resource (requires authentication)
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

      const body = await req.json();
      const { titulo, disciplina, nivel, tipo, url, licenca, tags, autor } = body;

      const { data: resource, error: insertError } = await supabaseClient
        .from('oer_resources')
        .insert({
          titulo,
          disciplina,
          nivel,
          tipo,
          url,
          licenca: licenca || 'CC BY',
          tags: tags || [],
          autor: autor || user.email
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating OER resource:', insertError);
        return new Response(JSON.stringify({ error: insertError.message }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }

      return new Response(JSON.stringify({ resource }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 201,
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    });

  } catch (error) {
    console.error('OER resources API error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});