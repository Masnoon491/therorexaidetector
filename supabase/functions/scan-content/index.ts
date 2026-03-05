const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('ORIGINALITY_AI_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { content, title } = await req.json();

    if (!content || content.length < 50) {
      return new Response(JSON.stringify({ error: 'Content must be at least 50 characters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://api.originality.ai/api/v3/scan', {
      method: 'POST',
      headers: {
        'X-OAI-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        title: title || `Scan - ${new Date().toISOString()}`,
        check_ai: true,
        check_plagiarism: true,
        check_readability: true,
        check_grammar: true,
        storeScan: true,
        aiModelVersion: 'lite',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const isRateLimit = response.status === 429 || (data?.error?.includes?.('rate') ?? false);
      return new Response(JSON.stringify({ error: data?.error || 'Scan failed', isRateLimit }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
