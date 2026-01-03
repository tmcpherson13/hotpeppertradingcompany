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
    const { queueId, action, reviewNotes, edits, autoApproved, excludedFields } = await req.json();

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

    console.log(`Processing ${action} for queue entry: ${queueId}${autoApproved ? ' (auto-approved)' : ''}`);
    if (excludedFields?.length) {
      console.log(`Excluding fields: ${excludedFields.join(', ')}`);
    }

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

    // Handle approval - merge edits if provided, respecting excludedFields
    const excluded = new Set(excludedFields || []);
    
    // Map proposed field names to override field names
    const fieldMapping: Record<string, string> = {
      'proposed_description': 'description',
      'proposed_historical_notes': 'historical_notes',
      'proposed_flavor_notes': 'flavor_notes',
      'proposed_aroma_notes': 'aroma_notes',
      'proposed_culinary_uses': 'culinary_uses',
      'proposed_trade_route': 'trade_route',
    };

    const finalContent: Record<string, any> = {
      source_citations: queueEntry.source_citations,
    };

    // Only include fields that are not excluded
    for (const [proposedKey, overrideKey] of Object.entries(fieldMapping)) {
      if (!excluded.has(proposedKey)) {
        finalContent[overrideKey] = edits?.[proposedKey] ?? queueEntry[proposedKey];
      }
    }

    // Check if override already exists
    const { data: existingOverride } = await supabase
      .from('pepper_overrides')
      .select('*')
      .eq('pepper_id', queueEntry.pepper_id)
      .single();

    if (existingOverride) {
      // Build update object - only include non-excluded fields
      const updateData: Record<string, any> = {
        enrichment_version: (existingOverride.enrichment_version || 0) + 1,
        updated_by: userId,
        updated_at: new Date().toISOString(),
        source_citations: finalContent.source_citations,
      };

      // Only update fields that are in finalContent (not excluded)
      for (const overrideKey of Object.values(fieldMapping)) {
        if (overrideKey in finalContent) {
          updateData[overrideKey] = finalContent[overrideKey];
        }
      }

      const { error: updateOverrideError } = await supabase
        .from('pepper_overrides')
        .update(updateData)
        .eq('id', existingOverride.id);

      if (updateOverrideError) {
        console.error('Error updating pepper override:', updateOverrideError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to apply enrichment' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      // Build insert object - only include non-excluded fields
      const insertData: Record<string, any> = {
        pepper_id: queueEntry.pepper_id,
        enrichment_version: 1,
        updated_by: userId,
        source_citations: finalContent.source_citations,
      };

      // Only insert fields that are in finalContent (not excluded)
      for (const overrideKey of Object.values(fieldMapping)) {
        if (overrideKey in finalContent) {
          insertData[overrideKey] = finalContent[overrideKey];
        }
      }

      const { error: insertOverrideError } = await supabase
        .from('pepper_overrides')
        .insert(insertData);

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
        review_notes: autoApproved ? 'Auto-approved based on confidence threshold' : (reviewNotes || null),
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
        auto_approved: autoApproved || false,
      })
      .eq('id', queueId);

    if (updateQueueError) {
      console.error('Error updating queue entry:', updateQueueError);
    }

    console.log(`Enrichment ${autoApproved ? 'auto-' : ''}approved and applied successfully`);

    return new Response(
      JSON.stringify({
        success: true,
        message: autoApproved ? 'Enrichment auto-approved and applied' : 'Enrichment approved and applied',
        pepperId: queueEntry.pepper_id,
        autoApproved: autoApproved || false,
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
