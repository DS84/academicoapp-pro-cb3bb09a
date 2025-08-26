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
      const grau = url.searchParams.get("grau");
      const pais = url.searchParams.get("pais");
      const limit = parseInt(url.searchParams.get("limit") || "20");
      const offset = parseInt(url.searchParams.get("offset") || "0");

      let query = supabaseClient
        .from('scholarship_opportunities')
        .select('*')
        .eq('is_active', true);

      // Apply filters
      if (grau) {
        query = query.eq('grau', grau);
      }
      if (pais) {
        query = query.eq('pais', pais);
      }

      // Apply pagination and ordering
      query = query
        .order('prazo', { ascending: true })
        .range(offset, offset + limit - 1);

      const { data: scholarships, error } = await query;

      if (error) {
        console.error('Error fetching scholarships:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }

      // Get total count for pagination
      const { count } = await supabaseClient
        .from('scholarship_opportunities')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      console.log(`Fetched ${scholarships?.length || 0} scholarships with filters: grau=${grau}, pais=${pais}`);

      return new Response(JSON.stringify({ 
        scholarships,
        pagination: {
          total: count || 0,
          limit,
          offset,
          has_more: (offset + limit) < (count || 0)
        }
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
    console.error('Scholarships API error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});