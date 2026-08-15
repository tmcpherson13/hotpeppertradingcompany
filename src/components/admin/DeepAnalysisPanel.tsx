import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { peppers } from '@/data/peppers';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Loader2, AlertTriangle, Sparkles, FileText, Image as ImageIcon,
  ChevronDown, ShieldAlert, PencilLine, RefreshCw,
} from 'lucide-react';

// The deferred deep-analysis pass: no new AI calls. It ranks what the enrichment
// runner already recorded on each published entry (confidence + verifier flags)
// so the riskiest content and the weakest AI images float to the top for review.

interface QueueRow {
  id: string;
  pepper_id: string;
  confidence_score: number | null;
  unsupported_claims: string[] | null;
  plagiarism_flags: string[] | null;
  narrative_inferences: string[] | null;
  verification_passed: boolean | null;
  verification_notes: string | null;
  auto_rewritten: boolean | null;
  proposed_description: string | null;
  created_at: string;
}

interface ImageRow {
  id: string;
  pepper_id: string;
  image_url: string | null;
  source_type: string;
  confidence_score: number | null;
  status: string;
  license: string | null;
  author: string | null;
}

const pepperName = (id: string) => peppers.find((p) => p.id === id)?.name || id;
const isAiSource = (s: string) => s.startsWith('ai-');

// Risk from the recorded signals — higher = review sooner.
function riskScore(r: QueueRow): number {
  const conf = r.confidence_score ?? 0;
  const facts = (r.unsupported_claims?.length ?? 0);
  const copies = (r.plagiarism_flags?.length ?? 0);
  return (100 - conf)
    + facts * 15
    + copies * 25
    + (r.auto_rewritten ? 8 : 0)
    + (r.verification_passed === false ? 10 : 0);
}

type ContentFilter = 'all' | 'facts' | 'lowconf' | 'rewritten';

