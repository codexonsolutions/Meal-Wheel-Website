"use client";
/* Client-side restaurant menu with category tabs and filtered items */
import { useState, useMemo } from "react";
import { useCart } from "@/components/cart/cart-context";
import Image from "next/image";

type Item = { id: string; name: string; image: string; price: string };

export function RestaurantMenu({
  name,
  categories,
  restaurantCategories = [],
}: {
  name: string;
  banner?: string;
  categories: Record<string, Item[]>;
  restaurantCategories?: string[];
}) {
  const { add } = useCart();
  const allKey = "All";
  const categoryKeys = useMemo(() => {
    // Use restaurant categories if available, otherwise fallback to categories from items
    const availableCategories = restaurantCategories.length > 0 
      ? restaurantCategories.filter(cat => categories[cat] && categories[cat].length > 0)
      : Object.keys(categories);
    return [allKey, ...availableCategories];
  }, [categories, restaurantCategories]);
  const [selected, setSelected] = useState<string>(allKey);

  const items = useMemo(() => {
    if (selected === allKey) return Object.values(categories).flat();
    return categories[selected] ?? [];
  }, [selected, categories]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">{name}</h1>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {categoryKeys.map((key) => {
          const isActive = key === selected;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(key)}
              className="px-3 py-1.5 rounded-full text-sm border transition-colors"
              style={{
                backgroundColor: isActive
                  ? "var(--text-secondary)"
                  : "transparent",
                color: isActive
                  ? "var(--text-primary)"
                  : "color-mix(in oklch, var(--text-primary) 80%, var(--app-bg))",
                borderColor: isActive
                  ? "var(--text-secondary)"
                  : "color-mix(in oklch, var(--text-primary) 20%, var(--app-bg))",
              }}
            >
              {key}
            </button>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((it) => (
          <div
            key={it.id}
            className="group rounded-[12%] overflow-hidden border shadow-md hover:shadow-xl transition-shadow"
            style={{ borderColor: "var(--text-secondary)" }}
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={it.image}
                alt={it.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="px-7 py-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold">{it.name}</h3>
              </div>
              <div className="inline-flex items-center gap-2">
                <span
                  className="text-sm font-bold"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {it.price}
                </span>
                <button
                  className="px-3 py-1.5 rounded-md text-sm font-medium transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: "var(--text-secondary)",
                    color: "var(--text-primary)",
                  }}
                  onClick={() => {
                    const price =
                      Number((it.price || "").replace(/[^0-9.]+/g, "")) || 0;
                    // Use the raw backend item id so checkout can submit valid ObjectIds
                    add({
                      id: it.id,
                      name: it.name,
                      price,
                      image: it.image,
                    });
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
  );
}
