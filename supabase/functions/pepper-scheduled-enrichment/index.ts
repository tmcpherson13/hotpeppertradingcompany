import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// In-stock pepper IDs (prioritized for enrichment in the legacy scheduled path).
const IN_STOCK_PEPPERS = [
  'aleppo', 'aji-amarillo', 'aji-limon', 'bhut-jolokia', 'birds-eye-thai',
  'carolina-reaper', 'cayenne', 'chipotle', 'datil', 'devils-breath',
  'espelette', 'fish-pepper', 'fresno', 'ghost', 'gochugaru',
  'guajillo', 'habanero', 'hatch-green', 'hungarian-wax', 'isot',
  'jalapeno', 'kashmiri', 'korean-gochugaru', 'malagueta', 'maras',
  'pequin', 'peri-peri', 'poblano', 'scotch-bonnet', 'serrano',
  'shishito', 'tabasco', 'thai-birds-eye', 'trinidad-scorpion', 'urfa-biber',
  'wiri-wiri'
];

// ---- Autonomous runner ----------------------------------------------------
// Driven by a pg_cron tick. Each invocation processes a small batch (research
// if needed, then synthesize with auto-rewrite + auto-publish) from the full
// pepper_catalog, guarded by a DB lock so ticks never overlap. Idempotent: a
// failed or timed-out tick just gets retried on the next cron fire, and already
// enriched / pending peppers are skipped — so it is self-healing and safe to
// run unattended until the whole catalogue is populated.
const LOCK_STALE_MS = 15 * 60 * 1000; // a lock older than this is treated as dead
const BATCH_WALL_MS = 100_000;        // stop starting new items past ~100s

