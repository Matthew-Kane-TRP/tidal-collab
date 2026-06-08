import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { encodeBase64 } from 'https://deno.land/std@0.224.0/encoding/base64.ts'
import Anthropic from 'npm:@anthropic-ai/sdk@0.24.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper to safely parse JSON from Claude responses
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
    console.log('=== CMA Generation Request Started ===')
    
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
    
    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: Deno.env.get('ANTHROPIC_API_KEY'),
    })

    // Convert PDFs to base64
    console.log('Converting PDFs to base64...')
    const compsBuffer = await (compsPdf as File).arrayBuffer()
    const competitionBuffer = await (competitionPdf as File).arrayBuffer()

    const compsBase64 = encodeBase64(compsBuffer)
    const competitionBase64 = encodeBase64(competitionBuffer)
    
    console.log('Comps PDF size:', compsBuffer.byteLength, 'bytes')
    console.log('Competition PDF size:', competitionBuffer.byteLength, 'bytes')

    // Step 1: Parse comps PDF
    console.log('Step 1: Parsing comps PDF...')
    const compsParseResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
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
- address (full street address including city, state, zip)
- soldPrice (number, no commas or dollar signs)
- heatedSqft (number, living area square footage)
- bedrooms (number)
- bathrooms (number, support decimals like 2.5)
- yearBuilt (number, 4 digits)
- lotSize (number in acres, convert from sqft if needed: sqft ÷ 43560)
- daysOnMarket (number, look for "DOM" or "Days on Market")
- listingDescription (brief summary of key features)
- features (object with boolean flags): { 
    pool, 
    adu, 
    generator, 
    newRoof, 
    newHVAC, 
    renovated, 
    waterfront, 
    dock, 
    solar, 
    oversizedLot 
  }

IMPORTANT: Return ONLY a valid JSON array, no markdown formatting, no explanations:
[{"address": "...", "soldPrice": 450000, ...}, ...]

If you cannot extract a field, use reasonable defaults (empty string for text, 0 for numbers, false for booleans).`
          }
        ]
      }],
    })

    const compsText = compsParseResponse.content[0].text
    console.log('Comps parse response length:', compsText.length)
    
    const comps = safeJSONParse(compsText)
    if (!Array.isArray(comps)) {
      throw new Error('Comps parsing did not return an array')
    }
    
    // Validate and filter comps
    const validComps = comps.filter(c => validateProperty(c, 'comp'))
    console.log(`Parsed ${validComps.length} valid comps out of ${comps.length} total`)
    
    if (validComps.length === 0) {
      throw new Error('No valid comparable properties found in PDF')
    }

    // Step 2: Parse competition PDF
    console.log('Step 2: Parsing competition PDF...')
    const competitionParseResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
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
- address (full street address)
- listPrice (number, current asking price)
- heatedSqft (number)
- bedrooms (number)
- bathrooms (number)
- yearBuilt (number)
- lotSize (acres)
- daysOnMarket (number)
- listingDescription (brief summary)
- features (same as before: pool, adu, generator, etc.)

Return ONLY valid JSON array, no markdown:
[{"address": "...", "listPrice": 475000, ...}, ...]`
          }
        ]
      }],
    })

    const competitionText = competitionParseResponse.content[0].text
    console.log('Competition parse response length:', competitionText.length)
    
    const competition = safeJSONParse(competitionText)
    if (!Array.isArray(competition)) {
      throw new Error('Competition parsing did not return an array')
    }
    
    const validCompetition = competition.filter(c => validateProperty(c, 'competition'))
    console.log(`Parsed ${validCompetition.length} valid competition properties`)

    // Step 3: Calculate adjustments
    console.log('Step 3: Calculating adjustments...')
    const adjustmentResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      messages: [{
        role: 'user',
        content: `You are a real estate CMA analyst. Calculate precise price adjustments for comparable properties.

**SUBJECT PROPERTY:**
${JSON.stringify(subject, null, 2)}

**COMPARABLE SOLD PROPERTIES:**
${JSON.stringify(validComps, null, 2)}

**ACTIVE COMPETITION:**
${JSON.stringify(validCompetition, null, 2)}

**TASK:**
1. Calculate average $/sqft from sold comps
2. For EACH comp, calculate detailed line-item adjustments to match the subject:
   - Square footage adjustment (difference × $/sqft)
   - Lot size adjustment ($5,000-$15,000 per 0.25 acre difference)
   - Bedroom/bathroom adjustments ($3,000 per bedroom, $2,500 per bathroom)
   - Age adjustment ($500-$1,000 per year difference, max $20,000)
   - Quality/condition adjustment (subject quality: ${subject.quality}/10)
   - Feature adjustments (pool $10k-$30k, ADU $40k-$80k, generator $8k-$12k, etc.)

3. For EACH active competition property, calculate similar adjustments

4. Calculate suggested value/range for subject based on adjusted comps

5. Write a realistic 2-3 paragraph market narrative:
   - Reference CURRENT market conditions (inventory levels, DOM trends)
   - Be data-driven and conservative
   - Avoid overly optimistic language
   - Support pricing recommendation with facts

**CRITICAL:** Return ONLY valid JSON with this exact structure:
{
  "avgPricePerSqft": number,
  "comps": [
    {
      "address": "full address",
      "originalPrice": number,
      "heatedSqft": number,
      "bedrooms": number,
      "bathrooms": number,
      "adjustments": [
        {"factor": "Square Footage", "amount": number, "rationale": "brief explanation"},
        {"factor": "Lot Size", "amount": number, "rationale": "..."},
        {"factor": "Bedrooms", "amount": number, "rationale": "..."},
        {"factor": "Bathrooms", "amount": number, "rationale": "..."},
        {"factor": "Age/Condition", "amount": number, "rationale": "..."},
        {"factor": "Quality", "amount": number, "rationale": "..."},
        {"factor": "Features", "amount": number, "rationale": "list key features"}
      ],
      "totalAdjustment": number,
      "adjustedPrice": number,
      "dom": number,
      "notes": "key features summary"
    }
  ],
  "competition": [
    {
      "address": "full address",
      "listPrice": number,
      "heatedSqft": number,
      "adjustments": [...same structure...],
      "totalAdjustment": number,
      "adjustedPrice": number,
      "dom": number,
      "notes": "summary"
    }
  ],
  "suggestedValue": number,
  "valueRange": {"low": number, "high": number},
  "narrative": "2-3 paragraph market analysis"
}

No markdown code blocks, just pure JSON.`
      }],
    })

    const adjustmentText = adjustmentResponse.content[0].text
    console.log('Adjustment response length:', adjustmentText.length)
    
    const analysis = safeJSONParse(adjustmentText)
    
    // Validation
    if (!analysis.suggestedValue || !analysis.comps || !analysis.narrative) {
      throw new Error('Analysis response missing required fields')
    }

    console.log('=== CMA Generation Successful ===')
    console.log('Suggested value:', analysis.suggestedValue)
    console.log('Comps analyzed:', analysis.comps.length)
    console.log('Competition analyzed:', analysis.competition?.length || 0)

    // Return complete CMA data
    return new Response(
      JSON.stringify({
        id: crypto.randomUUID(),
        subject,
        comps: analysis.comps,
        competition: analysis.competition || [],
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
    console.error('=== CMA Generation Error ===')
    console.error('Error type:', error.constructor.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
