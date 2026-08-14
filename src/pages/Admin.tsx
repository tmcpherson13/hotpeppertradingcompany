import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { SEO } from '@/components/SEO';
import { Footer } from '@/components/layout/Footer';

import { UserManagement } from '@/components/admin/UserManagement';
import { ImageModeration } from '@/components/admin/ImageModeration';
import { ProfileSettings } from '@/components/admin/ProfileSettings';
import { PepperEnrichment } from '@/components/admin/PepperEnrichment';
import { EnrichmentDashboard } from '@/components/admin/EnrichmentDashboard';
import { ImageProposalReview } from '@/components/admin/ImageProposalReview';
import { AdminAuditLog } from '@/components/admin/AdminAuditLog';
import { ReportsDownload } from '@/components/admin/ReportsDownload';
import { FeaturedRotationControls } from '@/components/admin/FeaturedRotationControls';
import { PepperManager } from '@/components/admin/PepperManager';
import { PepperImporter } from '@/components/admin/PepperImporter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Image, User, BookOpen, Activity, ImagePlus, FileText, Download, Star, Sprout } from 'lucide-react';
import antiqueMap from '@/assets/antique-map.jpg';

type EnrichmentSubTab = 'enrich' | 'catalog' | 'image-proposals' | 'progress';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('enrichment');
  const [enrichmentSubTab, setEnrichmentSubTab] = useState<EnrichmentSubTab>('enrich');
  const [catalogView, setCatalogView] = useState<'manage' | 'import'>('manage');
  const [enrichmentInitialView, setEnrichmentInitialView] = useState<'pending' | 'auto-approved' | undefined>(undefined);

  // Live counts of work awaiting review, badged onto the hub + sub-tabs so
  // pending items are visible without opening each section.
  const [pendingEnrichments, setPendingEnrichments] = useState(0);
  const [pendingImages, setPendingImages] = useState(0);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const [enr, img] = await Promise.all([
        supabase.from('pepper_enrichment_queue').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('pepper_image_proposals').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);
      if (!active) return;
      setPendingEnrichments(enr.count ?? 0);
      setPendingImages(img.count ?? 0);
    };
    load();
    const channel = supabase
      .channel('admin-pending-counts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pepper_enrichment_queue' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pepper_image_proposals' }, load)
      .subscribe();
    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDashboardNavigate = useCallback((target: 'pending' | 'auto-approved' | 'completed') => {
    if (target === 'pending' || target === 'auto-approved') {
      setEnrichmentInitialView(target === 'auto-approved' ? 'auto-approved' : 'pending');
      // Both live inside the Content Enrichment hub now — jump to the Enrich sub-tab.
      setActiveTab('enrichment');
      setEnrichmentSubTab('enrich');
    }
  }, []);

  // Secondary (sub-tab) trigger styling — deliberately lighter than the main
  // tyrian bar so it reads as a level-2 nav inside the Content Enrichment hub.
  const subTabClass =
    'group flex items-center justify-center gap-2 data-[state=active]:bg-tyrian data-[state=active]:text-parchment text-ink/70 hover:text-ink font-heading uppercase tracking-wider text-xs py-2.5 px-3 whitespace-nowrap transition-colors';

  // Count badge for the sub-tab strip (tyrian pill on the light strip; inverts
  // to parchment when its tab is active and the strip goes tyrian).
  const SubBadge = ({ count }: { count: number }) =>
    count > 0 ? (
      <span className="inline-flex items-center justify-center min-w-[1.15rem] h-[1.15rem] px-1 rounded-full bg-tyrian text-parchment text-[10px] leading-none group-data-[state=active]:bg-parchment group-data-[state=active]:text-tyrian">
        {count}
      </span>
    ) : null;

  return (
    <div className="min-h-screen bg-parchment flex flex-col relative">
      <SEO
        title="Administration"
        description="Administrative console for the Hot Pepper Trading Company: content enrichment, image moderation, user management, and site reports."
        path="/admin"
        noIndex
      />
      {/* Global background pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img
          src={antiqueMap}
          alt=""
          className="w-full h-full object-cover opacity-8"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-parchment/95 via-parchment/97 to-parchment" />
      </div>

      <Header />

      <main className="flex-1 pt-24 pb-12 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl uppercase tracking-[0.15em] text-ink">
              Administration
            </h1>
            <p className="font-body text-ink/60 mt-2">
              Enhance content, view statistics, and manage users
            </p>
          </div>


          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full bg-tyrian/90 border border-tyrian-dark p-1 mb-6 flex flex-wrap">
              <TabsTrigger
                value="enrichment"
                className="group flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-parchment data-[state=active]:text-ink text-parchment/90 font-heading uppercase tracking-wider text-xs py-3 px-2 whitespace-nowrap"
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                Content Enrichment
                {pendingEnrichments + pendingImages > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[1.15rem] h-[1.15rem] px-1 rounded-full bg-parchment text-tyrian text-[10px] leading-none group-data-[state=active]:bg-tyrian group-data-[state=active]:text-parchment">
                    {pendingEnrichments + pendingImages}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="images"
                className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-parchment data-[state=active]:text-ink text-parchment/90 font-heading uppercase tracking-wider text-xs py-3 px-2 whitespace-nowrap"
              >
                <Image className="w-4 h-4 shrink-0" />
                Images
              </TabsTrigger>
              <TabsTrigger
                value="audit-log"
                className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-parchment data-[state=active]:text-ink text-parchment/90 font-heading uppercase tracking-wider text-xs py-3 px-2 whitespace-nowrap"
              >
                <FileText className="w-4 h-4 shrink-0" />
                Audit Log
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-parchment data-[state=active]:text-ink text-parchment/90 font-heading uppercase tracking-wider text-xs py-3 px-2 whitespace-nowrap"
              >
                <Users className="w-4 h-4 shrink-0" />
                Users
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-parchment data-[state=active]:text-ink text-parchment/90 font-heading uppercase tracking-wider text-xs py-3 px-2 whitespace-nowrap"
              >
                <User className="w-4 h-4 shrink-0" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-parchment data-[state=active]:text-ink text-parchment/90 font-heading uppercase tracking-wider text-xs py-3 px-2 whitespace-nowrap"
              >
                <Download className="w-4 h-4 shrink-0" />
                Reports
              </TabsTrigger>
              <TabsTrigger
                value="featured"
                className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-parchment data-[state=active]:text-ink text-parchment/90 font-heading uppercase tracking-wider text-xs py-3 px-2 whitespace-nowrap"
              >
                <Star className="w-4 h-4 shrink-0" />
                Featured
              </TabsTrigger>
            </TabsList>

            {/* Content Enrichment hub — Enrich / Catalog / Image Proposals / Progress */}
            <TabsContent value="enrichment" className="mt-0">
              <div className="bg-parchment-dark/20 border border-ink/20 p-4">
                <Tabs value={enrichmentSubTab} onValueChange={(v) => setEnrichmentSubTab(v as EnrichmentSubTab)} className="w-full">
                  <TabsList className="w-full bg-parchment-dark/40 border border-ink/15 p-1 mb-5 flex flex-wrap">
                    <TabsTrigger value="enrich" className={`flex-1 ${subTabClass}`}>
                      <BookOpen className="w-4 h-4 shrink-0" />
                      Enrich
                      <SubBadge count={pendingEnrichments} />
                    </TabsTrigger>
                    <TabsTrigger value="catalog" className={`flex-1 ${subTabClass}`}>
                      <Sprout className="w-4 h-4 shrink-0" />
                      Catalog
                    </TabsTrigger>
                    <TabsTrigger value="image-proposals" className={`flex-1 ${subTabClass}`}>
                      <ImagePlus className="w-4 h-4 shrink-0" />
                      Image Proposals
                      <SubBadge count={pendingImages} />
                    </TabsTrigger>
                    <TabsTrigger value="progress" className={`flex-1 ${subTabClass}`}>
                      <Activity className="w-4 h-4 shrink-0" />
                      Progress
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="enrich" className="mt-0">
                    <h2 className="font-heading text-sm uppercase tracking-wider text-ink/70 mb-4">
                      Pepper Content Enrichment
                    </h2>
                    <PepperEnrichment
                      initialView={enrichmentInitialView}
                      onViewReset={() => setEnrichmentInitialView(undefined)}
                    />
                  </TabsContent>

                  <TabsContent value="catalog" className="mt-0">
                    <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
                      <h2 className="font-heading text-sm uppercase tracking-wider text-ink/70">
                        Catalog — Add &amp; Manage Cultivars
                      </h2>
                      <div className="inline-flex border border-tyrian-dark self-start">
                        <button
                          type="button"
                          onClick={() => setCatalogView('manage')}
                          className={`font-heading uppercase tracking-wider text-xs px-4 py-2 transition-colors ${
                            catalogView === 'manage'
                              ? 'bg-tyrian text-parchment'
                              : 'bg-parchment text-ink/70 hover:text-ink'
                          }`}
                        >
                          Manage Cultivars
                        </button>
                        <button
                          type="button"
                          onClick={() => setCatalogView('import')}
                          className={`font-heading uppercase tracking-wider text-xs px-4 py-2 border-l border-tyrian-dark transition-colors ${
                            catalogView === 'import'
                              ? 'bg-tyrian text-parchment'
                              : 'bg-parchment text-ink/70 hover:text-ink'
                          }`}
                        >
                          Bulk Import
                        </button>
                      </div>
                    </div>
                    {catalogView === 'manage' ? <PepperManager /> : <PepperImporter />}
                  </TabsContent>

                  <TabsContent value="image-proposals" className="mt-0">
                    <h2 className="font-heading text-sm uppercase tracking-wider text-ink/70 mb-4">
                      Pending Image Proposals
                    </h2>
                    <ImageProposalReview />
                  </TabsContent>

                  <TabsContent value="progress" className="mt-0">
                    <h2 className="font-heading text-sm uppercase tracking-wider text-ink/70 mb-4">
                      Enrichment Progress
                    </h2>
                    <EnrichmentDashboard onNavigate={handleDashboardNavigate} />
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>

            <TabsContent value="images" className="mt-0">
              <div className="bg-parchment-dark/20 border border-ink/20 p-4">
                <h2 className="font-heading text-sm uppercase tracking-wider text-ink/70 mb-4">
                  Image Gallery
                </h2>
                <ImageModeration />
              </div>
            </TabsContent>

            <TabsContent value="audit-log" className="mt-0">
              <div className="bg-parchment-dark/20 border border-ink/20 p-4">
                <h2 className="font-heading text-sm uppercase tracking-wider text-ink/70 mb-4">
                  Admin Audit Log
                </h2>
                <AdminAuditLog />
              </div>
            </TabsContent>

            <TabsContent value="users" className="mt-0">
              <div className="bg-parchment-dark/20 border border-ink/20 p-4">
                <h2 className="font-heading text-sm uppercase tracking-wider text-ink/70 mb-4">
                  User Management
                </h2>
                <UserManagement />
              </div>
            </TabsContent>

            <TabsContent value="profile" className="mt-0">
              <div className="bg-parchment-dark/20 border border-ink/20 p-4">
                <h2 className="font-heading text-sm uppercase tracking-wider text-ink/70 mb-4">
                  Your Profile
                </h2>
                <ProfileSettings />
              </div>
            </TabsContent>

            <TabsContent value="reports" className="mt-0">
              <div className="bg-parchment-dark/20 border border-ink/20 p-4">
                <h2 className="font-heading text-sm uppercase tracking-wider text-ink/70 mb-4">
                  Downloadable Reports
                </h2>
                <ReportsDownload />
              </div>
            </TabsContent>

            <TabsContent value="featured" className="mt-0">
              <div className="bg-parchment-dark/20 border border-ink/20 p-4">
                <h2 className="font-heading text-sm uppercase tracking-wider text-ink/70 mb-4">
                  Featured Consortium Controls
                </h2>
                <FeaturedRotationControls />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
