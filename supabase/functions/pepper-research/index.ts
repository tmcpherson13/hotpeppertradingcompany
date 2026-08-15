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

    // Require authentication. Trusted internal callers (the scheduled /
    // autonomous enrichment runner) present the service-role key as a Bearer
    // token — accept those directly and skip the interactive admin check, since
    // that key is a server-only secret. Everyone else must be a signed-in admin.
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const isServiceRole = token === supabaseKey;
    let userId: string | null = null;

    if (!isServiceRole) {
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);

      if (authError || !user) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid authentication' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Verify admin role
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

      userId = user.id;
    }

    console.log(`Starting research for pepper: ${pepperName} (${pepperId})`);

    const researchResults: any[] = [];
    const imageResults: any[] = [];
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

    // Wikimedia Commons image search for reference images
    if (sources.includes('wikimedia')) {
      try {
        console.log('Searching Wikimedia Commons for reference images...');
        // `filetype:bitmap` restricts CirrusSearch to raster photographs, which
        // keeps out the PDFs / DJVU scans / SVG diagrams that a bare name search
        // otherwise drags in (e.g. books that merely contain the word in a title).
        const wikiSearchTerms = [
          `${pepperName} pepper filetype:bitmap`,
          `${pepperName} chili filetype:bitmap`,
          `Capsicum ${pepperName} filetype:bitmap`,
        ];

        for (const searchTerm of wikiSearchTerms) {
          const wikiUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&srnamespace=6&srlimit=5&format=json&origin=*`;
          
          const wikiResponse = await fetch(wikiUrl);
          if (!wikiResponse.ok) continue;

          const wikiData = await wikiResponse.json();
          const searchResults = wikiData.query?.search || [];

          for (const result of searchResults) {
            const title = result.title;
            // Get image info
            const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|extmetadata|user|mime|mediatype&format=json&origin=*`;

            const infoResponse = await fetch(infoUrl);
            if (!infoResponse.ok) continue;

            const infoData = await infoResponse.json();
            const pages = infoData.query?.pages || {};
            const pageData = Object.values(pages)[0] as any;
            const imageInfo = pageData?.imageinfo?.[0];

            // Second guard behind filetype:bitmap: accept only real raster photos.
            // BITMAP + an image/* mime (never svg) excludes PDFs, DJVU, TIFF docs.
            const mediaType = (imageInfo?.mediatype || '').toUpperCase();
            const mime = (imageInfo?.mime || '').toLowerCase();
            const isPhoto = mediaType === 'BITMAP'
              && mime.startsWith('image/')
              && mime !== 'image/svg+xml';

            if (imageInfo?.url && isPhoto) {
              const extmeta = imageInfo.extmetadata || {};
              const license = extmeta.LicenseShortName?.value || 'Unknown';
              const author = extmeta.Artist?.value?.replace(/<[^>]+>/g, '').trim() || imageInfo.user || 'Unknown';

              // Only include CC-licensed images
              if (license.toLowerCase().includes('cc') || license.toLowerCase().includes('public domain')) {
                imageResults.push({
                  url: imageInfo.url,
                  sourceUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(title)}`,
                  license,
                  author,
                  mime,
                  title: title.replace('File:', ''),
                });
              }
            }
          }

          // Limit total results
          if (imageResults.length >= 5) break;
        }

        console.log(`Found ${imageResults.length} Wikimedia images`);

        // Store image search results
        if (imageResults.length > 0) {
          const { data: researchRecord, error: insertError } = await supabase
            .from('pepper_research')
            .insert({
              pepper_id: pepperId,
              source_type: 'wikimedia',
              query: `${pepperName} pepper images`,
              raw_content: JSON.stringify(imageResults),
              urls: imageResults.map(i => i.sourceUrl),
              metadata: { image_count: imageResults.length, images: imageResults },
              created_by: userId,
            })
            .select()
            .single();

          if (insertError) {
            console.error('Error storing Wikimedia research:', insertError);
          } else {
            researchResults.push(researchRecord);
          }
        }

        // Surface the real photos as reviewable image proposals. We download each
        // into our own storage bucket (rather than hotlinking Commons) and carry
        // the full attribution — source page, license, author — so approval works
        // exactly like AI images and the site can display proper credit.
        if (imageResults.length > 0) {
          // Dedup against photos already proposed for this pepper.
          const { data: existingProps } = await supabase
            .from('pepper_image_proposals')
            .select('source_url')
            .eq('pepper_id', pepperId)
            .eq('source_type', 'wikimedia');
          const seen = new Set((existingProps || []).map((p: any) => p.source_url));

          let createdCount = 0;
          for (const img of imageResults) {
            if (seen.has(img.sourceUrl)) continue;
            try {
              const dl = await fetch(img.url);
              if (!dl.ok) {
                console.error(`Failed to download Wikimedia image (${dl.status}): ${img.url}`);
                continue;
              }
              const bytes = new Uint8Array(await dl.arrayBuffer());
              const ext = (img.mime && img.mime.includes('/')) ? img.mime.split('/')[1].replace('jpeg', 'jpg') : 'jpg';
              const storagePath = `wikimedia/${pepperId}/${Date.now()}-${createdCount}.${ext}`;

              const { error: upErr } = await supabase.storage
                .from('pepper-images')
                .upload(storagePath, bytes, { contentType: img.mime || 'image/jpeg', upsert: true });
              if (upErr) {
                console.error('Wikimedia upload error:', upErr);
                continue;
              }

              const { data: { publicUrl } } = supabase.storage
                .from('pepper-images')
                .getPublicUrl(storagePath);

              const { error: propErr } = await supabase
                .from('pepper_image_proposals')
                .insert({
                  pepper_id: pepperId,
                  image_url: publicUrl,
                  storage_path: storagePath,
                  source_type: 'wikimedia',
                  source_url: img.sourceUrl,
                  license: img.license,
                  author: img.author,
                  prompt_used: img.title,
                  confidence_score: 60,
                  status: 'pending',
                });
              if (propErr) {
                console.error('Wikimedia proposal insert error:', propErr);
                continue;
              }
              seen.add(img.sourceUrl);
              createdCount++;
            } catch (imgErr) {
              console.error('Error processing Wikimedia image:', imgErr);
            }
          }
          console.log(`Created ${createdCount} Wikimedia photo proposal(s) for review.`);
        }
      } catch (err) {
        console.error('Wikimedia error:', err);
      }
    }

    console.log(`Research complete. ${researchResults.length} sources processed, ${imageResults.length} images found.`);

    return new Response(
      JSON.stringify({
        success: true,
        data: researchResults,
        images: imageResults,
        message: `Research gathered from ${researchResults.length} source(s), ${imageResults.length} images found`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in pepper-research:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'An internal error occurred. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
