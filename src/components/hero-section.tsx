/* Hero section */
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklch, var(--app-bg) 100%, transparent) 0%, color-mix(in oklch, var(--app-bg) 95%, transparent) 100%)",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="container relative z-10 max-w-screen-xl px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-balance">
                Delicious food,{" "}
                <span style={{ color: "var(--text-secondary)" }}>
                  delivered fast
                </span>
              </h1>
              <p
                className="text-lg md:text-xl max-w-lg text-pretty"
                style={{
                  color:
                    "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))",
                }}
              >
                Order from your favorite restaurants and get fresh, hot meals
                delivered right to your door in minutes.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="text-lg px-8 py-6 hover:opacity-90"
                style={{ backgroundColor: "var(--text-secondary)" }}
              >
                Order Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 bg-transparent"
              >
                Browse Restaurants
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <MapPin
                  className="h-5 w-5"
                  style={{ color: "var(--text-secondary)" }}
                />
                <span
                  className="text-sm"
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
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 p-6 flex items-center justify-center">
                  <img
                    src="/placeholder.svg"
                    alt="Burger"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-zinc-800/50 to-zinc-800/20 p-6 flex items-center justify-center">
                  <img
                    src="/placeholder.svg"
                    alt="Sushi"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 p-6 flex items-center justify-center">
                  <img
                    src="/placeholder.svg"
                    alt="Pizza"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-500/5 p-6 flex items-center justify-center">
                  <img
                    src="/placeholder.svg"
                    alt="Salad"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
