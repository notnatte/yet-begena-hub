
-- Drop existing storage policies to avoid conflicts
DROP POLICY IF EXISTS "Users can upload their own CV" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own CV" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own CV" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own CV" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view course materials" ON storage.objects;
DROP POLICY IF EXISTS "Instructors can upload course materials" ON storage.objects;
DROP POLICY IF EXISTS "Instructors can update their own course materials" ON storage.objects;
DROP POLICY IF EXISTS "Instructors can delete their own course materials" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload payment receipts" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own payment receipts" ON storage.objects;

-- Create missing storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cvs', 'cvs', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('course-materials', 'course-materials', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for CVs
CREATE POLICY "Users can upload their own CV" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'cvs' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own CV" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'cvs' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own CV" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'cvs' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own CV" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'cvs' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create storage policies for course materials
CREATE POLICY "Anyone can view course materials" ON storage.objects
  FOR SELECT USING (bucket_id = 'course-materials');

CREATE POLICY "Instructors can upload course materials" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'course-materials' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Instructors can update their own course materials" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'course-materials' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Instructors can delete their own course materials" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'course-materials' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create storage policies for payment receipts
CREATE POLICY "Users can upload payment receipts" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'payment-receipts' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own payment receipts" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'payment-receipts' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Fix the profiles policies to prevent infinite recursion
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create a security definer function to get current user ID
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS UUID AS $$
  SELECT auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Recreate profiles policies using the security definer function
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (public.get_current_user_id() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (public.get_current_user_id() = id);
