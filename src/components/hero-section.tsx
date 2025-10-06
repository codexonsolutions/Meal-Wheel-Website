"use client";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const scrollToFeatured = useCallback(() => {
    const el = document.getElementById("featured-items");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const router = useRouter();

  return (
    <section className="py-4 px-3 sm:px-4 md:px-6">
      <div className="w-full max-w-none">
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-bg-secondary rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 mx-2 sm:mx-3 md:mx-4 min-h-0 md:min-h-[80vh]">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center h-full">
            {/* Left Side - Text Content */}
            <div className="space-y-6 md:space-y-8">
              <div className="space-y-4 md:space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-center sm:text-left">
                  Delicious <span className="text-primary">food</span>,{" "}
                  <span className="text-primary">delivered</span> fast
                </h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/70 max-w-2xl leading-relaxed text-center sm:text-left">
                  {" "}
                  Order from your favorite restaurants and get fresh, hot meals
                  delivered right to your doorstep in minutes.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-row items-center justify-center sm:justify-start gap-3 sm:gap-4 pt-2">
                <Button
                  onClick={scrollToFeatured}
                  size="lg"
                  variant="outline"
                  className="w-[150px]"
                >
                  Order Now
                </Button>
                <Button
                  onClick={() => {
                    router.push("/menu");
                  }}
                  variant="secondary"
                  size="lg"
                  className="w-[150px]"
                >
                  View Menu
                </Button>
              </div>

              <div className="flex flex-row items-center gap-4 sm:gap-6 pt-4 md:pt-6 justify-center sm:justify-start">
                {" "}
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  <span className="text-sm sm:text-base md:text-lg text-foreground/70 font-medium">
                    Delivery in 40-50 min
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  <span className="text-sm sm:text-base md:text-lg text-foreground/70 font-medium">
                    Available 6PM - 2AM
                  </span>
                </div>
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0 hidden md:block">
              <div className="flex flex-col items-center space-y-4 md:space-y-6">
                {/* Top Image - Centered */}
                <div className="relative group">
                  <img
                    src="/f1.png"
                    alt="Food Item 1"
                    className="w-36 sm:w-44 md:w-52 lg:w-64 h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Bottom Two Images - Side by Side */}
                <div className="flex items-center justify-center gap-4 md:gap-6 lg:gap-8">
                  <div className="relative group">
                    <img
                      src="/f2.png"
                      alt="Food Item 2"
                      className="w-36 sm:w-44 md:w-52 lg:w-60 h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="relative group">
                    <img
                      src="/f3.png"
                      alt="Food Item 3"
                      className="w-36 sm:w-44 md:w-52 lg:w-60 h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-2 md:-top-4 -right-2 md:-right-4 bg-primary text-background px-3 md:px-4 py-2 rounded-full">
                <span className="font-bold text-xs sm:text-sm md:text-base">
                  30+ Restaurants
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
