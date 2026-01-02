-- Track users who must change password on next login
CREATE TABLE public.pending_password_changes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now() NOT NULL,
  created_by uuid NOT NULL
);

ALTER TABLE public.pending_password_changes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage pending changes"
  ON public.pending_password_changes FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view own pending status"
  ON public.pending_password_changes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pending status"
  ON public.pending_password_changes FOR DELETE
  USING (auth.uid() = user_id);

-- Track deactivated accounts
CREATE TABLE public.deactivated_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  deactivated_at timestamptz DEFAULT now() NOT NULL,
  deactivated_by uuid NOT NULL,
  reason text
);

ALTER TABLE public.deactivated_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage deactivated accounts"
  ON public.deactivated_accounts FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view own deactivation status"
  ON public.deactivated_accounts FOR SELECT
  USING (auth.uid() = user_id);

-- Admin audit log
CREATE TABLE public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  performed_by uuid NOT NULL,
  action text NOT NULL,
  target_type text NOT NULL,
  target_id text,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit log"
  ON public.admin_audit_log FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert audit log"
  ON public.admin_audit_log FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));