"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/cart-context";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CustomizationDialog,
  type Customization,
} from "@/components/customization-dialog";
import { SafeImage } from "@/components/ui/safe-image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface MenuItemApi {
  _id: string;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
  isFeatured?: boolean;
  restaurantName?: string;
  restaurantId?: string;
  customizations?: Customization[];
}

export default function MenuPage() {
  const { add } = useCart();
  const [items, setItems] = useState<MenuItemApi[]>([]);
  const [dialogItem, setDialogItem] = useState<MenuItemApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const base = process.env.NEXT_PUBLIC_API_URL;
        if (!base) throw new Error("Missing NEXT_PUBLIC_API_URL");
        const res = await fetch(`${base}/items`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch items");
        const data = await res.json();
        if (active) {
          const raw = Array.isArray(data.items) ? data.items : [];
          const normalized: MenuItemApi[] = raw.map((it: unknown) => {
            if (typeof it !== "object" || it === null)
              return {
                _id: "",
                name: "Unknown",
                imageUrl: "",
                price: 0,
                category: "Unknown",
              };
            const rec = it as { [k: string]: unknown };
            return {
              _id: String(rec._id ?? ""),
              name: typeof rec.name === "string" ? rec.name : "Unknown",
              imageUrl: typeof rec.imageUrl === "string" ? rec.imageUrl : "",
              price: typeof rec.price === "number" ? rec.price : 0,
              category:
                typeof rec.category === "string" ? rec.category : "Unknown",
              isFeatured: !!rec.isFeatured,
              customizations: Array.isArray((rec as any).customizations)
                ? ((rec as any).customizations as any)
                : undefined,
              restaurantName: (function () {
                const r = rec.restaurant;
                if (
                  typeof r === "object" &&
                  r &&
                  "name" in r &&
                  typeof (r as { name: unknown }).name === "string"
                ) {
                  return (r as { name: string }).name;
                }
                return undefined;
              })(),
              restaurantId: (function () {
                const r = rec.restaurant;
                if (
                  typeof r === "object" &&
                  r &&
                  "_id" in r &&
                  typeof (r as { _id: unknown })._id === "string"
                )
                  return (r as { _id: string })._id;
                if (typeof r === "string") return r;
                return undefined;
              })(),
            };
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

  const handleAddToCart = (item: MenuItemApi) => {
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              All <span className="text-secondary">Items</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Browse every available item across restaurants. Freshly updated in
              real time from our partners.
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, category, or restaurant"
                  aria-label="Search menu items"
                  className="h-12 text-base"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Items Grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading &&
              Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-100 bg-white p-4 animate-pulse h-60"
                />
              ))}
            {error && !loading && (
              <div className="col-span-full text-center text-lg text-red-500">
                {error}
              </div>
            )}
            {!loading && !error && items.length === 0 && (
              <div className="col-span-full text-center text-lg text-muted-foreground">
                No items available
              </div>
            )}
            {!loading && !error &&
              items
                .filter((it) => {
                  const q = query.trim().toLowerCase();
                  if (!q) return true;
                  return (
                    it.name.toLowerCase().includes(q) ||
                    it.category.toLowerCase().includes(q) ||
                    (it.restaurantName || "").toLowerCase().includes(q)
                  );
                })
                .map((item) => (
                  <Card
                    key={item._id}
                    className="p-0 overflow-hidden hover:border-primary transition-border duration-100"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <SafeImage
                        src={
                          item.imageUrl ||
                          "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center"
                        }
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <CardContent className="py-3 px-4">
                      <div className="mb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-base truncate">
                            {item.name}
                          </h3>
                          {item.isFeatured && <Badge>Featured</Badge>}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.category && (
                            <Badge variant="secondary">{item.category}</Badge>
                          )}
                          {item.restaurantName && (
                            <Badge variant="outline">{item.restaurantName}</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-secondary">
                          Rs. {item.price.toFixed(2)}
                        </span>
                        <Button
                          onClick={() => handleAddToCart(item)}
                          size="sm"
                          variant="default"
                          className="bg-secondary hover:bg-secondary/90 text-white"
                        >
                          <Plus className="h-4 w-4" />
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            {!loading && !error && items.length > 0 &&
              items.filter((it) => {
                const q = query.trim().toLowerCase();
                if (!q) return false;
                return !(
                  it.name.toLowerCase().includes(q) ||
                  it.category.toLowerCase().includes(q) ||
                  (it.restaurantName || "").toLowerCase().includes(q)
                );
              }).length === items.length && (
                <div className="col-span-full text-center text-muted-foreground">
                  No items match your search
                </div>
              )}
          </div>
        </div>
      </section>
      <CustomizationDialog
        open={!!dialogItem}
        itemName={dialogItem?.name || ""}
        customizations={dialogItem?.customizations}
        onClose={() => setDialogItem(null)}
        onConfirm={confirmAdd}
      />
    </div>
  );
}
