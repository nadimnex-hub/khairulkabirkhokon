import { Calendar, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { bn } from "date-fns/locale";

const NewsSection = () => {
  const { data: news, isLoading } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("date", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  const placeholderNews = [
    { id: 1, title: "নরসিংদীতে উন্নয়ন প্রকল্পের উদ্বোধন", description: "স্থানীয় জনগণের জন্য নতুন সড়ক নির্মাণ প্রকল্প শুরু হয়েছে।", date: new Date() },
    { id: 2, title: "যুব সম্মেলন ২০২৬", description: "তরুণদের জন্য কর্মসংস্থান ও দক্ষতা উন্নয়ন বিষয়ক সম্মেলন।", date: new Date() },
    { id: 3, title: "শিক্ষা প্রতিষ্ঠানে বৃত্তি প্রদান", description: "মেধাবী শিক্ষার্থীদের জন্য বিশেষ বৃত্তি কার্যক্রম।", date: new Date() },
  ];

  const displayNews = news && news.length > 0 ? news : placeholderNews;

  return (
    <section id="news" className="py-12 sm:py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 rounded-full bg-primary/10 border border-primary/20">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            <span className="font-bengali text-xs sm:text-sm text-primary font-medium">সর্বশেষ খবর</span>
          </div>

          <h2 className="section-heading font-bengali">সংবাদ ও কার্যক্রম</h2>
          <p className="section-subheading font-bengali mx-auto px-2">
            সাম্প্রতিক কার্যক্রম ও উন্নয়ন প্রকল্পসমূহ
          </p>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-elevated animate-pulse">
                <div className="aspect-video bg-muted rounded-lg sm:rounded-xl mb-3 sm:mb-4" />
                <div className="h-5 sm:h-6 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 sm:h-4 bg-muted rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {displayNews.map((item) => (
              <article key={item.id} className="group card-elevated overflow-hidden">
                {/* Image */}
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg sm:rounded-xl mb-3 sm:mb-4 overflow-hidden">
                  {item.image_url ? (
                    <img 
                      src={item.image_url} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-bengali text-3xl sm:text-4xl text-primary/30">📰</span>
                    </div>
                  )}
                </div>

                {/* Date */}
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="font-bengali">
                    {format(new Date(item.date), "d MMMM, yyyy", { locale: bn })}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bengali font-semibold text-base sm:text-lg text-foreground mb-1.5 sm:mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="font-bengali text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-3 sm:mb-4">
                  {item.description}
                </p>

                {/* Read more */}
                <button className="inline-flex items-center gap-1.5 sm:gap-2 text-primary font-medium text-sm group-hover:gap-2 sm:group-hover:gap-3 transition-all touch-target">
                  <span className="font-bengali">বিস্তারিত</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
