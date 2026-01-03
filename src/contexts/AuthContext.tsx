import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

const SESSION_PERSIST_KEY = 'hptc-remember-session';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  isAdminLoading: boolean;
  isDeactivated: boolean;
  mustChangePassword: boolean;
  clearPasswordChangeRequirement: () => void;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, displayName?: string, rememberMe?: boolean) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(true);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(false);

  // Check admin status, deactivation, and password change requirement
  const checkUserStatus = async (userId: string) => {
    setIsAdminLoading(true);
    try {
      // Check admin role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (roleError) {
        console.error('Error checking admin status:', roleError);
        setIsAdmin(false);
      } else {
        setIsAdmin(!!roleData);
      }

      // Check if deactivated
      const { data: deactivatedData } = await supabase
        .from('deactivated_accounts')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (deactivatedData) {
        setIsDeactivated(true);
        // Sign out deactivated users
        await supabase.auth.signOut();
        return;
      }
      
      setIsDeactivated(false);

      // Check if password change required
      const { data: pendingData } = await supabase
        .from('pending_password_changes')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      setMustChangePassword(!!pendingData);
    } catch (err) {
      console.error('Error in checkUserStatus:', err);
      setIsAdmin(false);
    } finally {
      setIsAdminLoading(false);
    }
  };

  const clearPasswordChangeRequirement = () => {
    setMustChangePassword(false);
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);

        // Defer user status check to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            checkUserStatus(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setIsAdminLoading(false);
          setIsDeactivated(false);
          setMustChangePassword(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Check if this is a session that should not persist
      const shouldPersist = sessionStorage.getItem(SESSION_PERSIST_KEY);
      
      if (session && shouldPersist === null) {
        // Session exists but no persist flag in sessionStorage
        // This means browser was closed and reopened without "remember me"
        // Check localStorage for the remember preference
        const remembered = localStorage.getItem(SESSION_PERSIST_KEY);
        if (remembered === 'false') {
          // User chose not to be remembered, sign them out
          supabase.auth.signOut();
          localStorage.removeItem(SESSION_PERSIST_KEY);
          setIsLoading(false);
          return;
        }
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      if (session?.user) {
        checkUserStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string, rememberMe: boolean = true) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (!error && data.user) {
      // Store the remember preference
      localStorage.setItem(SESSION_PERSIST_KEY, rememberMe ? 'true' : 'false');
      sessionStorage.setItem(SESSION_PERSIST_KEY, 'active');
      
      // Update last_sign_in_at in profiles table
      await supabase
        .from('profiles')
        .update({ last_sign_in_at: new Date().toISOString() })
        .eq('id', data.user.id);
    }
    
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, displayName?: string, rememberMe: boolean = true) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          display_name: displayName,
        },
      },
    });
    
    if (!error) {
      // Store the remember preference
      localStorage.setItem(SESSION_PERSIST_KEY, rememberMe ? 'true' : 'false');
      sessionStorage.setItem(SESSION_PERSIST_KEY, 'active');
    }
    
    return { error: error as Error | null };
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/auth`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    localStorage.removeItem(SESSION_PERSIST_KEY);
    sessionStorage.removeItem(SESSION_PERSIST_KEY);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
      isAdmin, 
      isAdminLoading, 
      isDeactivated,
      mustChangePassword,
      clearPasswordChangeRequirement,
      signIn, 
      signUp, 
      signOut, 
      resetPassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