async function runAutorun(supabase: any, supabaseUrl: string, supabaseKey: string) {
  const { data: settings } = await supabase
    .from('enrichment_settings').select('*').limit(1).single();
  if (!settings || !settings.autorun_enabled) {
    console.log('autorun: disabled, nothing to do');
    return;
  }

  // Lock: skip if another tick is still in flight (and the lock is fresh).
  const now = Date.now();
  const lockedAt = settings.autorun_locked_at ? new Date(settings.autorun_locked_at).getTime() : 0;
  if (lockedAt && now - lockedAt < LOCK_STALE_MS) {
    console.log('autorun: a batch is already running, skipping this tick');
    return;
  }
  await supabase.from('enrichment_settings').update({
    autorun_locked_at: new Date().toISOString(),
    autorun_status: 'running',
    autorun_last_tick: new Date().toISOString(),
  }).eq('id', settings.id);

  try {
    // Build the remaining work-list from the canonical catalogue.
    const [{ data: catalog }, { data: enriched }, { data: pendingQ }, { data: research }] = await Promise.all([
      supabase.from('pepper_catalog').select('id,name,in_stock'),
      supabase.from('pepper_overrides').select('pepper_id').gt('enrichment_version', 0),
      supabase.from('pepper_enrichment_queue').select('pepper_id').eq('status', 'pending'),
      supabase.from('pepper_research').select('pepper_id'),
    ]);

    const enrichedIds = new Set((enriched || []).map((r: any) => r.pepper_id));
    const pendingIds = new Set((pendingQ || []).map((r: any) => r.pepper_id));
    const researchedIds = new Set((research || []).map((r: any) => r.pepper_id));

    const remaining = (catalog || [])
      .filter((p: any) => !enrichedIds.has(p.id) && !pendingIds.has(p.id))
      .sort((a: any, b: any) => (b.in_stock ? 1 : 0) - (a.in_stock ? 1 : 0)); // in-stock first

    if (remaining.length === 0) {
      // Whole catalogue populated — stop the loop. Deep analysis is a ranking
      // over the signals already stored on the queue rows (no separate pass).
      await supabase.from('enrichment_settings').update({
        autorun_enabled: false,
        autorun_status: 'complete',
        autorun_locked_at: null,
        autorun_last_tick: new Date().toISOString(),
      }).eq('id', settings.id);
      console.log('autorun: complete — nothing left to enrich');
      return;
    }

    const batchSize = Math.max(1, settings.autorun_batch_size || 1);
    const batch = remaining.slice(0, batchSize);
    const startTs = Date.now();
    let done = 0;
    let creditBlocked = false;

    for (const p of batch) {
      if (Date.now() - startTs > BATCH_WALL_MS) break; // don't start a new item near the wall
      try {
        if (!researchedIds.has(p.id)) {
          const rr = await fetch(`${supabaseUrl}/functions/v1/pepper-research`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${supabaseKey}` },
            body: JSON.stringify({ pepperName: p.name, pepperId: p.id, sources: ['firecrawl', 'perplexity', 'wikimedia'] }),
          });
          if (!rr.ok) { console.error(`autorun: research failed for ${p.id} (${rr.status})`); continue; }
        }
        // autoRewrite + autoPublish are forced on here so the autonomous run
        // actually populates live content rather than just filling the queue.
        const sr = await fetch(`${supabaseUrl}/functions/v1/pepper-synthesize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${supabaseKey}` },
          body: JSON.stringify({ pepperId: p.id, pepperName: p.name, autoRewrite: true, autoPublish: true }),
        });
        if (sr.ok) { done++; console.log(`autorun: enriched ${p.id}`); }
        else {
          if (sr.status === 402) creditBlocked = true; // out of Anthropic credits
          console.error(`autorun: synthesize failed for ${p.id} (${sr.status})`);
        }
        await new Promise((r) => setTimeout(r, 1500));
      } catch (e) {
        console.error(`autorun: error on ${p.id}:`, e);
      }
    }

    // Surface an out-of-credits stall as a distinct status so the UI can show
    // it clearly; the loop stays enabled and auto-resumes once credits return.
    await supabase.from('enrichment_settings').update({
      autorun_locked_at: null,
      autorun_status: (creditBlocked && done === 0) ? 'blocked_credits' : 'running',
      autorun_last_tick: new Date().toISOString(),
      last_run_at: new Date().toISOString(),
      last_run_count: done,
    }).eq('id', settings.id);
    console.log(`autorun: processed ${done}/${batch.length}, ~${remaining.length - batch.length} remaining${creditBlocked ? ' (credits exhausted)' : ''}`);
  } catch (e) {
    console.error('autorun: batch error, releasing lock:', e);
    await supabase.from('enrichment_settings').update({ autorun_locked_at: null }).eq('id', settings.id);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json().catch(() => ({}));

    // Autonomous cron tick: ack immediately, do the batch in the background so
    // the caller (pg_cron) never waits on the AI calls.
    if (body.autorun === true) {
      // @ts-ignore EdgeRuntime is provided by the Supabase runtime
      EdgeRuntime.waitUntil(runAutorun(supabase, supabaseUrl, supabaseKey));
      return new Response(JSON.stringify({ success: true, mode: 'autorun', accepted: true }),
        { status: 202, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ---- Legacy scheduled / manual "Run Now" path (synthesize researched peppers) ----
    console.log('Starting scheduled enrichment check...');

    const { data: settings, error: settingsError } = await supabase
      .from('enrichment_settings').select('*').limit(1).single();

    if (settingsError || !settings) {
      return new Response(JSON.stringify({ success: false, error: 'No enrichment settings configured' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const forceRun = body.force === true;

    if (!forceRun && !settings.schedule_enabled) {
      return new Response(JSON.stringify({ success: true, message: 'Scheduled enrichment is disabled' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const now = new Date();
    const nextRun = settings.schedule_next_run ? new Date(settings.schedule_next_run) : null;
    if (!forceRun && nextRun && now < nextRun) {
      return new Response(JSON.stringify({ success: true, message: 'Not yet time for scheduled run', nextRun: nextRun.toISOString() }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { data: enrichedPeppers } = await supabase
      .from('pepper_overrides').select('pepper_id').gt('enrichment_version', 0);
    const enrichedIds = new Set(enrichedPeppers?.map((p: any) => p.pepper_id) || []);

    const { data: pendingQueue } = await supabase
      .from('pepper_enrichment_queue').select('pepper_id').eq('status', 'pending');
    const pendingIds = new Set(pendingQueue?.map((p: any) => p.pepper_id) || []);

    const { data: researchedPeppers } = await supabase.from('pepper_research').select('pepper_id');
    const researchedIds = new Set(researchedPeppers?.map((p: any) => p.pepper_id) || []);

    const candidatesInStock = IN_STOCK_PEPPERS.filter((id) =>
      researchedIds.has(id) && !enrichedIds.has(id) && !pendingIds.has(id));
    const candidatesOther = Array.from(researchedIds)
      .filter((id) => !enrichedIds.has(id) && !pendingIds.has(id) && !IN_STOCK_PEPPERS.includes(id));
    const candidates = [...candidatesInStock, ...candidatesOther];

    const batchSize = 5;
    const batch = candidates.slice(0, batchSize);

    if (batch.length === 0) {
      await supabase.from('enrichment_settings').update({
        last_run_at: now.toISOString(), last_run_count: 0,
        schedule_next_run: calculateNextRun(settings.schedule_frequency), updated_at: now.toISOString(),
      }).eq('id', settings.id);
      return new Response(JSON.stringify({ success: true, message: 'No peppers available for enrichment', processed: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    let successCount = 0, errorCount = 0;
    for (const pepperId of batch) {
      try {
        const response = await fetch(`${supabaseUrl}/functions/v1/pepper-synthesize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${supabaseKey}` },
          body: JSON.stringify({ pepperId, pepperName: pepperId }),
        });
        if (response.ok) successCount++; else errorCount++;
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (err) {
        errorCount++;
        console.error(`Error processing ${pepperId}:`, err);
      }
    }

    await supabase.from('enrichment_settings').update({
      last_run_at: now.toISOString(), last_run_count: successCount,
      schedule_next_run: calculateNextRun(settings.schedule_frequency), updated_at: now.toISOString(),
    }).eq('id', settings.id);

    return new Response(JSON.stringify({
      success: true, message: `Processed ${successCount} peppers`,
      processed: successCount, errors: errorCount, remaining: candidates.length - batch.length,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Error in pepper-scheduled-enrichment:', error);
    return new Response(JSON.stringify({ success: false, error: 'An internal error occurred. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});

function calculateNextRun(frequency: string): string {
  const now = new Date();
  switch (frequency) {
    case 'daily': now.setDate(now.getDate() + 1); break;
    case 'weekly': now.setDate(now.getDate() + 7); break;
    case 'monthly': now.setMonth(now.getMonth() + 1); break;
    default: now.setDate(now.getDate() + 7);
  }
  return now.toISOString();
}
