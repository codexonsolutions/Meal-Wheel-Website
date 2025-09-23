"use client";
import { useState } from "react";
import OrdersView from "../../components/admin/orders-view";
import RestaurantsView from "../../components/admin/restaurants-view";
import ItemsView from "../../components/admin/items-view";

const tabs = ["Orders", "Restaurants", "Items"] as const;

export default function AdminPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Orders");
  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Admin Panel</h1>
      <div className="flex gap-2 mb-8">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-full border text-sm"
            style={{
              backgroundColor: tab === t ? "var(--text-secondary)" : "transparent",
              color: tab === t ? "var(--text-primary)" : "color-mix(in oklch, var(--text-primary) 80%, var(--app-bg))",
              borderColor: tab === t ? "var(--text-secondary)" : "color-mix(in oklch, var(--text-primary) 20%, var(--app-bg))",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Orders" && <OrdersView />}
      {tab === "Restaurants" && <RestaurantsView />}
      {tab === "Items" && <ItemsView />}
    </div>
  );
}
