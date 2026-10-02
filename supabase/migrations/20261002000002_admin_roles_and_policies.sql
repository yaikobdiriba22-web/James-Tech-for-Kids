-- ==============================================================================
-- James Tech for Kids - Admin RLS Policies & Roles
-- Allows Administrators full access to manage students, enrollments, and messages
-- ==============================================================================

-- 1. Helper Function: is_admin()
-- Returns true if current user is an admin in profiles OR matches the designated admin email
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ) OR (
    auth.jwt() ->> 'email' = 'jamesechsolutionandacademy@gmail.com'
  );
$$;

-- 2. Profiles Policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (is_admin() OR auth.uid() = id);

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (is_admin() OR auth.uid() = id)
  WITH CHECK (is_admin() OR auth.uid() = id);

-- 3. Enrollments Policies
DROP POLICY IF EXISTS "Admins can view all enrollments" ON public.enrollments;
CREATE POLICY "Admins can view all enrollments"
  ON public.enrollments FOR SELECT
  USING (is_admin() OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update all enrollments" ON public.enrollments;
CREATE POLICY "Admins can update all enrollments"
  ON public.enrollments FOR UPDATE
  USING (is_admin() OR auth.uid() = user_id)
  WITH CHECK (is_admin() OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can delete enrollments" ON public.enrollments;
CREATE POLICY "Admins can delete enrollments"
  ON public.enrollments FOR DELETE
  USING (is_admin());

-- 4. Programs Policies (Admins can insert/update/delete programs)
DROP POLICY IF EXISTS "Admins can insert programs" ON public.programs;
CREATE POLICY "Admins can insert programs"
  ON public.programs FOR INSERT
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can update programs" ON public.programs;
CREATE POLICY "Admins can update programs"
  ON public.programs FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can delete programs" ON public.programs;
CREATE POLICY "Admins can delete programs"
  ON public.programs FOR DELETE
  USING (is_admin());

-- 5. Contact Messages Policies (Admins can view and update contact inquiries)
DROP POLICY IF EXISTS "Admins can view all contact messages" ON public.contact_messages;
CREATE POLICY "Admins can view all contact messages"
  ON public.contact_messages FOR SELECT
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can update contact messages" ON public.contact_messages;
CREATE POLICY "Admins can update contact messages"
  ON public.contact_messages FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can delete contact messages" ON public.contact_messages;
CREATE POLICY "Admins can delete contact messages"
  ON public.contact_messages FOR DELETE
  USING (is_admin());
