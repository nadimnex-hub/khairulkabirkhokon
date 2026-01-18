-- Add status column to complaints table with default 'pending'
ALTER TABLE public.complaints ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';

-- Create index for faster filtering by status
CREATE INDEX idx_complaints_status ON public.complaints(status);

-- Update site_content with specific Bengali text requested by user
UPDATE public.site_content 
SET title = 'গণতন্ত্র মুক্তির প্রহরী: খায়রুল কবির খোকন',
    content = 'যুগ্ম মহাসচিব, বাংলাদেশ জাতীয়তাবাদী দল (বিএনপি) ও সাবেক সংসদ সদস্য।'
WHERE id = 'hero';

UPDATE public.site_content 
SET content = 'ডাকসুর সাবেক জিএস এবং নব্বইয়ের ছাত্র আন্দোলনের অগ্রনায়ক খায়রুল কবির খোকন দেশ ও মানুষের অধিকার রক্ষায় সদা নিবেদিত। দীর্ঘ রাজনৈতিক জীবনে তিনি গণতন্ত্র ও জনগণের অধিকার রক্ষায় অগ্রণী ভূমিকা পালন করেছেন। নরসিংদী জেলার মানুষের আস্থাভাজন নেতা হিসেবে তিনি জাতীয় সংসদে নির্বাচিত হয়ে এলাকার উন্নয়নে নিরলস কাজ করে যাচ্ছেন।'
WHERE id = 'biography';