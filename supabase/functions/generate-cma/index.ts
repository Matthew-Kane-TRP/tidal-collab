import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { encodeBase64 } from 'https://deno.land/std@0.224.0/encoding/base64.ts'
import Anthropic from 'npm:@anthropic-ai/sdk@0.24.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const subjectJson = formData.get('subject')
    const compsPdf = formData.get('comps')
    const competitionPdf = formData.get('competition')

    if (!subjectJson || !compsPdf || !competitionPdf) {
      throw new Error('Missing required fields')
    }

    const subject = JSON.parse(subjectJson)
    
    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: Deno.env.get('ANTHROPIC_API_KEY'),
    })

    // Convert PDFs to base64. NOTE: do NOT use btoa(String.fromCharCode(...uint8))
    // — spreading a multi-hundred-KB PDF into String.fromCharCode overflows the
    // argument stack (RangeError) and 500s on any real-world file. encodeBase64
    // streams the buffer safely regardless of size.
    const compsBuffer = await compsPdf.arrayBuffer()
    const competitionBuffer = await competitionPdf.arrayBuffer()

    const compsBase64 = encodeBase64(compsBuffer)
    const competitionBase64 = encodeBase64(competitionBuffer)

    // Step 1: Parse comps PDF
    const compsParseResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: compsBase64,
            },
          },
          {
            type: 'text',
            text: `Extract ALL comparable sold properties from this PDF into structured JSON.

For EACH property, extract:
- address (full street address)
- soldPrice (number, no commas)
- heatedSqft (number)
- bedrooms (number)
- bathrooms (number, support decimals like 2.5)
- yearBuilt (number)
- lotSize (number in acres, convert if needed)
- daysOnMarket (number, "DOM")
- listingDescription (full text)
- features (object with boolean flags): { pool, adu, generator, newRoof, newHVAC, renovated, waterfront, dock, solar, oversizedLot }

Return ONLY valid JSON array with NO markdown formatting:
[{"address": "...", "soldPrice": 450000, ...}, ...]`
          }
        ]
      }],
    })

    const compsText = compsParseResponse.content[0].text
    const comps = JSON.parse(compsText.replace(/```json\n?/g, '').replace(/```\n?/g, ''))

    // Step 2: Parse competition PDF
    const competitionParseResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: competitionBase64,
            },
          },
          {
            type: 'text',
            text: `Extract ALL active competition properties from this PDF into structured JSON.

For EACH property, extract:
- address
- listPrice (number)
- heatedSqft (number)
- bedrooms (number)
- bathrooms (number)
- yearBuilt (number)
- lotSize (acres)
- daysOnMarket (number)
- listingDescription (full text)
- features (same as before)

Return ONLY valid JSON array:
[{"address": "...", "listPrice": 475000, ...}, ...]`
          }
        ]
      }],
    })

    const competitionText = competitionParseResponse.content[0].text
    const competition = JSON.parse(competitionText.replace(/```json\n?/g, '').replace(/```\n?/g, ''))

    // Step 3: Calculate adjustments
    const adjustmentResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8192,
      messages: [{
        role: 'user',
        content: `You are a real estate CMA analyst. Calculate price adjustments for comparable properties.

**SUBJECT PROPERTY:**
${JSON.stringify(subject, null, 2)}

**COMPARABLE SOLD PROPERTIES:**
${JSON.stringify(comps, null, 2)}

**TASK:**
1. Calculate average $/sqft from comps
2. For EACH comp, calculate line-item adjustments to match the subject:
   - Square footage adjustment (based on $/sqft)
   - Lot size adjustment
   - Bedroom count adjustment
   - Bathroom count adjustment
   - Age/year built adjustment
   - Quality/condition adjustment (subject quality: ${subject.quality}/10)
   - Feature adjustments (pool, ADU, generator, renovations, waterfront, etc.)

3. Calculate adjusted price for each comp
4. Derive suggested value/range for subject
5. Write a 2-3 paragraph market narrative that:
   - Reflects the CURRENT MARKET (high inventory, rate-sensitive buyers, listings sitting longer)
   - Uses DOM and pricing data to support realistic pricing
   - Avoids frothy "it'll sell instantly" language
   - Is confident, data-driven, and realistic

Return ONLY valid JSON:
{
  "avgPricePerSqft": number,
  "comps": [
    {
      "address": "...",
      "originalPrice": number,
      "adjustments": [
        {"factor": "Square Footage", "amount": number, "rationale": "..."},
        {"factor": "Lot Size", "amount": number, "rationale": "..."},
        ...
      ],
      "adjustedPrice": number,
      "dom": number,
      "notes": "Short summary of key features from description"
    }
  ],
  "suggestedValue": number,
  "valueRange": {"low": number, "high": number},
  "narrative": "Market analysis paragraph(s)..."
}`
      }],
    })

    const adjustmentText = adjustmentResponse.content[0].text
    const analysis = JSON.parse(adjustmentText.replace(/```json\n?/g, '').replace(/```\n?/g, ''))

    // Return complete CMA data
    return new Response(
      JSON.stringify({
        id: crypto.randomUUID(),
        subject,
        comps: analysis.comps,
        competition,
        suggestedValue: analysis.suggestedValue,
        valueRange: analysis.valueRange,
        narrative: analysis.narrative,
        avgPricePerSqft: analysis.avgPricePerSqft,
        generatedAt: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
