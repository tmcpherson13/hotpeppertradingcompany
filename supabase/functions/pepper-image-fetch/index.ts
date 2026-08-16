import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fetch free, COMMERCIALLY-USABLE real photos for a pepper from Openverse and
// iNaturalist, download them into our own storage bucket, and file them as
// pepper_image_proposals (same review flow as the Wikimedia photos in
// pepper-research). This is a curation supplement — it never publishes; an
// admin (or the curated primary-image override) picks the winner.
//
// LICENSE POLICY: this is a commercial site, so only CC0 / Public Domain /
// CC BY / CC BY-SA are accepted. CC *-NC (non-commercial) and *-ND images are
// rejected. Openverse is queried with license_type=commercial; iNaturalist is
// queried with photo_license restricted to cc0,cc-by,cc-by-sa.

const strip = (s: string | null | undefined) =>
  (s || '').replace(/<[^>]+>/g, '').trim();

interface Candidate {
  imageUrl: string;      // direct image bytes
  fallbackUrl?: string;  // reliable secondary (e.g. Openverse-hosted thumbnail)
  sourceUrl: string;     // human-facing source page (attribution link)
  license: string;
  author: string;
  title: string;
  source: 'openverse' | 'inaturalist';
}

// Accept only commercial-safe license codes.
const COMMERCIAL_OK = /^(cc0|pdm|public\s*domain|cc-?by(-sa)?(\s|$)|by(-sa)?$)/i;
function licenseAllowed(code: string): boolean {
  const c = (code || '').toLowerCase();
  if (c.includes('-nc') || c.includes('noncommercial')) return false;
  if (c.includes('-nd') || c.includes('noderiv')) return false;
  return COMMERCIAL_OK.test(c) || c.includes('cc-by') || c === 'by' || c === 'by-sa';
}

async function fromOpenverse(pepperName: string): Promise<Candidate[]> {
  const out: Candidate[] = [];
  try {
    const q = encodeURIComponent(`${pepperName} pepper`);
    const url = `https://api.openverse.org/v1/images/?q=${q}&license_type=commercial&page_size=8&mature=false`;
    const res = await fetch(url, { headers: { 'User-Agent': 'HotPepperTradingCompany/1.0 (curation)' } });
    if (!res.ok) { console.error('Openverse HTTP', res.status); return out; }
    const data = await res.json();
    for (const r of (data.results || [])) {
      const license = [r.license, r.license_version].filter(Boolean).join(' ').toUpperCase() || 'CC';
      if (!licenseAllowed(r.license || '')) continue;
      if (!r.url) continue;
      out.push({
        imageUrl: r.url,
        // Openverse-hosted thumbnail is always downloadable even when the
        // provider host blocks server-side hotlinking of r.url.
        fallbackUrl: r.thumbnail || undefined,
        sourceUrl: r.foreign_landing_url || r.url,
        license,
        author: strip(r.creator) || 'Unknown',
        title: strip(r.title) || pepperName,
        source: 'openverse',
      });
    }
  } catch (e) {
    console.error('Openverse error:', e);
  }
  return out;
}

