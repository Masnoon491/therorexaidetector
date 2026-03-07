const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function formatDateBD(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Dhaka',
  };
  return new Intl.DateTimeFormat('en-GB', options).format(date).replace(/\//g, '-');
}

function formatTimeBD(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Dhaka',
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendKey = Deno.env.get('RESEND_API_KEY');
    if (!resendKey) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { userEmail, planName, trxId, amountBdt, credits } = await req.json();

    const now = new Date();
    const dateStr = formatDateBD(now);
    const timeStr = formatTimeBD(now);

    const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 0;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:#1a1a2e;padding:24px 32px;text-align:center;">
            <h1 style="color:#00b894;margin:0;font-size:22px;">🚨 New Credit Request</h1>
            <p style="color:#cccccc;margin:8px 0 0;font-size:13px;">Theorex Consulting — Payment Alert</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:28px 32px;">
            <table width="100%" cellpadding="8" cellspacing="0" style="font-size:14px;color:#333;">
              <tr style="background:#f8f9fa;">
                <td style="font-weight:bold;width:140px;border-bottom:1px solid #eee;">User Email</td>
                <td style="border-bottom:1px solid #eee;">${userEmail}</td>
              </tr>
              <tr>
                <td style="font-weight:bold;border-bottom:1px solid #eee;">Plan</td>
                <td style="border-bottom:1px solid #eee;">${planName}</td>
              </tr>
              <tr style="background:#f8f9fa;">
                <td style="font-weight:bold;border-bottom:1px solid #eee;">Credits</td>
                <td style="border-bottom:1px solid #eee;">${credits}</td>
              </tr>
              <tr>
                <td style="font-weight:bold;border-bottom:1px solid #eee;">Amount (BDT)</td>
                <td style="border-bottom:1px solid #eee;">৳${amountBdt}</td>
              </tr>
              <tr style="background:#f8f9fa;">
                <td style="font-weight:bold;border-bottom:1px solid #eee;">bKash TrxID</td>
                <td style="border-bottom:1px solid #eee;font-family:monospace;font-size:15px;font-weight:bold;color:#D12053;">${trxId}</td>
              </tr>
              <tr>
                <td style="font-weight:bold;">Submitted At</td>
                <td>${dateStr} | ${timeStr} (GMT+6)</td>
              </tr>
            </table>
            <p style="margin:24px 0 0;text-align:center;font-size:13px;color:#888;">
              Log in to the Admin Panel to approve or reject this request.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#1a1a2e;padding:16px 32px;text-align:center;">
            <p style="color:#888;font-size:11px;margin:0;">Theorex Consulting • Automated Notification</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Theorex Consulting <onboarding@resend.dev>',
        to: ['salestheorex@gmail.com'],
        subject: `🚨 New Credit Request: ${userEmail}`,
        html: htmlBody,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error('Resend error:', result);
      return new Response(JSON.stringify({ error: 'Email send failed', details: result }), {
        status: res.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('notify-payment error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
