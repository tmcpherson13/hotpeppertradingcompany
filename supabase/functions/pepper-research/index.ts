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
    const { pepperName, pepperId, sources = ['firecrawl', 'perplexity'] } = await req.json();

    if (!pepperName || !pepperId) {
      return new Response(
        JSON.stringify({ success: false, error: 'pepperName and pepperId are required' }),
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

    console.log(`Starting research for pepper: ${pepperName} (${pepperId})`);

    const researchResults: any[] = [];
    const searchQuery = `${pepperName} pepper culinary uses history origin flavor profile heat level`;

    // Firecrawl research
    if (sources.includes('firecrawl')) {
      const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
      if (firecrawlKey) {
        try {
          console.log('Executing Firecrawl search...');
          const firecrawlResponse = await fetch('https://api.firecrawl.dev/v1/search', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${firecrawlKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: searchQuery,
              limit: 5,
              scrapeOptions: { formats: ['markdown'] },
            }),
          });

          if (firecrawlResponse.ok) {
            const firecrawlData = await firecrawlResponse.json();
            console.log('Firecrawl response received');

            const urls = firecrawlData.data?.map((r: any) => r.url) || [];
            const content = firecrawlData.data?.map((r: any) => 
              `## ${r.title}\nSource: ${r.url}\n\n${r.markdown || r.description || ''}`
            ).join('\n\n---\n\n') || '';

            // Store in database
            const { data: researchRecord, error: insertError } = await supabase
              .from('pepper_research')
              .insert({
                pepper_id: pepperId,
                source_type: 'firecrawl',
                query: searchQuery,
                raw_content: content,
                urls: urls,
                metadata: { result_count: firecrawlData.data?.length || 0 },
                created_by: userId,
              })
              .select()
              .single();

            if (insertError) {
              console.error('Error storing Firecrawl research:', insertError);
            } else {
              researchResults.push(researchRecord);
            }
          } else {
            console.error('Firecrawl API error:', await firecrawlResponse.text());
          }
        } catch (err) {
          console.error('Firecrawl error:', err);
        }
      } else {
        console.log('FIRECRAWL_API_KEY not configured');
      }
    }

    // Perplexity research
    if (sources.includes('perplexity')) {
      const perplexityKey = Deno.env.get('PERPLEXITY_API_KEY');
      if (perplexityKey) {
        try {
          console.log('Executing Perplexity search...');
          const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${perplexityKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'sonar',
              messages: [
                {
                  role: 'system',
                  content: 'You are a culinary historian specializing in peppers and spices. Provide detailed, factual information about pepper varieties including their origin, history, flavor profile, heat level (Scoville), culinary uses, and cultural significance. Include specific regional preparations and traditional dishes.'
                },
                {
                  role: 'user',
                  content: `Provide comprehensive information about the ${pepperName} pepper, including:
1. Origin and geographic distribution
2. Historical significance and trade routes
3. Flavor profile and aroma characteristics
4. Heat level (Scoville units) and comparison to other peppers
5. Traditional and modern culinary uses
6. Cultural significance in various cuisines
7. Any interesting facts or lesser-known information`
                }
              ],
            }),
          });

          if (perplexityResponse.ok) {
            const perplexityData = await perplexityResponse.json();
            console.log('Perplexity response received');

            const content = perplexityData.choices?.[0]?.message?.content || '';
            const citations = perplexityData.citations || [];

            // Store in database
            const { data: researchRecord, error: insertError } = await supabase
              .from('pepper_research')
              .insert({
                pepper_id: pepperId,
                source_type: 'perplexity',
                query: searchQuery,
                raw_content: content,
                urls: citations,
                metadata: { model: 'sonar', has_citations: citations.length > 0 },
                created_by: userId,
              })
              .select()
              .single();

            if (insertError) {
              console.error('Error storing Perplexity research:', insertError);
            } else {
              researchResults.push(researchRecord);
            }
          } else {
            console.error('Perplexity API error:', await perplexityResponse.text());
          }
        } catch (err) {
          console.error('Perplexity error:', err);
        }
      } else {
        console.log('PERPLEXITY_API_KEY not configured');
      }
    }

    console.log(`Research complete. ${researchResults.length} sources processed.`);

    return new Response(
      JSON.stringify({
        success: true,
        data: researchResults,
        message: `Research gathered from ${researchResults.length} source(s)`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in pepper-research:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
