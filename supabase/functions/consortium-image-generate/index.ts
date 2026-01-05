import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Regional consortium definitions (excluding Turkish Terroir)
const REGIONAL_CONSORTIUMS: Record<string, { name: string; peppers: string[] }> = {
  'african-fire': {
    name: 'African Fire',
    peppers: ['Mombasa Chili', 'Peri Peri', 'Malagueta']
  },
  'american-fusion': {
    name: 'American Fusion',
    peppers: ['Fresno', 'Rocoto', 'Datil']
  },
  'andean-heights': {
    name: 'Andean Heights',
    peppers: ['Aji Panca', 'Aji Amarillo', "Devil's Breath"]
  },
  'caribbean-heat-trio': {
    name: 'Caribbean Heat Trio',
    peppers: ['Scotch Bonnet', 'Habanero', 'Trinidad Scorpion']
  },
  'indian-subcontinent': {
    name: 'Indian Subcontinent',
    peppers: ['Kashmiri Chili', 'Ghost Pepper', 'Naga Viper']
  },
  'mediterranean-selection': {
    name: 'Mediterranean Selection',
    peppers: ['Aleppo', 'Calabrian', 'Urfa Biber']
  },
  'mexican-triad': {
    name: 'Mexican Triad',
    peppers: ['Chipotle Morita', 'Chile de Árbol', 'Orange Habanero']
  },
  'pacific-rim': {
    name: 'Pacific Rim Blend',
    peppers: ['Gochugaru', "Thai Bird's Eye", 'Tien Tsin']
  },
  'south-american-heat': {
    name: 'South American Heat',
    peppers: ['Aji Dulce', 'Aji Charapita', 'Malagueta']
  }
};

// Web search for reference images
async function searchPepperImages(pepperName: string, lovableKey: string): Promise<string[]> {
  try {
    console.log(`Searching web for ${pepperName} images...`);
    
    // Use Lovable AI to describe what to search for
    const searchResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{
          role: 'user',
          content: `You are helping generate search queries for finding high-quality reference images of the "${pepperName}" pepper variety. 
          
Provide 5 specific search queries that would find detailed photos of this pepper. Focus on:
- Scientific/botanical photos
- Fresh pepper photos showing color and shape
- Photos showing the pepper in its natural state (not cooked or processed)

Return ONLY a JSON array of search query strings, nothing else:
["query1", "query2", "query3", "query4", "query5"]`
        }],
      }),
    });

    if (!searchResponse.ok) {
      console.error('Search query generation failed');
      return [];
    }

    const searchData = await searchResponse.json();
    const queryContent = searchData.choices?.[0]?.message?.content || '';
    
    // Extract JSON array
    const jsonMatch = queryContent.match(/\[[\s\S]*?\]/);
    if (!jsonMatch) return [];
    
    const queries = JSON.parse(jsonMatch[0]) as string[];
    console.log(`Generated ${queries.length} search queries for ${pepperName}`);
    
    return queries.slice(0, 3); // Use top 3 queries
  } catch (err) {
    console.error(`Error generating search queries for ${pepperName}:`, err);
    return [];
  }
}

// Analyze reference images and extract visual characteristics
async function analyzeReferenceImages(
  pepperName: string, 
  imageUrls: string[], 
  lovableKey: string
): Promise<string> {
  if (imageUrls.length === 0) {
    return `${pepperName}: Typical characteristics of this cultivar should be depicted accurately.`;
  }

  try {
    // Use up to 5 images for analysis
    const imagesToAnalyze = imageUrls.slice(0, 5);
    const imageContent = imagesToAnalyze.map(url => ({
      type: 'image_url',
      image_url: { url }
    }));

    const analysisPrompt = `Analyze these reference images of the "${pepperName}" pepper variety and extract detailed visual characteristics for hyper-realistic image generation:

1. Pod shape and size (elongated, round, wrinkled, etc.)
2. Exact colors and color gradients (ripe and unripe if visible)
3. Surface texture (smooth, wrinkled, bumpy, shiny/matte)
4. Stem and calyx appearance
5. Any distinctive visual features

Provide a concise description (3-4 sentences) focusing on the most distinctive visual characteristics that would help recreate this pepper hyper-realistically.`;

    const analysisResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: analysisPrompt },
            ...imageContent
          ]
        }],
      }),
    });

    if (!analysisResponse.ok) {
      console.error(`Analysis failed for ${pepperName}`);
      return `${pepperName}: Typical characteristics should be depicted.`;
    }

    const analysisData = await analysisResponse.json();
    return `${pepperName}: ${analysisData.choices?.[0]?.message?.content || 'Typical characteristics.'}`;
  } catch (err) {
    console.error(`Error analyzing ${pepperName}:`, err);
    return `${pepperName}: Typical characteristics should be depicted.`;
  }
}

