"use client";
import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface RestaurantApi {
  _id: string;
  name: string;
  imageUrl: string;
  categories: string[];
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<RestaurantApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const base = process.env.NEXT_PUBLIC_API_URL;
        if (!base) throw new Error("Missing NEXT_PUBLIC_API_URL");
        const res = await fetch(`${base}/restaurant`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch restaurants");
        const data = await res.json();
        if (active)
          setRestaurants(
            Array.isArray(data.restaurants) ? data.restaurants : []
          );
      } catch (e: unknown) {
        const msg =
          e instanceof Error ? e.message : "Failed to load restaurants";
        if (active) setError(msg);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Our <span className="text-secondary">Restaurants</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Discover amazing flavors from partner restaurants.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          {loading && (
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
              aria-busy="true"
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-100 bg-white p-6 h-72 animate-pulse"
                />
              ))}
            </div>
          )}
          {error && !loading && (
            <div className="text-center text-lg text-red-500 py-12">
              {error}
            </div>
          )}
          {!loading && !error && restaurants.length === 0 && (
            <div className="text-center text-lg text-muted-foreground py-12">
              No restaurants found
            </div>
          )}
          {!loading && !error && restaurants.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {restaurants.map((r) => {
                const slug = slugify(r.name);
                return (
                  <Link
                    key={r._id}
                    href={`/restaurants/${slug}`}
                    className="group block"
                  >
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                      <div className="relative h-48 md:h-56 overflow-hidden">
                        <SafeImage
                          src={r.imageUrl || "/placeholder.jpg"}
                          alt={r.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-secondary transition-colors mb-3">
                          {r.name}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {r.categories.slice(0, 3).map((c) => (
                            <span
                              key={c}
                              className="px-3 py-1 bg-secondary/10 text-secondary text-sm rounded-full font-medium"
                            >
                              {c}
                            </span>
                          ))}
                          {r.categories.length > 3 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                              +{r.categories.length - 3} more
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {r.categories.length} categories
                          </span>
                          <div className="flex items-center gap-2 text-secondary font-medium group-hover:gap-3 transition-all">
                            <span>View Menu</span>
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Can&apos;t decide?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Browse featured items to discover popular dishes.
          </p>
          <Button
            onClick={() => {
              router.push("#featured-items");
            }}
            variant="outline"
            size="lg"
          >
            View Featured Items
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
