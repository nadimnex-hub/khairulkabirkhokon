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

  const infoCards = [
    { title: "বর্তমান পদ", value: "বিএনপি যুগ্ম মহাসচিব" },
    { title: "নির্বাচনী এলাকা", value: "নরসিংদী-১" },
    { title: "শিক্ষা প্রতিষ্ঠান", value: "ঢাকা বিশ্ববিদ্যালয়" },
  ];

  const milestones = [
    { year: "১৯৯০", title: "ডাকসু জিএস নির্বাচিত", desc: "ঢাকা বিশ্ববিদ্যালয় কেন্দ্রীয় ছাত্র সংসদের জেনারেল সেক্রেটারি" },
    { year: "১৯৯০", title: "স্বৈরাচার বিরোধী আন্দোলন", desc: "গণতন্ত্র পুনরুদ্ধারে ঐতিহাসিক আন্দোলনে নেতৃত্ব প্রদান" },
    { year: "২০০৫", title: "সংসদ সদস্য নির্বাচিত", desc: "নরসিংদী-১ আসন থেকে জাতীয় সংসদ সদস্য নির্বাচিত" },
    { year: "বর্তমান", title: "বিএনপি যুগ্ম মহাসচিব", desc: "দলের জাতীয় পর্যায়ে গুরুত্বপূর্ণ দায়িত্ব পালন", isCurrent: true },
  ];

  return (
    <section id="biography" className="py-12 sm:py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left Side - Image + Info Cards */}
          <div className="space-y-4 sm:space-y-6">
            {/* Main image with green accent */}
            <div className="relative">
              <div className="absolute -left-2 sm:-left-3 top-0 bottom-0 w-1 sm:w-1.5 bg-primary rounded-full" />
              <div className="aspect-[4/5] sm:aspect-square max-w-sm sm:max-w-md mx-auto lg:mx-0 overflow-hidden rounded-lg shadow-lg">
                <img 
                  src={leaderPortrait} 
                  alt="খায়রুল কবির খোকন"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Info Cards */}
            <div className="max-w-sm sm:max-w-md mx-auto lg:mx-0 space-y-2 sm:space-y-3">
              {infoCards.map((card, index) => (
                <div 
                  key={index}
                  className="bg-muted/50 border-l-4 border-primary p-3 sm:p-4 rounded-r-lg"
                >
                  <h4 className="font-bengali font-semibold text-foreground text-xs sm:text-sm">{card.title}</h4>
                  <p className="font-bengali text-muted-foreground text-xs sm:text-sm">{card.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-6 sm:space-y-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-bengali text-foreground text-center lg:text-left">
              {biographyContent?.title || "জীবন ও সংগ্রাম"}
            </h2>

            <div className="space-y-3 sm:space-y-4 text-muted-foreground font-bengali leading-relaxed text-sm sm:text-base">
              <p>
                বাংলাদেশের রাজনৈতিক ইতিহাসে খায়রুল কবির খোকন একজন নিষ্ঠাবান ও সাহসী নেতার নাম। তাঁর রাজনৈতিক জীবন 
                শুরু হয় ছাত্রাবস্থায়, যেখানে তিনি ঢাকা ইউনিভার্সিটি সেন্ট্রাল স্টুডেন্টস ইউনিয়ন (DUCSU)-এর জেনারেল সেক্রেটারি 
                (GS) নির্বাচিত হয়েছিলেন।
              </p>
              <p>
                ১৯৯০-এর স্বৈরাচার বিরোধী আন্দোলনে তাঁর নেতৃত্ব এবং ত্যাগ ইতিহাসে স্বর্ণাক্ষরে লেখা থাকবে। পরবর্তীতে তিনি 
                নরসিংদী-১ আসন থেকে সংসদ সদস্য (MP) নির্বাচিত হন এবং এলাকার উন্নয়নে বিপুল পরিবর্তন আনেন।
              </p>
              <p className="text-primary font-medium">
                বিএনপির যুগ্ম মহাসচিব হিসেবে তিনি আজও গণতন্ত্র, ভোটের অধিকার এবং মানবাধিকার রক্ষার লড়াইয়ে অবিচল।
              </p>
            </div>

            {/* Timeline Section */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-bold font-bengali text-foreground border-b-2 border-primary pb-2 inline-block">
                রাজনৈতিক জীবনের মাইলফলক
              </h3>

              <div className="space-y-4 sm:space-y-5">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex gap-3 sm:gap-4 items-start">
                    <div className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold font-bengali whitespace-nowrap flex-shrink-0 ${
                      milestone.isCurrent 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-primary/10 text-primary border border-primary/30'
                    }`}>
                      {milestone.year}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bengali font-semibold text-foreground text-sm sm:text-base">{milestone.title}</h4>
                      <p className="font-bengali text-xs sm:text-sm text-muted-foreground">{milestone.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BiographySection;
