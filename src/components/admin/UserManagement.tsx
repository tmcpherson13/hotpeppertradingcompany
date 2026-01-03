import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Shield, User, UserPlus, UserMinus, RefreshCw, Copy, Check, Mail, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface UserData {
  id: string;
  display_name: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  role: 'admin' | 'user';
  imageCount: number;
  isDeactivated: boolean;
}

export function UserManagement() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [tempPassword, setTempPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [resendingEmail, setResendingEmail] = useState<string | null>(null);
  const [emailFormError, setEmailFormError] = useState('');
  
  // Form state
  const [newEmail, setNewEmail] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(false);
  
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      // Get profiles including last_sign_in_at
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, display_name, created_at, last_sign_in_at')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Get roles for each user
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Get image counts
      const { data: imageCounts, error: imageError } = await supabase
        .from('user_uploaded_images')
        .select('user_id');

      if (imageError) throw imageError;

      // Get deactivated accounts
      const { data: deactivated, error: deactivatedError } = await supabase
        .from('deactivated_accounts')
        .select('user_id');

      if (deactivatedError) throw deactivatedError;

      // Create maps
      const imageCountMap = new Map<string, number>();
      imageCounts?.forEach((img) => {
        imageCountMap.set(img.user_id, (imageCountMap.get(img.user_id) || 0) + 1);
      });

      const roleMap = new Map<string, 'admin' | 'user'>();
      roles?.forEach((r) => {
        if (r.role === 'admin') {
          roleMap.set(r.user_id, 'admin');
        } else if (!roleMap.has(r.user_id)) {
          roleMap.set(r.user_id, 'user');
        }
      });

      const deactivatedSet = new Set(deactivated?.map(d => d.user_id) || []);

      // Combine data
      const userData: UserData[] = (profiles || []).map((profile) => ({
        id: profile.id,
        display_name: profile.display_name,
        created_at: profile.created_at,
        last_sign_in_at: profile.last_sign_in_at,
        role: roleMap.get(profile.id) || 'user',
        imageCount: imageCountMap.get(profile.id) || 0,
        isDeactivated: deactivatedSet.has(profile.id),
      }));

      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  const toggleDeactivation = async (userId: string, isDeactivated: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (isDeactivated) {
        // Reactivate
        const { error } = await supabase
          .from('deactivated_accounts')
          .delete()
          .eq('user_id', userId);

        if (error) throw error;

        if (user) {
          await supabase.from('admin_audit_log').insert({
            performed_by: user.id,
            action: 'admin_reactivated',
            target_type: 'user',
            target_id: userId,
          });
        }

        toast({ title: 'Account Reactivated' });
      } else {
        // Deactivate
        const { error } = await supabase
          .from('deactivated_accounts')
          .insert({
            user_id: userId,
            deactivated_by: user?.id,
          });

        if (error) throw error;

        if (user) {
          await supabase.from('admin_audit_log').insert({
            performed_by: user.id,
            action: 'admin_deactivated',
            target_type: 'user',
            target_id: userId,
          });
        }

        toast({ title: 'Account Deactivated' });
      }

      fetchUsers();
    } catch (error) {
      console.error('Error toggling deactivation:', error);
      toast({
        title: 'Error',
        description: 'Failed to update account status',
        variant: 'destructive',
      });
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleCreateAdmin = async () => {
    setEmailFormError('');

    if (!newEmail || !newDisplayName) {
      toast({
        title: 'Error',
        description: 'Email and display name are required',
        variant: 'destructive',
      });
      return;
    }

    // Email format validation
    if (!validateEmail(newEmail)) {
      setEmailFormError('Please enter a valid email address');
      return;
    }

    setIsCreating(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        toast({
          title: 'Session Expired',
          description: 'Please sign in again to continue.',
          variant: 'destructive',
        });
        return;
      }
      
      const response = await supabase.functions.invoke('create-admin-user', {
        body: {
          email: newEmail,
          displayName: newDisplayName,
          sendWelcomeEmail,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to create admin');
      }

      // Handle duplicate email error
      if (response.data?.error === 'duplicate_email') {
        setEmailFormError('An account with this email already exists');
        return;
      }

      if (response.data?.error) {
        throw new Error(response.data.message || response.data.error);
      }

      const { temporaryPassword, emailSent, emailError } = response.data;
      
      // Show different toasts based on email status
      if (sendWelcomeEmail && !emailSent) {
        toast({
          title: 'Admin Created (Email Failed)',
          description: emailError || 'Welcome email could not be sent. Share the password manually.',
          variant: 'destructive',
        });
      }
      
      setTempPassword(temporaryPassword);
      setShowAddModal(false);
      setShowPasswordModal(true);
      setNewEmail('');
      setNewDisplayName('');
      setSendWelcomeEmail(false);
      setEmailFormError('');
      
      fetchUsers();
    } catch (error: any) {
      console.error('Error creating admin:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create administrator',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleResendWelcomeEmail = async (userId: string) => {
    setResendingEmail(userId);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        toast({
          title: 'Session Expired',
          description: 'Please sign in again.',
          variant: 'destructive',
        });
        return;
      }

      const response = await supabase.functions.invoke('resend-admin-welcome', {
        body: { userId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to resend welcome email');
      }

      if (response.data?.error) {
        throw new Error(response.data.message || response.data.error);
      }

      const { temporaryPassword, emailSent, emailError } = response.data;

      if (emailSent) {
        toast({
          title: 'Welcome Email Sent',
          description: 'A new temporary password has been sent to the user.',
        });
      } else {
        // Email failed but password was reset - show password modal
        toast({
          title: 'Password Reset (Email Failed)',
          description: emailError || 'Share the new password manually.',
          variant: 'destructive',
        });
      }

      // Always show the password modal so admin can copy it
      setTempPassword(temporaryPassword);
      setShowPasswordModal(true);
    } catch (error: any) {
      console.error('Error resending welcome email:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to resend welcome email',
        variant: 'destructive',
      });
    } finally {
      setResendingEmail(null);
    }
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-parchment-dark/20 border border-ink/10 p-4 animate-pulse">
            <div className="h-4 bg-ink/10 rounded w-32" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add Admin Button */}
      <div className="flex justify-end">
        <Dialog open={showAddModal} onOpenChange={(open) => {
          setShowAddModal(open);
          if (!open) {
            setEmailFormError('');
            setNewEmail('');
            setNewDisplayName('');
            setSendWelcomeEmail(false);
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-tyrian hover:bg-tyrian/90 text-parchment font-heading uppercase tracking-wider text-xs">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Administrator
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-parchment border-ink/20">
            <DialogHeader>
              <DialogTitle className="font-display text-xl uppercase tracking-wider text-ink">
                Add New Administrator
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="font-heading text-xs uppercase tracking-wider text-ink/70">
                  Email Address
                </Label>
                <Input
                  type="email"
                  value={newEmail}
                  onChange={(e) => {
                    setNewEmail(e.target.value);
                    setEmailFormError('');
                  }}
                  placeholder="admin@example.com"
                  className={`bg-parchment border-ink/30 focus:border-tyrian ${emailFormError ? 'border-red-500' : ''}`}
                />
                {emailFormError && (
                  <p className="text-xs text-red-600 font-body">{emailFormError}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="font-heading text-xs uppercase tracking-wider text-ink/70">
                  Display Name
                </Label>
                <Input
                  type="text"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  placeholder="John Smith"
                  className="bg-parchment border-ink/30 focus:border-tyrian"
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="sendEmail"
                  checked={sendWelcomeEmail}
                  onCheckedChange={(checked) => setSendWelcomeEmail(checked === true)}
                />
                <Label htmlFor="sendEmail" className="font-body text-sm text-ink/70 cursor-pointer">
                  Send welcome email with credentials
                </Label>
              </div>
              <p className="text-xs text-ink/50 font-body">
                A temporary password will be generated. The new administrator will be required to change it on first login.
              </p>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 border-ink/20"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateAdmin}
                  disabled={isCreating || !newEmail || !newDisplayName}
                  className="flex-1 bg-tyrian hover:bg-tyrian/90 text-parchment"
                >
                  {isCreating ? 'Creating...' : 'Create Admin'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Password Display Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="bg-parchment border-ink/20">
          <DialogHeader>
            <DialogTitle className="font-display text-xl uppercase tracking-wider text-ink">
              Temporary Password
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="font-body text-sm text-ink/70">
              Share this temporary password securely with the administrator:
            </p>
            <div className="bg-parchment-dark/30 border border-ink/20 p-4 flex items-center justify-between">
              <code className="font-mono text-ink">{tempPassword}</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyPassword}
                className="ml-2"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-ink/50 font-body">
              This password will only be shown once. The user will be required to change it on first login.
            </p>
            <Button
              onClick={() => setShowPasswordModal(false)}
              className="w-full bg-tyrian hover:bg-tyrian/90 text-parchment"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* User List */}
      <div className="space-y-2">
        <div className="grid grid-cols-12 gap-4 px-4 py-2 font-heading text-xs uppercase tracking-wider text-ink/60 border-b border-ink/20">
          <div className="col-span-2">User</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Images</div>
          <div className="col-span-2">Last Login</div>
          <div className="col-span-2">Joined</div>
          <div className="col-span-2">Actions</div>
        </div>

        {users.map((user) => (
          <div
            key={user.id}
            className={`grid grid-cols-12 gap-4 px-4 py-3 bg-parchment-dark/20 border border-ink/10 items-center ${
              user.isDeactivated ? 'opacity-50' : ''
            }`}
          >
            <div className="col-span-2 flex items-center gap-2">
              <User className="w-4 h-4 text-ink/40 flex-shrink-0" />
              <span className={`font-body text-sm text-ink truncate ${user.isDeactivated ? 'line-through' : ''}`}>
                {user.display_name || 'Anonymous'}
              </span>
            </div>
            <div className="col-span-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-heading uppercase tracking-wider ${
                  user.role === 'admin'
                    ? 'bg-tyrian/20 text-tyrian'
                    : 'bg-ink/10 text-ink/60'
                }`}
              >
                {user.role === 'admin' && <Shield className="w-3 h-3" />}
                {user.role}
              </span>
            </div>
            <div className="col-span-1">
              <span
                className={`inline-flex items-center px-2 py-0.5 text-xs font-heading uppercase tracking-wider ${
                  user.isDeactivated
                    ? 'bg-red-100 text-red-600'
                    : 'bg-green-100 text-green-600'
                }`}
              >
                {user.isDeactivated ? 'Inactive' : 'Active'}
              </span>
            </div>
            <div className="col-span-1 font-body text-sm text-ink/70">
              {user.imageCount}
            </div>
            <div className="col-span-2 font-body text-xs text-ink/50">
              {user.last_sign_in_at 
                ? format(new Date(user.last_sign_in_at), 'MMM d, yyyy HH:mm')
                : 'Never'}
            </div>
            <div className="col-span-2 font-body text-xs text-ink/50">
              {format(new Date(user.created_at), 'MMM d, yyyy')}
            </div>
            <div className="col-span-2 flex gap-1">
              {user.role === 'admin' && !user.isDeactivated && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleResendWelcomeEmail(user.id)}
                  disabled={resendingEmail === user.id}
                  className="border-ink/20 text-xs hover:bg-blue-50"
                  title="Resend welcome email with new password"
                >
                  {resendingEmail === user.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Mail className="w-3 h-3" />
                  )}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleDeactivation(user.id, user.isDeactivated)}
                className={`border-ink/20 text-xs ${
                  user.isDeactivated ? 'hover:bg-green-50' : 'hover:bg-red-50'
                }`}
              >
                {user.isDeactivated ? (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Reactivate
                  </>
                ) : (
                  <>
                    <UserMinus className="w-3 h-3 mr-1" />
                    Deactivate
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <div className="text-center py-8 text-ink/50 font-body">
            No users found
          </div>
        )}
      </div>
    </div>
  );
}
