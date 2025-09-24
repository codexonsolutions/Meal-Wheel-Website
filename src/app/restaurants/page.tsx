"use client";
/* Restaurants listing page: shows restaurant cards with only image and name */
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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

  return (
    <section className="relative py-20 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklch, var(--app-bg) 100%, transparent) 0%, color-mix(in oklch, var(--app-bg) 95%, transparent) 100%)",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="container relative z-10 max-w-screen-xl px-4">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-bold">Restaurants</h1>
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

        {!loading && !error && restaurants.length > 0 && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {restaurants.map((r) => {
              const slug = r.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
              return (
                <Link key={r._id} href={`/restaurants/${slug}`} className="group rounded-[12%] overflow-hidden border shadow-md hover:shadow-xl cursor-pointer transition-shadow" style={{ borderColor: "var(--text-secondary)" }}>
                  <div className="relative aspect-[4/3]">
                    <Image src={r.imageUrl || "/placeholder.jpg"} alt={r.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{r.name}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
