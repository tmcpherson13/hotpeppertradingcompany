import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Shield, ShieldOff, User } from 'lucide-react';
import { format } from 'date-fns';

interface UserData {
  id: string;
  display_name: string | null;
  created_at: string;
  role: 'admin' | 'user';
  imageCount: number;
}

export function UserManagement() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      // Get profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, display_name, created_at')
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

      // Count images per user
      const imageCountMap = new Map<string, number>();
      imageCounts?.forEach((img) => {
        imageCountMap.set(img.user_id, (imageCountMap.get(img.user_id) || 0) + 1);
      });

      // Create role map
      const roleMap = new Map<string, 'admin' | 'user'>();
      roles?.forEach((r) => {
        if (r.role === 'admin') {
          roleMap.set(r.user_id, 'admin');
        } else if (!roleMap.has(r.user_id)) {
          roleMap.set(r.user_id, 'user');
        }
      });

      // Combine data
      const userData: UserData[] = (profiles || []).map((profile) => ({
        id: profile.id,
        display_name: profile.display_name,
        created_at: profile.created_at,
        role: roleMap.get(profile.id) || 'user',
        imageCount: imageCountMap.get(profile.id) || 0,
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

  const toggleRole = async (userId: string, currentRole: 'admin' | 'user') => {
    try {
      if (currentRole === 'admin') {
        // Demote: update role to 'user'
        const { error } = await supabase
          .from('user_roles')
          .update({ role: 'user' })
          .eq('user_id', userId)
          .eq('role', 'admin');

        if (error) throw error;
      } else {
        // Promote: update role to 'admin'
        const { error } = await supabase
          .from('user_roles')
          .update({ role: 'admin' })
          .eq('user_id', userId);

        if (error) throw error;
      }

      toast({
        title: 'Role Updated',
        description: `User ${currentRole === 'admin' ? 'demoted to user' : 'promoted to admin'}`,
      });

      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    }
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
    <div className="space-y-2">
      <div className="grid grid-cols-12 gap-4 px-4 py-2 font-heading text-xs uppercase tracking-wider text-ink/60 border-b border-ink/20">
        <div className="col-span-4">User</div>
        <div className="col-span-2">Role</div>
        <div className="col-span-2">Images</div>
        <div className="col-span-2">Joined</div>
        <div className="col-span-2">Actions</div>
      </div>

      {users.map((user) => (
        <div
          key={user.id}
          className="grid grid-cols-12 gap-4 px-4 py-3 bg-parchment-dark/20 border border-ink/10 items-center"
        >
          <div className="col-span-4 flex items-center gap-2">
            <User className="w-4 h-4 text-ink/40" />
            <span className="font-body text-sm text-ink truncate">
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
          <div className="col-span-2 font-body text-sm text-ink/70">
            {user.imageCount}
          </div>
          <div className="col-span-2 font-body text-xs text-ink/50">
            {format(new Date(user.created_at), 'MMM d, yyyy')}
          </div>
          <div className="col-span-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleRole(user.id, user.role)}
              className="border-ink/20 hover:bg-parchment-dark/50 text-xs"
            >
              {user.role === 'admin' ? (
                <>
                  <ShieldOff className="w-3 h-3 mr-1" />
                  Demote
                </>
              ) : (
                <>
                  <Shield className="w-3 h-3 mr-1" />
                  Promote
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
  );
}