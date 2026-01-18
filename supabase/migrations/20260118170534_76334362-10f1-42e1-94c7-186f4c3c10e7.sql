-- Fix RLS: Allow public read access to complaints for admin view (admin auth uses session storage not Supabase auth)
DROP POLICY IF EXISTS "Authenticated can read complaints" ON public.complaints;

-- Allow anyone to read complaints (admin will access without Supabase auth)
CREATE POLICY "Anyone can read complaints" 
ON public.complaints 
FOR SELECT 
USING (true);

-- Also add UPDATE policy for status changes
DROP POLICY IF EXISTS "Anyone can update complaints" ON public.complaints;

CREATE POLICY "Anyone can update complaints" 
ON public.complaints 
FOR UPDATE 
USING (true);