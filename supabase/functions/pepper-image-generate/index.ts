import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Logo watermark as base64 (will be fetched from storage or embedded)
const WATERMARK_OPACITY = 0.20; // 20% opacity for subtle watermark

const VISION_ANALYSIS_PROMPT = `You are a botanical expert analyzing reference images of pepper varieties. Examine the provided image(s) and extract detailed visual characteristics:

1. Pod morphology: Shape (elongated, round, lantern, conical, etc.), size estimation, surface texture (smooth, wrinkled, bumpy)
2. Color details: Exact color gradients, ripeness stages visible, color transitions
3. Stem and calyx: Shape, color, attachment style
4. Surface features: Veins, sheen (glossy/matte), wrinkles, ridges
5. If visible: Leaf shape, plant structure, growing habit

Output a detailed JSON object:
{
  "pod_shape": "description",
  "pod_size": "small/medium/large with cm estimate",
  "surface_texture": "description",
  "color_primary": "main color",
  "color_secondary": "secondary colors or gradients",
  "color_transitions": "description of color changes",
  "stem_calyx": "description",
  "surface_details": "veins, sheen, etc.",
  "plant_features": "if visible: leaves, stems, growth habit",
  "distinctive_features": "any unique identifying characteristics"
}`;

const BOTANICAL_PROMPT_TEMPLATE = `Create an antique botanical illustration in the style of 18th-century scientific drawings. Subject: {{pepperName}} pepper.

Visual characteristics:
{{characteristics}}

Style requirements:
- Hand-drawn scientific illustration aesthetic
- Aged parchment background with subtle texture
- Precise botanical detail showing the whole pepper
- Muted, historically accurate color palette
- Include subtle cross-section view if appropriate
- Fine line work with watercolor-like shading
- No modern elements or photography

Composition: Single pepper specimen centered, possibly with a small cross-section, scientific illustration style.`;

const PHOTO_PLANT_PROMPT_TEMPLATE = `Ultra high resolution photograph of {{pepperName}} pepper growing on the plant.

Visual characteristics:
{{characteristics}}

Requirements:
- Hyper-realistic photo quality, 8K detail
- Natural outdoor lighting, golden hour preferred
- Pepper visible on the plant with surrounding foliage
- Sharp focus on the pepper with slight bokeh background
- Authentic growing conditions
- Rich, vibrant colors
- Professional food/agricultural photography style`;

