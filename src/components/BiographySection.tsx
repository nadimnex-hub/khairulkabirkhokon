import { Award, Users, Building, GraduationCap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import leaderPortrait from "@/assets/leader-portrait.jpg";

const BiographySection = () => {
  const { data: biographyContent } = useQuery({
    queryKey: ["site-content", "biography"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("id", "biography")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const milestones = [
    { icon: GraduationCap, title: "ডাকসু জিএস", desc: "ছাত্র নেতৃত্বের শুরু" },
    { icon: Users, title: "জনসেবক", desc: "সমাজ সেবায় নিবেদিত" },
    { icon: Building, title: "সংসদ সদস্য", desc: "জাতীয় সংসদে প্রতিনিধিত্ব" },
    { icon: Award, title: "গণতন্ত্রের প্রহরী", desc: "জনগণের অধিকার রক্ষা" },
  ];

  return (
    <section id="biography" className="py-20 md:py-32 bg-secondary/30 pattern-dots">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <div className="relative order-2 lg:order-1">
            <div className="relative">
              {/* Main image */}
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-[var(--shadow-lg)]">
                <img 
                  src={leaderPortrait} 
                  alt="খায়রুল কবির খোকন"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating card */}
              <div className="absolute -bottom-6 -right-6 md:-right-10 glass-card p-6 max-w-xs">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-bengali font-semibold text-foreground">২০+ বছর</p>
                    <p className="font-bengali text-sm text-muted-foreground">রাজনৈতিক অভিজ্ঞতা</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20">
              <span className="font-bengali text-sm text-primary font-medium">পরিচিতি</span>
            </div>

            <h2 className="section-heading font-bengali">
              {biographyContent?.title || "জীবনী"}
            </h2>

            <p className="font-bengali text-lg text-muted-foreground leading-relaxed mb-8">
              {biographyContent?.content || "ডাকসুর সাবেক জিএস এবং নব্বইয়ের ছাত্র আন্দোলনের অগ্রনায়ক খায়রুল কবির খোকন দেশ ও মানুষের অধিকার রক্ষায় সদা নিবেদিত।"}
            </p>

            {/* Milestones */}
            <div className="grid sm:grid-cols-2 gap-4">
              {milestones.map((milestone, index) => (
                <div 
                  key={index}
                  className="card-elevated flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <milestone.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bengali font-semibold text-foreground">{milestone.title}</h4>
                    <p className="font-bengali text-sm text-muted-foreground">{milestone.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BiographySection;
