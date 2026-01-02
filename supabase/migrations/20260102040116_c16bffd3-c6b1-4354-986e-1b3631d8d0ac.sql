-- Fix RLS policies on user_roles to be PERMISSIVE instead of RESTRICTIVE
-- Drop the old restrictive policies
DROP POLICY IF EXISTS "Users can read own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Recreate as permissive policies (default)
CREATE POLICY "Users can read own role"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (has_role(auth.uid(), 'admin'));