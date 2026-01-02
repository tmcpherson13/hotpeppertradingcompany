import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdminStats } from '@/components/admin/AdminStats';
import { UserManagement } from '@/components/admin/UserManagement';
import { ImageModeration } from '@/components/admin/ImageModeration';
import { ProfileSettings } from '@/components/admin/ProfileSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Image, User } from 'lucide-react';

export default function Admin() {
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

          {/* Stats Overview */}
          <div className="mb-8">
            <AdminStats />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="bg-parchment-dark/30 border border-ink/20 p-1 mb-6">
              <TabsTrigger
                value="users"
                className="flex items-center gap-2 data-[state=active]:bg-parchment data-[state=active]:text-ink font-heading uppercase tracking-wider text-xs"
              >
                <Users className="w-4 h-4" />
                Users
              </TabsTrigger>
              <TabsTrigger
                value="images"
                className="flex items-center gap-2 data-[state=active]:bg-parchment data-[state=active]:text-ink font-heading uppercase tracking-wider text-xs"
              >
                <Image className="w-4 h-4" />
                Images
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