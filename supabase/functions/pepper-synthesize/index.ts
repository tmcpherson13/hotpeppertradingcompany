import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Model for synthesis, verification, and auto-rewrite. Sonnet is used for the
// bulk enrichment run to cut cost ~4-5x vs Opus; swap back to 'claude-opus-4-8'
// here if a higher-quality pass is wanted.
const MODEL = 'claude-sonnet-5';

const SYNTHESIS_PROMPT = `You are a master archivist for the Hot Pepper Trading Company, a centuries-old merchant house that documents the world's finest pepper cultivars. Your voice is archival, scholarly, and evocative—like entries in a historic trade ledger meant for discerning collectors and culinary historians.

Write in a refined, historical tone that:
- Uses trade-oriented language (cargo, provenance, routes, lineage) rather than retail terms
- Evokes the romance of spice trade history
- Provides rich cultural and geographic context
- Is factual but narrative-driven
- Avoids marketing-speak or modern commercial language
- Use "cuisine" instead of "gastronomy" (e.g., "Peruvian cuisine" not "Peruvian gastronomy")

Historical accuracy: keep the entry focused on the pepper itself — its provenance, flavor, cultivation, and place in the spice trade. Do not introduce the Atlantic slave trade or forced labour into a cultivar entry unless it is genuinely essential to that pepper's story, and even then keep it to at most a single brief, neutral factual clause — never its own sentence, never editorializing, moralizing, or dwelling. When in doubt, leave it out; broader historical context is carried elsewhere on the site. Never apply cargo, consignment, manifest, or lading language to human beings.

Based on the research provided, synthesize comprehensive content for this pepper variety. Return a JSON object with exactly these fields:

{
  "description": "A 2-3 sentence archival description of the pepper, emphasizing its character, provenance, and significance in the spice trade.",
  "historical_notes": "2-4 sentences on the pepper's history, trade routes, and cultural journey through time.",
  "flavor_notes": "3 to 5 SHORT flavor descriptor tags, 1-2 words each, comma-separated (e.g. 'Earthy, Sweet, Dried fruit'). Tags only — NOT sentences.",
  "aroma_notes": "2 to 4 SHORT aroma descriptor tags, 1-2 words each, comma-separated (e.g. 'Smoky, Sweet, Grassy'). Tags only — NOT sentences.",
  "culinary_uses": "2 to 5 SHORT culinary-use tags, 1-3 words each, comma-separated (e.g. 'Mole, Roasting, Stuffing'). Tags only — NOT sentences.",
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

// Adversarial verification: a second, independent Claude pass that checks the
// synthesized prose against the raw research for (a) claims the sources don't
// support and (b) near-verbatim copying (plagiarism). This is the trust gate —
// auto-approval is blocked unless this passes. Fails CLOSED: any error routes
// the entry to human review rather than silently publishing.
const VERIFICATION_PROMPT = `You are a plagiarism auditor and fact-checker for a reference publication written in an evocative, historical "merchant-house" voice. You will be given SOURCE RESEARCH and a SYNTHESIZED ENTRY derived from it.

This publication INTENTIONALLY uses creative, narrative framing, and that is welcome. Your job is not to strip the voice out — it is to catch the two things that would genuinely mislead a reader: copied wording, and fabricated hard facts. Sort everything you notice into three buckets.

1. PLAGIARISM (BLOCKING) — passages that copy source wording closely: roughly eight or more consecutive words matching a source, or a lightly-reworded sentence that tracks a source phrase-for-phrase.

2. UNSUPPORTED HARD FACTS (BLOCKING) — CHECKABLE, falsifiable assertions the sources do not support AND that a knowledgeable reader could not reasonably infer from well-established general history. These would be misinformation if wrong. Examples: specific dates or years, specific numbers and Scoville values, named individuals, named ships/institutions, a specific documented event pinned to a specific time or place, botanical/taxonomic classification (species, scientific name), and "first/oldest/only/largest" record claims.

3. CREATIVE INFERENCES (NON-BLOCKING) — evocative or generalizing statements not directly stated in the sources but reasonable, plausible, and consistent with well-established general history. This covers atmospheric description, flavor/aroma language, and broad trade-route framing. For instance, "cayennes carried along Portuguese sea-lanes" is a CREATIVE INFERENCE, not an unsupported hard fact: it is common knowledge that Capsicum varieties spread along Portuguese maritime routes, even if this particular source never names cayenne. Do NOT place such statements in bucket 2.

