import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// In-stock pepper IDs (prioritized for enrichment)
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting scheduled enrichment check...');

    // Check settings
    const { data: settings, error: settingsError } = await supabase
      .from('enrichment_settings')
      .select('*')
      .limit(1)
      .single();

    if (settingsError || !settings) {
      console.log('No enrichment settings found');
      return new Response(
        JSON.stringify({ success: false, error: 'No enrichment settings configured' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if scheduled enrichment is enabled
    if (!settings.schedule_enabled) {
      console.log('Scheduled enrichment is disabled');
      return new Response(
        JSON.stringify({ success: true, message: 'Scheduled enrichment is disabled' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if it's time to run
    const now = new Date();
    const nextRun = settings.schedule_next_run ? new Date(settings.schedule_next_run) : null;

    // For manual triggers, force=true bypasses the schedule check
    const body = await req.json().catch(() => ({}));
    const forceRun = body.force === true;

    if (!forceRun && nextRun && now < nextRun) {
      console.log(`Not yet time to run. Next scheduled: ${nextRun.toISOString()}`);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Not yet time for scheduled run',
          nextRun: nextRun.toISOString(),
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Running scheduled enrichment...');

    // Get peppers that need enrichment (prioritize in-stock, then unenriched)
    const { data: enrichedPeppers } = await supabase
      .from('pepper_overrides')
      .select('pepper_id')
      .gt('enrichment_version', 0);

    const enrichedIds = new Set(enrichedPeppers?.map(p => p.pepper_id) || []);

    // Get peppers with pending queue entries (skip those)
    const { data: pendingQueue } = await supabase
      .from('pepper_enrichment_queue')
      .select('pepper_id')
      .eq('status', 'pending');

    const pendingIds = new Set(pendingQueue?.map(p => p.pepper_id) || []);

    // Get peppers with research (required for synthesis)
    const { data: researchedPeppers } = await supabase
      .from('pepper_research')
      .select('pepper_id');

    const researchedIds = new Set(researchedPeppers?.map(p => p.pepper_id) || []);

    // Prioritize: in-stock + researched + not enriched + not pending
    const candidatesInStock = IN_STOCK_PEPPERS.filter(id => 
      researchedIds.has(id) && !enrichedIds.has(id) && !pendingIds.has(id)
    );

    // Then other researched peppers not yet enriched
    const candidatesOther = Array.from(researchedIds)
      .filter(id => !enrichedIds.has(id) && !pendingIds.has(id) && !IN_STOCK_PEPPERS.includes(id));

    const candidates = [...candidatesInStock, ...candidatesOther];

    // Limit batch size to avoid rate limits
    const batchSize = 5;
    const batch = candidates.slice(0, batchSize);

    console.log(`Found ${candidates.length} candidates, processing ${batch.length}`);

    if (batch.length === 0) {
      console.log('No peppers to process');
      
      // Update last run
      await supabase
        .from('enrichment_settings')
        .update({
          last_run_at: now.toISOString(),
          last_run_count: 0,
          schedule_next_run: calculateNextRun(settings.schedule_frequency),
          updated_at: now.toISOString(),
        })
        .eq('id', settings.id);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No peppers available for enrichment',
          processed: 0,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process each pepper
    let successCount = 0;
    let errorCount = 0;

    for (const pepperId of batch) {
      try {
        // Call the synthesize function internally
        const synthesizeUrl = `${supabaseUrl}/functions/v1/pepper-synthesize`;
        
        const response = await fetch(synthesizeUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({ pepperId, pepperName: pepperId }),
        });

        if (response.ok) {
          successCount++;
          console.log(`Successfully processed: ${pepperId}`);
        } else {
          errorCount++;
          console.error(`Failed to process: ${pepperId}`);
        }

        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (err) {
        errorCount++;
        console.error(`Error processing ${pepperId}:`, err);
      }
    }

    // Update settings with results
    await supabase
      .from('enrichment_settings')
      .update({
        last_run_at: now.toISOString(),
        last_run_count: successCount,
        schedule_next_run: calculateNextRun(settings.schedule_frequency),
        updated_at: now.toISOString(),
      })
      .eq('id', settings.id);

    console.log(`Scheduled enrichment complete: ${successCount} success, ${errorCount} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${successCount} peppers`,
        processed: successCount,
        errors: errorCount,
        remaining: candidates.length - batch.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in pepper-scheduled-enrichment:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'An internal error occurred. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function calculateNextRun(frequency: string): string {
  const now = new Date();
  
  switch (frequency) {
    case 'daily':
      now.setDate(now.getDate() + 1);
      break;
    case 'weekly':
      now.setDate(now.getDate() + 7);
      break;
    case 'monthly':
      now.setMonth(now.getMonth() + 1);
      break;
    default:
      now.setDate(now.getDate() + 7);
  }
  
  return now.toISOString();
}
