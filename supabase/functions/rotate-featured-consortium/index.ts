import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Total number of consortiums
const TOTAL_CONSORTIUMS = 10;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting featured consortium rotation...');

    // Parse request body for manual trigger info
    const body = await req.json().catch(() => ({}));
    const isScheduled = body.trigger === 'scheduled';
    const forceRotate = body.force === true;

    // Check authentication for manual triggers (not scheduled)
    if (!isScheduled) {
      const authHeader = req.headers.get('Authorization');
      if (authHeader && !authHeader.includes(Deno.env.get('SUPABASE_ANON_KEY')!)) {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        
        if (authError || !user) {
          console.error('Authentication failed:', authError?.message);
          return new Response(
            JSON.stringify({ success: false, error: 'Authentication required' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Verify admin role for manual triggers
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (roleError || !roleData) {
          return new Response(
            JSON.stringify({ success: false, error: 'Admin access required' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
    }

    // Fetch current featured consortium
    const { data: current, error: fetchError } = await supabase
      .from('featured_consortium')
      .select('*')
      .limit(1)
      .single();

    if (fetchError || !current) {
      console.error('Error fetching current featured consortium:', fetchError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to fetch current state' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate new index (cycle through 0-9)
    const currentIndex = current.consortium_index;
    const newIndex = (currentIndex + 1) % TOTAL_CONSORTIUMS;

    // Update to next consortium
    const { error: updateError } = await supabase
      .from('featured_consortium')
      .update({
        consortium_index: newIndex,
        last_rotated_at: new Date().toISOString(),
      })
      .eq('id', current.id);

    if (updateError) {
      console.error('Error updating featured consortium:', updateError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to rotate consortium' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Rotated featured consortium from index ${currentIndex} to ${newIndex}`);

    return new Response(
      JSON.stringify({
        success: true,
        previousIndex: currentIndex,
        newIndex: newIndex,
        message: `Featured consortium rotated to index ${newIndex}`,
        rotatedAt: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in rotate-featured-consortium:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'An internal error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
