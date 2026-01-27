import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import FeaturesSection from "@/components/FeaturesSection";
import PricingComparison from "@/components/PricingComparison";
import ArchitectureSection from "@/components/ArchitectureSection";
import CTASection from "@/components/CTASection";
import TransportBookingSection from "@/components/TransportBookingSection";
import SocialMeetupsSection from "@/components/SocialMeetupsSection";
import ShortReelsSection from "@/components/ShortReelsSection";
import MemoryGallerySection from "@/components/MemoryGallerySection";
import Footer from "@/components/Footer";
import BottomNav from "@/components/instagram/BottomNav";

const Index = () => {
  return (
    <main className="min-h-screen pb-16">
      <Header />
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <PricingComparison />
      <ArchitectureSection />
      <CTASection />
      <TransportBookingSection />
      <SocialMeetupsSection />
      <ShortReelsSection />
      <MemoryGallerySection />
      <Footer />
      <BottomNav />
    </main>
  );
};

export default Index;
