import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { encodeBase64 } from 'https://deno.land/std@0.224.0/encoding/base64.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper to safely parse JSON from GPT responses
function safeJSONParse(text: string): any {
  try {
    // Remove markdown code blocks if present
    const cleaned = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()
    
    return JSON.parse(cleaned)
  } catch (error) {
    console.error('JSON parse error:', error)
    console.error('Raw text:', text)
    throw new Error(`Failed to parse JSON response: ${error.message}`)
  }
}

// Validate parsed property data
function validateProperty(prop: any, type: 'comp' | 'competition'): boolean {
  const required = type === 'comp' 
    ? ['address', 'soldPrice', 'heatedSqft', 'daysOnMarket']
    : ['address', 'listPrice', 'heatedSqft', 'daysOnMarket']
  
  for (const field of required) {
    if (prop[field] === undefined || prop[field] === null) {
      console.warn(`Missing required field: ${field}`, prop)
      return false
    }
  }
  return true
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('=== CMA Generation Request Started (OpenAI) ===')
    
    const formData = await req.formData()
    const subjectJson = formData.get('subject')
    const compsPdf = formData.get('comps')
    const competitionPdf = formData.get('competition')

    // Validation
    if (!subjectJson) {
      throw new Error('Missing subject property data')
    }
    if (!compsPdf) {
      throw new Error('Missing comparables PDF')
    }
    if (!competitionPdf) {
      throw new Error('Missing competition PDF')
    }

    const subject = JSON.parse(subjectJson as string)
    console.log('Subject property:', subject.address || 'Manual entry')
    
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiKey) {
      throw new Error('OPENAI_API_KEY not configured')
    }

    // Convert PDFs to base64
    console.log('Converting PDFs to base64...')
    const compsBuffer = await (compsPdf as File).arrayBuffer()
    const competitionBuffer = await (competitionPdf as File).arrayBuffer()

    const compsBase64 = encodeBase64(compsBuffer)
    const competitionBase64 = encodeBase64(competitionBuffer)
    
    console.log('Comps PDF size:', compsBuffer.byteLength, 'bytes')
    console.log('Competition PDF size:', competitionBuffer.byteLength, 'bytes')

    // Step 1: Parse comps PDF with GPT-4o
    console.log('Step 1: Parsing comps PDF with GPT-4o...')
    const compsPrompt = `Extract ALL sold properties from this MLS comparables PDF.

For each property, extract:
- address (full street address)
- soldPrice (final sale price as number)
- soldDate (MM/DD/YYYY format)
- heatedSqft (heated square footage as number)
- bedrooms (number)
- bathrooms (number, can be decimal like 2.5)
- yearBuilt (4-digit year)
- lotSize (in acres, as number)
- daysOnMarket (DOM - number of days)
- subdivision (if listed)
- propertyType (Single Family, Condo, Townhouse, etc.)

Return ONLY a JSON array of objects. No markdown, no explanation.
Example: [{"address":"123 Main St","soldPrice":450000,"soldDate":"01/15/2024",...}]`

    const compsResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: compsPrompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:application/pdf;base64,${compsBase64}`,
              },
            },
          ],
        }],
        max_tokens: 4096,
      }),
    })

    if (!compsResponse.ok) {
      const error = await compsResponse.text()
      throw new Error(`OpenAI comps parse failed: ${error}`)
    }

    const compsData = await compsResponse.json()
    const compsText = compsData.choices[0].message.content
    const comps = safeJSONParse(compsText)
    
    const validComps = comps.filter((c: any) => validateProperty(c, 'comp'))
    console.log(`Parsed ${validComps.length} valid comps`)

    // Step 2: Parse competition PDF
    console.log('Step 2: Parsing competition PDF with GPT-4o...')
    const competitionPrompt = `Extract ALL active listings from this MLS competition PDF.

For each property, extract:
- address (full street address)
- listPrice (current list price as number)
- listDate (MM/DD/YYYY format)
- heatedSqft (heated square footage as number)
- bedrooms (number)
- bathrooms (number, can be decimal)
- yearBuilt (4-digit year)
- lotSize (in acres, as number)
- daysOnMarket (DOM - number of days)
- subdivision (if listed)
- propertyType (Single Family, Condo, Townhouse, etc.)
- status (Active, Pending, etc.)

Return ONLY a JSON array of objects. No markdown, no explanation.`

    const competitionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: competitionPrompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:application/pdf;base64,${competitionBase64}`,
              },
            },
          ],
        }],
        max_tokens: 4096,
      }),
    })

    if (!competitionResponse.ok) {
      const error = await competitionResponse.text()
      throw new Error(`OpenAI competition parse failed: ${error}`)
    }

    const competitionData = await competitionResponse.json()
    const competitionText = competitionData.choices[0].message.content
    const competition = safeJSONParse(competitionText)
    
    const validCompetition = competition.filter((c: any) => validateProperty(c, 'competition'))
    console.log(`Parsed ${validCompetition.length} valid competition listings`)

    // Step 3: Calculate adjustments
    console.log('Step 3: Calculating adjustments...')
    
    const adjustmentPrompt = `You are a professional real estate appraiser. Calculate CMA adjustments for each comparable sale.

SUBJECT PROPERTY:
${JSON.stringify(subject, null, 2)}

COMPARABLE SALES:
${JSON.stringify(validComps, null, 2)}

For each comp, calculate adjustments based on:
1. Square footage difference ($/sqft market rate)
2. Bedroom/bathroom count differences
3. Lot size differences
4. Age/condition differences
5. Location/subdivision differences
6. Market time adjustments (DOM)

Return JSON with this structure:
{
  "comps": [
    {
      ...original comp data,
      "adjustments": [
        {"reason": "Square footage", "amount": 15000, "direction": "positive"},
        {"reason": "Extra bedroom", "amount": -20000, "direction": "negative"}
      ],
      "totalAdjustment": -5000,
      "adjustedPrice": 445000,
      "weight": 0.85
    }
  ],
  "competition": [
    {
      ...original competition data,
      "adjustments": [...],
      "totalAdjustment": -3000,
      "adjustedPrice": 447000
    }
  ],
  "suggestedValue": 450000,
  "valueRange": {"low": 435000, "high": 465000},
  "avgPricePerSqft": 225,
  "narrative": "Multi-paragraph market analysis..."
}

Return ONLY valid JSON. No markdown.`

    const adjustmentResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{
          role: 'user',
          content: adjustmentPrompt,
        }],
        max_tokens: 8192,
      }),
    })

    if (!adjustmentResponse.ok) {
      const error = await adjustmentResponse.text()
      throw new Error(`OpenAI adjustment calc failed: ${error}`)
    }

    const adjustmentData = await adjustmentResponse.json()
    const adjustmentText = adjustmentData.choices[0].message.content
    const result = safeJSONParse(adjustmentText)

    console.log('=== CMA Generation Complete ===')
    console.log(`Suggested value: $${result.suggestedValue}`)
    console.log(`Range: $${result.valueRange.low} - $${result.valueRange.high}`)

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
