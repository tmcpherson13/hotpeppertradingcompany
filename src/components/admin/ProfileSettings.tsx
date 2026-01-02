import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordStrengthMeter } from '@/components/ui/PasswordStrengthMeter';
import { isPasswordValid } from '@/utils/passwordStrength';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';

const displayNameSchema = z.string().trim().max(100, { message: 'Display name must be less than 100 characters' });

export function ProfileSettings() {
  const [displayName, setDisplayName] = useState('');
  const [originalDisplayName, setOriginalDisplayName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [errors, setErrors] = useState<{ displayName?: string; password?: string; confirm?: string }>({});
  
  const { user } = useAuth();
  const { toast } = useToast();

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
    
    if (!isPasswordValid(newPassword)) {
      setErrors({ password: 'Password must meet all requirements' });
      return;
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

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <div className="bg-parchment/50 border border-ink/20 p-4">
        <h3 className="font-heading text-sm uppercase tracking-wider text-ink/70 mb-4">
          Account Information
        </h3>
        
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
      <div className="bg-parchment/50 border border-ink/20 p-4">
        <h3 className="font-heading text-sm uppercase tracking-wider text-ink/70 mb-4">
          Display Name
        </h3>

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
      <div className="bg-parchment/50 border border-ink/20 p-4">
        <h3 className="font-heading text-sm uppercase tracking-wider text-ink/70 mb-4">
          Change Password
        </h3>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="font-heading text-xs uppercase tracking-wider text-ink/70">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-parchment border-ink/30 focus:border-tyrian pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <PasswordStrengthMeter password={newPassword} />
            {errors.password && (
              <p className="text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="font-heading text-xs uppercase tracking-wider text-ink/70">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-parchment border-ink/30 focus:border-tyrian pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirm && (
              <p className="text-xs text-red-600">{errors.confirm}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isUpdatingPassword || !newPassword || !confirmPassword || !isPasswordValid(newPassword)}
            className="w-full bg-tyrian hover:bg-tyrian/90 text-parchment font-heading uppercase tracking-wider"
          >
            {isUpdatingPassword ? 'Updating...' : 'Change Password'}
          </Button>
        </form>
      </div>
    </div>
  );
}
