import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// gemini-flash-latest resolves to the current fast vision model; the dated
// 2.5 ids returned 404 on this key by mid-2026.
const VISION_MODEL = Deno.env.get('GEMINI_VISION_MODEL') || 'gemini-flash-latest';

const CLASSIFY_PROMPT =
  `You are verifying stock photos for a chili-pepper encyclopedia. Look at the image and decide whether it PRIMARILY depicts chili / capsicum peppers — fresh pods, the growing plant, or dried chili peppers (the fruit or the ground spice made from it).\n\n` +
  `Mark it NOT a pepper when the clear subject is: a person or portrait, a place/building/landscape, a document/newspaper/logo, a mineral or astronomical image, an animal, a prepared dish where peppers are not the obvious subject, or a different plant/spice entirely (e.g. black peppercorns / Piper nigrum, allspice, bell of another genus).\n\n` +
  `Respond with ONLY minified JSON, no prose: {"is_pepper":true|false,"confidence":0-100,"subject":"<=6 words"}`;

interface Proposal {
  id: string;
  pepper_id: string;
  image_url: string;
  source_url: string | null;
}

// Prefer a small Wikimedia thumbnail (low memory) over the full-res bucket
// original, which can be several MB and exhaust the worker.
function thumbUrl(sourceUrl: string | null, fallback: string): string {
  if (sourceUrl) {
    const marker = sourceUrl.includes('File%3A') ? 'File%3A' : (sourceUrl.includes('File:') ? 'File:' : null);
    if (marker) {
      const name = sourceUrl.split(marker)[1];
      if (name) return `https://commons.wikimedia.org/wiki/Special:FilePath/${name}?width=400`;
    }
  }
  return fallback;
}

type Verdict = { is_pepper: boolean; confidence: number; subject: string; err?: string };

async function classify(geminiKey: string, model: string, imageUrl: string, sourceUrl: string | null): Promise<Verdict> {
  let resp: Response;
  try {
    resp = await fetch(thumbUrl(sourceUrl, imageUrl), { redirect: 'follow' });
    if (!resp.ok) resp = await fetch(imageUrl); // fall back to the stored original
  } catch {
    return { is_pepper: true, confidence: 0, subject: '', err: 'fetch_throw' };
  }
  if (!resp.ok) return { is_pepper: true, confidence: 0, subject: '', err: `fetch_${resp.status}` };
  const buf = new Uint8Array(await resp.arrayBuffer());
  if (buf.length > 5_000_000) return { is_pepper: true, confidence: 0, subject: '', err: 'too_large' };

  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < buf.length; i += chunk) binary += String.fromCharCode(...buf.subarray(i, i + chunk));
  const b64 = btoa(binary);
  const mime = resp.headers.get('content-type') || 'image/jpeg';

  let r: Response;
  try {
    r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: CLASSIFY_PROMPT }, { inline_data: { mime_type: mime, data: b64 } }] }],
          generationConfig: { temperature: 0, maxOutputTokens: 1024 },
        }),
      },
    );
  } catch {
    return { is_pepper: true, confidence: 0, subject: '', err: 'gemini_throw' };
  }
  if (!r.ok) {
    const t = await r.text().catch(() => '');
    console.error('gemini', r.status, t.slice(0, 200));
    return { is_pepper: true, confidence: 0, subject: '', err: `gemini_${r.status}` };
  }
  const data = await r.json();
  const text = data.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') || '';
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) { console.error('noparse', JSON.stringify(data).slice(0, 300)); return { is_pepper: true, confidence: 0, subject: '', err: 'noparse' }; }
  try {
    const parsed = JSON.parse(m[0]);
    return { is_pepper: !!parsed.is_pepper, confidence: Number(parsed.confidence) || 0, subject: String(parsed.subject || '').slice(0, 80) };
  } catch {
    return { is_pepper: true, confidence: 0, subject: '', err: 'jsonerr' };
  }
}

async function pool<T>(items: T[], size: number, fn: (item: T) => Promise<void>): Promise<void> {
  const queue = [...items];
  const workers = Array.from({ length: Math.min(size, queue.length) }, async () => {
    while (queue.length) {
      const item = queue.shift();
      if (item === undefined) break;
      await fn(item);
    }
  });
  await Promise.all(workers);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiKey) {
      return new Response(JSON.stringify({ success: false, error: 'GEMINI_API_KEY missing' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const body = await req.json().catch(() => ({}));

    if (body.debug === 'models') {
      const rr = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`);
      const txt = await rr.text();
      // Return just the model names that support generateContent.
      let names: string[] = [];
      try {
        const j = JSON.parse(txt);
        names = (j.models || [])
          .filter((m: any) => (m.supportedGenerationMethods || []).includes('generateContent'))
          .map((m: any) => m.name);
      } catch { /* ignore */ }
      return new Response(JSON.stringify({ status: rr.status, names, raw: names.length ? undefined : txt.slice(0, 500) }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const model = body.model || Deno.env.get('GEMINI_VISION_MODEL') || VISION_MODEL;
    const limit = Math.min(Math.max(Number(body.limit) || 30, 1), 60);
    const sourceType = body.sourceType || 'wikimedia';
    const rejectBelow = Number(body.rejectConfidence) || 70;
    const concurrency = Math.min(Math.max(Number(body.concurrency) || 3, 1), 5);

    const { data: proposals, error } = await supabase
      .from('pepper_image_proposals')
      .select('id,pepper_id,image_url,source_url')
      .eq('status', 'pending')
      .eq('source_type', sourceType)
      .is('reviewed_at', null)
      .order('created_at', { ascending: true })
      .limit(limit);
    if (error) throw error;

    const list = (proposals || []) as Proposal[];
    let rejected = 0, kept = 0, failed = 0;
    const errs: Record<string, number> = {};
    const now = new Date().toISOString();

    await pool(list, concurrency, async (p) => {
      const v = await classify(geminiKey, model, p.image_url, p.source_url);
      if (v.err) { failed++; errs[v.err] = (errs[v.err] || 0) + 1; return; }
      if (!v.is_pepper && v.confidence >= rejectBelow) {
        await supabase.from('pepper_image_proposals')
          .update({ status: 'rejected', reviewed_at: now, confidence_score: Math.max(0, 100 - v.confidence) })
          .eq('id', p.id);
        rejected++;
      } else {
        await supabase.from('pepper_image_proposals')
          .update({ reviewed_at: now, confidence_score: v.is_pepper ? Math.max(v.confidence, 60) : 50 })
          .eq('id', p.id);
        kept++;
      }
    });

    const { count: remaining } = await supabase
      .from('pepper_image_proposals')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending')
      .eq('source_type', sourceType)
      .is('reviewed_at', null);

    return new Response(JSON.stringify({ success: true, model, processed: list.length, rejected, kept, failed, errs, remaining_unreviewed: remaining ?? null }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('pepper-proposal-audit error:', e);
    return new Response(JSON.stringify({ success: false, error: String(e) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
