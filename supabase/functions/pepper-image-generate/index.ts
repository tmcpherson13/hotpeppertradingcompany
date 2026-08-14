import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Watermark configuration - using actual company logo
// The logo is hosted in the public folder and accessible via the app URL

// Image generation + vision via Google Gemini (migrated off Lovable AI gateway)
// Function to apply watermark using image editing AI with the actual logo
async function applyWatermark(
  geminiKey: string,
  imageBase64: string,
  pepperName: string,
  supabaseUrl: string
): Promise<string> {
  try {
    // Use the actual company logo from storage
    // The logo URL is constructed from the Supabase project URL
    const logoUrl = `${supabaseUrl.replace('.supabase.co', '.lovable.app')}/branding/watermark-logo.png`;

    const watermarkPrompt = `Overlay the second image (the circular Hot Pepper Trading Company logo) as a subtle watermark in the bottom-right corner of the first image (the pepper image).

Requirements:
- Position the logo in the bottom-right corner with a small margin from the edges
- Make the logo semi-transparent at about 15-20% opacity
- Resize the logo to be small (approximately 5-8% of the image width)
- Tint the logo to a muted sepia, gold, or parchment tone that complements the main image
- The logo should look like a subtle publisher's mark or trading company seal
- Do NOT alter the main pepper image content at all - only add this watermark overlay

The first image is the main pepper image to watermark.
The second image is the Hot Pepper Trading Company logo to use as the watermark.`;

    // Parse the main pepper image (data URL) into mime + base64
    const mainMimeMatch = imageBase64.match(/^data:(image\/\w+);base64,/);
    const mainMime = mainMimeMatch ? mainMimeMatch[1] : 'image/png';
    const mainData = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    // Fetch the logo and convert to base64 for inline_data
    const parts: any[] = [
      { text: watermarkPrompt },
      { inline_data: { mime_type: mainMime, data: mainData } },
    ];
    try {
      const logoResp = await fetch(logoUrl);
      if (logoResp.ok) {
        const logoBuf = new Uint8Array(await logoResp.arrayBuffer());
        let binary = '';
        for (let i = 0; i < logoBuf.length; i++) binary += String.fromCharCode(logoBuf[i]);
        const logoB64 = btoa(binary);
        const logoMime = logoResp.headers.get('content-type') || 'image/png';
        parts.push({ inline_data: { mime_type: logoMime, data: logoB64 } });
      }
    } catch (logoErr) {
      console.error('Logo fetch error:', logoErr);
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts }],
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const responseParts = data.candidates?.[0]?.content?.parts || [];
      const imagePart = responseParts.find((p: any) => p.inlineData || p.inline_data);
      const inline = imagePart?.inlineData || imagePart?.inline_data;
      if (inline?.data) {
        const mimeType = inline.mimeType || inline.mime_type || 'image/png';
        return `data:${mimeType};base64,${inline.data}`;
      }
    }

    console.log('Watermarking failed, using original image');
    return imageBase64;
  } catch (err) {
    console.error('Watermark error:', err);
    return imageBase64;
  }
}

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
    const { 
      pepperId, 
      pepperName, 
      jobId, 
      referenceImageUrls = [],
      regenerationFeedback,
      imageType, // Optional: if provided, only generate this specific type
    } = await req.json();

    if (!pepperId || !pepperName) {
      return new Response(
        JSON.stringify({ success: false, error: 'pepperId and pepperName are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (!geminiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'AI image generation not configured (GEMINI_API_KEY missing)' }),
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
        // Fetch reference images and convert to base64 inline_data parts for Gemini vision
        const imageParts: any[] = [];
        for (const url of referenceImageUrls.slice(0, 3) as string[]) {
          try {
            const refResp = await fetch(url);
            if (!refResp.ok) continue;
            const refBuf = new Uint8Array(await refResp.arrayBuffer());
            let binary = '';
            for (let i = 0; i < refBuf.length; i++) binary += String.fromCharCode(refBuf[i]);
            const refB64 = btoa(binary);
            const refMime = refResp.headers.get('content-type') || 'image/jpeg';
            imageParts.push({ inline_data: { mime_type: refMime, data: refB64 } });
          } catch (fetchErr) {
            console.error('Reference image fetch error:', fetchErr);
          }
        }

        const analysisResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [
                  { text: `${VISION_ANALYSIS_PROMPT}\n\nAnalyze these reference images of the ${pepperName} pepper variety:` },
                  ...imageParts,
                ],
              }],
            }),
          }
        );

        if (analysisResponse.ok) {
          const analysisData = await analysisResponse.json();
          const analysisContent = analysisData.candidates?.[0]?.content?.parts?.[0]?.text || '';
          
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

    // Add regeneration feedback if provided
    if (regenerationFeedback) {
      visualCharacteristics += `\n\nIMPORTANT - User feedback for this regeneration: ${regenerationFeedback}`;
      console.log('Regeneration feedback applied:', regenerationFeedback);
    }

    // Step 2: Generate images
    await updateJobProgress('image-generation');
    console.log('Generating images...');

    const allImageTypes = [
      { type: 'ai-botanical', template: BOTANICAL_PROMPT_TEMPLATE, aspectRatio: '3:4' },
      { type: 'ai-photo-plant', template: PHOTO_PLANT_PROMPT_TEMPLATE, aspectRatio: '4:3' },
      { type: 'ai-photo-individual', template: PHOTO_INDIVIDUAL_PROMPT_TEMPLATE, aspectRatio: '1:1' },
    ];

    // Filter to specific type if provided
    const imageTypes = imageType 
      ? allImageTypes.filter(t => t.type === imageType)
      : allImageTypes;

    for (const { type, template, aspectRatio } of imageTypes) {
      try {
        const prompt = template
          .replace(/\{\{pepperName\}\}/g, pepperName)
          .replace(/\{\{characteristics\}\}/g, visualCharacteristics);

        console.log(`Generating ${type} image...`);

        const imageResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );

        if (!imageResponse.ok) {
          const errorText = await imageResponse.text();
          console.error(`Image generation failed for ${type}:`, errorText);
          await updateJobProgress('image-generation', `${type} generation failed: ${imageResponse.status}`);
          continue;
        }

        const imageData = await imageResponse.json();
        const genParts = imageData.candidates?.[0]?.content?.parts || [];
        const genImagePart = genParts.find((p: any) => p.inlineData || p.inline_data);
        const genInline = genImagePart?.inlineData || genImagePart?.inline_data;
        const generatedImage = genInline?.data
          ? `data:${genInline.mimeType || genInline.mime_type || 'image/png'};base64,${genInline.data}`
          : null;

        if (!generatedImage) {
          console.error(`No image returned for ${type}`);
          continue;
        }

        // Step 3: Apply watermark
        await updateJobProgress('watermarking');
        console.log(`Applying watermark to ${type} image...`);

        // Apply watermark using image editing
        const watermarkedImage = await applyWatermark(geminiKey, generatedImage, pepperName, supabaseUrl);
        
        const timestamp = Date.now();
        const storagePath = `generated/${pepperId}/${type}-${timestamp}.png`;

        // Convert base64 to blob and upload
        const base64Data = watermarkedImage.replace(/^data:image\/\w+;base64,/, '');
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
      JSON.stringify({ success: false, error: 'An internal error occurred. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
