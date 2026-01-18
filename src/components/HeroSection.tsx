import { ChevronDown, Play } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import heroBackground from "@/assets/hero-background.jpg";

const HeroSection = () => {
  const { data: heroContent } = useQuery({
    queryKey: ["site-content", "hero"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("id", "hero")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70" />
      
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-accent/20 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-primary-foreground/10 rounded-full blur-2xl animate-float animation-delay-200" />
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-accent/30 rounded-full blur-lg animate-float animation-delay-400" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-16">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 animate-fade-up">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse-soft" />
            <span className="font-bengali text-sm text-white/90">যুগ্ম মহাসচিব, বিএনপি</span>
          </div>

          {/* Title */}
          <h1 className="font-bengali text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-up animation-delay-100">
            {heroContent?.title || "গণতন্ত্র মুক্তির প্রহরী: খায়রুল কবির খোকন"}
          </h1>

          {/* Subtitle */}
          <p className="font-bengali text-xl sm:text-2xl md:text-3xl text-white/90 mb-8 animate-fade-up animation-delay-200">
            {heroContent?.content || "যুগ্ম মহাসচিব, বাংলাদেশ জাতীয়তাবাদী দল (বিএনপি) ও সাবেক সংসদ সদস্য।"}
          </p>

          {/* Description */}
          <p className="font-bengali text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12 animate-fade-up animation-delay-300">
            ডাকসু সাবেক জিএস থেকে জাতীয় নেতৃত্ব — জনগণের সেবায় নিবেদিত এক জীবন
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up animation-delay-400">
            <a href="#biography" className="btn-hero">
              <Play className="w-5 h-5" />
              <span className="font-bengali">আমার সম্পর্কে জানুন</span>
            </a>
            <a href="#vision" className="btn-outline-hero">
              <span className="font-bengali">ভিশন দেখুন</span>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <a href="#biography" className="flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors">
          <span className="font-bengali text-sm">স্ক্রল করুন</span>
          <ChevronDown className="w-6 h-6" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
