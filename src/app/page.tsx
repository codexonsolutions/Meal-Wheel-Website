/* Home page rendering Meal Wheel sections */
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { FeaturedItems } from "@/components/featured-items";
import { StatsSection } from "@/components/stats-section";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturedItems />
        <StatsSection />
      </main>
      <Footer />
    </div>
  );
}
