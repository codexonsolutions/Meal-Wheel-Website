"use client";
/* Featured items grid */
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/cart-context";

type FeaturedItem = {
  _id: string;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
  isFeatured: boolean;
  restaurantName?: string;
};

export function FeaturedItems() {
  const { add } = useCart();
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeaturedItems() {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/featured`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch featured items');
        }
        
        const data = await response.json();
        setFeaturedItems(data.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load featured items');
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedItems();
  }, []);

  return (
    <section id="featured-items" className="relative py-12 md:py-20 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, color-mix(in oklch, var(--app-bg) 100%, transparent) 0%, color-mix(in oklch, var(--app-bg) 95%, transparent) 100%)" }} />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="container relative z-10 max-w-screen-xl px-4">
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-balance px-2 md:px-0">
              Featured <span style={{ color: "var(--text-secondary)" }}>Items</span>
            </h2>
            <Link href="/restaurants" className="hidden sm:inline-flex items-center gap-2 text-lg md:text-xl transition-opacity hover:opacity-80 px-2 md:px-0" style={{ color: "var(--text-secondary)" }}>
              Explore all Restaurants
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-2 md:mt-3 text-sm md:text-lg max-w-2xl text-pretty px-2 md:px-0" style={{ color: "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))" }}>
            Handpicked menu favorites from different restaurants—curated for taste, quality, and popularity.
          </p>
          <div className="sm:hidden mt-4 px-2">
            <Link href="/restaurants" className="inline-flex items-center gap-2 text-base transition-opacity hover:opacity-80" style={{ color: "var(--text-secondary)" }}>
              Explore all Restaurants
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg" style={{ color: "var(--text-secondary)" }}>Loading featured items...</div>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg text-red-500">Error: {error}</div>
          </div>
        )}

        {!loading && !error && featuredItems.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg" style={{ color: "var(--text-secondary)" }}>No items found</div>
          </div>
        )}

        {!loading && !error && featuredItems.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {featuredItems.slice(0, 8).map((item) => (
              <div
                key={item._id}
                className="group rounded-lg md:rounded-[12%] overflow-hidden border shadow-md hover:shadow-xl transition-shadow"
                style={{ borderColor: "var(--text-secondary)" }}
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.imageUrl || "/placeholder.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-3 md:px-7 md:py-4">
                  <div className="flex flex-col space-y-2">
                    <div>
                      <h3 className="font-bold text-sm md:text-base leading-tight">{item.name}</h3>
                      {item.restaurantName && (
                        <p className="text-xs md:text-sm mt-0.5" style={{ color: "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))" }}>
                          {item.restaurantName}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs md:text-sm font-bold" style={{ color: "var(--text-secondary)" }}>
                        Rs. {item.price.toFixed(2)}
                      </span>
                      <button
                        type="button"
                        className="px-2 py-1 md:px-3 md:py-1.5 rounded text-xs md:text-sm font-medium transition-opacity hover:opacity-90 cursor-pointer"
                        style={{ backgroundColor: "var(--text-secondary)", color: "var(--text-primary)" }}
                        aria-label={`Add ${item.name} to cart`}
                        onClick={() => {
                          add({ 
                            id: item._id, 
                            name: item.name, 
                            price: item.price, 
                            image: item.imageUrl || "/placeholder.jpg" 
                          });
                        }}
                      >
                        Add
                      </button>
                    </div>
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
