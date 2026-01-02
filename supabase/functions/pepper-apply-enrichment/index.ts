import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { queueId, action, reviewNotes, edits } = await req.json();

    if (!queueId || !action) {
      return new Response(
        JSON.stringify({ success: false, error: 'queueId and action are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!['approve', 'reject'].includes(action)) {
      return new Response(
        JSON.stringify({ success: false, error: 'action must be "approve" or "reject"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${action} for queue entry: ${queueId}`);

    // Fetch the queue entry
    const { data: queueEntry, error: fetchError } = await supabase
      .from('pepper_enrichment_queue')
      .select('*')
      .eq('id', queueId)
      .single();

    if (fetchError || !queueEntry) {
      return new Response(
        JSON.stringify({ success: false, error: 'Queue entry not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (queueEntry.status !== 'pending') {
      return new Response(
        JSON.stringify({ success: false, error: 'Queue entry has already been processed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'reject') {
      // Update queue entry as rejected
      const { error: updateError } = await supabase
        .from('pepper_enrichment_queue')
        .update({
          status: 'rejected',
          review_notes: reviewNotes || null,
          reviewed_by: userId,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', queueId);

      if (updateError) {
        console.error('Error rejecting queue entry:', updateError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to reject entry' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Queue entry rejected');

      return new Response(
        JSON.stringify({ success: true, message: 'Enrichment rejected' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle approval - merge edits if provided
    const finalContent = {
      description: edits?.proposed_description ?? queueEntry.proposed_description,
      historical_notes: edits?.proposed_historical_notes ?? queueEntry.proposed_historical_notes,
      flavor_notes: edits?.proposed_flavor_notes ?? queueEntry.proposed_flavor_notes,
      aroma_notes: edits?.proposed_aroma_notes ?? queueEntry.proposed_aroma_notes,
      culinary_uses: edits?.proposed_culinary_uses ?? queueEntry.proposed_culinary_uses,
      trade_route: edits?.proposed_trade_route ?? queueEntry.proposed_trade_route,
      source_citations: queueEntry.source_citations,
    };

    // Check if override already exists
    const { data: existingOverride } = await supabase
      .from('pepper_overrides')
      .select('id, enrichment_version')
      .eq('pepper_id', queueEntry.pepper_id)
      .single();

    if (existingOverride) {
      // Update existing override
      const { error: updateOverrideError } = await supabase
        .from('pepper_overrides')
        .update({
          description: finalContent.description,
          historical_notes: finalContent.historical_notes,
          flavor_notes: finalContent.flavor_notes,
          aroma_notes: finalContent.aroma_notes,
          culinary_uses: finalContent.culinary_uses,
          trade_route: finalContent.trade_route,
          source_citations: finalContent.source_citations,
          enrichment_version: (existingOverride.enrichment_version || 0) + 1,
          updated_by: userId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingOverride.id);

      if (updateOverrideError) {
        console.error('Error updating pepper override:', updateOverrideError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to apply enrichment' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      // Create new override
      const { error: insertOverrideError } = await supabase
        .from('pepper_overrides')
        .insert({
          pepper_id: queueEntry.pepper_id,
          description: finalContent.description,
          historical_notes: finalContent.historical_notes,
          flavor_notes: finalContent.flavor_notes,
          aroma_notes: finalContent.aroma_notes,
          culinary_uses: finalContent.culinary_uses,
          trade_route: finalContent.trade_route,
          source_citations: finalContent.source_citations,
          enrichment_version: 1,
          updated_by: userId,
        });

      if (insertOverrideError) {
        console.error('Error creating pepper override:', insertOverrideError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to apply enrichment' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Update queue entry as approved
    const { error: updateQueueError } = await supabase
      .from('pepper_enrichment_queue')
      .update({
        status: 'approved',
        review_notes: reviewNotes || null,
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', queueId);

    if (updateQueueError) {
      console.error('Error updating queue entry:', updateQueueError);
    }

    console.log('Enrichment applied successfully');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Enrichment approved and applied',
        pepperId: queueEntry.pepper_id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in pepper-apply-enrichment:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
