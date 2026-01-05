import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Regional consortium definitions with unique backgrounds
const REGIONAL_CONSORTIUMS: Record<string, { name: string; peppers: string[]; background: string }> = {
  'african-fire': {
    name: 'African Fire',
    peppers: ['Mombasa Chili', 'Peri Peri', 'Malagueta'],
    background: 'weathered African mahogany table with carved tribal geometric patterns and sun-bleached edges'
  },
  'american-fusion': {
    name: 'American Fusion',
    peppers: ['Fresno', 'Rocoto', 'Datil'],
    background: 'rustic American barn wood planks with vintage iron nails and copper patina accents'
  },
  'andean-heights': {
    name: 'Andean Heights',
    peppers: ['Aji Panca', 'Aji Amarillo', "Devil's Breath"],
    background: 'hand-woven Peruvian alpaca textile with bold red and orange geometric Incan patterns'
  },
  'caribbean-heat-trio': {
    name: 'Caribbean Heat Trio',
    peppers: ['Scotch Bonnet', 'Habanero', 'Trinidad Scorpion'],
    background: 'sun-bleached Caribbean driftwood with scattered white sand and small seashells'
  },
  'indian-subcontinent': {
    name: 'Indian Subcontinent',
    peppers: ['Kashmiri Chili', 'Ghost Pepper', 'Naga Viper'],
    background: 'ornate antique Indian brass tray with embossed lotus and paisley engravings'
  },
  'mediterranean-selection': {
    name: 'Mediterranean Selection',
    peppers: ['Aleppo', 'Calabrian', 'Urfa Biber'],
    background: 'ancient terracotta tiles from a sun-drenched Mediterranean villa with ochre and sienna tones'
  },
  'mexican-triad': {
    name: 'Mexican Triad',
    peppers: ['Chipotle Morita', 'Chile de Árbol', 'Orange Habanero'],
    background: 'hand-painted Talavera ceramic platter with cobalt blue and marigold yellow floral motifs'
  },
  'pacific-rim': {
    name: 'Pacific Rim Blend',
    peppers: ['Gochugaru', "Thai Bird's Eye", 'Tien Tsin'],
    background: 'lacquered Asian bamboo serving tray with mother-of-pearl cherry blossom inlay'
  },
  'south-american-heat': {
    name: 'South American Heat',
    peppers: ['Aji Dulce', 'Aji Charapita', 'Malagueta'],
    background: 'aged Brazilian rosewood cutting board with rich natural grain and jungle leaf shadows'
  }
};

// Randomized artistic elements for unique compositions
const LIGHTING_STYLES = [
  'warm golden hour sunlight streaming dramatically from the left side',
  'soft diffused morning light filtering through gauze curtains from above',
  'dramatic Rembrandt lighting with deep moody shadows on one side',
  'cool northern window light with subtle blue-grey undertones',
  'warm candlelit ambiance with flickering amber and honey tones',
  'bright Mediterranean afternoon sun casting long dramatic shadows',
  'stormy twilight light with rich purple and orange atmospheric glow'
];

const ARTISTIC_ACCENTS = [
  'scattered whole peppercorns and crushed red chili flakes',
  'a few drops of golden olive oil glistening on the surface',
  'wisps of fragrant smoke curling upward through the scene',
  'fresh herb sprigs of thyme, rosemary, and oregano as accents',
  'coarse pink Himalayan salt crystals scattered artfully',
  'dried flower petals in muted burgundy and ochre tones',
  'vintage brass spice spoon with patina and scattered seeds',
  'antique linen cloth with hand-stitched edges draped softly'
];

const COMPOSITION_ANGLES = [
  'dramatic bird\'s eye view looking straight down',
  '45-degree angle capturing depth and dimension',
  'low 30-degree angle emphasizing pepper textures',
  'slightly off-center overhead with asymmetric balance'
];

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

      // Random selections for unique composition each time
      const lighting = LIGHTING_STYLES[Math.floor(Math.random() * LIGHTING_STYLES.length)];
      const accent1 = ARTISTIC_ACCENTS[Math.floor(Math.random() * ARTISTIC_ACCENTS.length)];
      let accent2 = ARTISTIC_ACCENTS[Math.floor(Math.random() * ARTISTIC_ACCENTS.length)];
      while (accent2 === accent1) {
        accent2 = ARTISTIC_ACCENTS[Math.floor(Math.random() * ARTISTIC_ACCENTS.length)];
      }
      const angle = COMPOSITION_ANGLES[Math.floor(Math.random() * COMPOSITION_ANGLES.length)];

      // Build detailed prompt for hyper-realistic artistic still life with DENSE pepper arrangement
      const prompt = `Create a hyper-realistic artistic still life photograph. The entire frame should be FILLED with fresh chili peppers arranged abundantly on ${consortium.background}.

PEPPERS TO FEATURE (FILL 75-80% OF THE FRAME):
1. ${consortium.peppers[0]} - Include 8-10 specimens in various sizes and angles, some whole, some cut to show seeds
2. ${consortium.peppers[1]} - Include 8-10 specimens scattered throughout, overlapping naturally with others
3. ${consortium.peppers[2]} - Include 6-8 specimens filling remaining space, creating visual balance

CRITICAL COMPOSITION REQUIREMENTS:
- DENSE ARRANGEMENT: Peppers should fill nearly the entire frame like a bountiful harvest display
- Show peppers overlapping, tumbling, clustered together naturally
- Mix of whole peppers and some cut in half to reveal colorful interiors and seeds
- Various orientations: some facing camera, some sideways, some at angles
- Background surface should only peek through in small gaps between peppers
- ${angle}

ARTISTIC ELEMENTS:
- ${accent1}
- ${accent2}

LIGHTING & ATMOSPHERE:
- ${lighting}
- Ultra-sharp focus on pepper textures, wrinkles, glossy skin, and matte surfaces
- Shallow depth of field with soft bokeh only on the furthest edges
- Rich, saturated natural colors true to each pepper variety
- Professional food photography quality, 8K hyper-realistic detail
- Painterly quality reminiscent of Dutch Golden Age still life masters

The image should look like a premium spice trading company's showcase photograph of the "${consortium.name}" collection - abundant, luxurious, and meticulously detailed.

NO TEXT. NO WATERMARKS. NO PEOPLE. ONLY PEPPERS AND ARTISTIC ACCENTS.`;

      console.log(`Generating with: ${angle}, ${lighting.substring(0, 40)}...`);

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
        console.error(`Image generation failed for ${consortium.name}:`, errorText);
        results.push({
          consortiumId: id,
          name: consortium.name,
          success: false,
          error: 'Image generation failed'
        });
        continue;
      }

      const imageData = await imageResponse.json();
      const generatedImage = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (!generatedImage) {
        console.error(`No image returned for ${consortium.name}`);
        results.push({
          consortiumId: id,
          name: consortium.name,
          success: false,
          error: 'No image in response'
        });
        continue;
      }

      // Save to storage
      const timestamp = Date.now();
      const storagePath = `regional-consortiums/${id}-${timestamp}.png`;

      const base64Data = generatedImage.replace(/^data:image\/\w+;base64,/, '');
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
        peppers: consortium.peppers,
        style: { lighting: lighting.substring(0, 50), angle }
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