// Generate the consortium image with all 3 peppers
async function generateConsortiumImage(
  consortiumName: string,
  pepperDescriptions: string[],
  lovableKey: string
): Promise<string | null> {
  const prompt = `Create a hyper-realistic artistic still life photograph featuring exactly THREE pepper varieties arranged together.

PEPPERS TO INCLUDE (EACH MUST BE CLEARLY VISIBLE AND IDENTIFIABLE):
${pepperDescriptions.map((desc, i) => `${i + 1}. ${desc}`).join('\n')}

CRITICAL REQUIREMENTS:
- Feature ONLY these 3 specific pepper varieties, no other peppers
- Each pepper must be clearly distinguishable and accurately depicted
- Show 2-3 specimens of each variety for visual richness (6-9 total peppers)
- Hyper-realistic 8K photograph quality with perfect sharp focus
- Professional food photography lighting with soft shadows

ARTISTIC STILL LIFE COMPOSITION:
- Arrange on rustic aged wood surface with subtle texture
- Include complementary props: vintage brass spice spoon, scattered peppercorns, dried herbs, aged linen cloth
- Warm, moody lighting suggesting a spice merchant's table
- Shallow depth of field with slight bokeh on background elements
- Rich, saturated natural colors
- Overhead or 45-degree angle view
- Composition suitable for a premium spice trading company product image

The image should feel like a museum-quality photograph of rare pepper specimens from the "${consortiumName}" collection.`;

  console.log(`Generating consortium image for ${consortiumName}...`);

  const imageResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${lovableKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash-image-preview',
      messages: [{ role: 'user', content: prompt }],
      modalities: ['image', 'text'],
    }),
  });

  if (!imageResponse.ok) {
    const errorText = await imageResponse.text();
    console.error(`Image generation failed for ${consortiumName}:`, errorText);
    return null;
  }

  const imageData = await imageResponse.json();
  return imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url || null;
}

