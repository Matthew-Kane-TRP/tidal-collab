import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Generate HTML for PDF (will be converted to PDF via browser print)
function generateCMAHTML(data: any): string {
  const { subject, comps, competition, suggestedValue, valueRange, narrative, avgPricePerSqft, generatedAt } = data

  // Calculate stats
  const avgDOM = comps.length > 0 
    ? Math.round(comps.reduce((sum: number, c: any) => sum + (c.dom || 0), 0) / comps.length)
    : 0
  
  const competitionAvgDOM = competition.length > 0
    ? Math.round(competition.reduce((sum: number, c: any) => sum + (c.dom || 0), 0) / competition.length)
    : 0

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>CMA Report - ${subject.address}</title>
  <style>
    @page {
      size: letter;
      margin: 0.5in;
    }
    
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.4;
      color: #091B34;
      margin: 0;
      padding: 0;
    }
    
    .page {
      page-break-after: always;
      min-height: 100vh;
      position: relative;
    }
    
    .page:last-child {
      page-break-after: avoid;
    }
    
    .header {
      background: linear-gradient(135deg, #091B34 0%, #001F45 100%);
      color: white;
      padding: 30px;
      margin-bottom: 30px;
    }
    
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 28px;
      font-weight: 700;
    }
    
    .header .subtitle {
      font-size: 14px;
      opacity: 0.9;
    }
    
    .logo {
      text-align: right;
      font-size: 24px;
      font-weight: 700;
      color: #42A5D7;
      margin-bottom: 10px;
    }
    
    .section {
      margin-bottom: 30px;
    }
    
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #091B34;
      border-bottom: 3px solid #42A5D7;
      padding-bottom: 8px;
      margin-bottom: 15px;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .stat-box {
      background: #F8FAFC;
      border-left: 4px solid #42A5D7;
      padding: 15px;
    }
    
    .stat-label {
      font-size: 11px;
      text-transform: uppercase;
      color: #64748B;
      margin-bottom: 5px;
      font-weight: 600;
    }
    
    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: #091B34;
    }
    
    .stat-value.highlight {
      color: #42A5D7;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
      margin-bottom: 20px;
    }
    
    thead {
      background: #091B34;
      color: white;
    }
    
    th {
      padding: 10px 8px;
      text-align: left;
      font-weight: 600;
      font-size: 10px;
      text-transform: uppercase;
    }
    
    th.right, td.right {
      text-align: right;
    }
    
    th.center, td.center {
      text-align: center;
    }
    
    td {
      padding: 10px 8px;
      border-bottom: 1px solid #E2E8F0;
    }
    
    tr:hover {
      background: #F8FAFC;
    }
    
    .adjustment-item {
      font-size: 10px;
      padding: 4px 0;
      display: flex;
      justify-content: space-between;
    }
    
    .adjustment-factor {
      color: #64748B;
      flex: 1;
    }
    
    .adjustment-amount {
      font-weight: 600;
      color: #091B34;
      margin-left: 10px;
    }
    
    .adjustment-amount.positive {
      color: #059669;
    }
    
    .adjustment-amount.negative {
      color: #DC2626;
    }
    
    .narrative {
      background: #F8FAFC;
      border-left: 4px solid #42A5D7;
      padding: 20px;
      line-height: 1.6;
      font-size: 13px;
      margin-bottom: 20px;
    }
    
    .pricing-recommendation {
      background: linear-gradient(135deg, #42A5D7 0%, #6BB8E0 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 8px;
    }
    
    .pricing-recommendation h2 {
      margin: 0 0 20px 0;
      font-size: 22px;
    }
    
    .price-main {
      font-size: 48px;
      font-weight: 700;
      margin: 10px 0;
    }
    
    .price-range {
      font-size: 16px;
      opacity: 0.9;
      margin-top: 15px;
    }
    
    .footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 10px;
      color: #64748B;
      padding: 15px;
      border-top: 1px solid #E2E8F0;
    }
    
    .property-details {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 20px;
      font-size: 12px;
    }
    
    .property-details dt {
      color: #64748B;
      font-weight: 600;
      margin-bottom: 3px;
    }
    
    .property-details dd {
      color: #091B34;
      margin: 0;
    }
    
    .subject-highlight {
      background: #FEF3C7;
      border: 2px solid #F59E0B;
      padding: 15px;
      margin-bottom: 20px;
      border-radius: 6px;
    }
    
    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  
  <!-- PAGE 1: OVERVIEW & SUBJECT PROPERTY -->
  <div class="page">
    <div class="logo">TIDAL REALTY PARTNERS</div>
    <div class="header">
      <h1>Comparative Market Analysis</h1>
      <div class="subtitle">Professional Property Valuation Report</div>
    </div>
    
    <div class="section">
      <div class="section-title">Subject Property</div>
      <div class="subject-highlight">
        <h3 style="margin: 0 0 10px 0; font-size: 18px; color: #091B34;">${subject.address || 'Subject Property'}</h3>
        <dl class="property-details" style="margin-bottom: 0;">
          ${subject.heatedSqft ? `<div><dt>Living Area</dt><dd>${subject.heatedSqft.toLocaleString()} sqft</dd></div>` : ''}
          ${subject.bedrooms ? `<div><dt>Bedrooms</dt><dd>${subject.bedrooms}</dd></div>` : ''}
          ${subject.bathrooms ? `<div><dt>Bathrooms</dt><dd>${subject.bathrooms}</dd></div>` : ''}
          ${subject.yearBuilt ? `<div><dt>Year Built</dt><dd>${subject.yearBuilt}</dd></div>` : ''}
          ${subject.lotSize ? `<div><dt>Lot Size</dt><dd>${subject.lotSize} ${subject.lotSizeUnit || 'acres'}</dd></div>` : ''}
          ${subject.quality ? `<div><dt>Quality Rating</dt><dd>${subject.quality}/10</dd></div>` : ''}
        </dl>
      </div>
      
      ${subject.updateNotes ? `
        <div style="margin-top: 15px;">
          <strong style="color: #64748B; font-size: 12px;">Recent Updates / Condition:</strong>
          <p style="margin: 5px 0 0 0; font-size: 12px; line-height: 1.5;">${subject.updateNotes}</p>
        </div>
      ` : ''}
    </div>
    
    <div class="section">
      <div class="section-title">Market Summary</div>
      <div class="stats-grid">
        <div class="stat-box">
          <div class="stat-label">Suggested Value</div>
          <div class="stat-value highlight">$${suggestedValue.toLocaleString()}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Avg $/SqFt</div>
          <div class="stat-value">$${Math.round(avgPricePerSqft)}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Comps Analyzed</div>
          <div class="stat-value">${comps.length}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Avg DOM (Sold)</div>
          <div class="stat-value">${avgDOM} days</div>
        </div>
      </div>
      
      <div class="narrative">
        ${narrative}
      </div>
    </div>
    
    <div class="footer">
      Generated ${new Date(generatedAt).toLocaleDateString()} | Tidal Realty Partners | For Professional Use Only
    </div>
  </div>
  
  <!-- PAGE 2: COMPARABLE SOLD PROPERTIES & ADJUSTMENTS -->
  <div class="page">
    <div class="logo">TIDAL REALTY PARTNERS</div>
    <div class="header" style="padding: 20px;">
      <h1 style="font-size: 22px;">Comparable Sold Properties</h1>
      <div class="subtitle">Adjusted to Match Subject Property</div>
    </div>
    
    <div class="section">
      ${comps.map((comp: any, idx: number) => `
        <div style="margin-bottom: 25px; page-break-inside: avoid;">
          <h4 style="margin: 0 0 10px 0; font-size: 14px; color: #091B34; font-weight: 700;">
            ${idx + 1}. ${comp.address}
          </h4>
          
          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 15px;">
            <div>
              <dl class="property-details" style="font-size: 11px;">
                <div><dt>Sold Price</dt><dd>$${comp.originalPrice.toLocaleString()}</dd></div>
                <div><dt>Living Area</dt><dd>${comp.heatedSqft?.toLocaleString() || 'N/A'} sqft</dd></div>
                <div><dt>Bed/Bath</dt><dd>${comp.bedrooms || 'N/A'} / ${comp.bathrooms || 'N/A'}</dd></div>
                <div><dt>Days on Market</dt><dd>${comp.dom} days</dd></div>
              </dl>
              ${comp.notes ? `<p style="font-size: 10px; color: #64748B; margin: 10px 0 0 0; line-height: 1.4;">${comp.notes}</p>` : ''}
            </div>
            
            <div>
              <div style="background: #F8FAFC; padding: 12px; border-radius: 6px;">
                <div style="font-size: 10px; color: #64748B; margin-bottom: 8px; font-weight: 600;">ADJUSTMENTS</div>
                ${comp.adjustments?.map((adj: any) => `
                  <div class="adjustment-item">
                    <span class="adjustment-factor">${adj.factor}</span>
                    <span class="adjustment-amount ${adj.amount >= 0 ? 'positive' : 'negative'}">
                      ${adj.amount >= 0 ? '+' : ''}$${adj.amount.toLocaleString()}
                    </span>
                  </div>
                `).join('') || ''}
                <hr style="margin: 8px 0; border: none; border-top: 1px solid #E2E8F0;">
                <div class="adjustment-item" style="font-weight: 700;">
                  <span>Adjusted Price</span>
                  <span style="color: #42A5D7; font-size: 13px;">$${comp.adjustedPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        ${idx < comps.length - 1 ? '<hr style="margin: 15px 0; border: none; border-top: 2px solid #E2E8F0;">' : ''}
      `).join('')}
    </div>
    
    <div class="footer">
      Page 2 of 4 | Generated ${new Date(generatedAt).toLocaleDateString()}
    </div>
  </div>
  
  <!-- PAGE 3: ACTIVE COMPETITION -->
  <div class="page">
    <div class="logo">TIDAL REALTY PARTNERS</div>
    <div class="header" style="padding: 20px;">
      <h1 style="font-size: 22px;">Active Competition</h1>
      <div class="subtitle">Currently Listed Properties (${competition.length} properties, Avg DOM: ${competitionAvgDOM} days)</div>
    </div>
    
    ${competition.length > 0 ? `
      <div class="section">
        ${competition.map((comp: any, idx: number) => `
          <div style="margin-bottom: 25px; page-break-inside: avoid;">
            <h4 style="margin: 0 0 10px 0; font-size: 14px; color: #091B34; font-weight: 700;">
              ${idx + 1}. ${comp.address}
            </h4>
            
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 15px;">
              <div>
                <dl class="property-details" style="font-size: 11px;">
                  <div><dt>List Price</dt><dd>$${comp.listPrice?.toLocaleString() || 'N/A'}</dd></div>
                  <div><dt>Living Area</dt><dd>${comp.heatedSqft?.toLocaleString() || 'N/A'} sqft</dd></div>
                  <div><dt>Bed/Bath</dt><dd>${comp.bedrooms || 'N/A'} / ${comp.bathrooms || 'N/A'}</dd></div>
                  <div><dt>Days on Market</dt><dd>${comp.dom || 'N/A'} days</dd></div>
                </dl>
                ${comp.notes ? `<p style="font-size: 10px; color: #64748B; margin: 10px 0 0 0; line-height: 1.4;">${comp.notes}</p>` : ''}
              </div>
              
              <div>
                <div style="background: #F8FAFC; padding: 12px; border-radius: 6px;">
                  <div style="font-size: 10px; color: #64748B; margin-bottom: 8px; font-weight: 600;">ADJUSTMENTS</div>
                  ${comp.adjustments?.map((adj: any) => `
                    <div class="adjustment-item">
                      <span class="adjustment-factor">${adj.factor}</span>
                      <span class="adjustment-amount ${adj.amount >= 0 ? 'positive' : 'negative'}">
                        ${adj.amount >= 0 ? '+' : ''}$${adj.amount.toLocaleString()}
                      </span>
                    </div>
                  `).join('') || ''}
                  <hr style="margin: 8px 0; border: none; border-top: 1px solid #E2E8F0;">
                  <div class="adjustment-item" style="font-weight: 700;">
                    <span>Adjusted Price</span>
                    <span style="color: #42A5D7; font-size: 13px;">$${comp.adjustedPrice?.toLocaleString() || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          ${idx < competition.length - 1 ? '<hr style="margin: 15px 0; border: none; border-top: 2px solid #E2E8F0;">' : ''}
        `).join('')}
      </div>
    ` : `
      <div style="text-align: center; padding: 60px 20px; color: #64748B;">
        <p style="font-size: 14px;">No active competition data available</p>
      </div>
    `}
    
    <div class="footer">
      Page 3 of 4 | Generated ${new Date(generatedAt).toLocaleDateString()}
    </div>
  </div>
  
  <!-- PAGE 4: PRICING RECOMMENDATION -->
  <div class="page">
    <div class="logo">TIDAL REALTY PARTNERS</div>
    <div class="header" style="padding: 20px;">
      <h1 style="font-size: 22px;">Pricing Recommendation</h1>
      <div class="subtitle">${subject.address}</div>
    </div>
    
    <div class="section">
      <div class="pricing-recommendation">
        <h2>Suggested List Price</h2>
        <div class="price-main">$${suggestedValue.toLocaleString()}</div>
        <div class="price-range">
          Recommended Range: $${valueRange.low.toLocaleString()} - $${valueRange.high.toLocaleString()}
        </div>
      </div>
      
      <div style="margin-top: 30px; background: #F8FAFC; padding: 20px; border-radius: 8px;">
        <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #091B34;">Pricing Strategy</h3>
        <div style="font-size: 13px; line-height: 1.6; color: #091B34;">
          <p style="margin: 0 0 12px 0;">
            <strong>Based on ${comps.length} comparable sold properties</strong> and ${competition.length} active listings, 
            this pricing recommendation reflects current market conditions in the area.
          </p>
          
          <p style="margin: 0 0 12px 0;">
            <strong>Market Context:</strong>
          </p>
          <ul style="margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">Average sold property DOM: ${avgDOM} days</li>
            <li style="margin-bottom: 8px;">Average active listing DOM: ${competitionAvgDOM} days</li>
            <li style="margin-bottom: 8px;">Average price per sqft: $${Math.round(avgPricePerSqft)}</li>
            <li style="margin-bottom: 8px;">Subject property sqft: ${subject.heatedSqft?.toLocaleString() || 'N/A'}</li>
          </ul>
          
          <p style="margin: 15px 0 0 0;">
            <strong>Recommendation:</strong> List at <span style="color: #42A5D7; font-weight: 700;">$${suggestedValue.toLocaleString()}</span> 
            to position competitively while maximizing value. This price accounts for the property's condition, 
            features, and current market absorption rates.
          </p>
        </div>
      </div>
      
      <div style="margin-top: 25px; padding: 20px; border: 2px solid #E2E8F0; border-radius: 8px;">
        <h3 style="margin: 0 0 12px 0; font-size: 14px; color: #091B34;">Methodology</h3>
        <p style="font-size: 11px; line-height: 1.5; color: #64748B; margin: 0;">
          This CMA was generated using AI-powered analysis of comparable sales and active listings. 
          Adjustments were calculated based on industry-standard valuation methods including square footage 
          differential, feature analysis, age/condition assessment, and lot size comparison. All data 
          extracted from MLS records and analyzed for accuracy. This report is intended for professional 
          real estate agent use and should be reviewed for accuracy before client presentation.
        </p>
      </div>
    </div>
    
    <div class="footer">
      Page 4 of 4 | Generated ${new Date(generatedAt).toLocaleDateString()} | Tidal Realty Partners
    </div>
  </div>
  
</body>
</html>`
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const cmaDataParam = url.searchParams.get('data')
    
    if (!cmaDataParam) {
      return new Response('Missing CMA data', { 
        status: 400,
        headers: corsHeaders
      })
    }
    
    // Decode the data from URL parameter
    const cmaData = JSON.parse(decodeURIComponent(cmaDataParam))
    
    // Generate HTML
    const html = generateCMAHTML(cmaData)
    
    // Return HTML that can be printed to PDF by browser
    return new Response(html, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
      },
    })
    
  } catch (error) {
    console.error('PDF generation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
