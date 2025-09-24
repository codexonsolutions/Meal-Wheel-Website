/* Hero section */
"use client";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { AnimatedFood, SparkleRing } from "@/components/animated/animated-food";
import { motion } from "framer-motion";
import { useCallback } from "react";

export function HeroSection() {
  const scrollToFeatured = useCallback(() => {
    const el = document.getElementById('featured-items');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);
  return (
    <section className="relative py-12 md:min-h-[80vh] md:flex md:items-center md:justify-center overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklch, var(--app-bg) 100%, transparent) 0%, color-mix(in oklch, var(--app-bg) 95%, transparent) 100%)",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="container relative z-10 max-w-screen-xl px-4">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-4 md:space-y-8">
            <div className="space-y-3 md:space-y-6">
              <h1 className="text-2xl sm:text-3xl md:text-6xl lg:text-7xl font-bold leading-tight text-balance px-2 md:px-0">
                Delicious food,{" "}
                <span style={{ color: "var(--text-secondary)" }}>
                  delivered fast
                </span>
              </h1>
              <p
                className="text-sm sm:text-base md:text-xl max-w-lg text-pretty px-2 md:px-0"
                style={{
                  color:
                    "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))",
                }}
              >
                Order from your favorite restaurants and get fresh, hot meals
                delivered right to your door step.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 px-2 md:px-0">
              <Button
                size="lg"
                className="text-sm md:text-lg px-6 md:px-8 py-3 md:py-6 hover:opacity-90 w-full sm:w-auto"
                style={{ backgroundColor: "var(--text-secondary)" }}
                onClick={scrollToFeatured}
              >
                Order Now
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-2 md:pt-4 px-2 md:px-0">
              <div className="flex items-center gap-2">
                <MapPin
                  className="h-4 w-4 md:h-5 md:w-5"
                  style={{ color: "var(--text-secondary)" }}
                />
                <span
                  className="text-xs md:text-sm"
                  style={{
                    color:
                      "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))",
                  }}
                >
                  Delivery in 40-60 min
                </span>
              </div>
            </div>
          </div>
          <div className="relative mt-8 lg:mt-0 hidden lg:block">
            <SparkleRing />
            <motion.div
              className="grid grid-cols-2 gap-4"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
            >
              <div className="space-y-4">
                <AnimatedFood shape="circle" gradient="bg-gradient-to-br from-orange-500/30 to-orange-500/5" delay={0}>
                  🍔
                </AnimatedFood>
                <AnimatedFood shape="blob" gradient="bg-gradient-to-br from-zinc-800/60 to-zinc-800/20" size="landscape" delay={0.1}>
                  🍣
                </AnimatedFood>
              </div>
              <div className="space-y-4 pt-8">
                <AnimatedFood shape="diamond" gradient="bg-gradient-to-br from-emerald-500/25 to-emerald-500/5" size="landscape" delay={0.2}>
                  🍕
                </AnimatedFood>
                <AnimatedFood shape="pill" gradient="bg-gradient-to-br from-orange-500/15 to-orange-500/5" delay={0.3}>
                  🥗
                </AnimatedFood>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
