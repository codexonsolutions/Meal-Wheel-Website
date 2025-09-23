"use client";
import { useAdmin } from "@/store/admin-store";

export default function RestaurantsView() {
  const { restaurants, addRestaurant } = useAdmin();

  function onAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const image = String(fd.get("image") || "").trim() || undefined;
    if (!name) return;
    addRestaurant({ name, image });
    e.currentTarget.reset();
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      <div className="rounded-xl border shadow-sm p-4" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 15%, var(--app-bg))" }}>
        <h2 className="font-semibold mb-3">Add Restaurant</h2>
        <form onSubmit={onAdd} className="space-y-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm">Name</label>
            <input name="name" required placeholder="Restaurant name" className="px-3 py-2 rounded-md border bg-transparent" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 20%, var(--app-bg))" }} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm">Image URL (optional)</label>
            <input name="image" placeholder="/image.jpg" className="px-3 py-2 rounded-md border bg-transparent" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 20%, var(--app-bg))" }} />
          </div>
          <button type="submit" className="px-4 py-2 rounded-md font-medium hover:opacity-90" style={{ backgroundColor: "var(--text-secondary)", color: "var(--text-primary)" }}>Add</button>
        </form>
      </div>

      <div className="rounded-xl border shadow-sm p-4" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 15%, var(--app-bg))" }}>
        <h2 className="font-semibold mb-3">Restaurants</h2>
        <div className="space-y-3">
          {restaurants.length === 0 ? (
            <p className="text-sm" style={{ color: "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))" }}>No restaurants added yet.</p>
          ) : (
            restaurants.map((r) => (
              <div key={r.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs" style={{ color: "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))" }}>/{r.slug}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
