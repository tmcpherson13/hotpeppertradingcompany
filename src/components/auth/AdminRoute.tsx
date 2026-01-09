import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { ForcePasswordChange } from '@/components/auth/ForcePasswordChange';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ShieldX, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, isLoading, isAdmin, isAdminLoading, mustChangePassword, clearPasswordChangeRequirement, signOut } = useAuth();

  // Wait for both session AND admin status to load before making decisions
  if (isLoading || (isAdminLoading && !isAdmin)) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <div className="text-ink/60 font-body">Loading...</div>
      </div>
    );
  }

  // Not logged in - show embedded login form
  if (!user) {
    return <AdminLoginForm />;
  }

  // Logged in but not admin - show access denied
  if (!isAdmin) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-parchment pt-32 pb-16">
          <div className="container mx-auto px-4 max-w-md text-center">
            <div className="bg-parchment-light border border-ink/10 rounded-lg p-8 shadow-lg">
              <ShieldX className="w-16 h-16 text-red-500/70 mx-auto mb-4" />
              <h1 className="font-heading text-2xl text-ink mb-2">Access Denied</h1>
              <p className="text-ink/60 font-body mb-6">
                This area is restricted to administrators. If you believe you should have access, please contact the system administrator.
              </p>
              <Button
                onClick={() => signOut()}
                variant="outline"
                className="border-ink/20 hover:bg-ink/5"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Admin must change password
  if (mustChangePassword) {
    return <ForcePasswordChange onPasswordChanged={clearPasswordChangeRequirement} />;
  }

  return <>{children}</>;
}