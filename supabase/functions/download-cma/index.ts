import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const cmaId = url.pathname.split('/').pop()

    // For now, return a placeholder PDF
    // In production, this would:
    // 1. Fetch CMA data from Supabase storage
    // 2. Render HTML template
    // 3. Convert to PDF via Puppeteer/headless Chrome
    // 4. Return PDF buffer

    const htmlContent = generateCMAHTML({
      id: cmaId,
      subject: { address: 'Sample Property' },
      suggestedValue: 450000,
      comps: [],
      narrative: 'PDF generation placeholder - full implementation in Phase 5'
    })

    return new Response(htmlContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

function generateCMAHTML(data) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>CMA Report</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      color: #091B34;
      line-height: 1.6;
    }
    .page {
      width: 8.5in;
      min-height: 11in;
      padding: 0.75in;
      background: white;
      page-break-after: always;
    }
    h1 {
      font-family: 'Playfair Display', serif;
      font-size: 36px;
      color: #091B34;
      margin-bottom: 16px;
    }
    h2 {
      font-family: 'Playfair Display', serif;
      font-size: 24px;
      color: #091B34;
      margin: 24px 0 12px;
    }
    .header {
      background: #091B34;
      color: white;
      padding: 24px;
      margin: -0.75in -0.75in 24px;
    }
    .value {
      font-size: 32px;
      font-weight: 700;
      color: #42A5D7;
    }
    .footer {
      margin-top: 48px;
      padding-top: 16px;
      border-top: 2px solid #D7E3EA;
      font-size: 12px;
      color: #566E8F;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <h1 style="color: white;">Comparative Market Analysis</h1>
      <p style="font-size: 18px; opacity: 0.9;">${data.subject.address}</p>
    </div>

    <h2>Suggested Value</h2>
    <p class="value">$${data.suggestedValue.toLocaleString()}</p>

    <h2>Market Analysis</h2>
    <p>${data.narrative}</p>

    <div class="footer">
      <p><strong>Tidal Realty Partners</strong> — a team brokered by Real Broker, LLC</p>
      <p>NC Firm License #C34379 · Matthew Kane, NC Broker #297432</p>
      <p>Equal Housing Opportunity</p>
      <p>5215 Junction Circle, #200, Wilmington, NC 28412 · (910) 372-6720</p>
      <p>info@tidalrealtypartners.com · tidalrealtypartners.com</p>
    </div>
  </div>
</body>
</html>
  `
}
