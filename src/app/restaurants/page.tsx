"use client";
import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import { ArrowRight, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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
  const [query, setQuery] = useState("");

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
            <p className="text-lg md:text-xl text-foreground/70 mb-8">
              Discover amazing flavors from partner restaurants.
            </p>
          </div>
        </div>
      </section>
      <section className="py-4 md:py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 m-[25px]">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or category"
              aria-label="Search menu items"
              className="h-12 text-base"
            />
          </div>
        </div>
      </section>
      <section className="py-10">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {restaurants
                .filter((r) => {
                  const q = query.trim().toLowerCase();
                  if (!q) return true;
                  return (
                    r.name.toLowerCase().includes(q) ||
                    r.categories.some((c) => c.toLowerCase().includes(q))
                  );
                })
                .map((r) => {
                  const slug = slugify(r.name);
                  return (
                    <Link
                      key={r._id}
                      href={`/restaurants/${slug}`}
                      className="block"
                    >
                      <Card className="p-0 overflow-hidden hover:border-primary transition-border duration-100">
                        <div className="relative aspect-[4/3]">
                          <SafeImage
                            src={r.imageUrl || "/placeholder.jpg"}
                            alt={r.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="py-3 px-4">
                          <div className="text-sm font-semibold truncate mb-2">
                            {r.name}
                          </div>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {r.categories.slice(0, 2).map((c) => (
                              <Badge key={c} variant="secondary">
                                {c}
                              </Badge>
                            ))}
                            {r.categories.length > 2 && (
                              <Badge variant="outline">
                                +{r.categories.length - 2}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{r.categories.length} categories</span>
                            <span className="inline-flex items-center gap-1 text-primary">
                              View Menu <ArrowRight className="h-3 w-3" />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              {restaurants.filter((r) => {
                const q = query.trim().toLowerCase();
                if (!q) return false;
                return !(
                  r.name.toLowerCase().includes(q) ||
                  r.categories.some((c) => c.toLowerCase().includes(q))
                );
              }).length === restaurants.length && (
                <div className="col-span-full text-center text-muted-foreground">
                  No restaurants match your search
                </div>
              )}
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