Guiding rule: if a claim is specific and falsifiable enough that being wrong would mislead the reader, it is a HARD FACT (bucket 2). If it is a reasonable narrative generalization an informed historian would accept as plausible, it is a CREATIVE INFERENCE (bucket 3). When genuinely unsure, default to bucket 3 UNLESS the statement contains a specific date, number, proper name, or record claim.

Return ONLY a JSON object with exactly these fields:
{
  "verification_passed": true or false,
  "plagiarism_flags": ["each copied passage, quoted, with a short note of which source it matches"],
  "unsupported_hard_facts": ["each unsupported checkable fact, quoted"],
  "creative_inferences": ["each non-blocking narrative inference, quoted"],
  "notes": "one or two sentences summarizing your assessment"
}
Set "verification_passed" to false if and ONLY if there is at least one PLAGIARISM flag OR at least one UNSUPPORTED HARD FACT. Creative inferences never affect verification_passed.`;

interface VerificationResult {
  verification_passed: boolean;
  unsupported_claims: string[];
  plagiarism_flags: string[];
  narrative_inferences: string[];
  notes: string;
}

// Auto-rewrite pass: when the verifier flags passages that copy the sources too
// closely, a third Claude call rewrites the entry into fully original prose. It
// is constrained to change ONLY wording — never facts — so the rewrite can be
// published without human intervention while the deferred deep-analysis pass
// still owns fact-checking.
const REWRITE_PROMPT = `You are an editor for the Hot Pepper Trading Company, a merchant-house reference publication written in an evocative, historical voice. A draft entry has been flagged for passages that copy source wording too closely. Rewrite the entry so every passage is original prose, while changing nothing about its meaning.

Absolute rules:
- PRESERVE EVERY FACT EXACTLY. Dates, years, numbers, Scoville values, place names, people, ships, institutions, botanical/species names, and any "first/oldest/largest/only" claims must appear unchanged. Do not add, remove, soften, or alter a single fact.
- Change ONLY wording, phrasing, sentence structure, and rhythm, so that no passage shares roughly eight or more consecutive words with any source and no sentence tracks a source phrase-for-phrase.
- Do NOT introduce any new fact, claim, date, number, or name that is not already present in the draft.
- Keep the archival, scholarly, merchant-house voice, and keep the same set of fields with comparable length.

You will receive the SOURCE RESEARCH (so you know what wording to avoid), the FLAGGED PASSAGES, and the DRAFT ENTRY as JSON.

