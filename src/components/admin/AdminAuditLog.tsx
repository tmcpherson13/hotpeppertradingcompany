import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  UserMinus, 
  ShieldCheck, 
  ShieldOff, 
  KeyRound,
  RefreshCw 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuditLogEntry {
  id: string;
  performed_by: string;
  action: string;
  target_type: string;
  target_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
  performer_name?: string;
}

const actionIcons: Record<string, React.ReactNode> = {
  admin_created: <UserPlus className="w-4 h-4 text-green-600" />,
  admin_deactivated: <UserMinus className="w-4 h-4 text-red-600" />,
  admin_reactivated: <RefreshCw className="w-4 h-4 text-blue-600" />,
  role_promoted: <ShieldCheck className="w-4 h-4 text-purple-600" />,
  role_demoted: <ShieldOff className="w-4 h-4 text-orange-600" />,
  password_reset_forced: <KeyRound className="w-4 h-4 text-yellow-600" />,
};

const actionLabels: Record<string, string> = {
  admin_created: 'Admin Created',
  admin_deactivated: 'Account Deactivated',
  admin_reactivated: 'Account Reactivated',
  role_promoted: 'Promoted to Admin',
  role_demoted: 'Demoted to User',
  password_reset_forced: 'Password Reset',
};

export function AdminAuditLog() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  const fetchLogs = async () => {
    setIsLoading(true);
    
    let query = supabase
      .from('admin_audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (filter) {
      query = query.eq('action', filter);
    }

    const { data: logData, error } = await query;

    if (error) {
      console.error('Error fetching audit logs:', error);
      setIsLoading(false);
      return;
    }

    // Fetch performer names
    const performerIds = [...new Set(logData?.map(log => log.performed_by) || [])];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, display_name')
      .in('id', performerIds);

    const profileMap = new Map(profiles?.map(p => [p.id, p.display_name]) || []);

    const enrichedLogs: AuditLogEntry[] = logData?.map(log => ({
      ...log,
      details: log.details as Record<string, unknown> | null,
      performer_name: profileMap.get(log.performed_by) || 'Unknown',
    })) || [];

    setLogs(enrichedLogs);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter(null)}
          className="font-heading text-xs uppercase tracking-wider"
        >
          All
        </Button>
        {Object.entries(actionLabels).map(([action, label]) => (
          <Button
            key={action}
            variant={filter === action ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(action)}
            className="font-heading text-xs uppercase tracking-wider"
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Log entries */}
      <div className="space-y-2">
        {logs.length === 0 ? (
          <div className="text-center py-8 text-ink/50 font-body">
            No audit log entries found
          </div>
        ) : (
          logs.map((log) => (
            <div 
              key={log.id} 
              className="bg-parchment/50 border border-ink/20 p-3 flex items-start gap-3"
            >
              <div className="mt-0.5">
                {actionIcons[log.action] || <div className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="font-heading text-xs uppercase">
                    {actionLabels[log.action] || log.action}
                  </Badge>
                  <span className="text-xs text-ink/50 font-body">
                    by {log.performer_name}
                  </span>
                </div>
                {log.details && Object.keys(log.details).length > 0 && (
                  <p className="text-sm text-ink/70 font-body mt-1">
                    {log.details.email && <span>Email: {String(log.details.email)}</span>}
                    {log.details.display_name && <span> • {String(log.details.display_name)}</span>}
                    {log.details.reason && <span> • Reason: {String(log.details.reason)}</span>}
                  </p>
                )}
                <p className="text-xs text-ink/40 font-body mt-1">
                  {new Date(log.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
