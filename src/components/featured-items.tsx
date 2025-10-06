"use client";
import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import { ArrowRight, Plus } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface FeaturedItemApi {
  _id: string;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
  restaurant?: string;
  restaurantName?: string;
}

export function FeaturedItems() {
  const { add } = useCart();
  const [items, setItems] = useState<FeaturedItemApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const base = process.env.NEXT_PUBLIC_API_URL;
        if (!base) throw new Error("Missing NEXT_PUBLIC_API_URL");
        const res = await fetch(`${base}/items/featured`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch featured items");
        const data = await res.json();
        if (active) setItems(Array.isArray(data.items) ? data.items : []);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to load items";
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
    <section
      id="featured-items"
      className="relative py-12 md:py-20 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="container relative z-10 max-w-screen-xl px-4">
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-balance px-2 md:px-0">
              Featured <span className="text-secondary">Items</span>
            </h2>
            <Link
              href="/restaurants"
              className="hidden sm:inline-flex items-center gap-2 text-lg md:text-xl transition-opacity hover:opacity-80 px-2 md:px-0"
              style={{ color: "var(--text-secondary)" }}
            >
              Explore all Restaurants
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p
            className="mt-2 md:mt-3 text-sm md:text-lg max-w-2xl text-pretty px-2 md:px-0"
            style={{
              color:
                "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))",
            }}
          >
            Handpicked menu favorites from different restaurants—curated for
            taste, quality, and popularity.
          </p>
          <div className="sm:hidden mt-4 px-2">
            <Link
              href="/restaurants"
              className="inline-flex items-center gap-2 text-base transition-opacity hover:opacity-80"
              style={{ color: "var(--text-secondary)" }}
            >
              Explore all Restaurants
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {!loading && !error && items.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg text-secondary">
              No featured items found
            </div>
          </div>
        )}
        {loading && (
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6"
            aria-busy="true"
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-100 bg-white p-4 animate-pulse h-48"
              />
            ))}
          </div>
        )}
        {error && (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg text-red-500">{error}</div>
          </div>
        )}
        {!loading && !error && items.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {items.slice(0, 8).map((item) => (
              <div
                key={item._id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <SafeImage
                    src={
                      item.imageUrl ||
                      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center"
                    }
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="mb-3">
                    <h3 className="font-bold text-sm md:text-base leading-tight mb-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {item.category}
                      {item.restaurantName ? ` · ${item.restaurantName}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-secondary">
                      Rs. {item.price.toFixed(2)}
                    </span>
                    <Button
                      size="sm"
                      variant="default"
                      className="bg-secondary hover:bg-secondary/90 text-white"
                      onClick={() => {
                        add({
                          id: item._id,
                          name: item.name,
                          price: item.price,
                          image:
                            item.imageUrl ||
                            "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center",
                          restaurantId:
                            typeof item.restaurant === "string"
                              ? item.restaurant
                              : undefined,
                        });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