async function fromINaturalist(pepperName: string): Promise<Candidate[]> {
  const out: Candidate[] = [];
  try {
    const q = encodeURIComponent(pepperName);
    // Research-grade plant observations, highest-voted first, commercial licenses only.
    const url = `https://api.inaturalist.org/v1/observations?q=${q}&photos=true&photo_license=cc0%2Ccc-by%2Ccc-by-sa&iconic_taxa=Plantae&order_by=votes&per_page=8`;
    const res = await fetch(url, { headers: { 'User-Agent': 'HotPepperTradingCompany/1.0 (curation)' } });
    if (!res.ok) { console.error('iNaturalist HTTP', res.status); return out; }
    const data = await res.json();
    for (const obs of (data.results || [])) {
      const photo = (obs.photos || [])[0];
      if (!photo || !photo.url) continue;
      if (!licenseAllowed(photo.license_code || '')) continue;
      // Upgrade the thumbnail URL to a larger rendition.
      const big = String(photo.url).replace(/\/square\.(\w+)/, '/large.$1');
      out.push({
        imageUrl: big,
        sourceUrl: obs.uri || `https://www.inaturalist.org/observations/${obs.id}`,
        license: (photo.license_code || 'cc').toUpperCase(),
        author: strip(photo.attribution) || strip(obs.user?.name) || strip(obs.user?.login) || 'iNaturalist contributor',
        title: strip(obs.taxon?.name) || pepperName,
        source: 'inaturalist',
      });
      if (out.length >= 6) break;
    }
  } catch (e) {
    console.error('iNaturalist error:', e);
  }
  return out;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { pepperId, pepperName, sources = ['openverse', 'inaturalist'], perSource = 4 } = await req.json();
    if (!pepperId || !pepperName) {
      return new Response(JSON.stringify({ success: false, error: 'pepperId and pepperName are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    let candidates: Candidate[] = [];
    if (sources.includes('openverse')) candidates = candidates.concat((await fromOpenverse(pepperName)).slice(0, perSource));
    if (sources.includes('inaturalist')) candidates = candidates.concat((await fromINaturalist(pepperName)).slice(0, perSource));

    // Dedup against what this pepper already has proposed (any source).
    const { data: existing } = await supabase
      .from('pepper_image_proposals').select('source_url').eq('pepper_id', pepperId);
    const seen = new Set((existing || []).map((p: any) => p.source_url));

    let created = 0;
    for (const c of candidates) {
      if (seen.has(c.sourceUrl)) continue;
      try {
        // Try the full image; if the provider blocks it or serves non-image
        // (HTML error page), fall back to the reliable Openverse thumbnail.
        const ua = { 'User-Agent': 'HotPepperTradingCompany/1.0 (curation)' };
        let dl = await fetch(c.imageUrl, { headers: ua });
        let mime = dl.headers.get('content-type') || '';
        if ((!dl.ok || !mime.startsWith('image/')) && c.fallbackUrl) {
          dl = await fetch(c.fallbackUrl, { headers: ua });
          mime = dl.headers.get('content-type') || '';
        }
        if (!dl.ok) { console.error(`download ${dl.status}: ${c.imageUrl}`); continue; }
        if (!mime.startsWith('image/')) { console.error('non-image mime', mime, c.imageUrl); continue; }
        const bytes = new Uint8Array(await dl.arrayBuffer());
        const ext = mime.includes('/') ? mime.split('/')[1].split(';')[0].replace('jpeg', 'jpg') : 'jpg';
        const storagePath = `${c.source}/${pepperId}/${Date.now()}-${created}.${ext}`;

        const { error: upErr } = await supabase.storage
          .from('pepper-images').upload(storagePath, bytes, { contentType: mime, upsert: true });
        if (upErr) { console.error('upload error', upErr); continue; }

        const { data: { publicUrl } } = supabase.storage.from('pepper-images').getPublicUrl(storagePath);

        const { error: propErr } = await supabase.from('pepper_image_proposals').insert({
          pepper_id: pepperId,
          image_url: publicUrl,
          storage_path: storagePath,
          source_type: c.source,
          source_url: c.sourceUrl,
          license: c.license,
          author: c.author,
          prompt_used: c.title,
          confidence_score: 60,
          status: 'pending',
        });
        if (propErr) { console.error('proposal insert error', propErr); continue; }
        seen.add(c.sourceUrl);
        created++;
      } catch (e) {
        console.error('candidate error', e);
      }
    }

    return new Response(JSON.stringify({ success: true, pepperId, found: candidates.length, created }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('pepper-image-fetch error:', error);
    return new Response(JSON.stringify({ success: false, error: 'An internal error occurred.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
