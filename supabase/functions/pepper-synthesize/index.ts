import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYNTHESIS_PROMPT = `You are a master archivist for the Hot Pepper Trading Company, a centuries-old merchant house that documents the world's finest pepper cultivars. Your voice is archival, scholarly, and evocative—like entries in a historic trade ledger meant for discerning collectors and culinary historians.

Write in a refined, historical tone that:
- Uses trade-oriented language (cargo, provenance, routes, lineage) rather than retail terms
- Evokes the romance of spice trade history
- Provides rich cultural and geographic context
- Is factual but narrative-driven
- Avoids marketing-speak or modern commercial language
- Use "cuisine" instead of "gastronomy" (e.g., "Peruvian cuisine" not "Peruvian gastronomy")

Based on the research provided, synthesize comprehensive content for this pepper variety. Return a JSON object with exactly these fields:

{
  "description": "A 2-3 sentence archival description of the pepper, emphasizing its character, provenance, and significance in the spice trade.",
  "historical_notes": "2-4 sentences on the pepper's history, trade routes, and cultural journey through time.",
  "flavor_notes": "Specific tasting notes describing the pepper's flavor profile—heat characteristics, underlying flavors, aromatic qualities.",
  "aroma_notes": "A brief description of the pepper's aromatic profile when fresh, dried, or cooked.",
  "culinary_uses": "Traditional and contemporary culinary applications, specific regional dishes, and preparation methods.",
  "trade_route": "The historical or contemporary trade route most associated with this pepper (if applicable).",
  "source_citations": ["Array of source URLs or references used"]
}

Be specific, accurate, and evocative. Draw from the provided research but synthesize it into the merchant-house voice.`;

