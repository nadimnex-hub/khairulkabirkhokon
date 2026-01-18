-- Create table for site content (editable text sections)
CREATE TABLE public.site_content (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for news items
CREATE TABLE public.news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for gallery images
CREATE TABLE public.gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for complaints
CREATE TABLE public.complaints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  attachment_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);

-- Storage policies for uploads bucket
CREATE POLICY "Public can view uploads" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'uploads');
CREATE POLICY "Authenticated users can delete" ON storage.objects FOR DELETE USING (bucket_id = 'uploads');

-- Enable RLS on all tables
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Public read policies for content
CREATE POLICY "Anyone can read site content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Anyone can read news" ON public.news FOR SELECT USING (true);
CREATE POLICY "Anyone can read gallery" ON public.gallery FOR SELECT USING (true);

-- Public insert for complaints (anyone can submit)
CREATE POLICY "Anyone can submit complaints" ON public.complaints FOR INSERT WITH CHECK (true);

-- Authenticated users (admin) can modify everything
CREATE POLICY "Authenticated can update site content" ON public.site_content FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can insert site content" ON public.site_content FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can insert news" ON public.news FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can update news" ON public.news FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can delete news" ON public.news FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can insert gallery" ON public.gallery FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can update gallery" ON public.gallery FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can delete gallery" ON public.gallery FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can read complaints" ON public.complaints FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can delete complaints" ON public.complaints FOR DELETE USING (auth.uid() IS NOT NULL);

-- Insert default content
INSERT INTO public.site_content (id, title, content) VALUES 
('hero', 'গণতন্ত্র মুক্তির প্রহরী', 'খায়রুল কবির খোকন'),
('biography', 'জীবনী', 'খায়রুল কবির খোকন একজন বিশিষ্ট রাজনীতিবিদ এবং জনসেবক। তিনি ঢাকা বিশ্ববিদ্যালয় কেন্দ্রীয় ছাত্র সংসদ (ডাকসু) এর সাবেক জিএস হিসেবে ছাত্র রাজনীতিতে তাঁর যাত্রা শুরু করেন। দীর্ঘ রাজনৈতিক জীবনে তিনি গণতন্ত্র ও জনগণের অধিকার রক্ষায় অগ্রণী ভূমিকা পালন করেছেন। নরসিংদী জেলার মানুষের আস্থাভাজন নেতা হিসেবে তিনি জাতীয় সংসদে নির্বাচিত হয়ে এলাকার উন্নয়নে নিরলস কাজ করে যাচ্ছেন।'),
('vision', 'ভবিষ্যৎ পরিকল্পনা', 'নরসিংদী ও বাংলাদেশের জন্য আমার স্বপ্ন হলো একটি সমৃদ্ধ, ন্যায়ভিত্তিক ও আধুনিক সমাজ গড়ে তোলা। শিক্ষা, স্বাস্থ্য, কর্মসংস্থান ও অবকাঠামো উন্নয়নে বিশেষ গুরুত্ব দেওয়া হবে। যুবসমাজের ক্ষমতায়ন, নারীর অগ্রগতি এবং কৃষকদের উন্নয়নে কাজ করে যাবো। গণতন্ত্র ও সুশাসন প্রতিষ্ঠার মাধ্যমে একটি উন্নত বাংলাদেশ গড়তে প্রতিশ্রুতিবদ্ধ।');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for site_content
CREATE TRIGGER update_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();