import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BiographySection from "@/components/BiographySection";
import VisionSection from "@/components/VisionSection";
import NewsSection from "@/components/NewsSection";
import GallerySection from "@/components/GallerySection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <BiographySection />
        <VisionSection />
        <NewsSection />
        <GallerySection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