export function DeepAnalysisPanel() {
  const [rows, setRows] = useState<QueueRow[]>([]);
  const [images, setImages] = useState<ImageRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contentFilter, setContentFilter] = useState<ContentFilter>('all');
  const [aiOnly, setAiOnly] = useState(true);
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [{ data: q }, { data: img }] = await Promise.all([
        supabase
          .from('pepper_enrichment_queue')
          .select('id, pepper_id, confidence_score, unsupported_claims, plagiarism_flags, narrative_inferences, verification_passed, verification_notes, auto_rewritten, proposed_description, created_at')
          .eq('status', 'approved'),
        supabase
          .from('pepper_image_proposals')
          .select('id, pepper_id, image_url, source_type, confidence_score, status, license, author')
          .neq('status', 'rejected'),
      ]);
      setRows(((q as unknown as QueueRow[]) || []));
      setImages(((img as unknown as ImageRow[]) || []));
    } catch (err) {
      console.error('Deep analysis fetch failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Keep only the latest approved row per pepper, then rank by risk.
  const latestByPepper = new Map<string, QueueRow>();
  for (const r of rows) {
    const prev = latestByPepper.get(r.pepper_id);
    if (!prev || new Date(r.created_at) > new Date(prev.created_at)) latestByPepper.set(r.pepper_id, r);
  }
  let content = Array.from(latestByPepper.values());
  content = content.filter((r) => {
    if (contentFilter === 'facts') return (r.unsupported_claims?.length ?? 0) > 0;
    if (contentFilter === 'lowconf') return (r.confidence_score ?? 0) < 70;
    if (contentFilter === 'rewritten') return !!r.auto_rewritten;
    return true;
  });
  content.sort((a, b) => riskScore(b) - riskScore(a));

  const flaggedCount = Array.from(latestByPepper.values()).filter(
    (r) => (r.unsupported_claims?.length ?? 0) > 0 || (r.confidence_score ?? 0) < 70 || r.auto_rewritten
  ).length;

  const imgs = images
    .filter((i) => (aiOnly ? isAiSource(i.source_type) : true))
    .sort((a, b) => (a.confidence_score ?? 0) - (b.confidence_score ?? 0));

  const confBadge = (conf: number | null) => {
    const c = conf ?? 0;
    const cls = c >= 85 ? 'bg-green-100 text-green-700'
      : c >= 70 ? 'bg-amber-100 text-amber-700'
      : 'bg-red-100 text-red-700';
    return <Badge className={`${cls} text-xs`}>{c}% conf</Badge>;
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-ink/10">
        <div className="flex items-center gap-2 mb-1">
          <ShieldAlert className="w-4 h-4 text-primary" />
          <h3 className="font-heading text-sm uppercase tracking-wider text-ink/80">Deep Analysis</h3>
        </div>
        <p className="text-xs text-ink/60">
          Published entries ranked by risk from the signals recorded at enrichment —
          {' '}<span className="font-medium text-ink">{flaggedCount}</span> of {latestByPepper.size} worth a look. No AI re-run; this is a ranking.
        </p>
      </div>

      <Tabs defaultValue="content" className="flex-1 flex flex-col">
        <div className="px-4 pt-3">
          <TabsList className="bg-parchment-dark/30 border border-ink/20">
            <TabsTrigger value="content" className="text-xs gap-1"><FileText className="w-3.5 h-3.5" />Content</TabsTrigger>
            <TabsTrigger value="images" className="text-xs gap-1"><ImageIcon className="w-3.5 h-3.5" />Images</TabsTrigger>
          </TabsList>
        </div>

        {/* CONTENT */}
        <TabsContent value="content" className="flex-1 mt-2">
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {([
              ['all', 'All'],
              ['facts', 'Unsupported facts'],
              ['lowconf', 'Low confidence'],
              ['rewritten', 'Auto-rewritten'],
            ] as [ContentFilter, string][]).map(([k, label]) => (
              <Button key={k} size="sm" variant={contentFilter === k ? 'default' : 'outline'}
                onClick={() => setContentFilter(k)} className="text-xs h-7">{label}</Button>
            ))}
            <Button size="sm" variant="ghost" onClick={fetchAll} className="text-xs h-7 ml-auto">
              <RefreshCw className="w-3 h-3 mr-1" />Refresh
            </Button>
          </div>
          <ScrollArea className="h-[440px]">
            <div className="p-4 pt-0 space-y-2">
              {content.length === 0 && <p className="text-sm text-ink/40 text-center py-8">Nothing published yet in this view.</p>}
              {content.map((r) => {
                const facts = r.unsupported_claims || [];
                const copies = r.plagiarism_flags || [];
                const risk = riskScore(r);
                const isOpen = !!open[r.id];
                return (
                  <Card key={r.id} className="bg-parchment border-ink/10">
                    <Collapsible open={isOpen} onOpenChange={(v) => setOpen((s) => ({ ...s, [r.id]: v }))}>
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-heading text-sm text-ink">{pepperName(r.pepper_id)}</span>
                          {confBadge(r.confidence_score)}
                          {facts.length > 0 && (
                            <Badge className="bg-red-100 text-red-700 text-xs gap-1">
                              <AlertTriangle className="w-3 h-3" />{facts.length} unsupported fact{facts.length > 1 ? 's' : ''}
                            </Badge>
                          )}
                          {copies.length > 0 && (
                            <Badge className="bg-red-100 text-red-700 text-xs">{copies.length} copied passage{copies.length > 1 ? 's' : ''}</Badge>
                          )}
                          {r.auto_rewritten && (
                            <Badge className="bg-amber-100 text-amber-700 text-xs gap-1"><PencilLine className="w-3 h-3" />auto-rewritten</Badge>
                          )}
                          <span className="ml-auto text-[11px] text-ink/40">risk {Math.round(risk)}</span>
                          <CollapsibleTrigger asChild>
                            <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                              Details <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent className="pt-3 space-y-3">
                          {facts.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-red-700 mb-1">Unsupported facts (verify against sources)</p>
                              <ul className="space-y-1">
                                {facts.map((f, i) => <li key={i} className="text-xs text-ink/70 pl-3 border-l-2 border-red-200">{f}</li>)}
                              </ul>
                            </div>
                          )}
                          {copies.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-red-700 mb-1">Passages flagged as too close to a source</p>
                              <ul className="space-y-1">
                                {copies.map((f, i) => <li key={i} className="text-xs text-ink/70 pl-3 border-l-2 border-red-200">{f}</li>)}
                              </ul>
                            </div>
                          )}
                          {r.verification_notes && (
                            <p className="text-xs text-ink/60"><span className="font-medium">Verifier notes:</span> {r.verification_notes}</p>
                          )}
                          {r.proposed_description && (
                            <p className="text-xs text-ink/70 italic">{r.proposed_description}</p>
                          )}
                          {facts.length === 0 && copies.length === 0 && (
                            <p className="text-xs text-green-700">No blocking flags — only confidence-based ranking.</p>
                          )}
                        </CollapsibleContent>
                      </CardContent>
                    </Collapsible>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* IMAGES */}
        <TabsContent value="images" className="flex-1 mt-2">
          <div className="px-4 pb-2 flex items-center gap-2">
            <Button size="sm" variant={aiOnly ? 'default' : 'outline'} onClick={() => setAiOnly((v) => !v)} className="text-xs h-7 gap-1">
              <Sparkles className="w-3 h-3" />{aiOnly ? 'AI-generated only' : 'All sources'}
            </Button>
            <span className="text-xs text-ink/50">weakest first</span>
            <Button size="sm" variant="ghost" onClick={fetchAll} className="text-xs h-7 ml-auto">
              <RefreshCw className="w-3 h-3 mr-1" />Refresh
            </Button>
          </div>
          <ScrollArea className="h-[440px]">
            <div className="p-4 pt-0 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {imgs.length === 0 && <p className="text-sm text-ink/40 col-span-full text-center py-8">No images to review.</p>}
              {imgs.map((i) => (
                <div key={i.id} className="border border-ink/10 rounded-lg overflow-hidden bg-parchment">
                  <div className="aspect-square bg-parchment-dark/30 overflow-hidden">
                    {i.image_url
                      ? <img src={i.image_url} alt={pepperName(i.pepper_id)} className="w-full h-full object-cover" loading="lazy" />
                      : <div className="flex items-center justify-center h-full text-ink/30"><ImageIcon className="w-6 h-6" /></div>}
                  </div>
                  <div className="p-2 space-y-1">
                    <p className="text-xs font-medium text-ink truncate">{pepperName(i.pepper_id)}</p>
                    <div className="flex items-center gap-1 flex-wrap">
                      <Badge variant="outline" className={`text-[10px] ${isAiSource(i.source_type) ? 'text-purple-600 border-purple-200' : 'text-blue-600 border-blue-200'}`}>
                        {isAiSource(i.source_type) ? 'AI' : 'Archive'}
                      </Badge>
                      {confBadge(i.confidence_score)}
                      <Badge variant="outline" className="text-[10px] capitalize">{i.status}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
