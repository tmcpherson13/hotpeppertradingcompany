import { useState, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Image, User, BookOpen, Activity, ImagePlus, FileText, Download, Star } from 'lucide-react';
import antiqueMap from '@/assets/antique-map.jpg';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('enrichment');
  const [enrichmentInitialView, setEnrichmentInitialView] = useState<'pending' | 'auto-approved' | undefined>(undefined);

  const handleDashboardNavigate = useCallback((target: 'pending' | 'auto-approved' | 'completed') => {
    if (target === 'pending' || target === 'auto-approved') {
      setEnrichmentInitialView(target === 'auto-approved' ? 'auto-approved' : 'pending');
      setActiveTab('enrichment');
    }
  }, []);

  return (
    <div className="min-h-screen bg-parchment flex flex-col relative">
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
                className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-parchment data-[state=active]:text-ink text-parchment/90 font-heading uppercase tracking-wider text-xs py-3 px-2 whitespace-nowrap"
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                Content Enrichment
              </TabsTrigger>
              <TabsTrigger
                value="progress"
                className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-parchment data-[state=active]:text-ink text-parchment/90 font-heading uppercase tracking-wider text-xs py-3 px-2 whitespace-nowrap"
              >
                <Activity className="w-4 h-4 shrink-0" />
                Progress
              </TabsTrigger>
              <TabsTrigger
                value="images"
                className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-parchment data-[state=active]:text-ink text-parchment/90 font-heading uppercase tracking-wider text-xs py-3 px-2 whitespace-nowrap"
              >
                <Image className="w-4 h-4 shrink-0" />
                Images
              </TabsTrigger>
              <TabsTrigger
                value="image-proposals"
                className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-parchment data-[state=active]:text-ink text-parchment/90 font-heading uppercase tracking-wider text-xs py-3 px-2 whitespace-nowrap"
              >
                <ImagePlus className="w-4 h-4 shrink-0" />
                Image Proposals
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

            <TabsContent value="users" className="mt-0">
              <div className="bg-parchment-dark/20 border border-ink/20 p-4">
                <h2 className="font-heading text-sm uppercase tracking-wider text-ink/70 mb-4">
                  User Management
                </h2>
                <UserManagement />
              </div>
            </TabsContent>

            <TabsContent value="images" className="mt-0">
              <div className="bg-parchment-dark/20 border border-ink/20 p-4">
                <h2 className="font-heading text-sm uppercase tracking-wider text-ink/70 mb-4">
                  Image Moderation
                </h2>
                <ImageModeration />
              </div>
            </TabsContent>

            <TabsContent value="enrichment" className="mt-0">
              <div className="bg-parchment-dark/20 border border-ink/20 p-4">
                <h2 className="font-heading text-sm uppercase tracking-wider text-ink/70 mb-4">
                  Pepper Content Enrichment
                </h2>
                <PepperEnrichment 
                  initialView={enrichmentInitialView} 
                  onViewReset={() => setEnrichmentInitialView(undefined)} 
                />
              </div>
            </TabsContent>

            <TabsContent value="progress" className="mt-0">
              <div className="bg-parchment-dark/20 border border-ink/20 p-4">
                <h2 className="font-heading text-sm uppercase tracking-wider text-ink/70 mb-4">
                  Enrichment Progress
                </h2>
                <EnrichmentDashboard onNavigate={handleDashboardNavigate} />
              </div>
            </TabsContent>

            <TabsContent value="image-proposals" className="mt-0">
              <div className="bg-parchment-dark/20 border border-ink/20 p-4">
                <h2 className="font-heading text-sm uppercase tracking-wider text-ink/70 mb-4">
                  Pending Image Proposals
                </h2>
                <ImageProposalReview />
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