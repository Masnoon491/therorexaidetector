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

    const scanTitle = title || `Scan - ${new Date().toISOString()}`;

    const payload = {
      content,
      title: scanTitle,
      check_ai: true,
      check_plagiarism: true,
      check_readability: true,
      check_grammar: true,
      check_facts: true,
      check_contentOptimizer: true,
      optimizerQuery: 'content authenticity',
      optimizerCountry: 'United States',
      optimizerDevice: 'Desktop',
      optimizerPublishingDomain: 'https://example.com',
      excludedUrls: [],
      storeScan: true,
      aiModelVersion: 'lite',
    };

    console.log('Sending scan request with title:', scanTitle, 'content length:', content.length);

    const response = await fetch('https://api.originality.ai/api/v3/scan', {
      method: 'POST',
      headers: {
        'X-OAI-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log('Originality API status:', response.status, 'response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid API response', details: responseText }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!response.ok) {
      const isRateLimit = response.status === 429;
      return new Response(JSON.stringify({ 
        error: data?.message || data?.error || 'Scan failed', 
        isRateLimit,
        details: data 
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
