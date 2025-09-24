"use client";
/* Restaurant detail page with category filters */
import { notFound } from "next/navigation";
import { RestaurantMenu } from "@/components/restaurant-menu";
import { useEffect, useState } from "react";

type Restaurant = {
  _id: string;
  name: string;
  imageUrl: string;
  categories: string[];
};

type Item = {
  _id: string;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
};

export default function RestaurantDetailPage({ params }: { params: { slug: string } }) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const slug = params.slug;

  useEffect(() => {
    async function fetchRestaurantData() {
      try {
        setLoading(true);
        
        // First, fetch all restaurants to find the one matching our slug
        const restaurantsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurant`);
        if (!restaurantsResponse.ok) {
          throw new Error('Failed to fetch restaurants');
        }
        
        const restaurantsData = await restaurantsResponse.json();
        const restaurants = restaurantsData.restaurants || [];
        
        // Find restaurant by matching slug with generated slug from name
        const foundRestaurant = restaurants.find((r: Restaurant) => {
          const restaurantSlug = r.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          return restaurantSlug === slug;
        });
        
        if (!foundRestaurant) {
          throw new Error('Restaurant not found');
        }
        
        setRestaurant(foundRestaurant);
        
        // Then fetch items for this restaurant
        const itemsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/restaurant/${foundRestaurant._id}`);
        if (!itemsResponse.ok) {
          throw new Error('Failed to fetch restaurant items');
        }
        
        const itemsData = await itemsResponse.json();
        setItems(itemsData.items || []);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load restaurant data');
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurantData();
  }, [slug]);

  if (loading) {
    return (
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, color-mix(in oklch, var(--app-bg) 100%, transparent) 0%, color-mix(in oklch, var(--app-bg) 95%, transparent) 100%)" }} />
        <div className="container relative z-10 max-w-screen-xl px-4">
          <div className="flex justify-center items-center py-12">
            <div className="text-lg" style={{ color: "var(--text-secondary)" }}>Loading restaurant...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !restaurant) {
    return notFound();
  }

  // Group items by category
  const categorizedItems: Record<string, Item[]> = {};
  items.forEach(item => {
    if (!categorizedItems[item.category]) {
      categorizedItems[item.category] = [];
    }
    categorizedItems[item.category].push(item);
  });

  // Convert backend data format to component format
  const menuCategories: Record<string, Array<{ id: string; name: string; image: string; price: string }>> = {};
  
  Object.keys(categorizedItems).forEach(category => {
    menuCategories[category] = categorizedItems[category].map(item => ({
      id: item._id,
      name: item.name,
      image: item.imageUrl || "/placeholder.jpg",
      price: `Rs. ${item.price.toFixed(2)}`
    }));
  });

  return (
    <section className="relative py-16 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, color-mix(in oklch, var(--app-bg) 100%, transparent) 0%, color-mix(in oklch, var(--app-bg) 95%, transparent) 100%)" }} />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="container relative z-10 max-w-screen-xl px-4">
        <RestaurantMenu 
          name={restaurant.name} 
          banner={restaurant.imageUrl} 
          categories={menuCategories}
          restaurantCategories={restaurant.categories}
        />
      </div>
    </section>
  );
}
