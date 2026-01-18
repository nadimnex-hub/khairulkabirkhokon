import { Target, Lightbulb, Heart, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const VisionSection = () => {
  const { data: visionContent } = useQuery({
    queryKey: ["site-content", "vision"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("id", "vision")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const visionPoints = [
    { 
      icon: Lightbulb, 
      title: "শিক্ষা ও দক্ষতা", 
      desc: "যুবসমাজের জন্য আধুনিক শিক্ষা ও কারিগরি প্রশিক্ষণ" 
    },
    { 
      icon: Heart, 
      title: "স্বাস্থ্যসেবা", 
      desc: "সবার জন্য মানসম্মত ও সাশ্রয়ী স্বাস্থ্যসেবা নিশ্চিতকরণ" 
    },
    { 
      icon: TrendingUp, 
      title: "অর্থনৈতিক উন্নয়ন", 
      desc: "কর্মসংস্থান সৃষ্টি ও ক্ষুদ্র উদ্যোক্তাদের সহায়তা" 
    },
    { 
      icon: Target, 
      title: "অবকাঠামো", 
      desc: "আধুনিক যোগাযোগ ব্যবস্থা ও ডিজিটাল সুবিধা" 
    },
  ];

  return (
    <section id="vision" className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-accent/10 border border-accent/20">
            <Target className="w-4 h-4 text-accent" />
            <span className="font-bengali text-sm text-accent font-medium">আমাদের লক্ষ্য</span>
          </div>

          <h2 className="section-heading font-bengali">
            {visionContent?.title || "ভবিষ্যৎ পরিকল্পনা"}
          </h2>

          <p className="section-subheading font-bengali mx-auto">
            {visionContent?.content || "নরসিংদী ও বাংলাদেশের জন্য আমার স্বপ্ন হলো একটি সমৃদ্ধ সমাজ গড়ে তোলা।"}
          </p>
        </div>

        {/* Vision Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visionPoints.map((point, index) => (
            <div 
              key={index}
              className="group card-elevated text-center hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                <point.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-bengali font-semibold text-xl mb-3">{point.title}</h3>
              <p className="font-bengali text-muted-foreground group-hover:text-primary-foreground/80 transition-colors">
                {point.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="mt-16 max-w-3xl mx-auto">
          <blockquote className="relative">
            <div className="absolute -top-4 -left-4 text-6xl text-primary/20 font-serif">"</div>
            <p className="font-bengali text-xl md:text-2xl text-foreground leading-relaxed text-center italic">
              গণতন্ত্র ও সুশাসন প্রতিষ্ঠার মাধ্যমে একটি উন্নত বাংলাদেশ গড়তে প্রতিশ্রুতিবদ্ধ
            </p>
            <footer className="mt-6 text-center">
              <cite className="font-bengali text-muted-foreground not-italic">— খায়রুল কবির খোকন</cite>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