// Apply watermark
async function applyWatermark(
  lovableKey: string,
  imageBase64: string,
  consortiumName: string,
  supabaseUrl: string
): Promise<string> {
  try {
    const logoUrl = `${supabaseUrl.replace('.supabase.co', '.lovable.app')}/branding/watermark-logo.png`;
    
    const watermarkPrompt = `Overlay the second image (the circular Hot Pepper Trading Company logo) as a subtle watermark in the bottom-right corner of the first image (the consortium pepper image).

Requirements:
- Position the logo in the bottom-right corner with a small margin from the edges
- Make the logo semi-transparent at about 15-20% opacity
- Resize the logo to be small (approximately 5-8% of the image width)
- Tint the logo to a muted sepia, gold, or parchment tone that complements the main image
- The logo should look like a subtle publisher's mark or trading company seal
- Do NOT alter the main pepper image content at all - only add this watermark overlay

The first image is the main ${consortiumName} consortium image to watermark.
The second image is the Hot Pepper Trading Company logo to use as the watermark.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: watermarkPrompt },
            { type: 'image_url', image_url: { url: imageBase64 } },
            { type: 'image_url', image_url: { url: logoUrl } }
          ]
        }],
        modalities: ['image', 'text'],
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const watermarkedImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
      if (watermarkedImage) return watermarkedImage;
    }
    
    console.log('Watermarking failed, using original image');
    return imageBase64;
  } catch (err) {
    console.error('Watermark error:', err);
    return imageBase64;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { consortiumId, generateAll = false } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableKey = Deno.env.get('LOVABLE_API_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (!lovableKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'AI image generation not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine which consortiums to generate
    const consortiumsToGenerate = generateAll 
      ? Object.entries(REGIONAL_CONSORTIUMS)
      : consortiumId && REGIONAL_CONSORTIUMS[consortiumId]
        ? [[consortiumId, REGIONAL_CONSORTIUMS[consortiumId]]]
        : [];

    if (consortiumsToGenerate.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: consortiumId 
            ? `Unknown consortium: ${consortiumId}. Valid options: ${Object.keys(REGIONAL_CONSORTIUMS).join(', ')}`
            : 'No consortiumId provided and generateAll is false'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results: any[] = [];

    for (const [id, consortium] of consortiumsToGenerate) {
      console.log(`\n=== Processing ${consortium.name} ===`);
      console.log(`Peppers: ${consortium.peppers.join(', ')}`);

      const pepperDescriptions: string[] = [];

      // Process each pepper - gather references and analyze
      for (const pepperName of consortium.peppers) {
        console.log(`\n--- Gathering references for ${pepperName} ---`);
        
        // Get existing research images from database
        const { data: researchData, error: researchError } = await supabase
          .from('pepper_research')
          .select('metadata')
          .eq('source_type', 'wikimedia_images')
          .ilike('query', `%${pepperName}%`);

        let imageUrls: string[] = [];

        if (!researchError && researchData) {
          researchData.forEach((record: any) => {
            const metadata = record.metadata;
            if (metadata?.images && Array.isArray(metadata.images)) {
              metadata.images.forEach((img: any) => {
                if (img.url) imageUrls.push(img.url);
              });
            }
          });
        }

        console.log(`Found ${imageUrls.length} existing reference images for ${pepperName}`);

        // If we don't have enough images, note it but continue
        // (Web search would require external API - using what we have from research)
        const targetImages = 50;
        if (imageUrls.length < targetImages) {
          console.log(`Note: Only ${imageUrls.length}/${targetImages} reference images available for ${pepperName}`);
        }

        // Analyze the available references
        const description = await analyzeReferenceImages(pepperName, imageUrls.slice(0, 10), lovableKey);
        pepperDescriptions.push(description);
        
        console.log(`Analysis complete for ${pepperName}`);
      }

      // Generate the consortium image
      const generatedImage = await generateConsortiumImage(
        consortium.name,
        pepperDescriptions,
        lovableKey
      );

      if (!generatedImage) {
        console.error(`Failed to generate image for ${consortium.name}`);
        results.push({
          consortiumId: id,
          name: consortium.name,
          success: false,
          error: 'Image generation failed'
        });
        continue;
      }

      // Apply watermark
      console.log(`Applying watermark to ${consortium.name} image...`);
      const watermarkedImage = await applyWatermark(lovableKey, generatedImage, consortium.name, supabaseUrl);

      // Save to storage
      const timestamp = Date.now();
      const storagePath = `regional-consortiums/${id}-${timestamp}.png`;

      const base64Data = watermarkedImage.replace(/^data:image\/\w+;base64,/, '');
      const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

      const { error: uploadError } = await supabase.storage
        .from('pepper-images')
        .upload(storagePath, binaryData, {
          contentType: 'image/png',
          upsert: true,
        });

      if (uploadError) {
        console.error(`Upload failed for ${consortium.name}:`, uploadError);
        results.push({
          consortiumId: id,
          name: consortium.name,
          success: false,
          error: `Upload failed: ${uploadError.message}`
        });
        continue;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('pepper-images')
        .getPublicUrl(storagePath);

      console.log(`Successfully generated and uploaded ${consortium.name} image`);

      results.push({
        consortiumId: id,
        name: consortium.name,
        success: true,
        imageUrl: publicUrl,
        storagePath,
        peppersAnalyzed: consortium.peppers
      });
    }

    const successCount = results.filter(r => r.success).length;
    
    return new Response(
      JSON.stringify({
        success: successCount > 0,
        message: `Generated ${successCount}/${results.length} consortium images`,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in consortium-image-generate:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});