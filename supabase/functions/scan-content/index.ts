const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

type OriginalityResponse = {
  status: number;
  data: any;
};

async function postToOriginality(apiKey: string, payload: Record<string, unknown>): Promise<OriginalityResponse> {
  const response = await fetch('https://api.originality.ai/api/v3/scan', {
    method: 'POST',
    headers: {
      'X-OAI-API-KEY': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  let data: any = { raw: text };

  try {
    data = JSON.parse(text);
  } catch {
    // keep raw text if not JSON
  }

  return { status: response.status, data };
}

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

    if (!content || typeof content !== 'string' || content.length < 50) {
      return new Response(JSON.stringify({ error: 'Content must be at least 50 characters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const scanTitle = title || `Scan - ${new Date().toISOString()}`;

    // 1) Primary payload format requested by user
    const primaryPayload = {
      content,
      title: scanTitle,
      check_ai: true,
      check_plagiarism: true,
      check_facts: true,
      check_readability: true,
      check_grammar: true,
      check_contentOptimizer: true,
      optimizerQuery: 'Mobile Hotspot',
      optimizerCountry: 'United States',
      optimizerDevice: 'Desktop',
      optimizerPublishingDomain: 'https://www.cnet.com/home/internet/i-tried-using-my-mobile-hotspot-at-home-heres-everything-that-went-wrong/',
      excludedUrls: ['https://example-1.com', 'https://example-2.com'],
      storeScan: true,
      aiModelVersion: 'lite',
    };

    let result = await postToOriginality(apiKey, primaryPayload);

    // 2) Fallback for accounts expecting scanProperties schema
    const message = (result.data?.message || result.data?.error || '').toString().toLowerCase();
    if (result.status === 422 && message.includes('scan properties')) {
      const fallbackPayload = {
        content,
        title: scanTitle,
        scanProperties: ['ai', 'plagiarism', 'readability', 'grammar'],
        storeScan: true,
        aiModelVersion: 'lite',
      };
      result = await postToOriginality(apiKey, fallbackPayload);
    }

    if (result.status >= 400) {
      const isRateLimit = result.status === 429;
      return new Response(JSON.stringify({
        error: result.data?.message || result.data?.error || 'Scan failed',
        isRateLimit,
        details: result.data,
      }), {
        status: result.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(result.data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
