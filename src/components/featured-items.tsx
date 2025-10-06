"use client";
import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import { ArrowRight, Plus } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CustomizationDialog,
  type Customization,
} from "@/components/customization-dialog";

interface FeaturedItemApi {
  _id: string;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
  restaurantName?: string;
  restaurantId?: string;
  customizations?: Customization[];
}

export function FeaturedItems() {
  const { add } = useCart();
  const [items, setItems] = useState<FeaturedItemApi[]>([]);
  const [dialogItem, setDialogItem] = useState<FeaturedItemApi | null>(null);
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
        if (active) {
          const raw = Array.isArray(data.items) ? data.items : [];
          const normalized: FeaturedItemApi[] = raw.map((it: unknown) => {
            if (typeof it !== "object" || it === null)
              return {
                _id: "",
                name: "Unknown",
                imageUrl: "",
                price: 0,
                category: "Unknown",
              } as FeaturedItemApi;
            const rec = it as { [k: string]: unknown } & {
              restaurant?: unknown;
            };
            const restaurantName = (function () {
              const r = rec.restaurant as any;
              if (r && typeof r === "object" && typeof r.name === "string")
                return r.name as string;
              return undefined;
            })();
            const restaurantId = (function () {
              const r = rec.restaurant as any;
              if (r && typeof r === "object" && typeof r._id === "string")
                return r._id as string;
              if (typeof rec.restaurant === "string")
                return rec.restaurant as string;
              return undefined;
            })();
            return {
              _id: String(rec._id ?? ""),
              name:
                typeof rec.name === "string" ? (rec.name as string) : "Unknown",
              imageUrl:
                typeof rec.imageUrl === "string"
                  ? (rec.imageUrl as string)
                  : "",
              price: typeof rec.price === "number" ? (rec.price as number) : 0,
              category:
                typeof rec.category === "string"
                  ? (rec.category as string)
                  : "Unknown",
              restaurantName,
              restaurantId,
              customizations: Array.isArray((rec as any).customizations)
                ? ((rec as any).customizations as any)
                : undefined,
            } satisfies FeaturedItemApi;
          });
          setItems(normalized);
        }
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

  const handleAddToCart = (item: FeaturedItemApi) => {
    setDialogItem(item);
  };

  const confirmAdd = (
    selectedOptions: {
      group: string;
      options: { name: string; price: number }[];
    }[]
  ) => {
    if (!dialogItem) return;
    const variantKey = selectedOptions
      .map(
        (g) =>
          `${g.group}:${g.options
            .map((o) => o.name)
            .sort()
            .join("|")}`
      )
      .sort()
      .join(";");
    add({
      id: dialogItem._id,
      name: dialogItem.name,
      price: dialogItem.price,
      image: dialogItem.imageUrl || "/placeholder.jpg",
      restaurantId: dialogItem.restaurantId,
      selectedOptions,
      qty: 1,
    });
    setDialogItem(null);
  };

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
              className="hover:text-primary transition-colors duration-100 hidden sm:inline-flex items-center gap-2 text-lg md:text-xl hover:opacity-80 px-2 md:px-0"
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
              className="inline-flex items-center gap-2 text-base transition-colors duration-200 hover:text-primary"
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
              <Card
                key={item._id}
                className="p-0 overflow-hidden transition-border duration-100"
              >
                <div className="relative aspect-[4/3]">
                  <SafeImage
                    src={item.imageUrl || "/placeholder.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="py-3 px-4">
                  <div className="text-sm font-semibold truncate mb-2">
                    {item.name}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.restaurantName && (
                        <Badge variant="outline">{item.restaurantName}</Badge>
                      )}
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    <span className="text-sm font-bold text-secondary">
                      Rs. {item.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button
                      onClick={() => handleAddToCart(item)}
                      className="w-[100%]"
                      aria-label={`Add ${item.name} to cart`}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <CustomizationDialog
        open={!!dialogItem}
        itemName={dialogItem?.name || ""}
        customizations={dialogItem?.customizations}
        onClose={() => setDialogItem(null)}
        onConfirm={confirmAdd}
      />
    </section>
  );
}