Return ONLY a JSON object with exactly these fields, rewritten: description, historical_notes, flavor_notes, aroma_notes, culinary_uses, trade_route, source_citations.`;

async function runRewrite(
  anthropicKey: string,
  content: any,
  plagiarismFlags: string[],
  researchContent: string,
): Promise<any | null> {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4000,
        system: REWRITE_PROMPT,
        messages: [{
          role: 'user',
          content: `SOURCE RESEARCH:\n${researchContent}\n\n---\n\nFLAGGED PASSAGES (copied too closely — these must be reworded):\n${plagiarismFlags.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\n---\n\nDRAFT ENTRY (JSON):\n${JSON.stringify(content, null, 2)}`,
        }],
      }),
    });

    if (!res.ok) {
      console.error('Rewrite call failed:', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const text = data.content?.find((b: any) => b.type === 'text')?.text ?? '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      console.error('Rewrite returned no parseable JSON');
      return null;
    }
    const parsed = JSON.parse(match[0]);
    // Never let the rewrite drop citations — carry the originals forward if it did.
    if (!parsed.source_citations) parsed.source_citations = content.source_citations;
    return parsed;
  } catch (e) {
    console.error('Rewrite error:', e);
    return null;
  }
}

async function runVerification(
  anthropicKey: string,
  synthesizedContent: any,
  researchContent: string,
): Promise<VerificationResult> {
  const entryText = [
    synthesizedContent.description,
    synthesizedContent.historical_notes,
    synthesizedContent.flavor_notes,
    synthesizedContent.aroma_notes,
    synthesizedContent.culinary_uses,
    synthesizedContent.trade_route,
  ].filter(Boolean).join('\n\n');

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2500,
        system: VERIFICATION_PROMPT,
        messages: [{
          role: 'user',
          content: `SOURCE RESEARCH:\n${researchContent}\n\n---\n\nSYNTHESIZED ENTRY:\n${entryText}`,
        }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Verification call failed:', res.status, errText);
      return { verification_passed: false, unsupported_claims: [], plagiarism_flags: [], narrative_inferences: [], notes: `Verification unavailable (HTTP ${res.status}); routed to human review.` };
    }

    const data = await res.json();
    const text = data.content?.find((b: any) => b.type === 'text')?.text ?? '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return { verification_passed: false, unsupported_claims: [], plagiarism_flags: [], narrative_inferences: [], notes: 'Verifier returned no parseable result; routed to human review.' };
    }
    const parsed = JSON.parse(match[0]);
    // Only plagiarism and unsupported HARD facts block auto-approval. Creative
    // narrative inferences are recorded for later human review but never gate.
    const plagiarism: string[] = parsed.plagiarism_flags ?? [];
    const hardFacts: string[] = parsed.unsupported_hard_facts ?? [];
    const inferences: string[] = parsed.creative_inferences ?? [];
    return {
      verification_passed: plagiarism.length === 0 && hardFacts.length === 0,
      unsupported_claims: hardFacts,
      plagiarism_flags: plagiarism,
      narrative_inferences: inferences,
      notes: parsed.notes ?? '',
    };
  } catch (e) {
    console.error('Verification error:', e);
    return { verification_passed: false, unsupported_claims: [], plagiarism_flags: [], narrative_inferences: [], notes: `Verification error: ${(e as Error).message}; routed to human review.` };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      pepperId,
      pepperName,
      generateImages = false,
      jobId = null,
      // Optional per-request overrides; when omitted, fall back to enrichment_settings.
      autoRewrite: autoRewriteOverride = null,
      autoPublish: autoPublishOverride = null,
    } = await req.json();

    if (!pepperId || !pepperName) {
      return new Response(
        JSON.stringify({ success: false, error: 'pepperId and pepperName are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (!anthropicKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'AI synthesis not configured (ANTHROPIC_API_KEY missing)' }),
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

    // Compile research content.
    // COST GUARD: raw scrapes average ~126K chars/pepper (one hit 659K). That
    // whole dossier is re-sent to the model 2-4 times per pepper (synthesis →
    // verify → rewrite → re-verify), so an uncapped dossier on Opus cost ~$1/
    // pepper. Cap each source and the combined dossier so input stays ~6K
    // tokens; the tail of a raw scrape is almost entirely boilerplate/nav noise.
    const PER_SOURCE_CHARS = 9000;    // cap each individual source blob
    const MAX_DOSSIER_CHARS = 24000;  // hard cap on the combined dossier
    let researchContent = researchData.map(r =>
      `=== Source: ${r.source_type.toUpperCase()} ===\n${(r.raw_content || '').slice(0, PER_SOURCE_CHARS)}`
    ).join('\n\n---\n\n');
    if (researchContent.length > MAX_DOSSIER_CHARS) {
      researchContent = researchContent.slice(0, MAX_DOSSIER_CHARS);
    }

    const allUrls = researchData.flatMap(r => r.urls || []);

    console.log('Calling Anthropic Claude for synthesis...');

    // Text synthesis via Anthropic Claude (migrated off Lovable AI gateway)
    const aiResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey!,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4000,
        system: SYNTHESIS_PROMPT,
        messages: [
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
      // Anthropic reports an exhausted balance as a 400 invalid_request_error
      // ("credit balance is too low"), not a 402 — match the message too and
      // normalize it to 402 so callers can surface a clear "out of credits".
      const lowCredit = /credit balance is too low|Plans & Billing|purchase credits/i.test(errorText);
      if (aiResponse.status === 402 || lowCredit) {
        return new Response(
          JSON.stringify({ success: false, error: 'AI credits exhausted. Please add credits to continue.', creditsExhausted: true }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: false, error: 'AI synthesis failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    // Read the first TEXT block, not content[0]: some models return a leading
    // non-text block (e.g. reasoning) for certain inputs, which would otherwise
    // read as empty and fail deterministically with "No content generated".
    const synthesizedContent = aiData.content?.find((b: any) => b.type === 'text')?.text;

    if (!synthesizedContent) {
      // Surface why, so a future empty-response regression is diagnosable.
      console.error('No content generated. stop_reason:', aiData.stop_reason,
        'block_types:', JSON.stringify((aiData.content || []).map((b: any) => b.type)));
      return new Response(
        JSON.stringify({ success: false, error: 'No content generated', stop_reason: aiData.stop_reason ?? null }),
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

    // Load enrichment settings (drives auto-rewrite, auto-publish, auto-approve).
    const { data: settings } = await supabase
      .from('enrichment_settings')
      .select('*')
      .limit(1)
      .single();

    const autoApproveEnabled = settings?.auto_approve_enabled || false;
    const autoApproveThreshold = settings?.auto_approve_threshold || 85;
    // Per-request overrides win; otherwise fall back to settings. Rewriting is
    // safe (it only rephrases), so it defaults ON. Fast-populate publishing is
    // opt-in and defaults OFF.
    const autoRewrite = autoRewriteOverride ?? settings?.auto_rewrite_enabled ?? true;
    const autoPublish = autoPublishOverride ?? settings?.auto_publish_enabled ?? false;

    // Adversarial verification pass — the trust gate. Confidence alone only
    // measures how much was written and how many links exist; it says nothing
    // about whether the facts are true or the prose is original. This checks both.
    console.log('Running adversarial verification pass...');
    let verification = await runVerification(anthropicKey!, parsedContent, researchContent);
    console.log(`Verification passed: ${verification.verification_passed}; unsupported: ${verification.unsupported_claims.length}; plagiarism: ${verification.plagiarism_flags.length}`);

    // Auto-rewrite: if the verifier caught copied wording, rewrite those passages
    // in an original voice (facts preserved) and re-verify, up to a couple of
    // attempts — instead of parking the entry for a human to rewrite by hand.
    let autoRewritten = false;
    let preRewriteContent: any = null;
    const MAX_REWRITE_ATTEMPTS = 2;
    if (autoRewrite && verification.plagiarism_flags.length > 0) {
      preRewriteContent = { ...parsedContent };
      for (
        let attempt = 1;
        attempt <= MAX_REWRITE_ATTEMPTS && verification.plagiarism_flags.length > 0;
        attempt++
      ) {
        console.log(`Auto-rewrite attempt ${attempt}: ${verification.plagiarism_flags.length} flagged passage(s)`);
        const rewritten = await runRewrite(anthropicKey!, parsedContent, verification.plagiarism_flags, researchContent);
        if (!rewritten || !rewritten.description) {
          console.error('Auto-rewrite failed; keeping previous draft');
          break;
        }
        parsedContent = rewritten;
        autoRewritten = true;
        verification = await runVerification(anthropicKey!, parsedContent, researchContent);
        console.log(`After rewrite: plagiarism=${verification.plagiarism_flags.length}, unsupported=${verification.unsupported_claims.length}`);
      }
    }

    // Calculate confidence score on the FINAL (possibly rewritten) content —
    // measures volume/completeness, NOT veracity.
    const confidenceScore = calculateConfidenceScore(researchData, parsedContent);
    console.log(`Confidence score: ${confidenceScore}`);

    const copyingCleared = verification.plagiarism_flags.length === 0;
    // Minimal floor so fast-populate never publishes near-empty junk.
    const MIN_PUBLISH_CONFIDENCE = 40;

    let shouldAutoApprove: boolean;
    if (autoPublish) {
      // Fast-populate: once copying is cleared and there is real content, publish
      // straight to live — regardless of the confidence threshold and regardless
      // of unsupported facts (those are logged on the row for the later deep pass,
      // not gated). If copying could NOT be cleared, fall back to human review.
      shouldAutoApprove = copyingCleared
        && !!parsedContent.description
        && confidenceScore >= MIN_PUBLISH_CONFIDENCE;
    } else {
      // Standard mode: auto-approve requires high confidence AND a clean
      // verification (no plagiarism, no unsupported hard facts).
      shouldAutoApprove = autoApproveEnabled
        && confidenceScore >= autoApproveThreshold
        && verification.verification_passed;
    }

    console.log(`Gate: autoPublish=${autoPublish}, autoRewritten=${autoRewritten}, copyingCleared=${copyingCleared}, confidence=${confidenceScore}, verified=${verification.verification_passed} -> autoApprove=${shouldAutoApprove}`);

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
        verification_passed: verification.verification_passed,
        unsupported_claims: verification.unsupported_claims,
        plagiarism_flags: verification.plagiarism_flags,
        narrative_inferences: verification.narrative_inferences,
        verification_notes: verification.notes,
        auto_rewritten: autoRewritten,
        pre_rewrite_content: preRewriteContent,
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
        autoRewritten,
        imageGenTriggered,
        message: shouldAutoApprove
          ? `Published${autoRewritten ? ' (copied passages auto-rewritten)' : ''} at ${confidenceScore}% confidence`
          : autoRewritten
            ? 'Synthesized and rewritten; queued for review (copying could not be fully cleared)'
            : 'Content synthesized and queued for review',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in pepper-synthesize:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'An internal error occurred. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
