import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import logoDark from '@/assets/logo-dark.svg';
import { z } from 'zod';

const displayNameSchema = z.string().trim().max(100, { message: 'Display name must be less than 100 characters' });
const passwordSchema = z.string().min(6, { message: 'Password must be at least 6 characters' }).max(128);

export default function Profile() {
  const [displayName, setDisplayName] = useState('');
  const [originalDisplayName, setOriginalDisplayName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [errors, setErrors] = useState<{ displayName?: string; password?: string; confirm?: string }>({});
  
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  // Fetch current profile
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single();
    
    if (data && !error) {
      setDisplayName(data.display_name || '');
      setOriginalDisplayName(data.display_name || '');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    try {
      displayNameSchema.parse(displayName);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors({ displayName: err.errors[0]?.message });
        return;
      }
    }

    if (!user) return;
    
    setIsUpdatingProfile(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: displayName.trim() || null })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setOriginalDisplayName(displayName);
      toast({
        title: 'Profile Updated',
        description: 'Your display name has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate password
    try {
      passwordSchema.parse(newPassword);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors({ password: err.errors[0]?.message });
        return;
      }
    }

    if (newPassword !== confirmPassword) {
      setErrors({ confirm: 'Passwords do not match' });
      return;
    }

    setIsUpdatingPassword(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      
      setNewPassword('');
      setConfirmPassword('');
      toast({
        title: 'Password Updated',
        description: 'Your password has been changed successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <p className="font-body text-ink/60">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment flex flex-col">
      <Header />
      
      <main className="flex-1 pt-28 pb-12 px-4">
        <div className="container mx-auto max-w-xl">
          {/* Decorative header */}
          <div className="text-center mb-8">
            <img src={logoDark} alt="" className="h-16 w-auto mx-auto mb-4 opacity-80" />
            <h1 className="font-display text-2xl uppercase tracking-[0.15em] text-ink">
              Your Profile
            </h1>
            <p className="font-body text-sm text-ink/60 mt-2">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Profile Info */}
          <div className="bg-parchment-dark/30 border-2 border-ink/20 p-6 mb-6">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-4 h-4 border-t-2 border-l-2 border-ink/30" />
              <div className="absolute -top-4 -right-4 w-4 h-4 border-t-2 border-r-2 border-ink/30" />
              <div className="absolute -bottom-4 -left-4 w-4 h-4 border-b-2 border-l-2 border-ink/30" />
              <div className="absolute -bottom-4 -right-4 w-4 h-4 border-b-2 border-r-2 border-ink/30" />
            </div>

            <h2 className="font-heading text-lg uppercase tracking-wider text-ink mb-4">
              Account Information
            </h2>
            
            <div className="space-y-3 font-body text-sm">
              <div className="flex justify-between py-2 border-b border-ink/10">
                <span className="text-ink/60">Email</span>
                <span className="text-ink">{user?.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-ink/10">
                <span className="text-ink/60">Member Since</span>
                <span className="text-ink">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Update Display Name */}
          <div className="bg-parchment-dark/30 border-2 border-ink/20 p-6 mb-6">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-4 h-4 border-t-2 border-l-2 border-ink/30" />
              <div className="absolute -top-4 -right-4 w-4 h-4 border-t-2 border-r-2 border-ink/30" />
              <div className="absolute -bottom-4 -left-4 w-4 h-4 border-b-2 border-l-2 border-ink/30" />
              <div className="absolute -bottom-4 -right-4 w-4 h-4 border-b-2 border-r-2 border-ink/30" />
            </div>

            <h2 className="font-heading text-lg uppercase tracking-wider text-ink mb-4">
              Display Name
            </h2>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="font-heading text-xs uppercase tracking-wider text-ink/70">
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your display name"
                  className="bg-parchment border-ink/30 focus:border-tyrian"
                />
                {errors.displayName && (
                  <p className="text-xs text-red-600">{errors.displayName}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isUpdatingProfile || displayName === originalDisplayName}
                className="w-full bg-tyrian hover:bg-tyrian/90 text-parchment font-heading uppercase tracking-wider"
              >
                {isUpdatingProfile ? 'Updating...' : 'Update Display Name'}
              </Button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-parchment-dark/30 border-2 border-ink/20 p-6">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-4 h-4 border-t-2 border-l-2 border-ink/30" />
              <div className="absolute -top-4 -right-4 w-4 h-4 border-t-2 border-r-2 border-ink/30" />
              <div className="absolute -bottom-4 -left-4 w-4 h-4 border-b-2 border-l-2 border-ink/30" />
              <div className="absolute -bottom-4 -right-4 w-4 h-4 border-b-2 border-r-2 border-ink/30" />
            </div>

            <h2 className="font-heading text-lg uppercase tracking-wider text-ink mb-4">
              Change Password
            </h2>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="font-heading text-xs uppercase tracking-wider text-ink/70">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-parchment border-ink/30 focus:border-tyrian"
                />
                {errors.password && (
                  <p className="text-xs text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-heading text-xs uppercase tracking-wider text-ink/70">
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-parchment border-ink/30 focus:border-tyrian"
                />
                {errors.confirm && (
                  <p className="text-xs text-red-600">{errors.confirm}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isUpdatingPassword || !newPassword || !confirmPassword}
                className="w-full bg-tyrian hover:bg-tyrian/90 text-parchment font-heading uppercase tracking-wider"
              >
                {isUpdatingPassword ? 'Updating...' : 'Change Password'}
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
