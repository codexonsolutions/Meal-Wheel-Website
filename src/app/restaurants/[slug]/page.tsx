/* Restaurant detail page with category filters */
import { notFound } from "next/navigation";
import Image from "next/image";
import { RestaurantMenu } from "@/components/restaurant-menu";

// Demo data: per-restaurant categories and items
const data: Record<string, {
  name: string;
  banner?: string;
  categories: Record<string, Array<{ id: number; name: string; image: string; price: string }>>;
}> = {
  "bella-italia": {
    name: "Bella Italia",
    banner: "/delicious-burger-fries.png",
    categories: {
      Starter: [
        { id: 1, name: "Bruschetta", image: "/placeholder.svg", price: "$6.50" },
        { id: 2, name: "Garlic Bread", image: "/placeholder.svg", price: "$5.00" },
      ],
      "Main Course": [
        { id: 3, name: "Margherita Pizza", image: "/placeholder.svg", price: "$12.99" },
        { id: 4, name: "Pasta Carbonara", image: "/placeholder.svg", price: "$13.99" },
      ],
      Desserts: [
        { id: 5, name: "Tiramisu", image: "/placeholder.svg", price: "$7.50" },
      ],
      "Midnight Deals": [
        { id: 6, name: "Pizza + Drink Combo", image: "/placeholder.svg", price: "$14.99" },
      ],
    },
  },
  "dragon-palace": {
    name: "Dragon Palace",
    banner: "/chinese-restaurant-with-red-lanterns.jpg",
    categories: {
      Starter: [
        { id: 7, name: "Spring Rolls", image: "/placeholder.svg", price: "$5.99" },
      ],
      "Main Course": [
        { id: 8, name: "Sweet & Sour Pork", image: "/placeholder.svg", price: "$10.50" },
        { id: 9, name: "Fried Rice", image: "/placeholder.svg", price: "$8.25" },
      ],
      "Chef Special": [
        { id: 10, name: "Mapo Tofu", image: "/placeholder.svg", price: "$9.75" },
      ],
    },
  },
};

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function restaurantFromSlug(slug: string) {
  // data is keyed by slug
  return data[slug];
}

export default function RestaurantDetailPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const restaurant = restaurantFromSlug(slug);
  if (!restaurant) return notFound();

  return (
    <section className="relative py-16 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, color-mix(in oklch, var(--app-bg) 100%, transparent) 0%, color-mix(in oklch, var(--app-bg) 95%, transparent) 100%)" }} />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="container relative z-10 max-w-screen-xl px-4">
        <RestaurantMenu name={restaurant.name} banner={restaurant.banner} categories={restaurant.categories} />
      </div>
    </section>
  );
}
