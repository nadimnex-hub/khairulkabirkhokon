import { Image, X } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Import real gallery images
import galleryRally from "@/assets/gallery-rally.jpg";
import galleryProtest from "@/assets/gallery-protest.jpg";
import galleryHistoric from "@/assets/gallery-historic.jpg";
import galleryFamily from "@/assets/gallery-family.jpg";
import gallerySacrifice from "@/assets/gallery-sacrifice.jpg";
import leaderPortrait from "@/assets/leader-portrait.jpg";

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: gallery, isLoading } = useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return data;
    },
  });

  const placeholderImages = [
    { id: "1", caption: "স্বদেশ প্রত্যাবর্তন অভিনন্দন", image_url: galleryRally },
    { id: "2", caption: "প্রতিবাদ মিছিল", image_url: galleryProtest },
    { id: "3", caption: "ঐতিহাসিক মুহূর্ত", image_url: galleryHistoric },
    { id: "4", caption: "পারিবারিক সাক্ষাৎ", image_url: galleryFamily },
    { id: "5", caption: "গণতন্ত্রের জন্য ত্যাগ", image_url: gallerySacrifice },
    { id: "6", caption: "কৃষকের পাশে", image_url: leaderPortrait },
  ];

  const displayGallery = gallery && gallery.length > 0 ? gallery : placeholderImages;

  return (
    <section id="gallery" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-accent/10 border border-accent/20">
            <Image className="w-4 h-4 text-accent" />
            <span className="font-bengali text-sm text-accent font-medium">ফটো গ্যালারি</span>
          </div>

          <h2 className="section-heading font-bengali">কার্যক্রমের চিত্র</h2>
          <p className="section-subheading font-bengali mx-auto">
            বিভিন্ন কর্মসূচি ও জনসম্পৃক্ততার কিছু মুহূর্ত
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayGallery.map((item, index) => (
              <button
                key={item.id}
                onClick={() => item.image_url && setSelectedImage(item.image_url)}
                className={`group relative aspect-square rounded-2xl overflow-hidden ${
                  index === 0 ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                <img 
                  src={item.image_url} 
                  alt={item.caption || "Gallery image"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="font-bengali text-white text-sm">{item.caption}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Gallery preview"
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default GallerySection;
