-- Grant admin role to user
INSERT INTO public.user_roles (user_id, role)
VALUES ('476b61d2-81f4-4e2e-b7ea-f69676d973fc', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;