// Calculate confidence score based on research quality and content completeness
function calculateConfidenceScore(
  researchData: any[],
  parsedContent: any
): number {
  let score = 0;

  // Source count scoring (max 30 points)
  const sourceCount = researchData.length;
  if (sourceCount >= 4) score += 30;
  else if (sourceCount >= 3) score += 25;
  else if (sourceCount >= 2) score += 15;
  else if (sourceCount >= 1) score += 5;

  // Content completeness scoring (max 30 points)
  const fields = ['description', 'historical_notes', 'flavor_notes', 'aroma_notes', 'culinary_uses', 'trade_route'];
  const populatedFields = fields.filter(f => parsedContent[f] && parsedContent[f].trim().length > 0);
  score += Math.round((populatedFields.length / fields.length) * 30);

  // Source quality scoring (max 20 points) - check for academic/authoritative domains
  const qualityDomains = ['.edu', '.gov', '.org', 'wikipedia', 'britannica', 'smithsonian', 'university'];
  const allUrls = researchData.flatMap(r => r.urls || []).join(' ').toLowerCase();
  const qualityMatches = qualityDomains.filter(domain => allUrls.includes(domain)).length;
  score += Math.min(qualityMatches * 5, 20);

  // Word count adequacy scoring (max 20 points)
  const contentText = fields.map(f => parsedContent[f] || '').join(' ');
  const wordCount = contentText.split(/\s+/).length;
  if (wordCount >= 200) score += 20;
  else if (wordCount >= 150) score += 15;
  else if (wordCount >= 100) score += 10;
  else if (wordCount >= 50) score += 5;

  return Math.min(score, 100);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pepperId, pepperName, generateImages = false, jobId = null } = await req.json();

    if (!pepperId || !pepperName) {
      return new Response(
        JSON.stringify({ success: false, error: 'pepperId and pepperName are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableKey = Deno.env.get('LOVABLE_API_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (!lovableKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'AI synthesis not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    console.log(`Starting synthesis for pepper: ${pepperName} (${pepperId})`);

    // Fetch research data
    const { data: researchData, error: fetchError } = await supabase
      .from('pepper_research')
      .select('*')
      .eq('pepper_id', pepperId)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching research:', fetchError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to fetch research data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!researchData || researchData.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'No research data available. Please run research first.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Compile research content
    const researchContent = researchData.map(r => 
      `=== Source: ${r.source_type.toUpperCase()} ===\n${r.raw_content}`
    ).join('\n\n---\n\n');

    const allUrls = researchData.flatMap(r => r.urls || []);

    console.log('Calling Lovable AI for synthesis...');

    // Call Lovable AI for synthesis
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYNTHESIS_PROMPT },
          { 
            role: 'user', 
            content: `Pepper Name: ${pepperName}\n\nResearch Data:\n${researchContent}\n\nSource URLs for citation:\n${allUrls.join('\n')}`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI gateway error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: false, error: 'AI synthesis failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const synthesizedContent = aiData.choices?.[0]?.message?.content;

    if (!synthesizedContent) {
      return new Response(
        JSON.stringify({ success: false, error: 'No content generated' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('AI synthesis complete, parsing response...');

    // Parse the JSON response from AI
    let parsedContent;
    try {
      // Try to extract JSON from the response (may be wrapped in markdown code blocks)
      const jsonMatch = synthesizedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.log('Raw response:', synthesizedContent);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to parse AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate confidence score
    const confidenceScore = calculateConfidenceScore(researchData, parsedContent);
    console.log(`Confidence score: ${confidenceScore}`);

    // Check auto-approval settings
    const { data: settings } = await supabase
      .from('enrichment_settings')
      .select('*')
      .limit(1)
      .single();

    const autoApproveEnabled = settings?.auto_approve_enabled || false;
    const autoApproveThreshold = settings?.auto_approve_threshold || 85;
    const shouldAutoApprove = autoApproveEnabled && confidenceScore >= autoApproveThreshold;

    console.log(`Auto-approve: ${autoApproveEnabled}, threshold: ${autoApproveThreshold}, will auto-approve: ${shouldAutoApprove}`);

    // Store in enrichment queue
    const researchIds = researchData.map(r => r.id);
    const { data: queueEntry, error: insertError } = await supabase
      .from('pepper_enrichment_queue')
      .insert({
        pepper_id: pepperId,
        proposed_description: parsedContent.description,
        proposed_historical_notes: parsedContent.historical_notes,
        proposed_flavor_notes: parsedContent.flavor_notes,
        proposed_aroma_notes: parsedContent.aroma_notes,
        proposed_culinary_uses: parsedContent.culinary_uses,
        proposed_trade_route: parsedContent.trade_route,
        source_citations: parsedContent.source_citations || allUrls,
        research_ids: researchIds,
        status: shouldAutoApprove ? 'approved' : 'pending',
        confidence_score: confidenceScore,
        auto_approved: shouldAutoApprove,
        created_by: userId,
        reviewed_by: shouldAutoApprove ? userId : null,
        reviewed_at: shouldAutoApprove ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error storing enrichment proposal:', insertError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to store enrichment proposal' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If auto-approved, also apply the enrichment to pepper_overrides
    if (shouldAutoApprove && queueEntry) {
      console.log('Auto-approving high-confidence enrichment...');

      // Check if override already exists
      const { data: existingOverride } = await supabase
        .from('pepper_overrides')
        .select('id, enrichment_version')
        .eq('pepper_id', pepperId)
        .single();

      if (existingOverride) {
        // Update existing override
        await supabase
          .from('pepper_overrides')
          .update({
            description: parsedContent.description,
            historical_notes: parsedContent.historical_notes,
            flavor_notes: parsedContent.flavor_notes,
            aroma_notes: parsedContent.aroma_notes,
            culinary_uses: parsedContent.culinary_uses,
            trade_route: parsedContent.trade_route,
            source_citations: parsedContent.source_citations || allUrls,
            enrichment_version: (existingOverride.enrichment_version || 0) + 1,
            updated_by: userId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingOverride.id);
      } else {
        // Create new override
        await supabase
          .from('pepper_overrides')
          .insert({
            pepper_id: pepperId,
            description: parsedContent.description,
            historical_notes: parsedContent.historical_notes,
            flavor_notes: parsedContent.flavor_notes,
            aroma_notes: parsedContent.aroma_notes,
            culinary_uses: parsedContent.culinary_uses,
            trade_route: parsedContent.trade_route,
            source_citations: parsedContent.source_citations || allUrls,
            enrichment_version: 1,
            updated_by: userId,
          });
      }

      console.log('Auto-approval applied successfully');
    }

    console.log('Synthesis stored in enrichment queue');

    // Trigger image generation if enabled
    let imageGenTriggered = false;
    if (generateImages) {
      try {
        console.log('Triggering image generation...');
        
        // Fetch Wikimedia reference images from research
        let referenceImageUrls: string[] = [];
        try {
          const { data: wikimediaResearch } = await supabase
            .from('pepper_research')
            .select('metadata')
            .eq('pepper_id', pepperId)
            .eq('source_type', 'wikimedia')
            .maybeSingle();

          if (wikimediaResearch?.metadata?.images) {
            referenceImageUrls = (wikimediaResearch.metadata.images as any[])
              .map((img: any) => img.url)
              .filter(Boolean)
              .slice(0, 5); // Limit to 5 reference images
          }
          console.log(`Found ${referenceImageUrls.length} reference images for vision analysis`);
        } catch (refErr) {
          console.error('Error fetching reference images:', refErr);
        }
        
        const imageGenResponse = await fetch(`${supabaseUrl}/functions/v1/pepper-image-generate`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pepperId,
            pepperName,
            jobId,
            referenceImageUrls,
            styles: ['ai-botanical', 'ai-photo-plant', 'ai-photo-individual'],
          }),
        });

        if (imageGenResponse.ok) {
          imageGenTriggered = true;
          console.log('Image generation triggered successfully');
        } else {
          console.error('Image generation failed:', await imageGenResponse.text());
        }
      } catch (imgErr) {
        console.error('Error triggering image generation:', imgErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: queueEntry,
        confidenceScore,
        autoApproved: shouldAutoApprove,
        imageGenTriggered,
        message: shouldAutoApprove 
          ? `Content auto-approved with ${confidenceScore}% confidence` 
          : 'Content synthesized and queued for review',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in pepper-synthesize:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
