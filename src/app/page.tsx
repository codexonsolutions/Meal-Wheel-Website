/* Home page rendering Meal Wheel sections */
import { HeroSection } from "@/components/hero-section";
import { FeaturedItems } from "@/components/featured-items";
import { StatsSection } from "@/components/stats-section";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        <FeaturedItems />
      </main>
    </div>
  );
}
