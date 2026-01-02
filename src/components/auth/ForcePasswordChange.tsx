import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordStrengthMeter } from '@/components/ui/PasswordStrengthMeter';
import { isPasswordValid } from '@/utils/passwordStrength';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Shield } from 'lucide-react';

interface ForcePasswordChangeProps {
  onPasswordChanged: () => void;
}

export function ForcePasswordChange({ onPasswordChanged }: ForcePasswordChangeProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const passwordsMatch = newPassword === confirmPassword;
  const isValid = isPasswordValid(newPassword) && passwordsMatch && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValid) {
      setError('Please meet all password requirements');
      return;
    }

    setIsUpdating(true);

    try {
      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      // Delete the pending password change record
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('pending_password_changes')
          .delete()
          .eq('user_id', user.id);
      }

      toast({
        title: 'Password Updated',
        description: 'Your password has been changed successfully.',
      });

      onPasswordChanged();
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
      toast({
        title: 'Update Failed',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/90 flex items-center justify-center z-50 p-4">
      <div className="bg-parchment border-2 border-gold/30 p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-tyrian/10 mb-4">
            <Shield className="w-8 h-8 text-tyrian" />
          </div>
          <h1 className="font-display text-2xl uppercase tracking-[0.1em] text-ink mb-2">
            Password Change Required
          </h1>
          <p className="font-body text-ink/60 text-sm">
            You must change your temporary password before continuing.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Enter new password"
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
                placeholder="Confirm new password"
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
            {confirmPassword && !passwordsMatch && (
              <p className="text-xs text-red-600">Passwords do not match</p>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isUpdating || !isValid}
            className="w-full bg-tyrian hover:bg-tyrian/90 text-parchment font-heading uppercase tracking-wider"
          >
            {isUpdating ? 'Updating...' : 'Set New Password'}
          </Button>
        </form>
      </div>
    </div>
  );
}
