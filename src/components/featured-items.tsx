"use client";
/* Featured items grid */
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { useAdmin } from "@/store/admin-store";

type FeaturedItem = {
  id: number;
  name: string;
  restaurant: string;
  price: string;
  rating: number;
  image: string;
  featured?: boolean;
  tags?: string[];
};

const featuredItems: FeaturedItem[] = [
  {
    id: 1,
    name: "Margherita Pizza",
    restaurant: "Bella Italia",
    price: "$12.99",
    rating: 4.8,
    image: "/delicious-burger-fries.png",
    featured: true,
    tags: ["Vegetarian", "Best Seller"],
  },
  {
    id: 2,
    name: "Sweet & Sour Pork",
    restaurant: "Dragon Palace",
    price: "$10.50",
    rating: 4.6,
    image: "/chinese-restaurant-with-red-lanterns.jpg",
    featured: true,
    tags: ["Popular"],
  },
  {
    id: 3,
    name: "Classic Cheeseburger",
    restaurant: "Burger Junction",
    price: "$9.99",
    rating: 4.7,
    image: "/modern-burger-restaurant.jpg",
    featured: true,
    tags: ["Combo Available"],
  },
  {
    id: 4,
    name: "Salmon Roll",
    restaurant: "Sakura Sushi",
    price: "$13.50",
    rating: 4.9,
    image: "/elegant-sushi-restaurant.jpg",
    featured: true,
    tags: ["Fresh"],
  },
];

export function FeaturedItems() {
  const { add } = useCart();
  const { items: adminItems } = useAdmin();
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, color-mix(in oklch, var(--app-bg) 100%, transparent) 0%, color-mix(in oklch, var(--app-bg) 95%, transparent) 100%)" }} />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="container relative z-10 max-w-screen-xl px-4">
        <div className="mb-12">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">
              Featured <span style={{ color: "var(--text-secondary)" }}>Items</span>
            </h2>
            <Link href="/restaurants" className="inline-flex items-center gap-2 text-2xl font-2xl transition-opacity hover:opacity-80" style={{ color: "var(--text-secondary)" }}>
              Explore all Restaurants
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-3 text-lg max-w-2xl text-pretty" style={{ color: "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))" }}>
            Handpicked menu favorites from different restaurants—curated for taste, quality, and popularity.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(adminItems.filter((i) => i.featured).slice(0, 8).map((i) => ({
            id: i.id,
            name: i.name,
            price: `$${i.price.toFixed(2)}`,
            image: i.image || "/placeholder.svg",
          })) as Array<{ id: string | number; name: string; price: string; image: string }> ).concat(
            adminItems.some((i) => i.featured) ? [] : featuredItems
          ).slice(0, 8).map((item) => (
            <div
              key={item.id}
              className="group rounded-[12%] overflow-hidden border shadow-md hover:shadow-xl transition-shadow"
              style={{ borderColor: "var(--text-secondary)" }}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="px-7 py-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                </div>
                <div className="inline-flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>{item.price}</span>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-md text-sm font-medium transition-opacity hover:opacity-90 cursor-pointer"
                    style={{ backgroundColor: "var(--text-secondary)", color: "var(--text-primary)" }}
                    aria-label={`Add ${item.name} to cart`}
                    onClick={() => {
                      // parse price string like "$12.99" to number 12.99
                      const price = Number((item.price || "").replace(/[^0-9.]+/g, "")) || 0;
                      add({ id: `featured-${item.id}`, name: item.name, price, image: item.image });
                    }}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
