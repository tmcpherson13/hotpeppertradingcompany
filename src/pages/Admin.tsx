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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Image, User, BookOpen, Activity, ImagePlus, FileText } from 'lucide-react';

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
    <div className="min-h-screen bg-parchment flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl uppercase tracking-[0.15em] text-ink">
              Administration
            </h1>
            <p className="font-body text-ink/60 mt-2">
              Manage users, moderate content, and view statistics
            </p>
          </div>


          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-parchment-dark/30 border border-ink/20 p-1 mb-6">
              <TabsTrigger
                value="enrichment"
                className="flex items-center gap-2 data-[state=active]:bg-parchment data-[state=active]:text-ink font-heading uppercase tracking-wider text-xs"
              >
                <BookOpen className="w-4 h-4" />
                Content Enrichment
              </TabsTrigger>
              <TabsTrigger
                value="progress"
                className="flex items-center gap-2 data-[state=active]:bg-parchment data-[state=active]:text-ink font-heading uppercase tracking-wider text-xs"
              >
                <Activity className="w-4 h-4" />
                Progress
              </TabsTrigger>
              <TabsTrigger
                value="images"
                className="flex items-center gap-2 data-[state=active]:bg-parchment data-[state=active]:text-ink font-heading uppercase tracking-wider text-xs"
              >
                <Image className="w-4 h-4" />
                Images
              </TabsTrigger>
              <TabsTrigger
                value="image-proposals"
                className="flex items-center gap-2 data-[state=active]:bg-parchment data-[state=active]:text-ink font-heading uppercase tracking-wider text-xs"
              >
                <ImagePlus className="w-4 h-4" />
                Image Proposals
              </TabsTrigger>
              <TabsTrigger
                value="audit-log"
                className="flex items-center gap-2 data-[state=active]:bg-parchment data-[state=active]:text-ink font-heading uppercase tracking-wider text-xs"
              >
                <FileText className="w-4 h-4" />
                Audit Log
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="flex items-center gap-2 data-[state=active]:bg-parchment data-[state=active]:text-ink font-heading uppercase tracking-wider text-xs"
              >
                <Users className="w-4 h-4" />
                Users
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="flex items-center gap-2 data-[state=active]:bg-parchment data-[state=active]:text-ink font-heading uppercase tracking-wider text-xs"
              >
                <User className="w-4 h-4" />
                Profile
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
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}