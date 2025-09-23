"use client";
import { useAdmin } from "@/store/admin-store";

export default function ItemsView() {
  const { restaurants, items, addItem, toggleFeatured } = useAdmin();

  function onAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const restaurantId = String(fd.get("restaurantId") || "");
    const name = String(fd.get("name") || "").trim();
    const price = Number(String(fd.get("price") || "0").replace(/[^0-9.]+/g, ""));
    const image = String(fd.get("image") || "").trim() || undefined;
    const category = String(fd.get("category") || "").trim() || undefined;
    if (!restaurantId || !name || !Number.isFinite(price)) return;
    addItem({ restaurantId, name, price, image, category, featured: false });
    e.currentTarget.reset();
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      <div className="rounded-xl border shadow-sm p-4" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 15%, var(--app-bg))" }}>
        <h2 className="font-semibold mb-3">Add Item</h2>
        <form onSubmit={onAdd} className="space-y-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm">Restaurant</label>
            <select name="restaurantId" required className="px-3 py-2 rounded-md border bg-transparent" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 20%, var(--app-bg))" }}>
              <option value="">Select</option>
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm">Name</label>
            <input name="name" required placeholder="Item name" className="px-3 py-2 rounded-md border bg-transparent" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 20%, var(--app-bg))" }} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm">Price</label>
            <input name="price" required placeholder="e.g. 12.99" inputMode="decimal" className="px-3 py-2 rounded-md border bg-transparent" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 20%, var(--app-bg))" }} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm">Image URL (optional)</label>
            <input name="image" placeholder="/image.jpg" className="px-3 py-2 rounded-md border bg-transparent" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 20%, var(--app-bg))" }} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm">Category (optional)</label>
            <input name="category" placeholder="e.g. Main Course" className="px-3 py-2 rounded-md border bg-transparent" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 20%, var(--app-bg))" }} />
          </div>
          <button type="submit" className="px-4 py-2 rounded-md font-medium hover:opacity-90" style={{ backgroundColor: "var(--text-secondary)", color: "var(--text-primary)" }}>Add</button>
        </form>
      </div>

      <div className="rounded-xl border shadow-sm p-4" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 15%, var(--app-bg))" }}>
        <h2 className="font-semibold mb-3">Items</h2>
        <div className="space-y-3">
          {items.length === 0 ? (
            <p className="text-sm" style={{ color: "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))" }}>No items yet.</p>
          ) : (
            items.map((it) => (
              <div key={it.id} className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium truncate">{it.name}</div>
                  <div className="text-xs" style={{ color: "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))" }}>${it.price.toFixed(2)} {it.category ? `• ${it.category}` : ""}</div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs">Featured</label>
                  <input type="checkbox" checked={!!it.featured} onChange={(e) => toggleFeatured(it.id, e.target.checked)} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
