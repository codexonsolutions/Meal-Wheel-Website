"use client";
/* Restaurants listing page: shows restaurant cards with only image and name */
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type Restaurant = {
  _id: string;
  name: string;
  imageUrl: string;
  categories: string[];
};

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurant`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }
        
        const data = await response.json();
        setRestaurants(data.restaurants || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load restaurants');
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurants();
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return restaurants;
    const q = query.trim().toLowerCase();
    return restaurants.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.categories.some(c => c.toLowerCase().includes(q))
    );
  }, [restaurants, query]);

  return (
    <section className="relative pt-8 pb-20 overflow-hidden min-h-screen">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklch, var(--app-bg) 100%, transparent) 0%, color-mix(in oklch, var(--app-bg) 95%, transparent) 100%)",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="container relative z-10 max-w-screen-xl px-4">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl md:text-4xl font-bold">Restaurants</h1>
          <div className="w-full sm:max-w-xs relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "color-mix(in oklch, var(--text-primary) 65%, var(--app-bg))" }} />
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search restaurants..."
              aria-label="Search restaurants"
              className="pl-9 shadow-sm text-sm"
              style={{ 
                color: "var(--text-primary)",
                backgroundColor: "white"
              }}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 rounded-md border border-zinc-700/60 hover:bg-zinc-800/50 transition"
                style={{ color: "var(--text-secondary)" }}
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg" style={{ color: "var(--text-secondary)" }}>Loading restaurants...</div>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg text-red-500">Error: {error}</div>
          </div>
        )}

        {!loading && !error && restaurants.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg" style={{ color: "var(--text-secondary)" }}>No restaurants found</div>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {filtered.map((r) => {
              const slug = r.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
              return (
                <Link key={r._id} href={`/restaurants/${slug}`} className="group rounded-lg md:rounded-[12%] overflow-hidden border shadow-md hover:shadow-xl cursor-pointer transition-shadow" style={{ borderColor: "var(--text-secondary)" }}>
                  <div className="relative aspect-[4/3]">
                    <Image src={r.imageUrl || "/placeholder.jpg"} alt={r.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <div className="p-3 md:px-7 md:py-4">
                    <h3 className="font-semibold text-sm md:text-base leading-tight">{r.name}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        {!loading && !error && filtered.length === 0 && restaurants.length > 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg" style={{ color: "var(--text-secondary)" }}>No restaurants match &quot;{query}&quot;</div>
          </div>
        )}
      </div>
    </section>
  );
}