const PHOTO_INDIVIDUAL_PROMPT_TEMPLATE = `Ultra high resolution studio photograph of {{pepperName}} pepper(s).

Visual characteristics:
{{characteristics}}

Requirements:
- Hyper-realistic photo quality, 8K detail
- Clean neutral background (light wood, marble, or white)
- One to three individual peppers arranged naturally
- Professional studio lighting with soft shadows
- Sharp focus throughout
- Rich, true-to-life colors
- Food photography style suitable for culinary publication`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pepperId, pepperName, jobId, referenceImageUrls = [] } = await req.json();

    if (!pepperId || !pepperName) {
      return new Response(
        JSON.stringify({ success: false, error: 'pepperId and pepperName are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    console.log(`Starting image generation for pepper: ${pepperName} (${pepperId})`);

    // Update job progress if jobId provided
    const updateJobProgress = async (step: string, errorMsg?: string) => {
      if (!jobId) return;
      
      const updates: any = { 
        current_step: step,
        current_pepper_id: pepperId,
        current_pepper_name: pepperName,
        updated_at: new Date().toISOString(),
      };
      
      if (errorMsg) {
        // Append error to log
        const { data: job } = await supabase
          .from('enrichment_jobs')
          .select('error_log')
          .eq('id', jobId)
          .single();
        
        const errorLog = job?.error_log || [];
        errorLog.push({
          pepper_id: pepperId,
          pepper_name: pepperName,
          step,
          error: errorMsg,
          timestamp: new Date().toISOString(),
        });
        updates.error_log = errorLog;
      }
      
      await supabase
        .from('enrichment_jobs')
        .update(updates)
        .eq('id', jobId);
    };

    const generatedImages: any[] = [];
    let visualCharacteristics = '';

    // Step 1: Vision Analysis (if reference images available)
    if (referenceImageUrls.length > 0) {
      await updateJobProgress('image-analysis');
      console.log('Analyzing reference images with vision AI...');

      try {
        const imageContent = referenceImageUrls.slice(0, 3).map((url: string) => ({
          type: 'image_url',
          image_url: { url }
        }));

        const analysisResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${lovableKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-pro',
            messages: [
              { role: 'system', content: VISION_ANALYSIS_PROMPT },
              {
                role: 'user',
                content: [
                  { type: 'text', text: `Analyze these reference images of the ${pepperName} pepper variety:` },
                  ...imageContent
                ]
              }
            ],
          }),
        });

        if (analysisResponse.ok) {
          const analysisData = await analysisResponse.json();
          const analysisContent = analysisData.choices?.[0]?.message?.content || '';
          
          // Extract JSON from response
          const jsonMatch = analysisContent.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const analysis = JSON.parse(jsonMatch[0]);
            visualCharacteristics = Object.entries(analysis)
              .filter(([_, v]) => v && typeof v === 'string' && (v as string).length > 0)
              .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`)
              .join('\n');
          }
        }
      } catch (err) {
        console.error('Vision analysis error:', err);
        await updateJobProgress('image-analysis', `Vision analysis failed: ${err}`);
      }
    }

    // Default characteristics if no reference images or analysis failed
    if (!visualCharacteristics) {
      visualCharacteristics = `Pepper variety: ${pepperName}\nTypical characteristics of this cultivar should be depicted accurately.`;
    }

    // Step 2: Generate images
    await updateJobProgress('image-generation');
    console.log('Generating images...');

    const imageTypes = [
      { type: 'ai-botanical', template: BOTANICAL_PROMPT_TEMPLATE, aspectRatio: '3:4' },
      { type: 'ai-photo-plant', template: PHOTO_PLANT_PROMPT_TEMPLATE, aspectRatio: '4:3' },
      { type: 'ai-photo-individual', template: PHOTO_INDIVIDUAL_PROMPT_TEMPLATE, aspectRatio: '1:1' },
    ];

    for (const { type, template, aspectRatio } of imageTypes) {
      try {
        const prompt = template
          .replace(/\{\{pepperName\}\}/g, pepperName)
          .replace(/\{\{characteristics\}\}/g, visualCharacteristics);

        console.log(`Generating ${type} image...`);

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
          console.error(`Image generation failed for ${type}:`, errorText);
          await updateJobProgress('image-generation', `${type} generation failed: ${imageResponse.status}`);
          continue;
        }

        const imageData = await imageResponse.json();
        const generatedImage = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (!generatedImage) {
          console.error(`No image returned for ${type}`);
          continue;
        }

        // Step 3: Apply watermark
        await updateJobProgress('watermarking');
        console.log(`Applying watermark to ${type} image...`);

        // For now, we'll store the raw image and note that watermarking should be applied client-side
        // A more robust solution would use a dedicated image processing library
        const timestamp = Date.now();
        const storagePath = `generated/${pepperId}/${type}-${timestamp}.png`;

        // Convert base64 to blob and upload
        const base64Data = generatedImage.replace(/^data:image\/\w+;base64,/, '');
        const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

        const { error: uploadError } = await supabase.storage
          .from('pepper-images')
          .upload(storagePath, binaryData, {
            contentType: 'image/png',
            upsert: true,
          });

        if (uploadError) {
          console.error(`Upload failed for ${type}:`, uploadError);
          await updateJobProgress('watermarking', `Upload failed for ${type}: ${uploadError.message}`);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('pepper-images')
          .getPublicUrl(storagePath);

        // Create image proposal
        const { data: proposal, error: proposalError } = await supabase
          .from('pepper_image_proposals')
          .insert({
            pepper_id: pepperId,
            image_url: publicUrl,
            storage_path: storagePath,
            source_type: type,
            license: 'AI-Generated',
            prompt_used: prompt,
            confidence_score: 75, // Base confidence for AI-generated images
            status: 'pending',
            enrichment_job_id: jobId || null,
          })
          .select()
          .single();

        if (proposalError) {
          console.error(`Proposal creation failed for ${type}:`, proposalError);
        } else {
          generatedImages.push(proposal);
        }

      } catch (err) {
        console.error(`Error generating ${type} image:`, err);
        await updateJobProgress('image-generation', `${type} error: ${err}`);
      }
    }

    console.log(`Image generation complete. ${generatedImages.length} images created.`);

    return new Response(
      JSON.stringify({
        success: true,
        data: generatedImages,
        message: `Generated ${generatedImages.length} image proposal(s)`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in pepper-image-generate:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
